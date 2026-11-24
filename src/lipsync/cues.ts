/**
 * Lip-sync baseado em "mouth cues" (formato compatível com o Rhubarb Lip Sync).
 *
 * Fluxo de produção:
 *  - AGORA (placeholder): `cuesFromText` gera bocas a partir das sílabas do texto,
 *    no mesmo ritmo dos "blips" gerados por scripts/generate-placeholder-audio.mjs.
 *  - DEPOIS (voz real): rode o Rhubarb no .wav da fala
 *      rhubarb -f json -o fala.json public/audio/ep01/l1.wav
 *    e use `cuesFromRhubarb(json, fps, startFrame)` no lugar de `cuesFromText`.
 */

export type MouthShape = 'closed' | 'small' | 'open' | 'wide' | 'round';

export type MouthCue = {
  startFrame: number;
  endFrame: number;
  shape: MouthShape;
};

const VOWEL_GROUP = /[aeiouáéíóúâêôãõàü]+/g;

/** Extrai grupos vocálicos (aproximação de sílabas) do texto. Mesma regra do gerador de áudio. */
export const syllables = (text: string): string[] =>
  text.toLowerCase().match(VOWEL_GROUP) ?? [];

const shapeForVowel = (group: string): MouthShape => {
  const v = group.normalize('NFD').replace(/[̀-ͯ]/g, '')[0];
  switch (v) {
    case 'a':
      return 'wide';
    case 'e':
      return 'open';
    case 'i':
      return 'small';
    case 'o':
    case 'u':
      return 'round';
    default:
      return 'open';
  }
};

/**
 * Gera cues a partir do texto, distribuindo as sílabas igualmente entre start e end.
 * Cada sílaba abre a boca por 70% do slot e fecha nos 30% restantes.
 */
export const cuesFromText = (
  text: string,
  startFrame: number,
  endFrame: number,
): MouthCue[] => {
  const groups = syllables(text);
  if (groups.length === 0 || endFrame <= startFrame) {
    return [];
  }
  const slot = (endFrame - startFrame) / groups.length;
  const cues: MouthCue[] = [];
  groups.forEach((group, i) => {
    const s = startFrame + i * slot;
    const openEnd = s + slot * 0.7;
    cues.push({startFrame: Math.round(s), endFrame: Math.round(openEnd), shape: shapeForVowel(group)});
    cues.push({startFrame: Math.round(openEnd), endFrame: Math.round(s + slot), shape: 'closed'});
  });
  return cues;
};

type RhubarbJson = {
  mouthCues: {start: number; end: number; value: string}[];
};

const RHUBARB_MAP: Record<string, MouthShape> = {
  A: 'closed', // M, B, P
  B: 'small', // K, S, T, EE
  C: 'open', // EH, AE
  D: 'wide', // AA
  E: 'round', // AO, ER
  F: 'round', // UW, OW, W
  G: 'small', // F, V
  H: 'open', // L
  X: 'closed', // silêncio
};

/** Converte a saída JSON do Rhubarb Lip Sync em cues (em frames, com deslocamento). */
export const cuesFromRhubarb = (
  json: RhubarbJson,
  fps: number,
  offsetFrame: number,
): MouthCue[] =>
  json.mouthCues.map((c) => ({
    startFrame: offsetFrame + Math.round(c.start * fps),
    endFrame: offsetFrame + Math.round(c.end * fps),
    shape: RHUBARB_MAP[c.value] ?? 'closed',
  }));

/** Busca binária: forma da boca no frame atual, ou null se ninguém estiver falando. */
export const mouthAt = (cues: MouthCue[], frame: number): MouthShape | null => {
  let lo = 0;
  let hi = cues.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const cue = cues[mid];
    if (frame < cue.startFrame) {
      hi = mid - 1;
    } else if (frame >= cue.endFrame) {
      lo = mid + 1;
    } else {
      return cue.shape;
    }
  }
  return null;
};
