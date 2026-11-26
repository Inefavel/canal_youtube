import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, FONTS, VIDEO} from '../../config/tokens';
import {sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, slideIn, wave} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {ScreenCard} from '../../components/ScreenCard';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {Supermarket, SUPERMARKET} from '../../scenes/Supermarket';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP20 — "Senha do Cartão" (fim da temporada 2)
 * Gancho: no caixa, "Digite sua senha."
 * Desenvolvimento: aniversário dele? da mãe? do cachorro (que ele nem tem)? Cartão bloqueado.
 * Virada: o Palito paga com o celular, a fila aplaude, e a senha dele é 1234 (eco do EP02).
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

type MachineState = {status: string; color: string; typed: number};

export const T = {
  type1: endOf('l2') + sec(0.1),
  wrong1: startOf('l3'),
  type2: endOf('l4') + sec(0.1),
  blocked: startOf('l5'),
  shock: startOf('l6'),
  shockEnd: endOf('l6') + sec(0.3),
  palitoEnter: startOf('l7') - sec(0.6),
  approved: endOf('l7') + sec(0.1),
  twitchStart: startOf('l9') - sec(0.5),
  irisStart: endOf('l9') + sec(0.1),
};
export const EP20_THUMBNAIL_FRAME = T.shock + sec(0.4);

const FLOOR = SUPERMARKET.floorY;
const BOLOTA = {x: 560, face: {x: 560, y: 1130}};
const PALITO_X = 220;

/** "CLAP!" em quadrinho pulando pela tela quando a fila aplaude. */
const Clap: React.FC<{frame: number; start: number; end: number}> = ({frame, start, end}) => {
  if (frame < start || frame >= end) {
    return null;
  }
  const spots = [
    {x: 70, y: 1180, r: -12},
    {x: 640, y: 1120, r: 10},
    {x: 120, y: 1420, r: 8},
    {x: 700, y: 1400, r: -8},
  ];
  return (
    <>
      {spots.map((s, i) => {
        const t = frame - start - i * 4;
        if (t < 0) {
          return null;
        }
        const bounce = 1 + 0.12 * Math.abs(Math.sin(t / 3));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              fontFamily: FONTS.display,
              fontSize: 90,
              color: COLORS.captionHighlight,
              WebkitTextStroke: `14px ${COLORS.ink}`,
              paintOrder: 'stroke fill',
              transform: `rotate(${s.r}deg) scale(${bounce})`,
            }}
          >
            CLAP!
          </div>
        );
      })}
    </>
  );
};

export const Episode20: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP20_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const typedAt = (from: number) => Math.max(0, Math.min(4, Math.floor((frame - from) / 3)));
  const machine: MachineState =
    frame >= T.approved
      ? {status: 'APROVADO ✓', color: COLORS.ok, typed: 0}
      : frame >= T.blocked
        ? {status: 'CARTÃO BLOQUEADO', color: COLORS.danger, typed: 0}
        : frame >= T.type2
          ? {status: 'Digite sua senha', color: COLORS.ink, typed: typedAt(T.type2)}
          : frame >= T.wrong1
            ? {status: 'SENHA INCORRETA', color: COLORS.danger, typed: 0}
            : {status: 'Digite sua senha', color: COLORS.ink, typed: frame >= T.type1 ? typedAt(T.type1) : 0};
  const attemptsLeft = frame >= T.blocked ? 0 : frame >= T.wrong1 ? 2 : 3;

  const shocked = frame >= T.shock && frame < T.shockEnd;
  const typing = (frame >= T.type1 && frame < T.wrong1) || (frame >= T.type2 && frame < T.blocked);

  const bolotaExpression = step<Expression>(frame, [
    [0, 'neutral'],
    [startOf('l2'), 'happy'],
    [startOf('l2') + sec(1.6), 'neutral'],
    [T.wrong1, 'shocked'],
    [T.wrong1 + sec(0.5), 'annoyed'],
    [startOf('l4'), 'happy'],
    [T.blocked, 'shocked'],
    [T.blocked + sec(0.5), 'tired'],
    [T.shock, 'shocked'],
    [T.shockEnd, 'tired'],
    [startOf('l8') + sec(0.8), 'annoyed'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);
  const redOverlay = frame >= T.blocked ? kf(frame, [T.blocked, T.blocked + sec(1.5)], [0.28, 0]) : 0;

  const zoom =
    frame < T.type1
      ? kf(frame, [0, T.type1], [1.4, 1.1])
      : frame < T.twitchStart
        ? shockZoom(frame, T.shock, T.shockEnd, 1.45)
        : finaleZoom(frame, T.twitchStart, T.irisStart);

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x - 40, focusY: BOLOTA.face.y, shake: shockShake(frame, T.shock, T.shockEnd)}}
      speakerColors={SPEAKERS.colors}
      speakerNames={{...SPEAKERS.names, maquina: 'MAQUININHA'}}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['CARTÃO', 'BLOQUEADO?!'] : null}
      overlayInThumbnail
      overlay={
        <>
          {redOverlay > 0 ? <div style={{position: 'absolute', inset: 0, background: COLORS.danger, opacity: redOverlay}} /> : null}
          <ScreenCard
            frame={frame}
            fps={fps}
            start={sec(0.2)}
            end={T.palitoEnter}
            title="MAQUININHA · R$ 87,40"
            accent={machine.color === COLORS.ink ? COLORS.bankBlue : machine.color}
            big={{text: machine.typed > 0 ? '•'.repeat(machine.typed).split('').join(' ') : machine.status, color: machine.color}}
            footer={`Tentativas restantes: ${attemptsLeft}`}
            top={600}
          />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.approved}
            end={T.twitchStart}
            title="PAGAMENTO APROVADO"
            accent={COLORS.ok}
            rows={[{text: 'Por aproximação · Palito', bold: true}, {text: 'Senha do celular: 1234', color: COLORS.danger}]}
            top={600}
          />
          <Clap frame={frame} start={T.approved + sec(0.2)} end={startOf('l8') + sec(1)} />
        </>
      }
    >
      <Supermarket />
      {/* maquininha na esteira do caixa */}
      <div
        style={{
          position: 'absolute',
          left: BOLOTA.x + 230,
          top: SUPERMARKET.counterTopY - 130,
          width: 110,
          height: 140,
          background: COLORS.monitor,
          border: `8px solid ${COLORS.ink}`,
          borderRadius: 18,
        }}
      >
        <div style={{margin: 10, height: 40, borderRadius: 6, background: machine.color === COLORS.ink ? '#DFE4EA' : machine.color}} />
      </div>
      {frame >= T.palitoEnter ? (
        <Palito
          x={PALITO_X + enter.dx}
          y={FLOOR}
          expression="happy"
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          rightArm={frame >= startOf('l7') && frame < T.approved + sec(0.4) ? 95 : wave(frame, startOf('l8'), endOf('l8'))}
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
        lookY={typing ? 0.3 : 0}
        leftArm={shocked ? 160 : 15}
        rightArm={shocked ? 160 : typing ? 100 + 10 * Math.sin(frame * 2) : 15}
        squash={breathe(frame)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
    </EpisodeShell>
  );
};
