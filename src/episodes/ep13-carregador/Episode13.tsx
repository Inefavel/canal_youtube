import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, VIDEO} from '../../config/tokens';
import {sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, slideIn, wave} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {ScreenCard} from '../../components/ScreenCard';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {Kitchen, KITCHEN} from '../../scenes/Kitchen';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP13 — "Carregador Emprestado" (temporada 2)
 * Gancho: celular com 1% e nenhum carregador.
 * Desenvolvimento: o Palito empresta carregadores de todos os modelos, menos o certo.
 * Virada: quando acha o certo, "carregando lentamente: 9 horas".
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

const CHARGERS = [
  {at: endOf('l2') + sec(0.2), name: 'Micro-USB', ok: false},
  {at: startOf('l4') + sec(0.9), name: 'Lightning', ok: false},
  {at: startOf('l4') + sec(1.5), name: 'Cabo de fone de ouvido', ok: false},
  {at: startOf('l4') + sec(2.2), name: 'USB-C', ok: true},
];

export const T = {
  palitoEnter: startOf('l2') - sec(0.6),
  wrong: startOf('l3'),
  found: startOf('l5') - sec(0.4),
  slow: startOf('l6') - sec(0.3),
  shock: startOf('l6') + sec(2.2),
  shockEnd: startOf('l6') + sec(3.4),
  twitchStart: startOf('l8') - sec(0.5),
  irisStart: endOf('l8') + sec(0.1),
};
export const EP13_THUMBNAIL_FRAME = T.shock + sec(0.4);

const FLOOR = KITCHEN.floorY;
const BOLOTA = {x: 640, face: {x: 640, y: 1130}};
const PALITO_X = 300;

export const Episode13: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP13_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const shocked = frame >= T.shock && frame < T.shockEnd;
  const charger = [...CHARGERS].reverse().find((c) => frame >= c.at);
  const offering = frame >= CHARGERS[0].at - sec(0.3) && frame < T.slow;
  const blink = Math.floor(frame / 8) % 2 === 0;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'tired'],
    [T.palitoEnter + sec(0.6), 'happy'],
    [T.wrong, 'annoyed'],
    [T.found, 'happy'],
    [T.shock, 'shocked'],
    [T.shockEnd, 'tired'],
    [startOf('l7') + sec(1), 'annoyed'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);
  const charge = frame < T.slow ? 1 : Math.round(kf(frame, [T.slow, T.twitchStart], [1, 2]));

  const zoom =
    frame < T.palitoEnter
      ? kf(frame, [0, T.palitoEnter], [1.45, 1.15])
      : frame < T.twitchStart
        ? shockZoom(frame, T.shock, T.shockEnd, 1.4)
        : finaleZoom(frame, T.twitchStart, T.irisStart);

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x - 60, focusY: BOLOTA.face.y, shake: shockShake(frame, T.shock, T.shockEnd)}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['9 HORAS', 'PRA CARREGAR?!'] : null}
      overlayInThumbnail
      overlay={
        <>
          <ScreenCard
            frame={frame}
            fps={fps}
            start={sec(0.2)}
            end={CHARGERS[0].at - sec(0.2)}
            title="BATERIA"
            accent={COLORS.danger}
            big={{text: '1%', color: blink ? COLORS.danger : '#57606F'}}
            footer="Bateria muito fraca"
            top={620}
          />
          {charger && frame < T.slow ? (
            <ScreenCard
              key={charger.name}
              frame={frame}
              fps={fps}
              start={charger.at}
              end={T.slow}
              title="CARREGADOR DO PALITO"
              accent={charger.ok ? COLORS.ok : COLORS.danger}
              rows={[{text: `Conector: ${charger.name}`, bold: true}, {text: charger.ok ? '✓ Compatível!' : '✗ Não encaixa', color: charger.ok ? COLORS.ok : COLORS.danger, bold: true}]}
              top={620}
            />
          ) : null}
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.slow}
            end={T.twitchStart}
            title="BATERIA"
            accent={COLORS.ok}
            big={{text: `${charge}%`}}
            progress={charge / 100}
            footer="Carregando lentamente · 9 h restantes"
            top={620}
          />
        </>
      }
    >
      <Kitchen />
      {frame >= T.palitoEnter ? (
        <Palito
          x={PALITO_X + enter.dx}
          y={FLOOR}
          expression={frame >= T.wrong && frame < startOf('l4') ? 'neutral' : 'happy'}
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          rightArm={offering ? 95 + 6 * Math.sin(frame / 2) : wave(frame, startOf('l7'), endOf('l7'))}
          tilt={enter.tilt}
        />
      ) : null}
      <ImpactLines frame={frame} start={T.shock} end={T.shockEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={frame >= T.palitoEnter && frame < T.twitchStart && !shocked ? -0.8 : 0}
        lookY={frame < T.palitoEnter ? 0.5 : 0}
        leftArm={shocked ? 160 : frame >= T.found && frame < T.slow ? 150 : 15}
        rightArm={shocked ? 160 : frame >= T.found && frame < T.slow ? 150 : 70}
        squash={breathe(frame)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
      {!shocked && !(frame >= T.found && frame < T.slow) ? (
        <div style={{position: 'absolute', left: BOLOTA.x + 250, top: 1120, width: 60, height: 100, borderRadius: 12, background: COLORS.monitor, border: `6px solid ${COLORS.ink}`}} />
      ) : null}
    </EpisodeShell>
  );
};
