import {VIDEO} from './tokens';

/** Converte segundos em frames (arredondado). */
export const sec = (seconds: number): number => Math.round(seconds * VIDEO.fps);

/** Converte frames em segundos. */
export const toSeconds = (frames: number): number => frames / VIDEO.fps;

/** Curvas de easing reutilizáveis (cubic-bezier) para manter o "feel" consistente. */
export const MOTION = {
  /** Mola padrão para entradas de personagem. */
  springBouncy: {damping: 11, stiffness: 140, mass: 0.8},
  /** Mola firme para elementos de UI. */
  springSnappy: {damping: 18, stiffness: 220, mass: 0.6},
  /** Duração padrão das transições. */
  transitionFrames: 12,
  /** Intervalo médio entre piscadas. */
  blinkEvery: 75,
  blinkDuration: 6,
} as const;
