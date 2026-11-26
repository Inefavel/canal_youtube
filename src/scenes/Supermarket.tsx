import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, VIDEO} from '../config/tokens';

const FLOOR_Y = 1380;
const COUNTER_Y = 1060;

const PRODUCT_COLORS = ['#FF6B6B', '#FECA57', '#1DD1A1', '#54A0FF', '#FF9FF3', '#FF9F43'];

/** Mercado (estático): prateleiras coloridas ao fundo, placa "CAIXA 3" e esteira do caixa à direita. */
export const Supermarket: React.FC = React.memo(() => {
  const tiles = Array.from({length: 12}, (_, i) => i * 100);
  return (
    <AbsoluteFill>
      <svg width={VIDEO.width} height={VIDEO.height} viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`}>
        <rect width={VIDEO.width} height={FLOOR_Y} fill={COLORS.marketWall} />

        {/* prateleiras */}
        {[440, 600, 760].map((y, row) => (
          <g key={y}>
            <rect x={40} y={y + 110} width={1000} height={22} fill={COLORS.desk} stroke={COLORS.ink} strokeWidth={8} />
            {Array.from({length: 11}, (_, i) => (
              <rect
                key={i}
                x={60 + i * 90}
                y={y + 110 - (60 + ((i + row) % 3) * 14)}
                width={66}
                height={60 + ((i + row) % 3) * 14}
                rx={8}
                fill={PRODUCT_COLORS[(i + row * 2) % PRODUCT_COLORS.length]}
                stroke={COLORS.ink}
                strokeWidth={6}
              />
            ))}
          </g>
        ))}

        {/* placa do caixa */}
        <rect x={720} y={240} width={260} height={110} rx={18} fill={COLORS.danger} stroke={COLORS.ink} strokeWidth={10} />
        <text x={850} y={315} fontFamily="Arial Black, sans-serif" fontSize={54} textAnchor="middle" fill="#FFFFFF">
          CAIXA 3
        </text>

        {/* caixa com esteira */}
        <rect x={560} y={COUNTER_Y} width={520} height={FLOOR_Y - COUNTER_Y} fill={COLORS.counter} stroke={COLORS.ink} strokeWidth={12} />
        <rect x={540} y={COUNTER_Y - 30} width={560} height={40} rx={10} fill="#2F3542" stroke={COLORS.ink} strokeWidth={12} />
        {Array.from({length: 6}, (_, i) => (
          <line key={i} x1={580 + i * 90} x2={580 + i * 90} y1={COUNTER_Y - 26} y2={COUNTER_Y + 6} stroke="#57606F" strokeWidth={6} />
        ))}

        {/* chão */}
        <rect y={FLOOR_Y} width={VIDEO.width} height={VIDEO.height - FLOOR_Y} fill="#E8E1D5" />
        {tiles.map((x) => (
          <line key={x} x1={x} x2={x - 120} y1={FLOOR_Y} y2={VIDEO.height} stroke="#CFC6B6" strokeWidth={6} />
        ))}
        <line x1={0} x2={VIDEO.width} y1={FLOOR_Y} y2={FLOOR_Y} stroke={COLORS.ink} strokeWidth={12} />
      </svg>
    </AbsoluteFill>
  );
});
Supermarket.displayName = 'Supermarket';

export const SUPERMARKET = {floorY: FLOOR_Y + 90, counterTopY: COUNTER_Y - 30} as const;
