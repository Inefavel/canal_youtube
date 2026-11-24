/**
 * Gera áudios PLACEHOLDER (WAV 16-bit mono 44.1 kHz) para todos os episódios:
 *  - Vozes estilo "blip" (uma nota por sílaba, no mesmo ritmo do lip-sync placeholder)
 *  - Efeitos sonoros (click, ding, boing, whoosh, pop)
 *  - Trilha de fundo em loop
 *
 * Lê todos os arquivos src/episodes/<pasta>/dialogue.json.
 * Saída: public/audio/<episodio>/<id>.wav, public/audio/sfx/<tipo>.wav, public/audio/music/<id>.wav
 *
 * SUBSTITUIÇÃO: para usar voz real, grave/gere cada fala e salve com o MESMO nome
 * (ex.: public/audio/ep01/l1.wav). Rode com --keep-existing para não sobrescrever.
 */
import {mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SAMPLE_RATE = 44100;
const KEEP_EXISTING = process.argv.includes('--keep-existing');

// ---------- utilidades ----------

const writeWav = (path, samples) => {
  if (KEEP_EXISTING && existsSync(path)) {
    return false;
  }
  mkdirSync(dirname(path), {recursive: true});
  const dataSize = samples.length * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SAMPLE_RATE, 24);
  buf.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  writeFileSync(path, buf);
  return true;
};

const empty = (seconds) => new Float32Array(Math.max(1, Math.round(seconds * SAMPLE_RATE)));

/** Envelope ADSR simplificado (attack / release em segundos). */
const env = (t, len, attack, release) => {
  if (t < attack) return t / attack;
  if (t > len - release) return Math.max(0, (len - t) / release);
  return 1;
};

/** Adiciona um tom com harmônicos ao buffer. */
const addTone = (buf, startSec, lenSec, freq, gain, timbre = 'soft', glide = 0) => {
  const start = Math.round(startSec * SAMPLE_RATE);
  const n = Math.round(lenSec * SAMPLE_RATE);
  let phase = 0;
  for (let i = 0; i < n && start + i < buf.length; i++) {
    const t = i / SAMPLE_RATE;
    const f = freq * (1 + glide * (t / lenSec));
    phase += (2 * Math.PI * f) / SAMPLE_RATE;
    let v;
    if (timbre === 'square') {
      v = 0.6 * Math.sign(Math.sin(phase)) + 0.4 * Math.sin(phase);
    } else {
      v = Math.sin(phase) + 0.35 * Math.sin(2 * phase) + 0.15 * Math.sin(3 * phase);
    }
    buf[start + i] += v * gain * env(t, lenSec, 0.006, Math.min(0.05, lenSec / 2));
  }
};

/** Ruído branco com envelope e "sweep" simples (para whoosh). */
const addNoise = (buf, startSec, lenSec, gain, seed = 1) => {
  const start = Math.round(startSec * SAMPLE_RATE);
  const n = Math.round(lenSec * SAMPLE_RATE);
  let s = seed;
  let last = 0;
  for (let i = 0; i < n && start + i < buf.length; i++) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const white = s / 4294967296 - 0.5;
    const t = i / n;
    // filtro passa-baixa cuja abertura sobe e desce (efeito de passagem)
    const k = 0.05 + 0.5 * Math.sin(Math.PI * t);
    last = last + k * (white - last);
    buf[start + i] += last * gain * Math.sin(Math.PI * t);
  }
};

// ---------- vozes ----------

const VOWEL_GROUP = /[aeiouáéíóúâêôãõàü]+/g;
const syllables = (text) => text.toLowerCase().match(VOWEL_GROUP) ?? [];
const VOWEL_PITCH = {a: 1.0, e: 1.12, i: 1.26, o: 0.9, u: 0.84};

const VOICES = {
  bolota: {freq: 165, timbre: 'soft', gain: 0.45},
  palito: {freq: 300, timbre: 'soft', gain: 0.4},
  maquina: {freq: 520, timbre: 'square', gain: 0.18},
};

const renderLine = (line) => {
  const voice = VOICES[line.speaker] ?? VOICES.bolota;
  // Sem start/end absolutos (falas encadeadas): mesma estimativa de src/components/timeline.ts
  const duration =
    line.start !== undefined && line.end !== undefined
      ? line.end - line.start
      : Math.max(0.8, syllables(line.text).length * 0.18 + 0.3);
  const buf = empty(duration);
  const groups = syllables(line.text);
  const slot = duration / Math.max(1, groups.length);
  const shouting = line.text === line.text.toUpperCase();
  groups.forEach((g, i) => {
    const v = g.normalize('NFD').replace(/[̀-ͯ]/g, '')[0];
    const pitch = (VOWEL_PITCH[v] ?? 1) * (shouting ? 1.35 : 1);
    // pergunta: última sílaba sobe; demais: leve variação determinística
    const isLast = i === groups.length - 1;
    const glide = isLast && line.text.includes('?') ? 0.4 : 0;
    const wobble = 1 + 0.04 * Math.sin(i * 2.3);
    addTone(buf, i * slot, slot * 0.7, voice.freq * pitch * wobble, voice.gain, voice.timbre, glide);
  });
  return buf;
};

// ---------- efeitos ----------

const SFX = {
  click: () => {
    const b = empty(0.08);
    addTone(b, 0, 0.03, 1800, 0.5, 'square');
    addNoise(b, 0, 0.05, 0.6, 7);
    return b;
  },
  ding: () => {
    const b = empty(0.9);
    addTone(b, 0, 0.9, 1318.5, 0.35);
    addTone(b, 0, 0.9, 1975.5, 0.15);
    return b;
  },
  boing: () => {
    const b = empty(0.45);
    addTone(b, 0, 0.45, 180, 0.5, 'soft', 1.6);
    return b;
  },
  whoosh: () => {
    const b = empty(0.5);
    addNoise(b, 0, 0.5, 1.2, 42);
    return b;
  },
  typing: () => {
    // ~1,2 s de teclas com ritmo levemente irregular
    const b = empty(1.2);
    const hits = [0, 0.09, 0.17, 0.3, 0.38, 0.5, 0.57, 0.7, 0.81, 0.88, 1.02];
    hits.forEach((t, i) => {
      addNoise(b, t, 0.035, 0.9, 11 + i);
      addTone(b, t, 0.02, 2400 + (i % 3) * 300, 0.12, 'square');
    });
    return b;
  },
  beep: () => {
    // bipe duplo de despertador digital
    const b = empty(0.4);
    addTone(b, 0, 0.12, 2000, 0.25, 'square');
    addTone(b, 0.18, 0.12, 2000, 0.25, 'square');
    return b;
  },
  buzz: () => {
    // celular vibrando na mesa
    const b = empty(0.9);
    addTone(b, 0, 0.35, 140, 0.45, 'square');
    addTone(b, 0.5, 0.35, 140, 0.45, 'square');
    return b;
  },
  alarm: () => {
    // sirene "uí-uó" de bloqueio
    const b = empty(1.6);
    for (let i = 0; i < 4; i++) {
      addTone(b, i * 0.4, 0.2, 880, 0.22, 'square');
      addTone(b, i * 0.4 + 0.2, 0.2, 660, 0.22, 'square');
    }
    return b;
  },
  pop: () => {
    const b = empty(0.15);
    addTone(b, 0, 0.12, 600, 0.6, 'soft', -0.6);
    return b;
  },
};

// ---------- trilha ----------

const renderMusic = (seconds, bpm) => {
  const b = empty(seconds);
  const beat = 60 / bpm;
  // progressão I - vi - IV - V em Dó maior (fundamentais e terças)
  const chords = [
    [130.81, 164.81, 196.0],
    [110.0, 130.81, 164.81],
    [87.31, 110.0, 130.81],
    [98.0, 123.47, 146.83],
  ];
  const totalBeats = Math.floor(seconds / beat);
  for (let i = 0; i < totalBeats; i++) {
    const chord = chords[Math.floor(i / 4) % chords.length];
    // baixo nos tempos 1 e 3
    if (i % 2 === 0) addTone(b, i * beat, beat * 0.9, chord[0] / 2, 0.35);
    // acorde em "staccato" nos contratempos
    chord.forEach((f) => addTone(b, i * beat + beat / 2, beat * 0.25, f * 2, 0.08));
    // "hi-hat" leve
    addNoise(b, i * beat, 0.03, 0.15, i + 3);
  }
  return b;
};

// ---------- execução ----------

const episodesDir = join(ROOT, 'src', 'episodes');
const audioDir = join(ROOT, 'public', 'audio');
let written = 0;

for (const [type, make] of Object.entries(SFX)) {
  if (writeWav(join(audioDir, 'sfx', `${type}.wav`), make())) written++;
}

for (const folder of readdirSync(episodesDir)) {
  const file = join(episodesDir, folder, 'dialogue.json');
  if (!existsSync(file)) continue;
  const ep = JSON.parse(readFileSync(file, 'utf8'));
  for (const line of ep.lines) {
    if (writeWav(join(audioDir, ep.episode, `${line.id}.wav`), renderLine(line))) written++;
  }
  if (ep.music) {
    if (writeWav(join(audioDir, 'music', `${ep.music.id}.wav`), renderMusic(ep.durationSeconds ?? 60, ep.music.bpm))) written++;
  }
  for (const s of ep.sfx) {
    if (!SFX[s.type]) throw new Error(`SFX desconhecido "${s.type}" em ${file}`);
  }
}

console.log(`Áudios placeholder gerados: ${written} arquivo(s) em public/audio`);
