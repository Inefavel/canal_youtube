import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, VIDEO} from '../../config/tokens';
import {sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, slideIn} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines, TitleCard} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {Kitchen, KITCHEN} from '../../scenes/Kitchen';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP06 — "Academia Amanhã"
 * Gancho: Bolota decidido a começar a academia hoje.
 * Desenvolvimento: segunda (chuva), terça (cansaço), quarta (lua cheia)…
 * Virada: Palito aparece forte depois de uma semana de treino. Bolota: "…Amanhã eu começo."
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

const CARD = sec(1.1);
const DAYS: {line: string; text: string}[] = [
  {line: 'l2', text: 'SEGUNDA'},
  {line: 'l3', text: 'TERÇA'},
  {line: 'l4', text: 'QUARTA'},
  {line: 'l5', text: 'UMA SEMANA DEPOIS...'},
];

export const T = {
  palitoEnter: startOf('l5') - sec(0.2),
  shock: startOf('l6'),
  shockEnd: endOf('l6') + sec(0.2),
  twitchStart: startOf('l8') - sec(0.5),
  irisStart: endOf('l8') + sec(0.1),
} as const;
export const EP06_THUMBNAIL_FRAME = T.shock + sec(0.4);

const FLOOR = KITCHEN.floorY;
const BOLOTA = {x: 640, face: {x: 640, y: 1130}};
const PALITO_X = 250;

export const Episode06: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP06_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'happy'],
    [startOf('l2') - CARD, 'tired'],
    [startOf('l3') - CARD, 'tired'],
    [startOf('l4') - CARD, 'annoyed'],
    [T.palitoEnter, 'neutral'],
    [T.shock, 'shocked'],
    [T.shockEnd, 'tired'],
  ]);
  const flexing = frame < endOf('l1') || (frame >= startOf('l5') && frame < endOf('l5'));
  const enter = slideIn(frame, T.palitoEnter, fps);
  const shocked = frame >= T.shock && frame < T.shockEnd;

  // Cada desculpa tem uma pose: deitado de lado (cansaço) e olhando para cima (lua cheia).
  const bolotaTilt = shocked
    ? Math.sin(frame * 1.7) * 4
    : frame >= startOf('l3') - CARD && frame < startOf('l4') - CARD
      ? -8
      : 0;
  const lookY = frame >= startOf('l4') - CARD && frame < T.palitoEnter ? -0.8 : 0;

  const zoom =
    frame < startOf('l2') - CARD
      ? kf(frame, [0, endOf('l1')], [1.5, 1.35])
      : frame < T.twitchStart
        ? shockZoom(frame, T.shock, T.shockEnd, 1.35)
        : finaleZoom(frame, T.twitchStart, T.irisStart);

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x, focusY: BOLOTA.face.y, shake: shockShake(frame, T.shock, T.shockEnd)}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['UMA SEMANA', 'DE TREINO?!'] : null}
      overlay={
        <>
          {DAYS.map((d) => (
            <TitleCard key={d.line} frame={frame} fps={fps} start={startOf(d.line) - CARD - sec(0.2)} end={startOf(d.line) - sec(0.2)} text={d.text} />
          ))}
        </>
      }
    >
      <Kitchen />
      {frame >= T.palitoEnter ? (
        <Palito
          x={PALITO_X + enter.dx}
          y={FLOOR}
          scale={1.12}
          squash={1.06}
          expression="happy"
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          leftArm={flexing ? 150 + 10 * Math.sin(frame / 2) : 20}
          rightArm={flexing ? 150 + 10 * Math.sin(frame / 2 + 1) : 20}
          tilt={enter.tilt}
        />
      ) : null}
      <ImpactLines frame={frame} start={T.shock} end={T.shockEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={frame >= T.palitoEnter && frame < T.twitchStart ? -0.8 : 0}
        lookY={lookY}
        leftArm={shocked ? 160 : frame < endOf('l1') ? 150 : 15}
        rightArm={shocked ? 160 : frame < endOf('l1') ? 150 : 15}
        squash={breathe(frame)}
        tilt={bolotaTilt}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
      {/* gotas de chuva na janela durante a desculpa da segunda-feira */}
      {frame >= startOf('l2') - CARD && frame < startOf('l3') - CARD
        ? Array.from({length: 10}, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 100 + ((i * 37) % 280),
                top: 340 + ((frame * 9 + i * 53) % 330),
                width: 8,
                height: 30,
                borderRadius: 4,
                background: COLORS.bankBlue,
              }}
            />
          ))
        : null}
    </EpisodeShell>
  );
};
