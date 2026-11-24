import React from 'react';
import {COLORS, CHARACTER} from '../../config/tokens';

type EyeProps = {
  cx: number;
  cy: number;
  r: number;
  /** 0 = aberto, 1 = fechado. */
  lid: number;
  lookX: number;
  lookY: number;
  pupilScale: number;
  browAngle: number;
  browLift: number;
  /** -1 para o olho esquerdo (espelha a sobrancelha), 1 para o direito. */
  side: -1 | 1;
};

export const Eye: React.FC<EyeProps> = ({cx, cy, r, lid, lookX, lookY, pupilScale, browAngle, browLift, side}) => {
  const stroke = CHARACTER.outline * 0.7;
  const clipId = `eye-clip-${cx.toFixed(1)}-${cy.toFixed(1)}`;
  const pupilR = r * 0.42 * pupilScale;
  const px = cx + lookX * r * 0.45;
  const py = cy + lookY * r * 0.4;
  // A pálpebra desce de cima (y = cy - r) até cobrir o olho inteiro (y = cy + r).
  const lidBottom = cy - r + 2 * r * Math.min(1, Math.max(0, lid));
  const closed = lid >= 0.97;
  const browY = cy - r - browLift;
  const browHalf = r * 0.95;

  return (
    <g>
      {closed ? (
        <path
          d={`M ${cx - r} ${cy} Q ${cx} ${cy + r * 0.5} ${cx + r} ${cy}`}
          fill="none"
          stroke={COLORS.ink}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      ) : (
        <>
          <defs>
            <clipPath id={clipId}>
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
          </defs>
          <circle cx={cx} cy={cy} r={r} fill={COLORS.eyeWhite} />
          <g clipPath={`url(#${clipId})`}>
            <circle cx={px} cy={py} r={pupilR} fill={COLORS.ink} />
            <circle cx={px - pupilR * 0.35} cy={py - pupilR * 0.35} r={pupilR * 0.3} fill={COLORS.eyeWhite} />
            {lid > 0.01 ? (
              <rect x={cx - r - 2} y={cy - r - 2} width={2 * r + 4} height={lidBottom - (cy - r) + 2} fill="currentColor" />
            ) : null}
            {lid > 0.01 ? (
              <line x1={cx - r} x2={cx + r} y1={lidBottom} y2={lidBottom} stroke={COLORS.ink} strokeWidth={stroke} />
            ) : null}
          </g>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={COLORS.ink} strokeWidth={stroke} />
        </>
      )}
      <line
        x1={cx - browHalf}
        x2={cx + browHalf}
        y1={browY}
        y2={browY}
        stroke={COLORS.ink}
        strokeWidth={stroke * 1.4}
        strokeLinecap="round"
        transform={`rotate(${-browAngle * side} ${cx} ${browY})`}
      />
    </g>
  );
};
