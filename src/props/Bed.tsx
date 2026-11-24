import React from 'react';
import {COLORS} from '../config/tokens';

/** Área da cama (px no canvas). A cabeceira fica atrás do personagem e o cobertor na frente. */
export const BED = {left: 190, right: 850, mattressY: 1180, floorY: 1380} as const;

/** Cabeceira e travesseiro: desenhar ANTES do personagem. */
export const BedBack: React.FC = () => (
  <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
    <rect x={BED.left + 40} y={860} width={BED.right - BED.left - 80} height={360} rx={40} fill={COLORS.bedFrame} stroke={COLORS.ink} strokeWidth={12} />
    <rect x={BED.left + 200} y={1060} width={420} height={140} rx={60} fill={COLORS.pillow} stroke={COLORS.ink} strokeWidth={10} />
  </svg>
);

/** Cobertor e pés da cama: desenhar DEPOIS do personagem (cobre o corpo dele). */
export const BedFront: React.FC<{ruffle: number}> = ({ruffle}) => {
  const top = BED.mattressY + 50;
  const wave = (i: number) => Math.sin(i * 1.3 + ruffle) * 8;
  const points = Array.from({length: 9}, (_, i) => {
    const x = BED.left + ((BED.right - BED.left) / 8) * i;
    return `${x},${top + wave(i)}`;
  });
  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
      <polygon
        points={`${BED.left - 10},${BED.floorY - 20} ${points.join(' ')} ${BED.right + 10},${BED.floorY - 20}`}
        fill={COLORS.blanket}
        stroke={COLORS.ink}
        strokeWidth={12}
        strokeLinejoin="round"
      />
      <path d={`M ${BED.left + 40} ${top + 80} Q ${(BED.left + BED.right) / 2} ${top + 110} ${BED.right - 40} ${top + 80}`} fill="none" stroke={COLORS.blanketDark} strokeWidth={10} />
      <rect x={BED.left - 20} y={BED.floorY - 30} width={BED.right - BED.left + 40} height={40} rx={10} fill={COLORS.bedFrame} stroke={COLORS.ink} strokeWidth={10} />
      <rect x={BED.left} y={BED.floorY + 10} width={30} height={60} fill={COLORS.bedFrame} stroke={COLORS.ink} strokeWidth={8} />
      <rect x={BED.right - 30} y={BED.floorY + 10} width={30} height={60} fill={COLORS.bedFrame} stroke={COLORS.ink} strokeWidth={8} />
    </svg>
  );
};
