import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, FONTS, VIDEO} from '../../config/tokens';
import {sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, slideIn} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {PhoneNotification} from '../../components/PhoneNotification';
import {ScreenCard} from '../../components/ScreenCard';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {WallClock} from '../../props/WallClock';
import {Kitchen, KITCHEN} from '../../scenes/Kitchen';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP15 — "Entrega Prevista" (temporada 2)
 * Gancho: "Meu pedido chega hoje, entre 8h e 18h."
 * Desenvolvimento: time-lapse do dia inteiro esperando; às 18:01, "ninguém atendeu".
 * Virada: o Palito recebeu de manhã e deixou o bilhete avisando… dentro da caixa.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

export const T = {
  lapseStart: endOf('l2') + sec(0.3),
  lapseEnd: startOf('l3') - sec(0.2),
  notify: startOf('l4') - sec(0.6),
  shock: startOf('l5'),
  shockEnd: endOf('l5') + sec(0.3),
  palitoEnter: startOf('l6') - sec(0.6),
  note: endOf('l8') + sec(0.1),
  twitchStart: startOf('l9') - sec(0.5),
  irisStart: endOf('l9') + sec(0.1),
};
export const EP15_THUMBNAIL_FRAME = T.shock + sec(0.4);

const FLOOR = KITCHEN.floorY;
const BOLOTA = {x: 660, face: {x: 660, y: 1130}};
const PALITO_X = 280;

/** Horas desde as 7h00 → "HH:MM". */
const clockText = (hours: number) => {
  const total = Math.floor((7 + hours) * 60);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

export const Episode15: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP15_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  // 8:00 → 17:59 no time-lapse; 18:01 na notificação
  const hours = frame < T.notify ? kf(frame, [T.lapseStart, T.lapseEnd], [1, 10.984]) : kf(frame, [T.notify, T.notify + 10], [10.984, 11.017]);
  const lapsing = frame >= T.lapseStart && frame < T.lapseEnd;
  const shocked = frame >= T.shock && frame < T.shockEnd;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.lapseStart, 'neutral'],
    [T.lapseStart + sec(1.4), 'tired'],
    [T.lapseEnd, 'happy'],
    [T.notify + sec(0.3), 'neutral'],
    [T.shock, 'shocked'],
    [T.shockEnd, 'annoyed'],
    [startOf('l7'), 'shocked'],
    [startOf('l7') + sec(0.5), 'annoyed'],
    [startOf('l8') + sec(1.4), 'tired'],
    [T.note + sec(0.6), 'annoyed'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);

  const zoom =
    frame < T.lapseStart
      ? kf(frame, [0, T.lapseStart], [1.4, 1.1])
      : frame < T.twitchStart
        ? shockZoom(frame, T.shock, T.shockEnd, 1.45)
        : finaleZoom(frame, T.twitchStart, T.irisStart);

  // no time-lapse, o Bolota olha de um lado para o outro (janela ↔ porta)
  const lookX = lapsing ? Math.sin((frame - T.lapseStart) / 5) : frame >= T.palitoEnter && frame < T.twitchStart && !shocked ? -0.8 : 0;

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x - 60, focusY: BOLOTA.face.y - 40, shake: shockShake(frame, T.shock, T.shockEnd)}}
      speakerColors={SPEAKERS.colors}
      speakerNames={{...SPEAKERS.names, celular: 'ENTREGAS'}}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['18:01', 'NINGUÉM ATENDEU?!'] : null}
      overlayInThumbnail
      overlay={
        <>
          <ScreenCard
            frame={frame}
            fps={fps}
            start={sec(0.3)}
            end={T.notify}
            title="RASTREIO DO PEDIDO"
            accent={COLORS.bankBlue}
            rows={[{text: frame < T.lapseEnd ? 'Saiu para entrega' : 'Chega a qualquer momento!', bold: true}]}
            big={{text: clockText(hours), color: hours > 10.5 ? COLORS.danger : COLORS.ink}}
            footer="Previsão: 8:00 às 18:00"
            top={600}
          />
          <PhoneNotification
            frame={frame}
            fps={fps}
            start={T.notify}
            end={T.palitoEnter}
            app="Entregas · 18:01"
            title="Tentativa de entrega"
            body="Ninguém atendeu. Nova tentativa em 7 dias úteis."
            top={620}
          />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.note}
            end={T.irisStart}
            title="BILHETE (DENTRO DA CAIXA)"
            accent={COLORS.cardboard}
            rows={[{text: 'Bolota, sua encomenda chegou!', bold: true}, {text: 'Tá comigo. Beijos, Palito'}]}
            top={620}
          />
        </>
      }
    >
      <Kitchen />
      <WallClock x={800} y={560} hours={hours} />
      {frame >= T.palitoEnter ? (
        <>
          <Palito
            x={PALITO_X + enter.dx}
            y={FLOOR}
            expression={frame >= startOf('l7') && frame < startOf('l8') ? 'neutral' : 'happy'}
            mouth={mouthAt(cues.palito ?? [], frame)}
            lookX={0.8}
            rightArm={95}
            leftArm={60}
            tilt={enter.tilt}
          />
          {/* a caixa da encomenda nos braços do Palito */}
          <div
            style={{
              position: 'absolute',
              left: PALITO_X + enter.dx + 40,
              top: 1150,
              width: 190,
              height: 150,
              background: COLORS.cardboard,
              border: `8px solid ${COLORS.ink}`,
              borderRadius: 10,
              transform: `rotate(${enter.tilt}deg)`,
            }}
          >
            <div style={{position: 'absolute', left: 70, top: 0, width: 34, height: '100%', background: '#E8D3A9'}} />
            <div style={{position: 'absolute', left: 14, bottom: 10, fontFamily: FONTS.display, fontSize: 24, color: COLORS.ink}}>BOLOTA</div>
          </div>
        </>
      ) : null}
      <ImpactLines frame={frame} start={T.shock} end={T.shockEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={lookX}
        leftArm={shocked ? 160 : frame < endOf('l1') ? 150 : 15}
        rightArm={shocked ? 160 : frame < endOf('l1') ? 150 : 15}
        squash={breathe(frame, lapsing ? 4 : 10)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : lapsing ? Math.sin((frame - T.lapseStart) / 5) * 3 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
    </EpisodeShell>
  );
};
