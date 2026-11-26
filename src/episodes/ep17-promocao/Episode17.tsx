import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, VIDEO} from '../../config/tokens';
import {sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, slideIn, wave} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {PhoneNotification} from '../../components/PhoneNotification';
import {ScreenCard} from '../../components/ScreenCard';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines, TitleCard} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {Computer} from '../../props/Computer';
import {HomeOffice, HOME_OFFICE} from '../../scenes/HomeOffice';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP17 — "Promoção Imperdível" (temporada 2)
 * Gancho: "50% OFF! Só hoje!" — o Bolota compra tudo.
 * Desenvolvimento: no dia seguinte, a mesma loja está com 70% OFF.
 * Virada: o Palito comprou igual com 90%, usando o cupom que chegou no e-mail… do Bolota.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

// cliques de "compra" (iguais aos SFX s1–s3 do dialogue.json)
const CLICKS = [0.2, 0.6, 1.0].map((s) => startOf('l2') + sec(s));

export const T = {
  confirmed: endOf('l2') + sec(0.2),
  cardStart: endOf('l2') + sec(0.6),
  nextDay: startOf('l3') - sec(0.3),
  seventy: startOf('l4') - sec(0.3),
  shock: startOf('l4'),
  shockEnd: endOf('l4') + sec(0.3),
  palitoEnter: startOf('l5') - sec(0.6),
  email: startOf('l7') + sec(0.6),
  twitchStart: startOf('l8') - sec(0.5),
  irisStart: endOf('l8') + sec(0.1),
};
export const EP17_THUMBNAIL_FRAME = T.shock + sec(0.4);

const FLOOR = HOME_OFFICE.floorY;
const BOLOTA = {x: 500, face: {x: 500, y: 1130}};
const COMPUTER_POS = {x: 790, y: HOME_OFFICE.deskTopY + 10};

export const Episode17: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP17_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const clicks = CLICKS.filter((c) => frame >= c).length;
  const buying = frame >= startOf('l2') && frame < T.confirmed;
  const shocked = frame >= T.shock && frame < T.shockEnd;
  const discount = frame >= T.seventy ? 70 : 50;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.nextDay, 'happy'],
    [T.shock, 'shocked'],
    [T.shockEnd, 'annoyed'],
    [startOf('l6'), 'shocked'],
    [endOf('l6'), 'neutral'],
    [startOf('l7') + sec(1), 'tired'],
    [T.email + sec(0.6), 'annoyed'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);

  const zoom =
    frame < T.confirmed
      ? kf(frame, [0, startOf('l2')], [1.4, 1.1])
      : frame < T.twitchStart
        ? shockZoom(frame, T.shock, T.shockEnd, 1.5)
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
      thumbnailText={thumbnail ? ['70% OFF', 'NO DIA SEGUINTE?!'] : null}
      overlayInThumbnail
      overlay={
        <>
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.confirmed}
            end={T.cardStart + sec(0.1)}
            title="PEDIDO CONFIRMADO"
            accent={COLORS.ok}
            rows={[{text: '12 itens · 50% OFF', bold: true}, {text: 'Total: R$ 1.247,00'}]}
            top={600}
          />
          <TitleCard frame={frame} fps={fps} start={T.cardStart} end={T.nextDay} text="NO DIA SEGUINTE..." />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.seventy}
            end={T.palitoEnter}
            title="MESMA LOJA, HOJE"
            accent="#8854D0"
            big={{text: '70% OFF', color: '#8854D0'}}
            footer="Só hoje! (de novo)"
            top={600}
          />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={endOf('l5') + sec(0.1)}
            end={T.email}
            title="PEDIDO DO PALITO"
            accent={COLORS.palitoTag}
            rows={[{text: '12 itens · 90% OFF', bold: true}, {text: 'Total: R$ 124,70', color: COLORS.ok, bold: true}]}
            top={600}
          />
          <PhoneNotification
            frame={frame}
            fps={fps}
            start={T.email}
            end={T.irisStart}
            app="E-mail · ontem"
            title="Para: Bolota · Cupom exclusivo!"
            body="90% OFF em tudo. Lido por: Palito"
            top={620}
          />
        </>
      }
    >
      <HomeOffice />
      <Computer x={COMPUTER_POS.x} y={COMPUTER_POS.y} screen={{kind: 'shop', discount, cart: frame >= T.nextDay ? 0 : clicks * 4, color: discount === 70 ? '#8854D0' : COLORS.danger}} typed={0} cursorOn={false} />
      {frame >= T.palitoEnter ? (
        <Palito
          x={170 + enter.dx}
          y={FLOOR}
          expression="happy"
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          rightArm={wave(frame, startOf('l5'), endOf('l5')) !== 20 ? wave(frame, startOf('l5'), endOf('l5')) : wave(frame, startOf('l7'), endOf('l7'))}
          tilt={enter.tilt}
        />
      ) : null}
      <ImpactLines frame={frame} start={T.shock} end={T.shockEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={step(frame, [[0, 0.8], [T.shock, 0], [T.palitoEnter + sec(0.6), -0.8], [T.twitchStart, 0]])}
        leftArm={shocked ? 160 : buying ? 115 + 14 * Math.sin(frame * 1.4) : frame < startOf('l2') ? 150 : 15}
        rightArm={shocked ? 160 : buying ? 115 + 14 * Math.sin(frame * 1.4 + 1.6) : frame < startOf('l2') ? 150 : 15}
        squash={breathe(frame)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
    </EpisodeShell>
  );
};
