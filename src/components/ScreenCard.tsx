import React from 'react';
import {spring} from 'remotion';
import {COLORS, FONTS} from '../config/tokens';

export type ScreenRow = {text: string; color?: string; bold?: boolean};

type ScreenCardProps = {
  frame: number;
  fps: number;
  start: number;
  end: number;
  /** Faixa colorida do topo (nome do app). */
  title: string;
  accent: string;
  rows?: ScreenRow[];
  /** Valor grande no centro (ex.: "R$ 0,12", "7:43"). */
  big?: {text: string; color?: string};
  /** 0 a 1: barra de progresso (player de áudio, download…). */
  progress?: number;
  footer?: string;
  /** Posição vertical do topo do cartão. */
  top?: number;
};

/** Cartão de tela de app (celular) que surge com mola: banco, player de áudio, Wi-Fi, cartelas. */
export const ScreenCard: React.FC<ScreenCardProps> = ({frame, fps, start, end, title, accent, rows = [], big, progress, footer, top = 560}) => {
  if (frame < start || frame >= end) {
    return null;
  }
  const pop = spring({frame: frame - start, fps, config: {damping: 13, stiffness: 170, mass: 0.7}});
  const out = spring({frame: frame - (end - 8), fps, config: {damping: 20, stiffness: 220}});
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        top,
        background: '#FFFFFF',
        border: `8px solid ${COLORS.ink}`,
        borderRadius: 40,
        overflow: 'hidden',
        boxShadow: `0 14px 0 ${COLORS.ink}`,
        transform: `scale(${pop * (1 - out)}) rotate(${(1 - pop) * -6}deg)`,
      }}
    >
      <div style={{background: accent, color: '#fff', fontFamily: FONTS.display, fontSize: 40, padding: '16px 28px'}}>{title}</div>
      <div style={{padding: '20px 28px 26px'}}>
        {rows.map((r, i) => (
          <div
            key={`${r.text}-${i}`}
            style={{fontFamily: r.bold ? FONTS.display : FONTS.body, fontWeight: 700, fontSize: 40, color: r.color ?? COLORS.ink, lineHeight: 1.3}}
          >
            {r.text}
          </div>
        ))}
        {big ? (
          <div style={{fontFamily: FONTS.display, fontSize: Math.min(120, Math.floor(820 / (big.text.length * 0.66))), color: big.color ?? COLORS.ink, textAlign: 'center', lineHeight: 1.1, marginTop: 6, whiteSpace: 'nowrap'}}>
            {big.text}
          </div>
        ) : null}
        {progress !== undefined ? (
          <div style={{height: 26, borderRadius: 13, background: '#DFE4EA', border: `5px solid ${COLORS.ink}`, marginTop: 14, overflow: 'hidden'}}>
            <div style={{width: `${Math.round(progress * 100)}%`, height: '100%', background: accent}} />
          </div>
        ) : null}
        {footer ? <div style={{fontFamily: FONTS.body, fontSize: 32, color: '#57606F', marginTop: 12, textAlign: 'center'}}>{footer}</div> : null}
      </div>
    </div>
  );
};
