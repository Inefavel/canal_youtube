import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, VIDEO} from '../config/tokens';

const FLOOR_Y = 1380;

/** Ônibus por dentro: janelas com a cidade passando, barras de apoio e bancos. `frame` move a paisagem. */
export const Bus: React.FC<{frame: number}> = ({frame}) => {
  const shift = (frame * 9) % 360;
  return (
    <AbsoluteFill>
      <svg width={VIDEO.width} height={VIDEO.height} viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`}>
        <rect width={VIDEO.width} height={FLOOR_Y} fill={COLORS.busWall} />
        {/* janelas com prédios passando */}
        <defs>
          <clipPath id="bus-windows">
            {[0, 1, 2].map((i) => (
              <rect key={i} x={40 + i * 350} y={480} width={300} height={300} rx={26} />
            ))}
          </clipPath>
        </defs>
        <g clipPath="url(#bus-windows)">
          <rect x={0} y={480} width={VIDEO.width} height={300} fill="#9AD8FF" />
          {Array.from({length: 8}, (_, i) => {
            const x = ((i * 180 - shift * 2) % 1440) + 1440;
            const h = 110 + ((i * 53) % 120);
            return <rect key={i} x={(x % 1440) - 180} y={780 - h} width={140} height={h} fill={['#A4B0BE', '#747D8C', '#CED6E0'][i % 3]} stroke={COLORS.ink} strokeWidth={6} />;
          })}
        </g>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={40 + i * 350} y={480} width={300} height={300} rx={26} fill="none" stroke={COLORS.ink} strokeWidth={12} />
        ))}
        {/* barra de apoio */}
        <rect x={0} y={400} width={VIDEO.width} height={18} fill="#DFE4EA" stroke={COLORS.ink} strokeWidth={6} />
        {[180, 900].map((x) => (
          <rect key={x} x={x} y={400} width={18} height={FLOOR_Y - 400} fill="#DFE4EA" stroke={COLORS.ink} strokeWidth={6} />
        ))}
        {/* bancos */}
        {[60, 760].map((x) => (
          <g key={x}>
            <rect x={x} y={960} width={260} height={160} rx={20} fill={COLORS.busSeat} stroke={COLORS.ink} strokeWidth={10} />
            <rect x={x} y={1110} width={260} height={50} rx={12} fill={COLORS.busSeat} stroke={COLORS.ink} strokeWidth={10} />
          </g>
        ))}
        <rect y={FLOOR_Y} width={VIDEO.width} height={VIDEO.height - FLOOR_Y} fill="#57606F" />
        <line x1={0} x2={VIDEO.width} y1={FLOOR_Y} y2={FLOOR_Y} stroke={COLORS.ink} strokeWidth={12} />
      </svg>
    </AbsoluteFill>
  );
};

export const BUS = {floorY: FLOOR_Y + 90} as const;
