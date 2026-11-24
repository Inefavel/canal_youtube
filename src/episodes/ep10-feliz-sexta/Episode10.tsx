import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, FONTS, VIDEO} from '../../config/tokens';
import {MOTION, sec} from '../../config/timing';
import {breathe, finaleZoom, slideIn, wave} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {ScreenCard} from '../../components/ScreenCard';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {TitleCard, Zzz} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {Kitchen, KITCHEN} from '../../scenes/Kitchen';
import {Bedroom, BEDROOM} from '../../scenes/Bedroom';
import {BedBack, BedFront} from '../../props/Bed';
import {Nightstand} from '../../props/Nightstand';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP10 — "Feliz Sexta-feira" (fim de temporada)
 * Gancho: "SEXTA-FEIRA!" e um plano épico de fim de semana.
 * Desenvolvimento: o fim de semana passa em 2 segundos… dormindo.
 * Virada: segunda-feira de novo. Fecha com o bordão do EP01: "…Eu odeio segunda."
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

const base = endOf('l3');
export const T = {
  plan: startOf('l2') - sec(0.2),
  palitoEnter: startOf('l3') - sec(0.6),
  cardStart: base + sec(0.3),
  bedroom: base + sec(1.3),
  saturday: base + sec(1.3),
  sunday: base + sec(2.5),
  monday: base + sec(3.5),
  wake: startOf('l4'),
  palitoEnter2: startOf('l5') - sec(0.6),
  twitchStart: startOf('l6') - sec(0.5),
  irisStart: endOf('l6') + sec(0.1),
} as const;
export const EP10_THUMBNAIL_FRAME = T.wake + sec(0.5);

const FLOOR = KITCHEN.floorY;
const BOLOTA_KITCHEN = {x: 640, face: {x: 640, y: 1130}};
const BOLOTA_BED = {x: 600, y: 1380};
const NIGHTSTAND = {x: 960, y: 1420};

const DayStamp: React.FC<{text: string; frame: number; fps: number; at: number}> = ({text, frame, fps, at}) => {
  const p = spring({frame: frame - at, fps, config: MOTION.springSnappy});
  return (
    <div
      style={{
        position: 'absolute',
        top: 330,
        width: '100%',
        textAlign: 'center',
        fontFamily: FONTS.display,
        fontSize: 140,
        color: COLORS.captionHighlight,
        WebkitTextStroke: `22px ${COLORS.ink}`,
        paintOrder: 'stroke fill',
        transform: `scale(${0.6 + 0.4 * p}) rotate(-5deg)`,
      }}
    >
      {text}
    </div>
  );
};

export const Episode10: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP10_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const inBedroom = frame >= T.bedroom;
  const enter = slideIn(frame, T.palitoEnter, fps);
  const enter2 = slideIn(frame, T.palitoEnter2, fps);
  const hop = frame < endOf('l1') ? Math.abs(Math.sin(frame / 5)) : 0;

  // dia/noite no fim de semana acelerado
  const daylight = !inBedroom
    ? 1
    : frame < T.monday
      ? 0.5 + 0.5 * Math.sin(((frame - T.saturday) / (T.monday - T.saturday)) * Math.PI * 4 - Math.PI / 2)
      : kf(frame, [T.monday, T.wake], [0.1, 0.6]);
  const ringing = frame >= T.monday + sec(0.1) && frame < T.wake;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.bedroom, 'sleeping'],
    [T.wake, 'shocked'],
    [T.wake + sec(1.2), 'tired'],
    [startOf('l5') + sec(1.2), 'annoyed'],
  ]);
  const stamp = frame >= T.saturday && frame < T.sunday ? 'SÁBADO' : frame >= T.sunday && frame < T.monday ? 'DOMINGO' : frame >= T.monday && frame < T.wake ? 'SEGUNDA, 06:00' : null;
  const stampAt = frame < T.sunday ? T.saturday : frame < T.monday ? T.sunday : T.monday;

  const zoom = !inBedroom
    ? kf(frame, [0, T.plan], [1.5, 1])
    : frame < T.twitchStart
      ? kf(frame, [T.wake, T.wake + 4, T.wake + sec(1), T.wake + sec(1.3)], [1, 1.35, 1.35, 1])
      : finaleZoom(frame, T.twitchStart, T.irisStart);
  const focus = inBedroom ? {x: BOLOTA_BED.x, y: 1110} : {x: (BOLOTA_KITCHEN.x + 230) / 2 + 120, y: BOLOTA_KITCHEN.face.y};

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: focus.x, focusY: focus.y}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['JÁ É', 'SEGUNDA?!'] : null}
      overlay={
        <>
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.plan}
            end={T.cardStart}
            title="PLANO DO FIM DE SEMANA"
            accent={COLORS.ok}
            rows={[{text: 'Sábado: praia'}, {text: 'Domingo: trilha'}, {text: 'Status: VIVER!', bold: true, color: COLORS.ok}]}
            top={600}
          />
          <TitleCard frame={frame} fps={fps} start={T.cardStart} end={T.bedroom} text="O FIM DE SEMANA:" />
          {stamp ? <DayStamp text={stamp} frame={frame} fps={fps} at={stampAt} /> : null}
        </>
      }
    >
      {!inBedroom ? (
        <>
          <Kitchen />
          {frame >= T.palitoEnter ? (
            <Palito x={230 + enter.dx} y={FLOOR} expression="happy" mouth={mouthAt(cues.palito ?? [], frame)} lookX={0.8} rightArm={wave(frame, startOf('l3'), endOf('l3'))} tilt={enter.tilt} />
          ) : null}
          <Bolota
            x={BOLOTA_KITCHEN.x}
            y={FLOOR - 70 * hop}
            expression={bolotaExpression}
            mouth={mouthAt(cues.bolota ?? [], frame)}
            lookX={frame >= T.palitoEnter ? -0.8 : 0}
            leftArm={frame < endOf('l2') ? 155 : 15}
            rightArm={frame < endOf('l2') ? 155 : 15}
            squash={breathe(frame)}
          />
        </>
      ) : (
        <>
          <Bedroom daylight={daylight} />
          <BedBack />
          <Bolota
            x={BOLOTA_BED.x}
            y={BOLOTA_BED.y}
            expression={bolotaExpression}
            mouth={mouthAt(cues.bolota ?? [], frame)}
            lookX={frame >= T.palitoEnter2 && frame < T.twitchStart ? -0.8 : 0}
            squash={breathe(frame, bolotaExpression === 'sleeping' ? 18 : 10)}
            tilt={bolotaExpression === 'sleeping' ? -4 : 0}
            twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
          />
          <BedFront ruffle={frame / 20} />
          <Nightstand x={NIGHTSTAND.x} y={NIGHTSTAND.y} time={frame >= T.monday ? '06:00' : '--:--'} ringing={ringing} pressed={0} frame={frame} />
          {bolotaExpression === 'sleeping' ? <Zzz frame={frame} x={BOLOTA_BED.x + 150} y={BOLOTA_BED.y - 470} /> : null}
          {frame >= T.palitoEnter2 ? (
            <Palito x={110 + enter2.dx} y={BEDROOM.floorY} expression="happy" mouth={mouthAt(cues.palito ?? [], frame)} lookX={0.8} rightArm={wave(frame, startOf('l5'), endOf('l5'))} tilt={enter2.tilt} />
          ) : null}
        </>
      )}
    </EpisodeShell>
  );
};
