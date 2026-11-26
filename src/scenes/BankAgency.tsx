import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, FONTS, VIDEO} from '../config/tokens';

const FLOOR_Y = 1380;
const COUNTER_Y = 1080;

type BankAgencyProps = {
  /** Número exibido no painel de senhas (ex.: "847"). */
  calling: string;
  /** Guichê exibido no painel. */
  window: number;
  /** 0 a 1: brilho do painel quando troca de senha. */
  flash?: number;
};

/** Agência bancária: painel de senhas, guichês com vidro, cadeiras de espera e vaso de planta. */
export const BankAgency: React.FC<BankAgencyProps> = ({calling, window, flash = 0}) => {
  const tiles = Array.from({length: 12}, (_, i) => i * 100);
  return (
    <AbsoluteFill>
      <svg width={VIDEO.width} height={VIDEO.height} viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`}>
        <rect width={VIDEO.width} height={FLOOR_Y} fill={COLORS.bankWall} />
        <rect y={760} width={VIDEO.width} height={20} fill={COLORS.bankStripe} />

        {/* guichês */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={60 + i * 340} y={800} width={300} height={290} rx={12} fill="#BFE6FF" opacity={0.7} stroke={COLORS.ink} strokeWidth={10} />
            <rect x={140 + i * 340} y={815} width={140} height={44} rx={8} fill="#FFFFFF" stroke={COLORS.ink} strokeWidth={6} />
            <text x={210 + i * 340} y={849} fontFamily={FONTS.display} fontSize={30} textAnchor="middle" fill={COLORS.ink}>
              {`GUICHÊ ${i + 3}`}
            </text>
          </g>
        ))}

        {/* chão */}
        <rect y={FLOOR_Y} width={VIDEO.width} height={VIDEO.height - FLOOR_Y} fill="#B8C4D6" />
        {tiles.map((x) => (
          <line key={x} x1={x} x2={x - 120} y1={FLOOR_Y} y2={VIDEO.height} stroke="#9AA8BC" strokeWidth={6} />
        ))}
        <line x1={0} x2={VIDEO.width} y1={FLOOR_Y} y2={FLOOR_Y} stroke={COLORS.ink} strokeWidth={12} />
      </svg>

      {/* painel de senhas */}
      <div
        style={{
          position: 'absolute',
          left: 240,
          top: 560,
          width: 600,
          height: 220,
          background: COLORS.monitor,
          border: `12px solid ${COLORS.ink}`,
          borderRadius: 24,
          boxShadow: `0 0 ${60 * flash}px ${COLORS.clockDigits}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{fontFamily: FONTS.display, fontSize: 40, color: '#DFE4EA', letterSpacing: 4}}>SENHA · GUICHÊ {window}</div>
        <div style={{fontFamily: FONTS.display, fontSize: 130, lineHeight: 1, color: COLORS.clockDigits}}>{calling}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Balcão dos guichês, desenhado por cima do atendente (que fica "atrás" dele). */
export const BankCounterFront: React.FC = React.memo(() => (
  <svg style={{position: 'absolute', left: 0, top: 0}} width={VIDEO.width} height={VIDEO.height} viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`}>
    <rect x={0} y={COUNTER_Y} width={VIDEO.width} height={FLOOR_Y - COUNTER_Y} fill={COLORS.bankCounter} stroke={COLORS.ink} strokeWidth={12} />
    <rect x={0} y={COUNTER_Y - 20} width={VIDEO.width} height={34} fill={COLORS.counterTop} stroke={COLORS.ink} strokeWidth={10} />
    {[340, 680].map((x) => (
      <line key={x} x1={x} x2={x} y1={COUNTER_Y + 20} y2={FLOOR_Y - 10} stroke={COLORS.ink} strokeWidth={8} />
    ))}
  </svg>
));
BankCounterFront.displayName = 'BankCounterFront';

export const BANK = {floorY: FLOOR_Y + 90, counterTopY: COUNTER_Y - 20} as const;
