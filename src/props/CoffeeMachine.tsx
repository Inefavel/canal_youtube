import React from 'react';
import {COLORS, FONTS, TYPE} from '../config/tokens';

type CoffeeMachineProps = {
  /** Posição da BASE (centro) da máquina. */
  x: number;
  y: number;
  screenLines: string[];
  /** 0 a 1; se null, a barra não aparece. */
  progress: number | null;
  /** 0 a 1: botão afundado. */
  buttonPressed?: number;
  /** Deslocamento de tremida (px). */
  shake?: number;
};

const W = 380;
const H = 460;

/** Fonte da tela encolhe para caber a linha mais longa (≈0.68 em de largura média por caractere). */
const fitFontSize = (lines: string[]): number => {
  const longest = Math.max(1, ...lines.map((l) => l.length));
  return Math.min(TYPE.screenSize, Math.floor((W - 110) / (longest * 0.68)));
};

export const CoffeeMachine: React.FC<CoffeeMachineProps> = ({x, y, screenLines, progress, buttonPressed = 0, shake = 0}) => (
  <div style={{position: 'absolute', left: x - W / 2 + shake, top: y - H, width: W, height: H}}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <rect x={10} y={10} width={W - 20} height={H - 20} rx={36} fill={COLORS.machine} stroke={COLORS.ink} strokeWidth={10} />
      {/* tela */}
      <rect x={40} y={40} width={W - 80} height={170} rx={16} fill={COLORS.machineScreen} stroke={COLORS.ink} strokeWidth={8} />
      {/* bico e área do copo */}
      <rect x={W / 2 - 110} y={250} width={220} height={170} rx={12} fill="#1B1F27" />
      <rect x={W / 2 - 30} y={250} width={60} height={34} rx={6} fill="#A4B0BE" stroke={COLORS.ink} strokeWidth={6} />
      {/* botão */}
      <circle cx={W - 60} cy={300} r={26} fill="#FF4757" stroke={COLORS.ink} strokeWidth={6} />
      <circle cx={W - 60} cy={300 + buttonPressed * 4} r={18 - buttonPressed * 4} fill="#FF6B81" />
      {progress !== null ? (
        <>
          <rect x={60} y={170} width={W - 120} height={22} rx={11} fill={COLORS.progressTrack} />
          <rect x={60} y={170} width={Math.max(22, (W - 120) * progress)} height={22} rx={11} fill={COLORS.machineScreenText} />
        </>
      ) : null}
    </svg>
    <div
      style={{
        position: 'absolute',
        left: 50,
        top: 52,
        width: W - 100,
        height: progress !== null ? 110 : 150,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONTS.display,
        fontSize: fitFontSize(screenLines),
        lineHeight: 1.05,
        color: COLORS.machineScreenText,
        textAlign: 'center',
      }}
    >
      {screenLines.map((l) => (
        <div key={l}>{l}</div>
      ))}
    </div>
  </div>
);

export const COFFEE_MACHINE = {width: W, height: H, spoutOffsetY: 160} as const;
