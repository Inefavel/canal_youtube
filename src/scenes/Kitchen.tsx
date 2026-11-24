import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, VIDEO} from '../config/tokens';

const FLOOR_Y = 1380;
const COUNTER_Y = 1020;

/** Cozinha estática. Memoizada: não depende do frame, então não é recalculada a cada quadro. */
export const Kitchen: React.FC = React.memo(() => {
  const stripes = Array.from({length: 12}, (_, i) => i * 100);
  const tiles = Array.from({length: 12}, (_, i) => i * 100);
  return (
    <AbsoluteFill>
      <svg width={VIDEO.width} height={VIDEO.height} viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`}>
        <rect width={VIDEO.width} height={FLOOR_Y} fill={COLORS.wall} />
        {stripes.map((x) => (
          <rect key={x} x={x} y={0} width={50} height={FLOOR_Y} fill={COLORS.wallStripe} />
        ))}

        {/* janela */}
        <rect x={90} y={330} width={300} height={360} rx={24} fill="#9AD8FF" stroke={COLORS.ink} strokeWidth={12} />
        <line x1={240} x2={240} y1={330} y2={690} stroke={COLORS.ink} strokeWidth={10} />
        <line x1={90} x2={390} y1={510} y2={510} stroke={COLORS.ink} strokeWidth={10} />
        <circle cx={330} cy={400} r={36} fill="#FFE66D" />

        {/* bancada */}
        <rect x={560} y={COUNTER_Y} width={520} height={FLOOR_Y - COUNTER_Y} fill={COLORS.counter} stroke={COLORS.ink} strokeWidth={12} />
        <rect x={540} y={COUNTER_Y - 30} width={560} height={40} rx={10} fill={COLORS.counterTop} stroke={COLORS.ink} strokeWidth={12} />
        <line x1={820} x2={820} y1={COUNTER_Y + 40} y2={FLOOR_Y - 20} stroke={COLORS.ink} strokeWidth={8} />
        <circle cx={790} cy={COUNTER_Y + 180} r={10} fill={COLORS.ink} />
        <circle cx={850} cy={COUNTER_Y + 180} r={10} fill={COLORS.ink} />

        {/* chão */}
        <rect y={FLOOR_Y} width={VIDEO.width} height={VIDEO.height - FLOOR_Y} fill={COLORS.floor} />
        {tiles.map((x) => (
          <line key={x} x1={x} x2={x - 120} y1={FLOOR_Y} y2={VIDEO.height} stroke={COLORS.floorDark} strokeWidth={6} />
        ))}
        <line x1={0} x2={VIDEO.width} y1={FLOOR_Y} y2={FLOOR_Y} stroke={COLORS.ink} strokeWidth={12} />
      </svg>
    </AbsoluteFill>
  );
});
Kitchen.displayName = 'Kitchen';

export const KITCHEN = {floorY: FLOOR_Y + 90, counterTopY: COUNTER_Y - 30} as const;
