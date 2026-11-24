import type {MouthShape} from '../lipsync/cues';

export type CharacterId = 'bolota' | 'palito';

export type Expression =
  | 'neutral'
  | 'tired'
  | 'shocked'
  | 'happy'
  | 'annoyed'
  | 'sleeping';

/** Bocas possíveis: as do lip-sync + as "de repouso" usadas pelas expressões. */
export type FaceMouth = MouthShape | 'smile' | 'frown' | 'flat';

export type CharacterProps = {
  /** Posição dos PÉS (base, centro) no canvas 1080x1920. */
  x: number;
  y: number;
  scale?: number;
  expression?: Expression;
  /** Boca do lip-sync; se null/undefined, usa a boca padrão da expressão. */
  mouth?: FaceMouth | null;
  /** Direção do olhar: -1 (esquerda/cima) a 1 (direita/baixo). */
  lookX?: number;
  lookY?: number;
  /** Ângulos dos braços em graus (0 = para baixo, 90 = para o lado, 180 = para cima). */
  leftArm?: number;
  rightArm?: number;
  /** Achatamento/estiramento: 1 = normal, <1 achata, >1 estica. */
  squash?: number;
  /** Inclinação do corpo em graus. */
  tilt?: number;
  /** Espelha horizontalmente (olhar para o outro lado). */
  flip?: boolean;
  /** Tique no olho direito (0 a 1) para cenas de irritação. */
  twitch?: number;
  /** Semente para variar o tempo da piscada entre personagens. */
  blinkSeed?: number;
};
