import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONTS} from '../../config/tokens';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS} from '../../config/tokens';
import {MOTION, sec} from '../../config/timing';
import {Camera} from '../../components/Camera';
import {Captions} from '../../components/Captions';
import type {CaptionLine} from '../../components/Captions';
import {EpisodeAudio} from '../../components/EpisodeAudio';
import {kf, step} from '../../components/keyframes';
import {ImpactLines, IrisOut, TitleCard, Zzz} from '../../components/Transitions';
import {cuesFromText, mouthAt} from '../../lipsync/cues';
import type {MouthCue} from '../../lipsync/cues';
import {Kitchen, KITCHEN} from '../../scenes/Kitchen';
import {CoffeeMachine} from '../../props/CoffeeMachine';
import {Cup} from '../../props/Cup';
import {WallClock} from '../../props/WallClock';
import dialogue from './dialogue.json';

/**
 * EP01 — "O Café da Segunda" (30 s, 9:16, 30 fps)
 * Gancho (0–3 s): close no Bolota exausto pedindo café.
 * Desenvolvimento: máquina entra em atualização de 3 horas; Palito dá um conselho inútil; time-lapse.
 * Fechamento: a atualização termina e a máquina agora só serve chá de camomila.
 */

// ---------- marcadores de tempo (frames) ----------
export const T = {
  pressStart: sec(2.8),
  pressHit: sec(3.2),
  updateStart: sec(3.6),
  shockStart: sec(6.3),
  shockEnd: sec(7.6),
  palitoEnter: sec(8.0),
  titleCardStart: sec(14.5),
  timelapseStart: sec(16.5),
  updateDone: sec(21.0),
  cupOut: sec(23.5),
  twitchStart: sec(26.2),
  irisStart: sec(28.8),
  end: sec(dialogue.durationSeconds),
} as const;

/** Frame sugerido para a thumbnail (Bolota em choque + tela "1%"). */
export const EP01_THUMBNAIL_FRAME = sec(6.9);

// ---------- layout (px no canvas 1080x1920) ----------
const FLOOR = KITCHEN.floorY;
const MACHINE = {x: 800, y: KITCHEN.counterTopY + 10};
const BOLOTA_X = 540;
const PALITO_X = 200;
const BOLOTA_FACE = {x: BOLOTA_X, y: 1130};

const SPEAKER_COLORS = {bolota: COLORS.bolotaTag, palito: COLORS.palitoTag, maquina: COLORS.machineScreen};
const SPEAKER_NAMES = {bolota: 'BOLOTA', palito: 'PALITO', maquina: 'MÁQUINA'};

type Speaker = keyof typeof SPEAKER_NAMES;

type Episode01Props = {
  /** Modo thumbnail: congela no frame indicado, sem legenda/áudio e com texto grande. */
  thumbnail?: boolean;
};

export const Episode01: React.FC<Episode01Props> = ({thumbnail = false}) => {
  const currentFrame = useCurrentFrame();
  const frame = thumbnail ? EP01_THUMBNAIL_FRAME : currentFrame;
  const {fps} = useVideoConfig();

  // Calculado UMA vez (não a cada frame): legendas e cues de lip-sync por personagem.
  const {captions, cues} = useMemo(() => {
    const caps: CaptionLine[] = dialogue.lines.map((l) => ({
      id: l.id,
      speaker: l.speaker,
      text: l.text,
      startFrame: sec(l.start),
      endFrame: sec(l.end),
    }));
    const bySpeaker: Record<Speaker, MouthCue[]> = {bolota: [], palito: [], maquina: []};
    for (const c of caps) {
      bySpeaker[c.speaker as Speaker].push(...cuesFromText(c.text, c.startFrame, c.endFrame));
    }
    return {captions: caps, cues: bySpeaker};
  }, []);

  // ---------- câmera ----------
  const zoom =
    frame < T.updateStart
      ? kf(frame, [0, sec(2.4), T.updateStart], [1.75, 1.6, 1])
      : frame < T.palitoEnter
        ? kf(frame, [T.shockStart - 2, T.shockStart + 4, T.shockEnd, T.palitoEnter], [1, 1.45, 1.45, 1])
        : kf(frame, [sec(25.8), T.irisStart], [1, 1.8], Easing.out(Easing.quad));
  const shake = frame >= T.shockStart && frame < T.shockEnd ? kf(frame, [T.shockStart, T.shockEnd], [16, 2]) : 0;

  // ---------- máquina ----------
  const progressValue =
    frame < T.updateStart || frame >= T.updateDone
      ? null
      : frame < T.timelapseStart
        ? kf(frame, [sec(12), sec(13.5)], [0.01, 0.02])
        : kf(frame, [T.timelapseStart, T.updateDone - 6], [0.02, 0.99], Easing.inOut(Easing.quad));
  const screenLines =
    frame < T.updateStart
      ? ['PRONTO!']
      : frame < T.updateDone
        ? ['ATUALIZANDO...', `${Math.round((progressValue ?? 1) * 100)}%`]
        : frame < T.cupOut
          ? ['CaféOS 2.0', 'BEM-VINDO!']
          : ['CHÁ DE', 'CAMOMILA'];
  const machineSpeaking = mouthAt(cues.maquina, frame) !== null;
  const buttonPressed = kf(frame, [T.pressHit - 2, T.pressHit, T.pressHit + 6], [0, 1, 0]);

  // ---------- Bolota ----------
  const jump = kf(frame, [T.pressStart, T.pressHit, T.pressHit + 4, T.updateStart + 2], [0, 1, 1, 0]);
  const landing = frame > T.updateStart ? Math.exp(-(frame - T.updateStart) / 4) * Math.sin((frame - T.updateStart) / 1.5) : 0;
  const breathing = 1 + 0.015 * Math.sin(frame / 10);
  const shocked = frame >= T.shockStart && frame < T.shockEnd;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'tired'],
    [T.updateStart, 'neutral'],
    [T.shockStart, 'shocked'],
    [T.shockEnd, 'tired'],
    [sec(11.8), 'annoyed'],
    [T.timelapseStart, 'sleeping'],
    [T.updateDone, 'shocked'],
    [T.updateDone + 12, 'happy'],
    [T.cupOut + 6, 'neutral'],
    [T.twitchStart, 'annoyed'],
  ]);
  const bolotaLookX = step(frame, [
    [0, 0],
    [T.pressStart, 0.7],
    [T.shockStart, 0],
    [sec(9.0), -0.8],
    [T.timelapseStart, 0],
    [T.updateDone, 0.7],
    [T.twitchStart, 0],
  ]);
  const bolotaRightArm = shocked
    ? 160
    : kf(frame, [T.pressStart, T.pressHit, T.updateStart, T.updateStart + 8], [15, 140, 140, 15]);
  const bolotaLeftArm = shocked ? 160 : 15;
  const twitch = frame >= T.twitchStart && frame < T.irisStart ? 1 : 0;

  // ---------- Palito ----------
  const enter = spring({frame: frame - T.palitoEnter, fps, config: MOTION.springBouncy});
  const palitoX = PALITO_X - 420 * (1 - enter);
  const palitoExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.timelapseStart, 'sleeping'],
    [T.updateDone, 'shocked'],
    [T.updateDone + 12, 'happy'],
  ]);
  const palitoWave = frame >= sec(9) && frame < sec(11.5) ? 150 + 20 * Math.sin(frame / 3) : 20;

  // ---------- time-lapse ----------
  const clockHours = kf(frame, [T.titleCardStart, T.updateDone], [0, 3], Easing.inOut(Easing.quad));
  const sleeping = frame >= T.timelapseStart && frame < T.updateDone;
  const cupPop = spring({frame: frame - T.cupOut, fps, config: MOTION.springBouncy});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.paper}}>
      <Camera zoom={zoom} focusX={BOLOTA_FACE.x} focusY={BOLOTA_FACE.y} shake={shake} frame={frame}>
        <Kitchen />
        <WallClock x={200} y={830} hours={clockHours} />
        <CoffeeMachine
          x={MACHINE.x}
          y={MACHINE.y}
          screenLines={screenLines}
          progress={progressValue}
          buttonPressed={buttonPressed}
          shake={machineSpeaking ? Math.sin(frame * 3) * 3 : 0}
        />
        {frame >= T.cupOut ? (
          <Cup x={MACHINE.x} y={MACHINE.y - 40} liquid={COLORS.tea} label="CHÁ" frame={frame} scale={0.85 * cupPop} />
        ) : null}

        <Palito
          x={palitoX}
          y={FLOOR}
          expression={palitoExpression}
          mouth={mouthAt(cues.palito, frame)}
          lookX={0.8}
          rightArm={palitoWave}
          tilt={(1 - enter) * -12}
        />
        {frame >= T.palitoEnter && sleeping ? <Zzz frame={frame} x={palitoX + 60} y={640} /> : null}

        <ImpactLines frame={frame} start={T.shockStart} end={T.shockEnd} x={BOLOTA_FACE.x} y={BOLOTA_FACE.y} />
        <Bolota
          x={BOLOTA_X}
          y={FLOOR - 220 * jump}
          expression={bolotaExpression}
          mouth={mouthAt(cues.bolota, frame)}
          lookX={bolotaLookX}
          lookY={frame < T.updateStart && frame > T.pressStart ? -0.6 : 0}
          rightArm={bolotaRightArm}
          leftArm={bolotaLeftArm}
          squash={breathing * (1 - 0.12 * landing)}
          tilt={shocked ? Math.sin(frame * 1.7) * 4 : 0}
          twitch={twitch}
        />
        {sleeping ? <Zzz frame={frame + 20} x={BOLOTA_X + 80} y={980} /> : null}
      </Camera>

      <TitleCard frame={frame} fps={fps} start={T.titleCardStart} end={T.timelapseStart} text="3 HORAS DEPOIS..." />
      <IrisOut frame={frame} start={T.irisStart} end={T.end} x={540} y={900} />
      {thumbnail ? (
        <div
          style={{
            position: 'absolute',
            top: 240,
            width: '100%',
            textAlign: 'center',
            fontFamily: FONTS.display,
            fontSize: 190,
            lineHeight: 0.95,
            color: COLORS.captionHighlight,
            WebkitTextStroke: `26px ${COLORS.ink}`,
            paintOrder: 'stroke fill',
            transform: 'rotate(-6deg)',
          }}
        >
          3 HORAS
          <br />
          PRA UM CAFÉ?!
        </div>
      ) : (
        <>
          <Captions lines={captions} frame={frame} fps={fps} speakerColors={SPEAKER_COLORS} speakerNames={SPEAKER_NAMES} />
          <EpisodeAudio data={dialogue} fps={fps} />
        </>
      )}
    </AbsoluteFill>
  );
};
