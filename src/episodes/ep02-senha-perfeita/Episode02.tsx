import React from 'react';
import {AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, FONTS, VIDEO} from '../../config/tokens';
import {MOTION, sec} from '../../config/timing';
import {Camera} from '../../components/Camera';
import {Captions} from '../../components/Captions';
import {EpisodeAudio} from '../../components/EpisodeAudio';
import {kf, step} from '../../components/keyframes';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines, IrisOut} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {HomeOffice, HOME_OFFICE} from '../../scenes/HomeOffice';
import {Computer} from '../../props/Computer';
import type {ComputerScreen, PasswordRule} from '../../props/Computer';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP02 — "A Senha Perfeita" (37,6 s, 9:16, 30 fps)
 * Gancho (0–3 s): Bolota exausto só quer pagar uma conta.
 * Desenvolvimento: o banco exige maiúscula, número, símbolo, emoji e o nome do primeiro bichinho.
 * Virada: Palito sugere "senha123", o site aceita… e bloqueia a conta por "senha fraca demais para ser verdade".
 */

const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

// ---------- marcadores de tempo (frames), derivados das falas ----------
export const T = {
  typing1Start: endOf('l1') + sec(0.1),
  rulesStart: startOf('l2') - sec(0.2),
  shockStart: startOf('l3'),
  shockEnd: endOf('l3') + sec(0.2),
  petRule: startOf('l4'),
  frustratedStart: startOf('l5'),
  palitoEnter: startOf('l6') - sec(0.6),
  annoyedStart: startOf('l7'),
  typing2Start: endOf('l7') + sec(0.1),
  accepted: startOf('l8') - sec(1.2),
  blocked: startOf('l8') - sec(0.1),
  palitoGloat: startOf('l9'),
  twitchStart: startOf('l10') - sec(0.5),
  irisStart: endOf('l10') + sec(0.1),
  end: TIMELINE.durationInFrames,
} as const;

export const EP02_THUMBNAIL_FRAME = T.shockStart + sec(0.5);

// ---------- layout ----------
const FLOOR = HOME_OFFICE.floorY;
const COMPUTER_POS = {x: 790, y: HOME_OFFICE.deskTopY + 10};
const BOLOTA_X = 500;
const PALITO_X = 170;
const BOLOTA_FACE = {x: BOLOTA_X, y: 1130};

const SPEAKER_COLORS = {bolota: COLORS.bolotaTag, palito: COLORS.palitoTag, site: COLORS.bankBlue};
const SPEAKER_NAMES = {bolota: 'BOLOTA', palito: 'PALITO', site: 'BANCO SEGURO'};

const RULES = [
  'Mínimo de 12 caracteres',
  'Uma letra maiúscula',
  'Um número',
  'Um símbolo (!@#$)',
  'Um emoji',
] as const;
const PET_RULE = 'Nome do 1º bichinho';

type Episode02Props = {thumbnail?: boolean};

export const Episode02: React.FC<Episode02Props> = ({thumbnail = false}) => {
  const currentFrame = useCurrentFrame();
  const frame = thumbnail ? EP02_THUMBNAIL_FRAME : currentFrame;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  // ---------- digitação ----------
  const typing1 = frame >= T.typing1Start && frame < T.rulesStart;
  const typing2 = frame >= T.typing2Start && frame < T.accepted;
  const typing = typing1 || typing2;
  const typed = typing1
    ? Math.floor(kf(frame, [T.typing1Start, T.rulesStart - 2], [0, 9], Easing.linear))
    : typing2
      ? Math.floor(kf(frame, [T.typing2Start, T.accepted - 3], [0, 8], Easing.linear))
      : frame < T.rulesStart
        ? 0
        : 8;

  // ---------- tela ----------
  const rulesShown = Math.floor(kf(frame, [startOf('l2'), endOf('l2') - sec(0.6)], [1, RULES.length], Easing.linear));
  const rules: PasswordRule[] = [
    ...RULES.slice(0, Math.max(1, rulesShown)).map((label) => ({label, ok: false})),
    ...(frame >= T.petRule ? [{label: PET_RULE, ok: false}] : []),
  ];
  const flash = frame >= T.blocked ? (Math.floor((frame - T.blocked) / 6) % 2 === 0 ? 1 : 0) : 0;
  const screen: ComputerScreen =
    frame < T.rulesStart || typing2
      ? {kind: 'login'}
      : frame < T.typing2Start
        ? {kind: 'rules', rules}
        : frame < T.blocked
          ? {kind: 'accepted'}
          : {kind: 'blocked', flash};
  const siteSpeaking = mouthAt(cues.site ?? [], frame) !== null;

  // ---------- câmera ----------
  const zoom =
    frame < T.rulesStart
      ? kf(frame, [0, T.typing1Start, T.rulesStart], [1.7, 1.6, 1])
      : frame < T.palitoEnter
        ? kf(frame, [T.shockStart - 2, T.shockStart + 4, T.shockEnd, T.shockEnd + 8], [1, 1.45, 1.45, 1])
        : kf(frame, [T.twitchStart - sec(0.3), T.irisStart], [1, 1.8], Easing.out(Easing.quad));
  const shocked = frame >= T.shockStart && frame < T.shockEnd;
  const alarmShake = frame >= T.blocked && frame < T.blocked + sec(1.2);
  const shake = shocked ? kf(frame, [T.shockStart, T.shockEnd], [16, 2]) : alarmShake ? 10 : 0;

  // ---------- Bolota ----------
  const bolotaExpression = step<Expression>(frame, [
    [0, 'tired'],
    [T.rulesStart, 'neutral'],
    [T.shockStart, 'shocked'],
    [T.shockEnd, 'tired'],
    [T.frustratedStart, 'annoyed'],
    [T.palitoEnter, 'tired'],
    [T.annoyedStart, 'annoyed'],
    [T.accepted, 'shocked'],
    [T.accepted + 10, 'happy'],
    [T.blocked, 'shocked'],
    [T.palitoGloat, 'annoyed'],
  ]);
  const typingArm = (phase: number) => 120 + 14 * Math.sin(frame * 1.3 + phase);
  const bolotaRightArm = shocked || (frame >= T.blocked && frame < T.palitoGloat) ? 165 : typing ? typingArm(0) : 15;
  const bolotaLeftArm = shocked || (frame >= T.blocked && frame < T.palitoGloat) ? 165 : typing ? typingArm(1.7) : frame >= T.frustratedStart && frame < T.palitoEnter ? 60 : 15;
  const bolotaLookX = step(frame, [
    [0, 0],
    [T.typing1Start, 0.8],
    [T.shockStart, 0],
    [T.petRule, 0.8],
    [T.frustratedStart, 0],
    [T.palitoEnter + sec(0.6), -0.8],
    [T.typing2Start, 0.8],
    [T.blocked, 0],
    [T.palitoGloat, -0.8],
    [T.twitchStart, 0],
  ]);
  const breathing = 1 + 0.015 * Math.sin(frame / 10);
  const hop = frame >= T.accepted && frame < T.accepted + 12 ? Math.sin(((frame - T.accepted) / 12) * Math.PI) : 0;

  // ---------- Palito ----------
  const enter = spring({frame: frame - T.palitoEnter, fps, config: MOTION.springBouncy});
  const palitoX = PALITO_X - 420 * (1 - enter);
  const palitoExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.blocked, 'shocked'],
    [T.palitoGloat, 'happy'],
  ]);
  const palitoWave =
    (frame >= startOf('l6') && frame < endOf('l6')) || (frame >= startOf('l9') && frame < endOf('l9'))
      ? 150 + 20 * Math.sin(frame / 3)
      : 20;

  const twitch = frame >= T.twitchStart && frame < T.irisStart ? 1 : 0;
  const redOverlay = frame >= T.blocked ? kf(frame, [T.blocked, T.blocked + sec(2.5)], [0.35, 0]) * (0.6 + 0.4 * flash) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.paper}}>
      <Camera zoom={zoom} focusX={BOLOTA_FACE.x} focusY={BOLOTA_FACE.y} shake={shake} frame={frame}>
        <HomeOffice />
        <Computer
          x={COMPUTER_POS.x}
          y={COMPUTER_POS.y}
          screen={screen}
          typed={typed}
          cursorOn={Math.floor(frame / 15) % 2 === 0}
          shake={siteSpeaking ? Math.sin(frame * 3) * 2 : 0}
        />

        <Palito
          x={palitoX}
          y={FLOOR}
          expression={palitoExpression}
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          rightArm={palitoWave}
          tilt={(1 - enter) * -12}
        />

        <ImpactLines frame={frame} start={T.shockStart} end={T.shockEnd} x={BOLOTA_FACE.x} y={BOLOTA_FACE.y} />
        <Bolota
          x={BOLOTA_X}
          y={FLOOR - 90 * hop}
          expression={bolotaExpression}
          mouth={mouthAt(cues.bolota ?? [], frame)}
          lookX={bolotaLookX}
          lookY={typing ? -0.4 : 0}
          rightArm={bolotaRightArm}
          leftArm={bolotaLeftArm}
          squash={breathing}
          tilt={shocked ? Math.sin(frame * 1.7) * 4 : 0}
          twitch={twitch}
        />
      </Camera>

      {redOverlay > 0 ? <AbsoluteFill style={{backgroundColor: COLORS.danger, opacity: redOverlay}} /> : null}
      <IrisOut frame={frame} start={T.irisStart} end={T.end} x={540} y={900} />
      {thumbnail ? (
        <div
          style={{
            position: 'absolute',
            top: 240,
            width: '100%',
            textAlign: 'center',
            fontFamily: FONTS.display,
            fontSize: 170,
            lineHeight: 0.95,
            color: COLORS.captionHighlight,
            WebkitTextStroke: `26px ${COLORS.ink}`,
            paintOrder: 'stroke fill',
            transform: 'rotate(-6deg)',
          }}
        >
          SENHA
          <br />
          COM EMOJI?!
        </div>
      ) : (
        <>
          <Captions lines={TIMELINE.lines} frame={frame} fps={fps} speakerColors={SPEAKER_COLORS} speakerNames={SPEAKER_NAMES} />
          <EpisodeAudio dialogue={dialogue} timeline={TIMELINE} />
        </>
      )}
    </AbsoluteFill>
  );
};
