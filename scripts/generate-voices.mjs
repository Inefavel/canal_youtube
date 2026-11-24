/**
 * Gera as vozes sintéticas (ElevenLabs) de todas as falas dos episódios.
 *
 * Para cada fala de src/episodes/<pasta>/dialogue.json:
 *  - chama /v1/text-to-speech/{voice}/with-timestamps (áudio + tempo de cada caractere)
 *  - salva o áudio em public/voices/<episodio>/<id>.mp3
 *  - grava duração e alinhamento em src/episodes/<pasta>/voices.json (usado no lip-sync e nas legendas)
 *
 * Cache: só regenera a fala se o texto, a voz, o modelo ou os ajustes mudarem.
 *
 * Uso:
 *   npm run voices                 # todos os episódios
 *   npm run voices -- --only=ep01  # um episódio
 *   npm run voices -- --force      # ignora o cache
 *
 * Chave: lida de ELEVENLABS_API_KEY. Em sessões na nuvem do Claude, a chave é injetada pelo
 * proxy; nesse caso qualquer valor serve (ex.: ELEVENLABS_API_KEY=proxy-injected).
 */
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://api.elevenlabs.io/v1';
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const ONLY = args.find((a) => a.startsWith('--only='))?.split('=')[1];
const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY) {
  console.error('Defina ELEVENLABS_API_KEY (ex.: ELEVENLABS_API_KEY=sk_... npm run voices).');
  process.exit(1);
}

const config = JSON.parse(readFileSync(join(ROOT, 'src', 'config', 'voices.json'), 'utf8'));

const hashOf = (obj) => createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 16);

const synthesize = async (text, speaker) => {
  const s = config.speakers[speaker];
  if (!s) {
    throw new Error(`Sem voz configurada para "${speaker}" em src/config/voices.json`);
  }
  const {speed, ...voiceSettings} = s.settings;
  const body = {
    text,
    model_id: config.model,
    voice_settings: {...voiceSettings, speed},
  };
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(`${API}/text-to-speech/${s.voiceId}/with-timestamps?output_format=${config.outputFormat}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'xi-api-key': API_KEY},
      body: JSON.stringify(body),
    });
    if (res.ok) {
      return res.json();
    }
    const detail = await res.text();
    if (res.status === 429 || res.status >= 500) {
      console.warn(`  tentativa ${attempt} falhou (${res.status}), aguardando...`);
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      continue;
    }
    throw new Error(`ElevenLabs respondeu ${res.status}: ${detail.slice(0, 300)}`);
  }
  throw new Error('ElevenLabs indisponível após 3 tentativas.');
};

const episodesDir = join(ROOT, 'src', 'episodes');
let generated = 0;
let cached = 0;
let characters = 0;

for (const folder of readdirSync(episodesDir)) {
  const dialoguePath = join(episodesDir, folder, 'dialogue.json');
  if (!existsSync(dialoguePath)) continue;
  const ep = JSON.parse(readFileSync(dialoguePath, 'utf8'));
  if (ONLY && ep.episode !== ONLY) continue;

  const voicesPath = join(episodesDir, folder, 'voices.json');
  const previous = existsSync(voicesPath) ? JSON.parse(readFileSync(voicesPath, 'utf8')) : {lines: {}};
  const out = {model: config.model, lines: {}};
  console.log(`\n${ep.episode} — ${ep.title}`);

  for (const line of ep.lines) {
    const spoken = line.tts ?? line.text;
    const speaker = config.speakers[line.speaker];
    const hash = hashOf({spoken, voice: speaker?.voiceId, model: config.model, settings: speaker?.settings});
    const file = `voices/${ep.episode}/${line.id}.mp3`;
    const filePath = join(ROOT, 'public', file);
    const old = previous.lines?.[line.id];

    if (!FORCE && old?.hash === hash && existsSync(filePath)) {
      out.lines[line.id] = old;
      cached++;
      console.log(`  ${line.id} (cache) ${old.duration.toFixed(2)}s  "${spoken}"`);
      continue;
    }

    const result = await synthesize(spoken, line.speaker);
    mkdirSync(dirname(filePath), {recursive: true});
    writeFileSync(filePath, Buffer.from(result.audio_base64, 'base64'));
    const a = result.alignment;
    const duration = a.character_end_times_seconds.at(-1) ?? 0;
    out.lines[line.id] = {
      file,
      hash,
      duration: Math.round(duration * 1000) / 1000,
      alignment: {
        characters: a.characters,
        starts: a.character_start_times_seconds,
        ends: a.character_end_times_seconds,
      },
    };
    generated++;
    characters += spoken.length;
    console.log(`  ${line.id} (nova) ${duration.toFixed(2)}s  "${spoken}"`);
  }

  writeFileSync(voicesPath, JSON.stringify(out, null, 1) + '\n');

  // Avisa quando uma fala real ficou mais longa que o espaço até a próxima (só para tempos absolutos;
  // falas encadeadas, sem "start", se reposicionam sozinhas).
  const absolute = ep.lines.filter((l) => l.start !== undefined).sort((x, y) => x.start - y.start);
  absolute.forEach((line, i) => {
    const next = absolute[i + 1];
    const end = line.start + out.lines[line.id].duration / (line.rate ?? 1);
    if (next && end > next.start - 0.1) {
      console.warn(`  ⚠ ${line.id} termina em ${end.toFixed(2)}s e ${next.id} começa em ${next.start}s: ajuste "start" no dialogue.json`);
    }
  });
}

console.log(`\nVozes: ${generated} gerada(s), ${cached} do cache, ${characters} caractere(s) cobrados.`);
