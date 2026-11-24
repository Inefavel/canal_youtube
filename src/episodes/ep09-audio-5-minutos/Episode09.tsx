import React from 'react';
import {Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, VIDEO} from '../../config/tokens';
import {sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, wave} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {PhoneNotification} from '../../components/PhoneNotification';
import {ScreenCard} from '../../components/ScreenCard';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {Kitchen, KITCHEN} from '../../scenes/Kitchen';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP09 — "O Áudio de 5 Minutos"
 * Gancho: Palito manda "um áudio rapidinho" de 7:43.
 * Desenvolvimento: Bolota ouve em 2x (voz de esquilo); o áudio termina com "depois eu te conto pessoalmente".
 * Virada: o Palito estava do lado dele o tempo todo.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

export const T = {
  notif: endOf('l1') + sec(0.1),
  shock: startOf('l2'),
  shockEnd: endOf('l2') + sec(0.2),
  player: startOf('l3') - sec(0.2),
  play: startOf('l4'),
  skip: endOf('l4'),
  playerEnd: endOf('l5') + sec(0.3),
  realize: startOf('l6'),
  twitchStart: startOf('l8') - sec(0.5),
  irisStart: endOf('l8') + sec(0.1),
} as const;
export const EP09_THUMBNAIL_FRAME = T.shock + sec(0.4);

const FLOOR = KITCHEN.floorY;
const BOLOTA = {x: 640, face: {x: 640, y: 1130}};
const PALITO_X = 270;

export const Episode09: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP09_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const listening = frame >= T.play && frame < T.playerEnd;
  const shocked = frame >= T.shock && frame < T.shockEnd;
  const realizing = frame >= T.realize && frame < endOf('l6') + sec(0.2);
  const progress =
    frame < T.play ? 0 : frame < T.skip ? kf(frame, [T.play, T.skip], [0, 0.93], Easing.linear) : kf(frame, [startOf('l5'), endOf('l5')], [0.93, 1]);
  const remaining = Math.round(463 * (1 - progress));

  const bolotaExpression = step<Expression>(frame, [
    [0, 'neutral'],
    [T.notif, 'neutral'],
    [T.shock, 'shocked'],
    [T.shockEnd, 'tired'],
    [T.play + sec(2), 'sleeping'],
    [T.skip, 'tired'],
    [T.realize, 'shocked'],
    [endOf('l6'), 'annoyed'],
  ]);
  const palitoExpression = step<Expression>(frame, [[0, 'happy']]);

  const zoom =
    frame < T.shock
      ? kf(frame, [0, T.notif], [1.4, 1.1])
      : frame < T.realize
        ? shockZoom(frame, T.shock, T.shockEnd, 1.4)
        : frame < T.twitchStart
          ? shockZoom(frame, T.realize, endOf('l6') + sec(0.2), 1.3)
          : finaleZoom(frame, T.twitchStart, T.irisStart);

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: (BOLOTA.x + PALITO_X) / 2 + (frame >= T.twitchStart ? 185 : 0), focusY: BOLOTA.face.y, shake: shockShake(frame, T.shock, T.shockEnd)}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['ÁUDIO DE', '7 MINUTOS?!'] : null}
      overlay={
        <>
          <PhoneNotification frame={frame} fps={fps} start={T.notif} end={T.player} app="Mensagens" title="Palito" body="🎤 Áudio · 7:43" />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.player}
            end={T.playerEnd}
            title="ÁUDIO DO PALITO"
            accent={COLORS.palitoTag}
            big={{text: `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`}}
            progress={progress}
            footer={frame >= T.play && frame < T.skip ? 'Velocidade: 2x ⏩' : frame >= T.skip ? 'Velocidade: 1x' : 'Toque para ouvir'}
            top={730}
          />
        </>
      }
    >
      <Kitchen />
      <Palito
        x={PALITO_X}
        y={FLOOR}
        expression={palitoExpression}
        mouth={mouthAt(cues.palito ?? [], frame)}
        lookX={0.8}
        rightArm={wave(frame, startOf('l7'), endOf('l7'), frame < endOf('l1') ? 110 : 20)}
      />
      <ImpactLines frame={frame} start={T.shock} end={T.shockEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={realizing || frame >= endOf('l6') ? -0.8 : listening ? 0 : frame < T.notif ? -0.8 : 0}
        lookY={listening ? 0.5 : 0}
        leftArm={shocked ? 160 : realizing ? 95 : 15}
        rightArm={shocked ? 160 : listening || (frame >= T.player && frame < T.play) ? 70 : 15}
        squash={breathe(frame, listening ? 20 : 10)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : listening ? -5 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
      {frame >= T.player && frame < T.playerEnd ? (
        <div style={{position: 'absolute', left: BOLOTA.x + 250, top: 1120, width: 60, height: 100, borderRadius: 12, background: COLORS.monitor, border: `6px solid ${COLORS.ink}`}} />
      ) : null}
    </EpisodeShell>
  );
};
