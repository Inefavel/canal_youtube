import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, VIDEO} from '../config/tokens';

const FLOOR_Y = 1380;
const DESK_Y = 1020;

/** Escritório em casa (estático e memoizado): janela, estante com planta e mesa à direita. */
export const HomeOffice: React.FC = React.memo(() => {
  const stripes = Array.from({length: 12}, (_, i) => i * 100);
  const tiles = Array.from({length: 12}, (_, i) => i * 100);
  return (
    <AbsoluteFill>
      <svg width={VIDEO.width} height={VIDEO.height} viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`}>
        <rect width={VIDEO.width} height={FLOOR_Y} fill={COLORS.officeWall} />
        {stripes.map((x) => (
          <rect key={x} x={x} y={0} width={50} height={FLOOR_Y} fill={COLORS.officeWallStripe} />
        ))}

        {/* janela noturna (é tarde e ele ainda está pagando conta) */}
        <rect x={90} y={330} width={300} height={360} rx={24} fill="#2C3E73" stroke={COLORS.ink} strokeWidth={12} />
        <line x1={240} x2={240} y1={330} y2={690} stroke={COLORS.ink} strokeWidth={10} />
        <line x1={90} x2={390} y1={510} y2={510} stroke={COLORS.ink} strokeWidth={10} />
        <circle cx={330} cy={400} r={34} fill="#F7F1E3" />
        <circle cx={316} cy={392} r={34} fill="#2C3E73" />
        {[[140, 380], [190, 450], [300, 600], [150, 620]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={5} fill="#F7F1E3" />
        ))}

        {/* estante com planta */}
        <rect x={600} y={420} width={360} height={24} rx={6} fill={COLORS.desk} stroke={COLORS.ink} strokeWidth={8} />
        <rect x={640} y={330} width={50} height={90} fill="#FF9F43" stroke={COLORS.ink} strokeWidth={6} />
        <rect x={695} y={350} width={40} height={70} fill="#4FA3F7" stroke={COLORS.ink} strokeWidth={6} />
        <rect x={740} y={340} width={30} height={80} fill="#FECA57" stroke={COLORS.ink} strokeWidth={6} />
        <path d="M 850 420 L 840 360 L 920 360 L 910 420 Z" fill={COLORS.plantPot} stroke={COLORS.ink} strokeWidth={6} />
        <path d="M 880 360 q -50 -60 -20 -110 q 10 50 20 110 q 10 -70 50 -100 q -10 60 -50 100" fill={COLORS.plant} stroke={COLORS.ink} strokeWidth={6} />

        {/* mesa */}
        <rect x={540} y={DESK_Y - 30} width={560} height={40} rx={10} fill={COLORS.deskTop} stroke={COLORS.ink} strokeWidth={12} />
        <rect x={580} y={DESK_Y + 10} width={40} height={FLOOR_Y - DESK_Y - 10} fill={COLORS.desk} stroke={COLORS.ink} strokeWidth={10} />
        <rect x={1020} y={DESK_Y + 10} width={40} height={FLOOR_Y - DESK_Y - 10} fill={COLORS.desk} stroke={COLORS.ink} strokeWidth={10} />

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
HomeOffice.displayName = 'HomeOffice';

export const HOME_OFFICE = {floorY: FLOOR_Y + 90, deskTopY: DESK_Y - 30} as const;
