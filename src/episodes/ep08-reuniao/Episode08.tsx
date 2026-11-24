import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota} from '../../characters';
import type {Expression} from '../../characters';
import {VIDEO} from '../../config/tokens';
import {sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines, TitleCard, Zzz} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {HomeOffice, HOME_OFFICE} from '../../scenes/HomeOffice';
import {Computer} from '../../props/Computer';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP08 — "Reunião que Podia Ser um E-mail"
 * Gancho: "Reunião rápida, dois minutos, ele disse."
 * Desenvolvimento: 1h47 depois o chefe pergunta "alguma dúvida?" — e o Palito levanta a mão.
 * Virada: a pergunta vira… outra reunião.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

export const T = {
  join: startOf('l2') - sec(0.5),
  cardStart: endOf('l2') + sec(0.3),
  cardEnd: endOf('l2') + sec(1.8),
  doubt: startOf('l3'),
  palitoAsks: startOf('l4'),
  scream: startOf('l5'),
  screamEnd: endOf('l5') + sec(0.3),
  twitchStart: startOf('l7') - sec(0.5),
  irisStart: endOf('l7') + sec(0.1),
} as const;
export const EP08_THUMBNAIL_FRAME = T.scream + sec(0.3);

const FLOOR = HOME_OFFICE.floorY;
const BOLOTA = {x: 500, face: {x: 500, y: 1130}};
const COMPUTER_POS = {x: 790, y: HOME_OFFICE.deskTopY + 10};

const fmt = (totalSec: number) => {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const Episode08: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP08_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const speaking = (speaker: string) => TIMELINE.lines.some((l) => l.speaker === speaker && frame >= l.startFrame && frame < l.endFrame);
  const elapsed = frame < T.join ? 0 : frame < T.cardEnd ? (frame - T.join) / fps : 6420 + (frame - T.cardEnd) / fps;
  const asleep = frame >= T.cardEnd && frame < T.doubt + sec(0.5);
  const shocked = frame >= T.scream && frame < T.screamEnd;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'neutral'],
    [T.join, 'neutral'],
    [T.cardEnd, 'sleeping'],
    [T.doubt + sec(0.5), 'happy'],
    [T.palitoAsks + sec(0.4), 'shocked'],
    [T.screamEnd, 'tired'],
    [startOf('l6') + sec(1.5), 'annoyed'],
  ]);

  const zoom =
    frame < T.join
      ? kf(frame, [0, T.join], [1.5, 1])
      : frame < T.twitchStart
        ? shockZoom(frame, T.scream, T.screamEnd, 1.4)
        : finaleZoom(frame, T.twitchStart, T.irisStart);

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x + 60, focusY: BOLOTA.face.y, shake: shockShake(frame, T.scream, T.screamEnd)}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['NÃO,', 'PALITO!'] : null}
      overlay={<TitleCard frame={frame} fps={fps} start={T.cardStart} end={T.cardEnd} text="1 HORA E 47 MINUTOS DEPOIS..." />}
    >
      <HomeOffice />
      <Computer
        x={COMPUTER_POS.x}
        y={COMPUTER_POS.y}
        screen={
          frame < T.join
            ? {kind: 'call', title: 'Reunião rápida (2 min)', timer: 'entrando...', tiles: [{name: 'BOLOTA', color: '#FF9F43', speaking: false}]}
            : {
                kind: 'call',
                title: 'Reunião rápida (2 min)',
                timer: fmt(elapsed),
                tiles: [
                  {name: 'CHEFE', color: '#57606F', speaking: speaking('chefe')},
                  {name: 'PALITO', color: '#4FA3F7', speaking: speaking('palito')},
                  {name: 'BOLOTA', color: '#FF9F43', speaking: speaking('bolota'), asleep},
                  {name: 'CARLOS', color: '#2ED573', speaking: false, asleep: frame >= T.cardEnd},
                ],
              }
        }
        typed={0}
        cursorOn={false}
      />
      <ImpactLines frame={frame} start={T.scream} end={T.screamEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={step(frame, [[0, 0.8], [T.scream, 0], [T.screamEnd, 0.8], [T.twitchStart, 0]])}
        leftArm={shocked ? 160 : 15}
        rightArm={shocked ? 160 : frame >= T.doubt + sec(0.5) && frame < T.palitoAsks ? 150 : 15}
        squash={breathe(frame, asleep ? 20 : 10)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : asleep ? -6 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
      {asleep ? <Zzz frame={frame} x={BOLOTA.x + 120} y={920} /> : null}
    </EpisodeShell>
  );
};
