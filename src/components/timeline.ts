import {cuesFromAlignment, cuesFromText, wordFramesFromAlignment} from '../lipsync/cues';
import type {CharAlignment, MouthCue} from '../lipsync/cues';

export type DialogueLine = {
  id: string;
  speaker: string;
  text: string;
  /** Texto enviado ao TTS, se diferente da legenda (ex.: sem CAIXA ALTA). Mesmo número de palavras. */
  tts?: string;
  start: number;
  end: number;
};

export type Dialogue = {
  episode: string;
  title: string;
  durationSeconds: number;
  music?: {id: string; bpm: number; volume: number};
  lines: DialogueLine[];
  sfx: {id: string; type: string; at: number}[];
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
  cues: MouthCue[];
  /** true se usa voz real (ElevenLabs); false se usa o placeholder. */
  synthetic: boolean;
};

export type Timeline = {
  lines: TimedLine[];
  /** Cues de boca agrupados por personagem. */
  cuesBySpeaker: Record<string, MouthCue[]>;
  startOf: (id: string) => number;
  endOf: (id: string) => number;
  durationInFrames: number;
};

/**
 * Junta o roteiro (dialogue.json) com as vozes geradas (voices.json).
 * Se uma fala tem voz real: duração, boca e legenda vêm do alinhamento da ElevenLabs.
 * Senão: usa o placeholder (start/end do roteiro, boca estimada pelo texto e áudio "blip").
 */
export const buildTimeline = (dialogue: Dialogue, voices: VoicesFile, fps: number): Timeline => {
  const f = (s: number) => Math.round(s * fps);
  const lines: TimedLine[] = dialogue.lines.map((l) => {
    const voice = voices.lines[l.id];
    const startFrame = f(l.start);
    if (voice) {
      const words = wordFramesFromAlignment(voice.alignment, fps, startFrame);
      return {
        id: l.id,
        speaker: l.speaker,
        text: l.text,
        startFrame,
        endFrame: startFrame + f(voice.duration),
        wordFrames: words.length === l.text.split(' ').length ? words : undefined,
        audioSrc: voice.file,
        cues: cuesFromAlignment(voice.alignment, fps, startFrame),
        synthetic: true,
      };
    }
    const endFrame = f(l.end);
    return {
      id: l.id,
      speaker: l.speaker,
      text: l.text,
      startFrame,
      endFrame,
      audioSrc: `audio/${dialogue.episode}/${l.id}.wav`,
      cues: cuesFromText(l.text, startFrame, endFrame),
      synthetic: false,
    };
  });

  const cuesBySpeaker: Record<string, MouthCue[]> = {};
  for (const l of lines) {
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

  return {
    lines,
    cuesBySpeaker,
    startOf: (id) => get(id).startFrame,
    endOf: (id) => get(id).endFrame,
    durationInFrames: f(dialogue.durationSeconds),
  };
};
