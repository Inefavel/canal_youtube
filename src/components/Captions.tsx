import React from 'react';
import {interpolate, spring} from 'remotion';
import {COLORS, FONTS, SAFE_AREA, TYPE, VIDEO} from '../config/tokens';
import {MOTION} from '../config/timing';

export type CaptionLine = {
  id: string;
  speaker: string;
  text: string;
  startFrame: number;
  endFrame: number;
  /** Frame de início de cada palavra (voz real). Sem isso, as palavras avançam de forma linear. */
  wordFrames?: number[];
};

type CaptionsProps = {
  lines: CaptionLine[];
  frame: number;
  fps: number;
  speakerColors: Record<string, string>;
  speakerNames: Record<string, string>;
};

/** Progresso "em palavras" (ex.: 2.4 = terceira palavra sendo dita) a partir dos frames de cada palavra. */
const wordProgress = (wordFrames: number[], endFrame: number, frame: number): number => {
  for (let i = wordFrames.length - 1; i >= 0; i--) {
    if (frame >= wordFrames[i]) {
      const next = wordFrames[i + 1] ?? endFrame;
      return Math.min(i + 1, i + (frame - wordFrames[i]) / Math.max(1, next - wordFrames[i]));
    }
  }
  return 0;
};

/** Legenda dinâmica palavra a palavra, no topo da zona segura dos Shorts (não cobre os personagens). */
export const Captions: React.FC<CaptionsProps> = ({lines, frame, fps, speakerColors, speakerNames}) => {
  const HOLD = 8; // frames que a legenda fica após o fim da fala
  const line = lines.find((l) => frame >= l.startFrame && frame < l.endFrame + HOLD);
  if (!line) {
    return null;
  }
  const words = line.text.split(' ');
  const progress = line.wordFrames
    ? wordProgress(line.wordFrames, line.endFrame, frame)
    : interpolate(frame, [line.startFrame, line.endFrame], [0, words.length], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const pop = spring({frame: frame - line.startFrame, fps, config: MOTION.springSnappy});
  const fadeOut = interpolate(frame, [line.endFrame, line.endFrame + HOLD], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const color = speakerColors[line.speaker] ?? COLORS.captionText;

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE_AREA.side,
        right: SAFE_AREA.side,
        top: SAFE_AREA.top + 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: fadeOut,
        transform: `scale(${0.7 + 0.3 * pop})`,
        width: VIDEO.width - SAFE_AREA.side * 2,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.display,
          fontSize: 40,
          color: COLORS.captionText,
          background: color,
          border: `6px solid ${COLORS.ink}`,
          borderRadius: 18,
          padding: '4px 22px',
          marginBottom: 14,
        }}
      >
        {speakerNames[line.speaker] ?? line.speaker}
      </div>
      <div style={{textAlign: 'center', lineHeight: 1.1}}>
        {words.map((w, i) => {
          const visible = progress > i;
          const current = progress > i && progress < i + 1;
          return (
            <span
              key={`${line.id}-${i}`}
              style={{
                display: 'inline-block',
                margin: '0 10px',
                fontFamily: FONTS.display,
                fontSize: TYPE.captionSize,
                color: current ? COLORS.captionHighlight : COLORS.captionText,
                WebkitTextStroke: `${TYPE.captionStroke}px ${COLORS.captionStroke}`,
                paintOrder: 'stroke fill',
                opacity: visible ? 1 : 0.25,
                transform: current ? 'scale(1.12)' : 'scale(1)',
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
