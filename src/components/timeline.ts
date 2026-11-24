import {cuesFromAlignment, cuesFromText, syllables, wordFramesFromAlignment} from '../lipsync/cues';
import type {CharAlignment, MouthCue} from '../lipsync/cues';

export type DialogueLine = {
  id: string;
  speaker: string;
  text: string;
  /** Texto enviado ao TTS, se diferente da legenda (ex.: sem CAIXA ALTA). Mesmo número de palavras. */
  tts?: string;
  /** Início absoluto (s). Se omitido, a fala começa `gap` segundos após o fim da anterior. */
  start?: number;
  /** Fim absoluto (s), usado só sem voz real. Se omitido, é estimado pelas sílabas. */
  end?: number;
  /** Pausa (s) depois da fala anterior, quando `start` é omitido. Padrão: 0,3. */
  gap?: number;
  /** Velocidade de reprodução (ex.: 2 = áudio acelerado). Padrão: 1. */
  rate?: number;
  /** Fala "fora de cena" (ex.: áudio no celular): legenda e áudio, mas sem boca de personagem. */
  offscreen?: boolean;
};

/** Efeito sonoro em tempo absoluto (`at`) ou preso a uma fala (`line` + `edge` + `offset`). */
export type SfxCue = {
  id: string;
  type: string;
  at?: number;
  line?: string;
  edge?: 'start' | 'end';
  offset?: number;
  volume?: number;
};

export type Dialogue = {
  episode: string;
  title: string;
  /** Duração total (s). Se omitida: fim da última fala + `tail` (padrão 1,6 s). */
  durationSeconds?: number;
  tail?: number;
  music?: {id: string; bpm: number; volume: number};
  lines: DialogueLine[];
  sfx: SfxCue[];
};

export type VoiceLine = {
  file: string;
  hash: string;
  duration: number;
  alignment: CharAlignment;
};

export type VoicesFile = {model?: string; lines: Record<string, VoiceLine>};

export type TimedLine = {
  id: string;
  speaker: string;
  text: string;
  startFrame: number;
  endFrame: number;
  /** Frame de início de cada palavra (só com voz real). */
  wordFrames?: number[];
  /** Caminho em /public do áudio desta fala. */
  audioSrc: string;
  playbackRate: number;
  cues: MouthCue[];
  offscreen: boolean;
  /** true se usa voz real (ElevenLabs); false se usa o placeholder. */
  synthetic: boolean;
};

export type TimedSfx = {id: string; type: string; frame: number; volume: number};

export type Timeline = {
  lines: TimedLine[];
  sfx: TimedSfx[];
  /** Cues de boca agrupados por personagem. */
  cuesBySpeaker: Record<string, MouthCue[]>;
  startOf: (id: string) => number;
  endOf: (id: string) => number;
  durationInFrames: number;
};

/** Duração estimada de uma fala sem voz real (mesma regra do gerador de placeholders). */
export const estimateSeconds = (text: string): number => Math.max(0.8, syllables(text).length * 0.18 + 0.3);

const scaleAlignment = (a: CharAlignment, rate: number): CharAlignment =>
  rate === 1 ? a : {characters: a.characters, starts: a.starts.map((t) => t / rate), ends: a.ends.map((t) => t / rate)};

/**
 * Junta o roteiro (dialogue.json) com as vozes geradas (voices.json).
 * Com voz real: duração, boca e legenda vêm do alinhamento da ElevenLabs.
 * Sem voz: placeholder (duração estimada, boca pelo texto e áudio "blip").
 * Falas sem `start` são encadeadas: começam `gap` segundos após a anterior.
 */
export const buildTimeline = (dialogue: Dialogue, voices: VoicesFile, fps: number): Timeline => {
  const f = (s: number) => Math.round(s * fps);
  let prevEndSec = 0;
  const lines: TimedLine[] = dialogue.lines.map((l) => {
    const voice = voices.lines[l.id];
    const rate = l.rate ?? 1;
    const startSec = l.start ?? prevEndSec + (l.gap ?? 0.3);
    const startFrame = f(startSec);
    let durationSec: number;
    let timed: Omit<TimedLine, 'startFrame' | 'endFrame' | 'id' | 'speaker' | 'text' | 'offscreen' | 'playbackRate'>;
    if (voice) {
      const a = scaleAlignment(voice.alignment, rate);
      durationSec = voice.duration / rate;
      const words = wordFramesFromAlignment(a, fps, startFrame);
      timed = {
        wordFrames: words.length === l.text.split(' ').length ? words : undefined,
        audioSrc: voice.file,
        cues: cuesFromAlignment(a, fps, startFrame),
        synthetic: true,
      };
    } else {
      durationSec = l.start !== undefined && l.end !== undefined ? l.end - l.start : estimateSeconds(l.text) / rate;
      timed = {
        audioSrc: `audio/${dialogue.episode}/${l.id}.wav`,
        cues: cuesFromText(l.text, startFrame, startFrame + f(durationSec)),
        synthetic: false,
      };
    }
    prevEndSec = startSec + durationSec;
    return {
      id: l.id,
      speaker: l.speaker,
      text: l.text,
      startFrame,
      endFrame: startFrame + f(durationSec),
      playbackRate: rate,
      offscreen: l.offscreen ?? false,
      ...timed,
    };
  });

  const cuesBySpeaker: Record<string, MouthCue[]> = {};
  for (const l of lines) {
    if (l.offscreen) continue;
    (cuesBySpeaker[l.speaker] ??= []).push(...l.cues);
  }
  for (const list of Object.values(cuesBySpeaker)) {
    list.sort((a, b) => a.startFrame - b.startFrame);
  }

  const byId = new Map(lines.map((l) => [l.id, l]));
  const get = (id: string) => {
    const l = byId.get(id);
    if (!l) {
      throw new Error(`Fala "${id}" não existe em ${dialogue.episode}/dialogue.json`);
    }
    return l;
  };

  const sfx: TimedSfx[] = dialogue.sfx.map((s) => {
    let frame: number;
    if (s.line) {
      const l = get(s.line);
      frame = (s.edge === 'end' ? l.endFrame : l.startFrame) + f(s.offset ?? 0);
    } else {
      frame = f(s.at ?? 0);
    }
    return {id: s.id, type: s.type, frame: Math.max(0, frame), volume: s.volume ?? 0.6};
  });

  const lastEnd = Math.max(...lines.map((l) => l.endFrame));
  const durationInFrames = dialogue.durationSeconds !== undefined ? f(dialogue.durationSeconds) : lastEnd + f(dialogue.tail ?? 1.6);

  return {
    lines,
    sfx,
    cuesBySpeaker,
    startOf: (id) => get(id).startFrame,
    endOf: (id) => get(id).endFrame,
    durationInFrames,
  };
};
