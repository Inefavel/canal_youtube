import React from 'react';
import {COLORS, CHARACTER} from '../../config/tokens';
import type {FaceMouth} from '../types';

type MouthProps = {
  cx: number;
  cy: number;
  /** Largura de referência da boca. */
  width: number;
  shape: FaceMouth;
};

export const Mouth: React.FC<MouthProps> = ({cx, cy, width: w, shape}) => {
  const stroke = CHARACTER.outline * 0.7;
  const line = {fill: 'none', stroke: COLORS.ink, strokeWidth: stroke, strokeLinecap: 'round' as const};
  const filled = {fill: COLORS.mouthInside, stroke: COLORS.ink, strokeWidth: stroke};

  switch (shape) {
    case 'closed':
      return <path d={`M ${cx - w / 2} ${cy} Q ${cx} ${cy + 8} ${cx + w / 2} ${cy}`} {...line} />;
    case 'flat':
      return <path d={`M ${cx - w / 2.5} ${cy} L ${cx + w / 2.5} ${cy}`} {...line} />;
    case 'smile':
      return <path d={`M ${cx - w / 2} ${cy - 6} Q ${cx} ${cy + w * 0.45} ${cx + w / 2} ${cy - 6}`} {...line} />;
    case 'frown':
      return <path d={`M ${cx - w / 2.4} ${cy + 10} Q ${cx} ${cy - w * 0.22} ${cx + w / 2.4} ${cy + 10}`} {...line} />;
    case 'small':
      return <ellipse cx={cx} cy={cy} rx={w * 0.2} ry={w * 0.1} {...filled} />;
    case 'round':
      return <ellipse cx={cx} cy={cy + w * 0.05} rx={w * 0.17} ry={w * 0.23} {...filled} />;
    case 'open':
    case 'wide': {
      const rx = shape === 'wide' ? w * 0.45 : w * 0.32;
      const ry = shape === 'wide' ? w * 0.3 : w * 0.22;
      const clipId = `mouth-${shape}-${cx.toFixed(0)}-${cy.toFixed(0)}`;
      return (
        <g>
          <defs>
            <clipPath id={clipId}>
              <ellipse cx={cx} cy={cy + ry * 0.4} rx={rx} ry={ry} />
            </clipPath>
          </defs>
          <ellipse cx={cx} cy={cy + ry * 0.4} rx={rx} ry={ry} fill={COLORS.mouthInside} />
          <ellipse clipPath={`url(#${clipId})`} cx={cx} cy={cy + ry * 1.25} rx={rx * 0.7} ry={ry * 0.55} fill={COLORS.tongue} />
          <ellipse cx={cx} cy={cy + ry * 0.4} rx={rx} ry={ry} fill="none" stroke={COLORS.ink} strokeWidth={stroke} />
        </g>
      );
    }
    default: {
      const exhaustive: never = shape;
      return exhaustive;
    }
  }
};
