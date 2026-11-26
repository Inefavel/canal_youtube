import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, VIDEO} from '../../config/tokens';
import {sec} from '../../config/timing';
import {breathe, finaleZoom, shockZoom, slideIn} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {ScreenCard} from '../../components/ScreenCard';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {mouthAt} from '../../lipsync/cues';
import {Bedroom, BEDROOM} from '../../scenes/Bedroom';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP18 — "Modo Avião" (temporada 2)
 * Gancho: "Hoje: detox digital. Zero celular."
 * Desenvolvimento: ele resiste 3 segundos; o Palito mostra um meme.
 * Virada: o dia passa voando, 42 abas abertas, e já é noite.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

export const T = {
  airplane: startOf('l2'),
  detoxStart: endOf('l2') + sec(0.1),
  palitoEnter: startOf('l4') - sec(0.6),
  grab: endOf('l5') - sec(0.2),
  lapseStart: endOf('l5') + sec(0.2),
  lapseEnd: startOf('l6') - sec(0.2),
  twitchStart: startOf('l8') - sec(0.5),
  irisStart: endOf('l8') + sec(0.1),
};
export const EP18_THUMBNAIL_FRAME = T.lapseEnd - sec(0.1);

const FLOOR = BEDROOM.floorY;
const BOLOTA = {x: 640, face: {x: 640, y: 1130}};
const PALITO_X = 280;

const Phone: React.FC<{x: number; y: number; glow?: number}> = ({x, y, glow = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 60,
      height: 100,
      borderRadius: 12,
      background: glow > 0 ? '#9AD8FF' : COLORS.monitor,
      border: `6px solid ${COLORS.ink}`,
      boxShadow: glow > 0 ? `0 0 ${50 * glow}px #9AD8FF` : 'none',
    }}
  />
);

export const Episode18: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP18_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const detoxSeconds = Math.max(0, Math.floor((Math.min(frame, T.palitoEnter) - T.detoxStart) / fps));
  const tabs = Math.round(kf(frame, [T.lapseStart, T.lapseEnd], [1, 42]));
  const daylight = kf(frame, [T.lapseStart, T.lapseEnd], [1, 0]);
  const lapsing = frame >= T.lapseStart && frame < T.lapseEnd;
  const hasPhone = frame >= T.grab;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.detoxStart + sec(0.6), 'neutral'],
    [startOf('l3') + sec(1.2), 'happy'],
    [startOf('l4') + sec(0.8), 'shocked'],
    [startOf('l5'), 'neutral'],
    [T.lapseStart, 'happy'],
    [T.lapseEnd, 'tired'],
    [startOf('l6') + sec(0.6), 'shocked'],
    [endOf('l6') + sec(0.1), 'tired'],
    [startOf('l7') + sec(0.6), 'annoyed'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);

  const zoom =
    frame < T.detoxStart
      ? kf(frame, [0, T.detoxStart], [1.4, 1.1])
      : frame < T.twitchStart
        ? Math.max(lapsing ? kf(frame, [T.lapseStart, T.lapseEnd], [1, 1.35]) : 1, shockZoom(frame, startOf('l6') + sec(0.6), endOf('l6') + sec(0.1), 1.3))
        : finaleZoom(frame, T.twitchStart, T.irisStart);

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x - 60, focusY: BOLOTA.face.y - 30}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['42 ABAS', 'EM 3 SEGUNDOS?!'] : null}
      overlayInThumbnail
      overlay={
        <>
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.airplane}
            end={T.palitoEnter + sec(0.4)}
            title="MODO AVIÃO · ATIVADO"
            accent={COLORS.ok}
            big={{text: `00:00:0${Math.min(9, detoxSeconds)}`}}
            footer="Tempo sem celular"
            top={600}
          />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.lapseStart}
            end={T.twitchStart}
            title="NAVEGADOR"
            accent={COLORS.danger}
            big={{text: `${tabs} abas`, color: COLORS.danger}}
            footer={`Tempo de tela hoje: ${Math.max(1, Math.round(kf(frame, [T.lapseStart, T.lapseEnd], [0, 11])))} h`}
            top={600}
          />
        </>
      }
    >
      <Bedroom daylight={daylight} />
      {frame >= T.palitoEnter ? (
        <>
          <Palito
            x={PALITO_X + enter.dx}
            y={FLOOR}
            expression={frame >= T.lapseEnd && frame < T.twitchStart ? 'neutral' : 'happy'}
            mouth={mouthAt(cues.palito ?? [], frame)}
            lookX={0.8}
            rightArm={frame < T.grab ? 95 : 20}
            tilt={enter.tilt}
          />
          {frame < T.grab ? <Phone x={PALITO_X + enter.dx + 150} y={1060} glow={1} /> : null}
        </>
      ) : null}
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={step(frame, [[0, 0], [T.palitoEnter + sec(0.4), -0.8], [T.lapseStart, 0.6], [startOf('l6'), -0.8], [T.twitchStart, 0]])}
        lookY={hasPhone && frame < startOf('l6') ? 0.5 : 0}
        leftArm={frame < endOf('l1') ? 150 : 15}
        rightArm={hasPhone ? 70 : frame < endOf('l1') ? 150 : frame < T.detoxStart ? 70 : 15}
        squash={breathe(frame)}
        tilt={lapsing ? Math.sin(frame / 3) * 2 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
      {hasPhone || (frame >= T.airplane && frame < T.detoxStart) ? <Phone x={BOLOTA.x + 250} y={1120} glow={lapsing ? 0.6 + 0.4 * Math.sin(frame) : 0} /> : null}
    </EpisodeShell>
  );
};
