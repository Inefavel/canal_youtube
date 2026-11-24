import React from 'react';
import {AbsoluteFill, spring} from 'remotion';
import {COLORS, FONTS, TYPE, VIDEO} from '../config/tokens';
import {MOTION} from '../config/timing';
import {kf} from './keyframes';

/** Fechamento em íris (círculo) no ponto (x, y), clássico de desenho animado. */
export const IrisOut: React.FC<{frame: number; start: number; end: number; x: number; y: number}> = ({frame, start, end, x, y}) => {
  if (frame < start) {
    return null;
  }
  const maxR = Math.hypot(VIDEO.width, VIDEO.height);
  const r = kf(frame, [start, end - 6, end], [maxR, 220, 0]);
  return (
    <AbsoluteFill>
      <svg width={VIDEO.width} height={VIDEO.height}>
        <defs>
          <mask id="iris">
            <rect width={VIDEO.width} height={VIDEO.height} fill="white" />
            <circle cx={x} cy={y} r={r} fill="black" />
          </mask>
        </defs>
        <rect width={VIDEO.width} height={VIDEO.height} fill={COLORS.ink} mask="url(#iris)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Cartela de texto que "bate" na tela (ex.: "3 HORAS DEPOIS..."). */
export const TitleCard: React.FC<{frame: number; fps: number; start: number; end: number; text: string; background?: string}> = ({
  frame,
  fps,
  start,
  end,
  text,
  background = COLORS.ink,
}) => {
  if (frame < start || frame >= end) {
    return null;
  }
  const slam = spring({frame: frame - start, fps, config: MOTION.springBouncy});
  const opacity = kf(frame, [start, start + 4, end - 6, end], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{background, opacity, justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: TYPE.titleSize,
          color: COLORS.captionHighlight,
          textAlign: 'center',
          lineHeight: 1,
          transform: `scale(${2 - slam}) rotate(${(1 - slam) * -8}deg)`,
          padding: 60,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** "Zzz" flutuando acima de um personagem dormindo. */
export const Zzz: React.FC<{frame: number; x: number; y: number}> = ({frame, x, y}) => (
  <>
    {[0, 1, 2].map((i) => {
      const t = ((frame + i * 15) % 45) / 45;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x + t * 90 + i * 10,
            top: y - t * 160,
            fontFamily: FONTS.display,
            fontSize: 50 + i * 16,
            color: COLORS.ink,
            opacity: 1 - t,
          }}
        >
          Z
        </div>
      );
    })}
  </>
);

/** Linhas de impacto radiais (para choque/surpresa). */
export const ImpactLines: React.FC<{frame: number; start: number; end: number; x: number; y: number}> = ({frame, start, end, x, y}) => {
  if (frame < start || frame >= end) {
    return null;
  }
  const grow = kf(frame, [start, start + 5], [0.4, 1]);
  const opacity = kf(frame, [end - 6, end], [1, 0]);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, opacity}} width={VIDEO.width} height={VIDEO.height}>
      {Array.from({length: 16}, (_, i) => {
        const a = (i / 16) * Math.PI * 2 + (frame % 2) * 0.05;
        const r1 = 330 * grow;
        const r2 = 520 * grow;
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * r1}
            y1={y + Math.sin(a) * r1}
            x2={x + Math.cos(a) * r2}
            y2={y + Math.sin(a) * r2}
            stroke={COLORS.ink}
            strokeWidth={10}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
