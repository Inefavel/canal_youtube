import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, FONTS, VIDEO} from '../../config/tokens';
import {MOTION, sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, slideIn, wave} from '../../components/beats';
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
 * EP11 — "O Grupo da Família" (temporada 2)
 * Gancho: 214 mensagens no grupo da família às 7 da manhã.
 * Desenvolvimento: bom dia com flores, corrente, áudio da mãe… Bolota sai do grupo e encontra a paz.
 * Virada: o Palito o adiciona de volta "sem querer" e ainda cria o "Família 2".
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

const WAVE1 = [
  {app: 'Família', title: 'Tia Cida', body: 'Bom dia!! Flores para alegrar seu dia'},
  {app: 'Família', title: 'Tio Zé', body: 'URGENTE: compartilhe com 10 pessoas'},
  {app: 'Família', title: 'Mãe', body: 'Mensagem de voz · 4:12'},
  {app: 'Família', title: 'Vó Dirce', body: 'Bom diaaaa família abençoada'},
  {app: 'Família', title: 'Primo Léo', body: 'kkkkkkkkkkkkkkk'},
];
const WAVE2 = [
  {app: 'Família 2', title: 'Palito', body: 'criou o grupo "Família 2"'},
  {app: 'Família 2', title: 'Palito', body: 'adicionou 37 pessoas'},
  {app: 'Família 2', title: 'Tia Cida', body: 'Bom dia, grupo novo!!'},
];

export const T = {
  wave1: [0.2, 0.7, ...[0.2, 0.7, 1.2].map((s) => endOf('l1') / VIDEO.fps + s)].map((s) => Math.round(s * VIDEO.fps)),
  shock1: startOf('l1'),
  shock1End: startOf('l1') + sec(1.2),
  leave: startOf('l2'),
  left: endOf('l2') + sec(0.3),
  peace: startOf('l3'),
  palitoEnter: startOf('l4') - sec(0.6),
  readded: endOf('l4') + sec(0.1),
  shock2: startOf('l5'),
  shock2End: endOf('l5') + sec(0.3),
  wave2: [0.2, 0.5, 0.8].map((s) => endOf('l6') + sec(s)),
  twitchStart: startOf('l7') - sec(0.5),
  irisStart: endOf('l7') + sec(0.1),
};
export const EP11_THUMBNAIL_FRAME = T.shock1 + sec(0.5);

const FLOOR = KITCHEN.floorY;
const BOLOTA = {x: 620, face: {x: 620, y: 1130}};
const PALITO_X = 230;

export const Episode11: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP11_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const shocked1 = frame >= T.shock1 && frame < T.shock1End;
  const shocked2 = frame >= T.shock2 && frame < T.shock2End;
  const shocked = shocked1 || shocked2;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'tired'],
    [T.shock1, 'shocked'],
    [T.shock1End, 'annoyed'],
    [T.left, 'neutral'],
    [T.peace, 'happy'],
    [T.palitoEnter + sec(0.4), 'neutral'],
    [T.shock2, 'shocked'],
    [T.shock2End, 'tired'],
    [T.wave2[0], 'annoyed'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);
  const holdingPhone = !shocked && frame < T.peace;

  // contador de não lidas
  const unread = frame < T.left ? Math.round(kf(frame, [0, T.wave1[4] + 8], [180, 214])) : frame >= T.wave2[0] ? Math.round(kf(frame, [T.wave2[0], T.wave2[2] + 8], [214, 428])) : null;
  const badgePop = spring({frame: frame - (frame >= T.wave2[0] ? T.wave2[0] : 0), fps, config: MOTION.springSnappy});

  const zoom =
    frame < T.shock2
      ? frame < T.shock1End + 8
        ? shockZoom(frame, T.shock1, T.shock1End, 1.4)
        : kf(frame, [T.peace, T.peace + sec(0.8), T.palitoEnter, T.palitoEnter + 8], [1, 1.25, 1.25, 1])
      : frame < T.twitchStart
        ? shockZoom(frame, T.shock2, T.shock2End, 1.4)
        : finaleZoom(frame, T.twitchStart, T.irisStart);
  const shake = Math.max(shockShake(frame, T.shock1, T.shock1End), shockShake(frame, T.shock2, T.shock2End));

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x, focusY: BOLOTA.face.y, shake}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['214', 'MENSAGENS?!'] : null}
      overlayInThumbnail
      overlay={
        <>
          {WAVE1.map((n, i) => (
            <PhoneNotification key={`w1-${i}`} frame={frame} fps={fps} start={T.wave1[i]} end={T.leave} app={n.app} title={n.title} body={n.body} top={520 + i * 215} />
          ))}
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.left}
            end={T.palitoEnter - sec(0.2)}
            title="GRUPO FAMÍLIA"
            accent={COLORS.ok}
            rows={[{text: 'Você saiu do grupo.', bold: true}, {text: '0 mensagens não lidas', color: COLORS.ok}]}
            top={620}
          />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.readded}
            end={T.shock2End}
            title="GRUPO FAMÍLIA"
            accent={COLORS.danger}
            rows={[{text: 'Palito adicionou você.', bold: true}, {text: 'Tia Cida: ué, saiu por quê??'}]}
            top={620}
          />
          {WAVE2.map((n, i) => (
            <PhoneNotification key={`w2-${i}`} frame={frame} fps={fps} start={T.wave2[i]} end={T.twitchStart} app={n.app} title={n.title} body={n.body} top={520 + i * 215} />
          ))}
          {unread !== null && frame < T.twitchStart ? (
            <div
              style={{
                position: 'absolute',
                right: 70,
                top: 430,
                background: COLORS.danger,
                color: '#fff',
                border: `6px solid ${COLORS.ink}`,
                borderRadius: 40,
                padding: '6px 24px',
                fontFamily: FONTS.display,
                fontSize: 44,
                transform: `scale(${0.85 + 0.15 * badgePop}) rotate(4deg)`,
              }}
            >
              {unread} não lidas
            </div>
          ) : null}
        </>
      }
    >
      <Kitchen />
      {frame >= T.palitoEnter ? (
        <Palito
          x={PALITO_X + enter.dx}
          y={FLOOR}
          expression="happy"
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          rightArm={wave(frame, startOf('l4'), endOf('l4')) === 20 ? wave(frame, startOf('l6'), endOf('l6')) : wave(frame, startOf('l4'), endOf('l4'))}
          tilt={enter.tilt}
        />
      ) : null}
      <ImpactLines frame={frame} start={T.shock1} end={T.shock1End} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <ImpactLines frame={frame} start={T.shock2} end={T.shock2End} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={frame >= T.palitoEnter && frame < T.twitchStart && !shocked2 ? -0.8 : 0}
        lookY={holdingPhone ? 0.5 : 0}
        leftArm={shocked ? 160 : frame >= T.peace && frame < T.palitoEnter ? 150 : 15}
        rightArm={shocked ? 160 : holdingPhone ? 70 : frame >= T.peace && frame < T.palitoEnter ? 150 : 15}
        squash={breathe(frame, frame >= T.peace && frame < T.palitoEnter ? 20 : 10)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
      {holdingPhone ? (
        <div style={{position: 'absolute', left: BOLOTA.x + 250, top: 1120, width: 60, height: 100, borderRadius: 12, background: COLORS.monitor, border: `6px solid ${COLORS.ink}`}} />
      ) : null}
    </EpisodeShell>
  );
};
