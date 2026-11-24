import React from 'react';
import {COLORS, FONTS} from '../config/tokens';

/** Roteador de Wi-Fi com antenas, luzes piscando e a etiqueta da senha. */
export const Router: React.FC<{x: number; y: number; frame: number; blinkFast?: boolean}> = ({x, y, frame, blinkFast = false}) => {
  const period = blinkFast ? 4 : 12;
  return (
    <div style={{position: 'absolute', left: x - 150, top: y - 190, width: 300, height: 190}}>
      <svg width={300} height={190} style={{position: 'absolute'}}>
        <line x1={70} x2={50} y1={100} y2={10} stroke={COLORS.ink} strokeWidth={14} strokeLinecap="round" />
        <line x1={230} x2={250} y1={100} y2={10} stroke={COLORS.ink} strokeWidth={14} strokeLinecap="round" />
        <rect x={10} y={90} width={280} height={90} rx={20} fill="#F1F2F6" stroke={COLORS.ink} strokeWidth={10} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={50 + i * 34} cy={120} r={9} fill={Math.floor((frame + i * 3) / period) % 2 === 0 ? '#2ED573' : '#7BED9F'} />
        ))}
        <rect x={180} y={128} width={92} height={40} rx={6} fill="#FFFFFF" stroke={COLORS.ink} strokeWidth={4} />
      </svg>
      <div style={{position: 'absolute', left: 186, top: 133, width: 80, fontFamily: FONTS.body, fontSize: 11, lineHeight: 1.1, color: COLORS.ink, fontWeight: 700}}>
        WI-FI
        <br />
        SENHA ↓
      </div>
    </div>
  );
};
