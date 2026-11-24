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
import {ImpactLines} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {Kitchen, KITCHEN} from '../../scenes/Kitchen';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP07 — "O Boleto"
 * Gancho: Bolota paga o último boleto do mês.
 * Desenvolvimento: 3 segundos de paz… e chegam 4 boletos novos.
 * Virada: Palito lembra que ele ainda tem crédito — saldo: R$ 0,12.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

const BILLS = [
  {app: 'Cartão', title: 'Fatura fechou', body: 'R$ 1.284,90 · vence dia 10'},
  {app: 'Energia', title: 'Conta de luz', body: 'R$ 312,40 · vence dia 12'},
  {app: 'Internet', title: 'Mensalidade', body: 'R$ 119,90 · vence dia 15'},
  {app: 'Condomínio', title: 'Boleto disponível', body: 'R$ 780,00 · vence dia 5'},
];

export const T = {
  paid: endOf('l1') - sec(0.2),
  peace: startOf('l2'),
  bills: [0.5, 1.0, 1.5, 2.0].map((s) => endOf('l2') + sec(s)),
  shock: startOf('l3'),
  shockEnd: endOf('l3') + sec(0.3),
  palitoEnter: startOf('l4') - sec(0.6),
  balance: startOf('l5') - sec(1.3),
  twitchStart: startOf('l7') - sec(0.5),
  irisStart: endOf('l7') + sec(0.1),
};
export const EP07_THUMBNAIL_FRAME = T.shock + sec(0.4);

const FLOOR = KITCHEN.floorY;
const BOLOTA = {x: 620, face: {x: 620, y: 1130}};
const PALITO_X = 230;

export const Episode07: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP07_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const shocked = frame >= T.shock && frame < T.shockEnd;
  const bolotaExpression = step<Expression>(frame, [
    [0, 'neutral'],
    [T.paid, 'happy'],
    [T.peace + sec(0.6), 'sleeping'],
    [T.bills[0], 'neutral'],
    [T.bills[2], 'tired'],
    [T.shock, 'shocked'],
    [T.shockEnd, 'tired'],
    [T.balance + sec(0.6), 'annoyed'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);
  const holdingPhone = frame < T.palitoEnter;

  const zoom =
    frame < T.shock
      ? kf(frame, [0, T.paid, T.peace + sec(0.6)], [1.45, 1.3, 1.2])
      : frame < T.twitchStart
        ? shockZoom(frame, T.shock, T.shockEnd, 1.4)
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
      thumbnailText={thumbnail ? ['QUATRO', 'BOLETOS?!'] : null}
      overlay={
        <>
          <ScreenCard
            frame={frame}
            fps={fps}
            start={sec(0.4)}
            end={T.bills[0] - sec(0.3)}
            title="BANCO SEGURO"
            accent={frame >= T.paid ? COLORS.ok : COLORS.bankBlue}
            rows={frame >= T.paid ? [{text: '✓ Pagamento confirmado', color: COLORS.ok, bold: true}, {text: 'Aluguel · R$ 1.500,00'}] : [{text: 'Pagando boleto...'}, {text: 'Aluguel · R$ 1.500,00'}]}
            top={600}
          />
          {BILLS.map((b, i) => (
            <PhoneNotification
              key={b.app}
              frame={frame}
              fps={fps}
              start={T.bills[i]}
              end={T.shock + sec(0.15)}
              app={b.app}
              title={b.title}
              body={b.body}
              top={560 + i * 175}
            />
          ))}
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.balance}
            end={endOf('l6') + sec(0.3)}
            title="BANCO SEGURO"
            accent={COLORS.bankBlue}
            rows={[{text: 'Saldo disponível'}]}
            big={{text: 'R$ 0,12', color: COLORS.danger}}
            top={600}
          />
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
          rightArm={wave(frame, startOf('l4'), endOf('l4'))}
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
        lookY={holdingPhone && !shocked ? 0.5 : 0}
        leftArm={shocked ? 160 : frame >= T.paid && frame < T.peace + sec(0.6) ? 150 : 15}
        rightArm={shocked ? 160 : holdingPhone ? 70 : 15}
        squash={breathe(frame, frame >= T.peace + sec(0.6) && frame < T.bills[0] ? 20 : 10)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
      {holdingPhone && !shocked ? (
        <div style={{position: 'absolute', left: BOLOTA.x + 250, top: 1120, width: 60, height: 100, borderRadius: 12, background: COLORS.monitor, border: `6px solid ${COLORS.ink}`}} />
      ) : null}
    </EpisodeShell>
  );
};
