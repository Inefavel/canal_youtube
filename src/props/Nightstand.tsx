import React from 'react';
import {COLORS, FONTS} from '../config/tokens';

type NightstandProps = {
  x: number;
  /** Chão. */
  y: number;
  /** Hora exibida no despertador, ex.: "06:05". */
  time: string;
  /** Tocando: o relógio treme e mostra ondas de som. */
  ringing: boolean;
  /** Botão de soneca afundado (0 a 1). */
  pressed: number;
  frame: number;
  /** Celular vibrando sobre o criado-mudo. */
  phoneBuzz?: boolean;
};

const W = 220;
const H = 230;

export const NIGHTSTAND_TOP = H; // altura do tampo em relação ao chão

/** Criado-mudo com despertador digital e celular. */
export const Nightstand: React.FC<NightstandProps> = ({x, y, time, ringing, pressed, frame, phoneBuzz = false}) => {
  const shake = ringing ? Math.sin(frame * 2.2) * 5 : 0;
  const phoneShake = phoneBuzz ? Math.sin(frame * 3.1) * 4 : 0;
  const clockTop = y - H - 120;
  return (
    <>
      <svg style={{position: 'absolute', left: x - W / 2, top: y - H}} width={W} height={H}>
        <rect x={6} y={6} width={W - 12} height={H - 12} rx={14} fill={COLORS.desk} stroke={COLORS.ink} strokeWidth={10} />
        <line x1={14} x2={W - 14} y1={H / 2} y2={H / 2} stroke={COLORS.ink} strokeWidth={8} />
        <circle cx={W / 2} cy={H / 4 + 4} r={9} fill={COLORS.ink} />
        <circle cx={W / 2} cy={(3 * H) / 4} r={9} fill={COLORS.ink} />
      </svg>

      {/* celular deitado no tampo */}
      <div
        style={{
          position: 'absolute',
          left: x + 30 + phoneShake,
          top: y - H - 22,
          width: 70,
          height: 22,
          borderRadius: 6,
          background: phoneBuzz ? '#FFFFFF' : COLORS.monitor,
          border: `5px solid ${COLORS.ink}`,
        }}
      />

      {/* despertador */}
      <div style={{position: 'absolute', left: x - 100 + shake, top: clockTop, width: 150, height: 120}}>
        <svg width={150} height={120} style={{position: 'absolute', overflow: 'visible'}}>
          <rect x={60} y={-6 + pressed * 6} width={40} height={14} rx={4} fill="#FF6B81" stroke={COLORS.ink} strokeWidth={5} />
          <rect x={4} y={8} width={142} height={104} rx={24} fill={COLORS.monitor} stroke={COLORS.ink} strokeWidth={8} />
          {ringing
            ? [0, 1, 2].map((i) => (
                <g key={i} opacity={((frame + i * 4) % 12) / 12}>
                  <path d={`M -14 ${30 - i * 10} q -14 30 0 60`} fill="none" stroke={COLORS.ink} strokeWidth={6} strokeLinecap="round" transform={`translate(${-i * 12} ${i * 10})`} />
                  <path d={`M 164 ${30 - i * 10} q 14 30 0 60`} fill="none" stroke={COLORS.ink} strokeWidth={6} strokeLinecap="round" transform={`translate(${i * 12} ${i * 10})`} />
                </g>
              ))
            : null}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 20,
            width: 122,
            height: 80,
            background: '#1B1F27',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONTS.display,
            fontSize: 42,
            color: COLORS.clockDigits,
            letterSpacing: 1,
          }}
        >
          {time}
        </div>
      </div>
    </>
  );
};

/** Posição do despertador, para a mão do personagem e para a câmera. */
export const clockCenter = (x: number, y: number) => ({x: x - 25, y: y - H - 60});
