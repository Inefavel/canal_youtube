import React from 'react';
import {COLORS} from '../config/tokens';

type WallClockProps = {
  x: number;
  y: number;
  /** Horas decorridas desde 7h00 (pode ser fracionário). */
  hours: number;
};

export const WallClock: React.FC<WallClockProps> = ({x, y, hours}) => {
  const totalMinutes = (7 + hours) * 60;
  const hourAngle = ((totalMinutes / 60) % 12) * 30;
  const minuteAngle = (totalMinutes % 60) * 6;
  return (
    <svg style={{position: 'absolute', left: x - 110, top: y - 110}} width={220} height={220} viewBox="0 0 220 220">
      <circle cx={110} cy={110} r={96} fill="#FFFFFF" stroke={COLORS.ink} strokeWidth={12} />
      {Array.from({length: 12}, (_, i) => (
        <line key={i} x1={110} x2={110} y1={26} y2={42} stroke={COLORS.ink} strokeWidth={6} transform={`rotate(${i * 30} 110 110)`} />
      ))}
      <line x1={110} x2={110} y1={110} y2={60} stroke={COLORS.ink} strokeWidth={12} strokeLinecap="round" transform={`rotate(${hourAngle} 110 110)`} />
      <line x1={110} x2={110} y1={110} y2={38} stroke="#FF4757" strokeWidth={7} strokeLinecap="round" transform={`rotate(${minuteAngle} 110 110)`} />
      <circle cx={110} cy={110} r={10} fill={COLORS.ink} />
    </svg>
  );
};
