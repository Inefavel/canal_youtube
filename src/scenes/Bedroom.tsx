import React from 'react';
import {AbsoluteFill, interpolateColors} from 'remotion';
import {COLORS, VIDEO} from '../config/tokens';

const FLOOR_Y = 1380;

type BedroomProps = {
  /** 0 = noite, 1 = dia claro (o céu da janela e a luz do quarto acompanham). */
  daylight: number;
};

/** Quarto: parede lilás, janela que amanhece, quadro e tapete. A cama e o criado-mudo são props à parte. */
export const Bedroom: React.FC<BedroomProps> = ({daylight}) => {
  const sky = interpolateColors(daylight, [0, 1], [COLORS.nightSky, COLORS.daySky]);
  const stripes = Array.from({length: 12}, (_, i) => i * 100);
  const tiles = Array.from({length: 12}, (_, i) => i * 100);
  return (
    <AbsoluteFill>
      <svg width={VIDEO.width} height={VIDEO.height} viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`}>
        <rect width={VIDEO.width} height={FLOOR_Y} fill={COLORS.bedroomWall} />
        {stripes.map((x) => (
          <rect key={x} x={x} y={0} width={50} height={FLOOR_Y} fill={COLORS.bedroomWallStripe} />
        ))}

        {/* janela com sol nascendo */}
        <rect x={640} y={300} width={300} height={360} rx={24} fill={sky} stroke={COLORS.ink} strokeWidth={12} />
        <circle cx={850} cy={620 - 200 * daylight} r={42} fill="#FFE66D" opacity={daylight} />
        <line x1={790} x2={790} y1={300} y2={660} stroke={COLORS.ink} strokeWidth={10} />
        <line x1={640} x2={940} y1={480} y2={480} stroke={COLORS.ink} strokeWidth={10} />
        {/* cortinas */}
        <path d="M 610 280 L 680 280 Q 660 480 700 690 L 610 690 Z" fill="#C56CF0" stroke={COLORS.ink} strokeWidth={8} />
        <path d="M 970 280 L 900 280 Q 920 480 880 690 L 970 690 Z" fill="#C56CF0" stroke={COLORS.ink} strokeWidth={8} />

        {/* quadro */}
        <rect x={130} y={380} width={220} height={170} rx={10} fill="#FFFFFF" stroke={COLORS.ink} strokeWidth={10} />
        <path d="M 150 520 L 210 440 L 250 490 L 285 450 L 330 520 Z" fill={COLORS.blanket} />
        <circle cx={300} cy={420} r={16} fill="#FFE66D" />

        {/* chão e tapete */}
        <rect y={FLOOR_Y} width={VIDEO.width} height={VIDEO.height - FLOOR_Y} fill={COLORS.floor} />
        {tiles.map((x) => (
          <line key={x} x1={x} x2={x - 120} y1={FLOOR_Y} y2={VIDEO.height} stroke={COLORS.floorDark} strokeWidth={6} />
        ))}
        <line x1={0} x2={VIDEO.width} y1={FLOOR_Y} y2={FLOOR_Y} stroke={COLORS.ink} strokeWidth={12} />
        <ellipse cx={540} cy={1560} rx={430} ry={90} fill={COLORS.rug} stroke={COLORS.ink} strokeWidth={10} />
      </svg>
      {/* luz da manhã entrando no quarto */}
      <AbsoluteFill style={{background: '#1B2140', opacity: 0.35 * (1 - daylight)}} />
    </AbsoluteFill>
  );
};

export const BEDROOM = {floorY: FLOOR_Y + 90} as const;
