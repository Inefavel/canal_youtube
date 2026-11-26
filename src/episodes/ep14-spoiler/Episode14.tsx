import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {VIDEO} from '../../config/tokens';
import {sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, slideIn, wave} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {HomeOffice, HOME_OFFICE} from '../../scenes/HomeOffice';
import {Computer} from '../../props/Computer';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP14 — "O Spoiler" (temporada 2)
 * Gancho: Bolota vai assistir ao episódio final, "sem spoiler".
 * Desenvolvimento: o Palito entra: "Que final quando ele morre, hein?!"
 * Virada: quem "morre" é o suflê. É um programa de culinária.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

export const T = {
  silent: endOf('l2') + sec(0.2),
  palitoEnter: startOf('l3') - sec(0.6),
  shock: startOf('l4'),
  shockEnd: endOf('l4') + sec(0.3),
  reveal: endOf('l5') + sec(0.1),
  twitchStart: startOf('l8') - sec(0.5),
  irisStart: endOf('l8') + sec(0.1),
};
export const EP14_THUMBNAIL_FRAME = T.shock + sec(0.4);

const FLOOR = HOME_OFFICE.floorY;
const BOLOTA = {x: 500, face: {x: 500, y: 1130}};
const COMPUTER_POS = {x: 790, y: HOME_OFFICE.deskTopY + 10};

export const Episode14: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP14_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const shocked = frame >= T.shock && frame < T.shockEnd;
  // O episódio começa a tocar depois do "silencioso" e pausa no susto; o suflê murcha na revelação.
  const playing = frame >= T.silent && frame < T.shock;
  const progress = frame < T.silent ? 0 : kf(frame, [T.silent, T.shock], [0, 0.08]);
  const souffle = frame < T.reveal ? 1 : kf(frame, [T.reveal, T.reveal + sec(1)], [1, 0]);

  const bolotaExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.palitoEnter + sec(0.6), 'neutral'],
    [T.shock, 'shocked'],
    [T.shockEnd, 'annoyed'],
    [T.reveal, 'tired'],
    [startOf('l7') + sec(0.6), 'annoyed'],
  ]);
  const palitoExpression = step<Expression>(frame, [
    [0, 'happy'],
    [startOf('l5') + sec(1.6), 'sleeping'], // "eu chorei" — olhos fechados de emoção
    [endOf('l5'), 'happy'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);

  const zoom =
    frame < T.silent
      ? kf(frame, [0, T.silent], [1.45, 1.1])
      : frame < T.twitchStart
        ? shockZoom(frame, T.shock, T.shockEnd, 1.45)
        : finaleZoom(frame, T.twitchStart, T.irisStart);

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x + 80, focusY: BOLOTA.face.y, shake: shockShake(frame, T.shock, T.shockEnd)}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['SPOILER', 'DO FINAL?!'] : null}
    >
      <HomeOffice />
      <Computer
        x={COMPUTER_POS.x}
        y={COMPUTER_POS.y}
        screen={{kind: 'player', title: 'A Grande Cozinha', subtitle: 'Temporada 3 · Episódio final', progress, paused: !playing, souffle}}
        typed={0}
        cursorOn={false}
      />
      {frame >= T.palitoEnter ? (
        <Palito
          x={170 + enter.dx}
          y={FLOOR}
          expression={palitoExpression}
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          rightArm={wave(frame, startOf('l3'), endOf('l3')) !== 20 ? wave(frame, startOf('l3'), endOf('l3')) : wave(frame, startOf('l7'), endOf('l7'))}
          tilt={enter.tilt}
        />
      ) : null}
      <ImpactLines frame={frame} start={T.shock} end={T.shockEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={step(frame, [[0, 0], [T.silent, 0.8], [T.palitoEnter + sec(0.6), -0.8], [T.shock, 0], [T.shockEnd, -0.8], [T.reveal, 0.8], [startOf('l6'), -0.8], [T.twitchStart, 0]])}
        leftArm={shocked ? 160 : frame < endOf('l1') ? 150 : 15}
        rightArm={shocked ? 160 : frame < endOf('l1') ? 150 : frame >= startOf('l2') && frame < T.silent ? 70 : 15}
        squash={breathe(frame)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
    </EpisodeShell>
  );
};
