import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CHARACTER, COLORS} from '../config/tokens';
import {MOTION} from '../config/timing';
import {EXPRESSIONS} from './expressions';
import {Eye} from './parts/Eye';
import {Mouth} from './parts/Mouth';
import type {CharacterId, CharacterProps} from './types';

type Look = {
  body: string;
  belly: string;
  bodyWidth: number;
  bodyHeight: number;
  eyeRadius: number;
  eyeGap: number;
  legLength: number;
  /** Altura dos olhos como fração da altura do corpo (0 = topo). */
  eyeLine: number;
  armLength: number;
};

const LOOKS: Record<CharacterId, Look> = {
  bolota: {
    body: COLORS.bolotaBody,
    belly: COLORS.bolotaBelly,
    ...CHARACTER.bolota,
    eyeLine: 0.36,
    armLength: 150,
  },
  palito: {
    body: COLORS.palitoBody,
    belly: COLORS.palitoBelly,
    ...CHARACTER.palito,
    eyeLine: 0.16,
    armLength: 230,
  },
};

const ARM_MARGIN = 260;
const TOP_MARGIN = 120;

/** Quanto a pálpebra está fechada por causa da piscada (0 a 1), determinístico por frame. */
const blinkAt = (frame: number, seed: number): number => {
  const period = MOTION.blinkEvery + (seed % 3) * 17;
  const t = (frame + seed * 23) % period;
  if (t >= MOTION.blinkDuration) {
    return 0;
  }
  const half = MOTION.blinkDuration / 2;
  return 1 - Math.abs(t - half) / half;
};

type ArmProps = {x: number; y: number; angle: number; length: number; color: string};

const Arm: React.FC<ArmProps> = ({x, y, angle, length, color}) => {
  const rad = (angle * Math.PI) / 180;
  // ângulo 0 = para baixo; positivo gira para FORA do corpo (o sinal do lado é aplicado por quem chama)
  const ex = x + Math.sin(rad) * length;
  const ey = y + Math.cos(rad) * length;
  const mx = x + Math.sin(rad) * length * 0.5 + Math.cos(rad) * 18;
  const my = y + Math.cos(rad) * length * 0.5 - Math.sin(rad) * 18;
  return (
    <g>
      <path
        d={`M ${x} ${y} Q ${mx} ${my} ${ex} ${ey}`}
        fill="none"
        stroke={COLORS.ink}
        strokeWidth={CHARACTER.outline * 2.6}
        strokeLinecap="round"
      />
      <path
        d={`M ${x} ${y} Q ${mx} ${my} ${ex} ${ey}`}
        fill="none"
        stroke={color}
        strokeWidth={CHARACTER.outline * 1.2}
        strokeLinecap="round"
      />
      <circle cx={ex} cy={ey} r={24} fill={color} stroke={COLORS.ink} strokeWidth={CHARACTER.outline * 0.7} />
    </g>
  );
};

export const Character: React.FC<CharacterProps & {id: CharacterId}> = ({
  id,
  x,
  y,
  scale = 1,
  expression = 'neutral',
  mouth = null,
  lookX = 0,
  lookY = 0,
  leftArm = 15,
  rightArm = 15,
  squash = 1,
  tilt = 0,
  flip = false,
  twitch = 0,
  blinkSeed = 0,
}) => {
  const frame = useCurrentFrame();
  const look = LOOKS[id];
  const spec = EXPRESSIONS[expression];
  const outline = CHARACTER.outline;

  const width = look.bodyWidth + ARM_MARGIN * 2;
  const height = TOP_MARGIN + look.bodyHeight + look.legLength + 40;
  const bodyX = ARM_MARGIN;
  const bodyY = TOP_MARGIN;
  const bodyBottom = bodyY + look.bodyHeight;
  const centerX = bodyX + look.bodyWidth / 2;
  const radius = Math.min(look.bodyWidth, look.bodyHeight) * 0.48;

  // Sem piscada quando dormindo ou em choque (uma piscada no susto apaga o olhar arregalado).
  const blink = expression === 'sleeping' || expression === 'shocked' ? 0 : blinkAt(frame, blinkSeed);
  const lid = Math.max(spec.lid, blink);
  // Tique: o olho direito treme e a pálpebra pisca rápido.
  const twitchLid = twitch > 0 ? Math.min(1, lid + twitch * 0.5 * (frame % 4 < 2 ? 1 : 0)) : lid;
  const twitchOffset = twitch > 0 ? twitch * 4 * Math.sin(frame * 2.7) : 0;

  const eyeY = bodyY + look.bodyHeight * look.eyeLine + look.eyeRadius;
  const eyeR = look.eyeRadius * spec.eyeScale;
  const mouthY = eyeY + look.eyeRadius * 1.9;
  const mouthW = look.eyeGap * 1.1;
  const shoulderY = bodyY + look.bodyHeight * (id === 'palito' ? 0.45 : 0.55);

  const eyeCommon = {
    r: eyeR,
    lookX,
    lookY,
    pupilScale: spec.pupilScale,
    browAngle: spec.browAngle,
    browLift: spec.browLift,
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height,
        width,
        height,
        transformOrigin: '50% 100%',
        transform: `scale(${(flip ? -1 : 1) * scale / Math.sqrt(squash)}, ${scale * squash}) rotate(${tilt}deg)`,
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
        {/* sombra no chão */}
        <ellipse cx={centerX} cy={height - 30} rx={look.bodyWidth * 0.55} ry={22} fill={COLORS.shadow} />

        {/* pernas */}
        {[0.3, 0.7].map((f) => {
          const lx = bodyX + look.bodyWidth * f;
          return (
            <g key={f}>
              <line x1={lx} x2={lx} y1={bodyBottom - 10} y2={bodyBottom + look.legLength} stroke={COLORS.ink} strokeWidth={outline * 2.2} strokeLinecap="round" />
              <ellipse cx={lx + (f < 0.5 ? -12 : 12)} cy={bodyBottom + look.legLength + 4} rx={38} ry={20} fill={COLORS.ink} />
            </g>
          );
        })}

        {/* braços (atrás do corpo) */}
        <Arm x={bodyX + 12} y={shoulderY} angle={-leftArm} length={look.armLength} color={look.body} />
        <Arm x={bodyX + look.bodyWidth - 12} y={shoulderY} angle={rightArm} length={look.armLength} color={look.body} />

        {/* corpo */}
        <rect x={bodyX} y={bodyY} width={look.bodyWidth} height={look.bodyHeight} rx={radius} fill={look.body} stroke={COLORS.ink} strokeWidth={outline} />
        <ellipse
          cx={centerX}
          cy={bodyY + look.bodyHeight * 0.78}
          rx={look.bodyWidth * 0.3}
          ry={look.bodyHeight * 0.16}
          fill={look.belly}
        />

        {/* rosto: "color" alimenta a pálpebra (currentColor) com a cor do corpo */}
        <g style={{color: look.body}}>
          <Eye {...eyeCommon} cx={centerX - look.eyeGap / 2} cy={eyeY} lid={lid} side={-1} />
          <Eye {...eyeCommon} cx={centerX + look.eyeGap / 2 + twitchOffset} cy={eyeY} lid={twitchLid} side={1} />
        </g>
        {spec.blush ? (
          <>
            <ellipse cx={centerX - look.eyeGap * 0.85} cy={mouthY - 6} rx={26} ry={14} fill={COLORS.cheek} opacity={0.6} />
            <ellipse cx={centerX + look.eyeGap * 0.85} cy={mouthY - 6} rx={26} ry={14} fill={COLORS.cheek} opacity={0.6} />
          </>
        ) : null}
        <Mouth cx={centerX} cy={mouthY} width={mouthW} shape={mouth ?? spec.restMouth} />
      </svg>
    </div>
  );
};
