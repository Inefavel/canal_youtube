import {Easing, interpolate} from 'remotion';

/**
 * Interpolação por keyframes com clamp e easing suave.
 * Ex.: kf(frame, [0, 30, 60], [0, 1, 0])
 */
export const kf = (
  frame: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
): number =>
  interpolate(frame, input, output, {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Valor discreto por intervalos: o último keyframe cujo frame <= frame atual. */
export const step = <T,>(frame: number, keys: [number, T][]): T => {
  let value = keys[0][1];
  for (const [at, v] of keys) {
    if (frame >= at) {
      value = v;
    }
  }
  return value;
};
