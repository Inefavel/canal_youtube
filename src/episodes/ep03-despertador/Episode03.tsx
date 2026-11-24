import React from 'react';
import {AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression, FaceMouth} from '../../characters';
import {COLORS, FONTS, VIDEO} from '../../config/tokens';
import {MOTION, sec} from '../../config/timing';
import {Camera} from '../../components/Camera';
import {Captions} from '../../components/Captions';
import {EpisodeAudio} from '../../components/EpisodeAudio';
import {kf, step} from '../../components/keyframes';
import {PhoneNotification} from '../../components/PhoneNotification';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines, IrisOut, Zzz} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {Bedroom, BEDROOM} from '../../scenes/Bedroom';
import {BedBack, BedFront} from '../../props/Bed';
import {Nightstand, clockCenter} from '../../props/Nightstand';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP03 — "O Despertador" (31 s, 9:16, 30 fps)
 * Gancho (0–3 s): o despertador toca às 06:00 e o Bolota pede "só mais cinco minutinhos".
 * Desenvolvimento: 9 sonecas seguidas enquanto o sol nasce; o Palito garante que hoje é sábado.
 * Virada: o celular avisa da reunião com o chefe. É quinta-feira.
 */

type EpisodeData = Dialogue & {snoozes: number[]};
const dialogue = dialogueJson as EpisodeData;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

const SNOOZES = dialogue.snoozes.map((s) => sec(s));

// ---------- marcadores de tempo (frames), derivados das falas ----------
export const T = {
  wake: sec(0.4),
  firstSnooze: SNOOZES[0],
  lastSnooze: SNOOZES[SNOOZES.length - 1],
  palitoEnter: startOf('l2') - sec(0.5),
  saturday: startOf('l3'),
  happySleep: endOf('l3'),
  buzz: startOf('l4') - sec(0.4),
  jump: startOf('l5'),
  sorry: startOf('l6'),
  twitchStart: startOf('l7') - sec(0.5),
  irisStart: endOf('l7') + sec(0.1),
  end: TIMELINE.durationInFrames,
} as const;

export const EP03_THUMBNAIL_FRAME = T.jump + sec(0.5);

// ---------- layout ----------
const FLOOR = BEDROOM.floorY;
const BOLOTA_X = 600;
const BOLOTA_IN_BED_Y = 1380; // pés escondidos sob o cobertor; só o rosto aparece
const JUMP_HEIGHT = 270;
const PALITO_X = 110;
const NIGHTSTAND = {x: 960, y: 1420};
const CLOCK = clockCenter(NIGHTSTAND.x, NIGHTSTAND.y);

const SPEAKER_COLORS = {bolota: COLORS.bolotaTag, palito: COLORS.palitoTag, celular: COLORS.danger};
const SPEAKER_NAMES = {bolota: 'BOLOTA', palito: 'PALITO', celular: 'CELULAR'};

const pad = (n: number) => String(n).padStart(2, '0');

type Episode03Props = {thumbnail?: boolean};

export const Episode03: React.FC<Episode03Props> = ({thumbnail = false}) => {
  const currentFrame = useCurrentFrame();
  const frame = thumbnail ? EP03_THUMBNAIL_FRAME : currentFrame;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  // ---------- sonecas ----------
  const snoozeCount = SNOOZES.filter((s) => frame >= s).length;
  const minutes = 6 * 60 + 5 * snoozeCount;
  const time = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  const ringWindow = sec(0.4);
  const ringing =
    (frame < T.firstSnooze) || SNOOZES.slice(1).some((s) => frame >= s - ringWindow && frame < s);
  const nearestSlap = SNOOZES.reduce((best, s) => (Math.abs(frame - s) < Math.abs(frame - best) ? s : best), SNOOZES[0]);
  const slap = Math.max(0, 1 - Math.abs(frame - nearestSlap) / 5); // pico no frame da soneca
  const daylight = kf(frame, [0, T.lastSnooze + sec(0.5)], [0, 1], Easing.inOut(Easing.quad));
  const counterPop = spring({frame: frame - nearestSlap, fps, config: MOTION.springSnappy});
  const showCounter = snoozeCount >= 2 && frame < T.palitoEnter;

  // ---------- Bolota ----------
  const inMontage = frame >= T.firstSnooze && frame < T.palitoEnter;
  const jumpP = spring({frame: frame - T.jump, fps, config: MOTION.springBouncy});
  const bolotaY = BOLOTA_IN_BED_Y - (frame >= T.jump ? JUMP_HEIGHT * jumpP : 0);
  const bolotaExpression = step<Expression>(frame, [
    [0, 'sleeping'],
    [T.wake, 'tired'],
    [T.firstSnooze + 3, 'sleeping'],
    [T.palitoEnter + sec(0.4), 'tired'],
    [T.saturday, 'happy'],
    [T.happySleep, 'sleeping'],
    [T.buzz + sec(0.3), 'tired'],
    [T.jump, 'shocked'],
    [T.sorry, 'annoyed'],
  ]);
  // Durante a montagem: abre o olho cansado no bipe e volta a dormir depois do tapa.
  const montageExpression: Expression = ringing ? 'tired' : 'sleeping';
  const expression = inMontage ? montageExpression : bolotaExpression;
  const restMouth: FaceMouth | null = frame >= T.happySleep && frame < T.buzz + sec(0.3) ? 'smile' : null;
  const shocked = frame >= T.jump && frame < T.sorry;
  const rightArm = shocked ? 160 : 15 + 55 * slap;
  const leftArm = shocked ? 160 : 15;
  const bolotaLookX = step(frame, [
    [0, 0.6],
    [T.palitoEnter + sec(0.4), -0.8],
    [T.happySleep, 0],
    [T.buzz + sec(0.3), 0.8],
    [T.jump, 0],
    [T.sorry, -0.8],
    [T.twitchStart, 0],
  ]);
  const sleeping = expression === 'sleeping';
  const twitch = frame >= T.twitchStart && frame < T.irisStart ? 1 : 0;
  const faceY = bolotaY - 270;

  // ---------- Palito ----------
  const enter = spring({frame: frame - T.palitoEnter, fps, config: MOTION.springBouncy});
  const palitoX = PALITO_X - 420 * (1 - enter);
  const palitoExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.jump, 'shocked'],
    [T.sorry, 'neutral'],
    [endOf('l6') - sec(1.2), 'happy'],
  ]);
  const palitoWave = frame >= startOf('l2') && frame < endOf('l2') ? 150 + 20 * Math.sin(frame / 3) : 20;

  // ---------- câmera ----------
  const zoom =
    frame < T.jump
      ? kf(frame, [0, T.firstSnooze, T.firstSnooze + sec(0.6)], [1.55, 1.5, 1])
      : frame < T.twitchStart
        ? kf(frame, [T.jump, T.jump + 4, T.sorry - 6, T.sorry + 6], [1, 1.35, 1.35, 1])
        : kf(frame, [T.twitchStart - sec(0.3), T.irisStart], [1, 1.8], Easing.out(Easing.quad));
  const focus = frame < T.jump ? {x: (BOLOTA_X + CLOCK.x) / 2, y: 1120} : {x: BOLOTA_X, y: faceY + 130};
  const shake = shocked ? kf(frame, [T.jump, T.sorry], [14, 2]) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.paper}}>
      <Camera zoom={zoom} focusX={focus.x} focusY={focus.y} shake={shake} frame={frame}>
        <Bedroom daylight={daylight} />
        <BedBack />
        <ImpactLines frame={frame} start={T.jump} end={T.sorry} x={BOLOTA_X} y={faceY + 130} />
        <Bolota
          x={BOLOTA_X}
          y={bolotaY}
          expression={expression}
          mouth={mouthAt(cues.bolota ?? [], frame) ?? restMouth}
          lookX={bolotaLookX}
          rightArm={rightArm}
          leftArm={leftArm}
          squash={1 + 0.015 * Math.sin(frame / (sleeping ? 18 : 10))}
          tilt={shocked ? Math.sin(frame * 1.7) * 4 : sleeping ? -4 : 0}
          twitch={twitch}
        />
        <BedFront ruffle={frame / 20 + (frame >= T.jump ? (frame - T.jump) / 4 : 0)} />
        <Nightstand
          x={NIGHTSTAND.x}
          y={NIGHTSTAND.y}
          time={time}
          ringing={ringing}
          pressed={slap}
          frame={frame}
          phoneBuzz={frame >= T.buzz && frame < T.jump}
        />
        {sleeping ? <Zzz frame={frame} x={BOLOTA_X + 150} y={bolotaY - 470} /> : null}
        <Palito
          x={palitoX}
          y={FLOOR}
          expression={palitoExpression}
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          rightArm={palitoWave}
          tilt={(1 - enter) * -12}
        />
      </Camera>

      {showCounter ? (
        <div
          style={{
            position: 'absolute',
            top: 300,
            width: '100%',
            textAlign: 'center',
            fontFamily: FONTS.display,
            fontSize: 120,
            color: COLORS.captionHighlight,
            WebkitTextStroke: `20px ${COLORS.ink}`,
            paintOrder: 'stroke fill',
            transform: `scale(${0.8 + 0.2 * counterPop}) rotate(-4deg)`,
          }}
        >
          SONECA x{snoozeCount}
        </div>
      ) : null}

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
          HOJE É
          <br />
          QUINTA?!
        </div>
      ) : (
        <>
          <PhoneNotification
            frame={frame}
            fps={fps}
            start={T.buzz}
            end={T.jump + sec(0.3)}
            app="Calendário"
            title="Reunião com o chefe"
            body="Quinta-feira · em 5 minutos"
          />
          <Captions lines={TIMELINE.lines} frame={frame} fps={fps} speakerColors={SPEAKER_COLORS} speakerNames={SPEAKER_NAMES} />
          <EpisodeAudio dialogue={dialogue} timeline={TIMELINE} />
        </>
      )}
    </AbsoluteFill>
  );
};
