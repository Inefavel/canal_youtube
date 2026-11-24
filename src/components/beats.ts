import {Easing, spring} from 'remotion';
import {MOTION, sec} from '../config/timing';
import {kf} from './keyframes';

/** Entrada com mola pela esquerda: deslocamento x (px) e inclinação durante a entrada. */
export const slideIn = (frame: number, at: number, fps: number, distance = 420) => {
  const p = spring({frame: frame - at, fps, config: MOTION.springBouncy});
  return {dx: -distance * (1 - p), tilt: (1 - p) * -12, progress: p};
};

/** Braço acenando (graus) entre dois frames; fora do intervalo fica abaixado. */
export const wave = (frame: number, from: number, to: number, rest = 20) =>
  frame >= from && frame < to ? 150 + 20 * Math.sin(frame / 3) : rest;

/** Zoom de choque: entra rápido, segura e volta. */
export const shockZoom = (frame: number, start: number, end: number, peak = 1.45) =>
  kf(frame, [start - 2, start + 4, end, end + 8], [1, peak, peak, 1]);

/** Zoom lento final no rosto (tique + punchline). */
export const finaleZoom = (frame: number, from: number, to: number) => kf(frame, [from - sec(0.3), to], [1, 1.8], Easing.out(Easing.quad));

/** Tremor do choque, decaindo. */
export const shockShake = (frame: number, start: number, end: number) => (frame >= start && frame < end ? kf(frame, [start, end], [16, 2]) : 0);

/** Respiração sutil (squash). */
export const breathe = (frame: number, speed = 10) => 1 + 0.015 * Math.sin(frame / speed);
