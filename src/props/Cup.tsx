import React from 'react';
import {COLORS, FONTS} from '../config/tokens';

type CupProps = {
  x: number;
  /** Base do copo. */
  y: number;
  liquid: string;
  label?: string;
  /** Frame atual (para animar o vapor sem hooks extras). */
  frame: number;
  scale?: number;
};

export const Cup: React.FC<CupProps> = ({x, y, liquid, label, frame, scale = 1}) => {
  const steam = [0, 1, 2].map((i) => {
    const t = (frame + i * 12) % 40;
    return {dx: -30 + i * 30 + Math.sin((frame + i * 20) / 6) * 6, dy: -t * 2.2, opacity: 1 - t / 40};
  });
  return (
    <div style={{position: 'absolute', left: x - 90, top: y - 200, width: 180, height: 200, transform: `scale(${scale})`, transformOrigin: '50% 100%'}}>
      <svg width={180} height={200} viewBox="0 0 180 200" style={{overflow: 'visible'}}>
        {steam.map((s, i) => (
          <path
            key={i}
            d={`M ${90 + s.dx} ${70 + s.dy} q 10 -15 0 -30 q -10 -15 0 -30`}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={8}
            strokeLinecap="round"
            opacity={s.opacity}
          />
        ))}
        <path d="M 135 105 q 45 0 40 35 q -5 30 -45 25" fill="none" stroke={COLORS.ink} strokeWidth={10} />
        <path d="M 30 80 L 150 80 L 138 190 L 42 190 Z" fill={COLORS.cup} stroke={COLORS.ink} strokeWidth={10} strokeLinejoin="round" />
        <ellipse cx={90} cy={84} rx={56} ry={10} fill={liquid} />
      </svg>
      {label ? (
        <div style={{position: 'absolute', top: 120, width: 180, textAlign: 'center', fontFamily: FONTS.display, fontSize: 22, color: COLORS.ink}}>
          {label}
        </div>
      ) : null}
    </div>
  );
};
