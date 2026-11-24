import React from 'react';
import {Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, VIDEO} from '../../config/tokens';
import {MOTION, sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, slideIn} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {Kitchen, KITCHEN} from '../../scenes/Kitchen';
import {CoffeeMachine} from '../../props/CoffeeMachine';
import {Cup} from '../../props/Cup';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP05 — "Atualização 2: A Vingança" (continuação do EP01)
 * Gancho: Bolota abraçado à cafeteira, otimista.
 * Desenvolvimento: chega a atualização CaféOS 3.0; Bolota protege a máquina; Palito aperta "instalar".
 * Virada: a atualização é rápida e o café sai… descafeinado.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

export const T = {
  offer: startOf('l2') - sec(0.4),
  guard: startOf('l3'),
  guardEnd: endOf('l3') + sec(0.3),
  palitoEnter: startOf('l4') - sec(0.6),
  press: endOf('l4') + sec(0.3),
  done: startOf('l5') - sec(0.3),
  tears: startOf('l6'),
  cup: startOf('l7') - sec(0.9),
  decaf: startOf('l7') + sec(1.6),
  twitchStart: startOf('l8') - sec(0.5),
  irisStart: endOf('l8') + sec(0.1),
} as const;
export const EP05_THUMBNAIL_FRAME = T.decaf + sec(0.6);

const FLOOR = KITCHEN.floorY;
const MACHINE = {x: 800, y: KITCHEN.counterTopY + 10};
const BOLOTA = {x: 560, face: {x: 560, y: 1130}};
const PALITO_X = 200;

export const Episode05: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP05_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const guarding = frame >= T.guard && frame < T.press + sec(0.4);
  const progress = frame < T.press ? null : frame < T.done ? kf(frame, [T.press, T.done - 4], [0.01, 1], Easing.in(Easing.quad)) : null;
  const screenLines =
    frame < T.offer
      ? ['CaféOS 2.0', 'PRONTO!']
      : frame < T.press
        ? ['CaféOS 3.0', 'DISPONÍVEL!']
        : frame < T.done
          ? ['INSTALANDO...', `${Math.round((progress ?? 1) * 100)}%`]
          : frame < T.cup
            ? ['CaféOS 3.0', 'CAFÉ PRONTO!']
            : ['100%', 'DESCAFEINADO'];
  const cupPop = spring({frame: frame - T.cup, fps, config: MOTION.springBouncy});

  const bolotaExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.offer, 'neutral'],
    [T.guard, 'shocked'],
    [T.guardEnd, 'annoyed'],
    [T.press, 'shocked'],
    [T.done, 'neutral'],
    [T.tears, 'happy'],
    [T.decaf, 'shocked'],
    [T.decaf + sec(0.8), 'annoyed'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);
  const pressing = frame >= T.press - sec(0.4) && frame < T.press + sec(0.3);

  const zoom =
    frame < T.guard
      ? kf(frame, [0, T.offer], [1.5, 1])
      : frame < T.twitchStart
        ? shockZoom(frame, T.guard, T.guardEnd, 1.35)
        : finaleZoom(frame, T.twitchStart, T.irisStart);

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x + 80, focusY: BOLOTA.face.y, shake: shockShake(frame, T.guard, T.guardEnd)}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['CAFÉ', 'DESCAFEINADO?!'] : null}
    >
      <Kitchen />
      <CoffeeMachine
        x={MACHINE.x}
        y={MACHINE.y}
        screenLines={screenLines}
        progress={progress}
        buttonPressed={pressing ? 1 : 0}
        shake={mouthAt(cues.maquina ?? [], frame) ? Math.sin(frame * 3) * 3 : 0}
      />
      {frame >= T.cup ? <Cup x={MACHINE.x} y={MACHINE.y - 40} liquid={COLORS.coffee} label="DESCAF." frame={frame} scale={0.85 * cupPop} /> : null}
      <Palito
        x={PALITO_X + enter.dx + (pressing ? 120 : 0)}
        y={FLOOR}
        expression={frame >= T.decaf ? 'neutral' : 'happy'}
        mouth={mouthAt(cues.palito ?? [], frame)}
        lookX={0.8}
        rightArm={pressing ? 95 : 20}
        tilt={enter.tilt}
      />
      <ImpactLines frame={frame} start={T.guard} end={T.guardEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={step(frame, [[0, 0.7], [T.guard, 0], [T.palitoEnter + sec(0.6), -0.8], [T.done, 0.7], [T.twitchStart, 0]])}
        leftArm={guarding ? 95 : frame < T.offer ? 60 : 15}
        rightArm={guarding ? 95 : frame < T.offer ? 75 : 15}
        squash={breathe(frame)}
        tilt={frame >= T.guard && frame < T.guardEnd ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
    </EpisodeShell>
  );
};
