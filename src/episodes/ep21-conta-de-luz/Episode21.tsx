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
import {Kitchen, KITCHEN} from '../../scenes/Kitchen';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP21 — "Conta de Luz" (temporada 3)
 * Gancho (frame 0): conta de R$ 847 na tela + alarme + "OITOCENTOS E QUARENTA E SETE?!".
 * Desenvolvimento: o Bolota desliga tudo, até a geladeira, e fica no escuro.
 * Virada: o Palito deixa o ar-condicionado ligado "pro gato". Eles não têm gato.
 * Final: cartela com a pergunta para os comentários.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

// cada "desliga" (TV, luz, geladeira), alinhado à voz e aos cliques s1–s3
const SWITCH_OFFS = [0.75, 2.28, 3.98].map((s) => startOf('l3') + sec(s));

export const T = {
  shockEnd: endOf('l1') + sec(0.2),
  palitoEnter: startOf('l4') - sec(0.6),
  acReveal: endOf('l6') + sec(0.1),
  shock2: startOf('l7'),
  shock2End: startOf('l7') + sec(1.2),
  twitchStart: startOf('l9') - sec(0.5),
  question: endOf('l9') + sec(0.3),
  irisStart: TIMELINE.durationInFrames - sec(0.5),
};
// recomendação da T3: a capa é o próprio começo do vídeo
export const EP21_THUMBNAIL_FRAME = sec(0.5);

const FLOOR = KITCHEN.floorY;
const BOLOTA = {x: 660, face: {x: 660, y: 1130}};
const PALITO_X = 280;
const AC = {x: 620, y: 560};

/** Ar-condicionado de parede com vento saindo. */
const AirConditioner: React.FC<{frame: number; on: boolean}> = ({frame, on}) => (
  <div style={{position: 'absolute', left: AC.x, top: AC.y, width: 340, height: 120}}>
    <div style={{position: 'absolute', inset: 0, background: '#FFFFFF', border: `10px solid ${COLORS.ink}`, borderRadius: 26}} />
    <div style={{position: 'absolute', left: 30, right: 30, bottom: 18, height: 10, background: '#C8CED8', borderRadius: 5}} />
    <div style={{position: 'absolute', right: 26, top: 20, fontFamily: FONTS.display, fontSize: 34, color: on ? COLORS.ok : '#57606F'}}>16°C</div>
    {on
      ? [0, 1, 2].map((i) => {
          const t = ((frame + i * 10) % 30) / 30;
          return (
            <div
              key={i}
              style={{position: 'absolute', left: 60 + i * 90, top: 130 + t * 160, width: 60, height: 10, borderRadius: 5, background: '#9AD8FF', opacity: 1 - t}}
            />
          );
        })
      : null}
  </div>
);

/** Caminha vazia com a plaquinha "GATO" (que eles não têm). */
const EmptyCatBed: React.FC = () => (
  <div style={{position: 'absolute', left: 900, top: FLOOR - 70, width: 150, height: 70}}>
    <div style={{position: 'absolute', inset: 0, background: COLORS.rug, border: `8px solid ${COLORS.ink}`, borderRadius: '50% 50% 20px 20px'}} />
    <div style={{position: 'absolute', left: 30, top: -60, padding: '2px 12px', background: '#FFFFFF', border: `6px solid ${COLORS.ink}`, borderRadius: 10, fontFamily: FONTS.display, fontSize: 28, color: COLORS.ink}}>
      GATO
    </div>
  </div>
);

export const Episode21: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP21_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const offs = SWITCH_OFFS.filter((f) => frame >= f).length;
  const darkness = [0, 0.18, 0.42, 0.5][offs];
  const shocked1 = frame < T.shockEnd;
  const shocked2 = frame >= T.shock2 && frame < T.shock2End;
  const shocked = shocked1 || shocked2;
  const acOn = frame >= T.acReveal;
  // conta: R$ 847 no gancho; no fim, a "economia" do Bolota (3%) contra o ar do Palito
  const savings = offs * 1;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'shocked'],
    [T.shockEnd, 'annoyed'],
    [startOf('l2') + sec(1.2), 'neutral'],
    [startOf('l3'), 'happy'],
    [T.palitoEnter + sec(0.6), 'neutral'],
    [T.acReveal, 'tired'],
    [T.shock2, 'shocked'],
    [T.shock2End, 'tired'],
    [startOf('l8') + sec(1.2), 'annoyed'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);

  const zoom =
    frame < T.shockEnd
      ? kf(frame, [0, sec(0.6)], [1.5, 1.15])
      : frame < T.twitchStart
        ? shockZoom(frame, T.shock2, T.shock2End, 1.4)
        : frame < T.question
          ? finaleZoom(frame, T.twitchStart, T.question)
          : kf(frame, [T.question, T.question + sec(0.4)], [1.8, 1]);

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x - 60, focusY: BOLOTA.face.y - 40, shake: Math.max(shockShake(frame, 0, T.shockEnd), shockShake(frame, T.shock2, T.shock2End))}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['R$ 847', 'DE LUZ?!'] : null}
      overlayInThumbnail
      overlay={
        <>
          <ScreenCard
            frame={frame}
            fps={fps}
            start={-8}
            end={startOf('l3')}
            title="CONTA DE LUZ · NOVEMBRO"
            accent={COLORS.danger}
            big={{text: 'R$ 847,00', color: COLORS.danger}}
            footer="Vencimento: hoje"
            top={620}
          />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={SWITCH_OFFS[0]}
            end={T.palitoEnter}
            title="MODO ECONOMIA"
            accent={COLORS.ok}
            big={{text: `-${savings}%`, color: COLORS.ok}}
            footer={['TV desligada', 'Luz desligada', 'Geladeira desligada'].slice(0, offs).join(' · ')}
            top={620}
          />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.question}
            end={TIMELINE.durationInFrames + 10}
            title="E VOCÊ?"
            accent={COLORS.brandDeep}
            rows={[{text: 'Qual foi a conta mais absurda que já chegou pra você?', bold: true}, {text: 'Responde nos comentários!', color: '#57606F'}]}
            top={620}
          />
        </>
      }
    >
      <Kitchen />
      <AirConditioner frame={frame} on={acOn} />
      {frame >= T.acReveal ? <EmptyCatBed /> : null}
      {/* as luzes vão apagando a cada "desliga" */}
      <div style={{position: 'absolute', inset: 0, background: '#141024', opacity: darkness}} />
      {frame >= T.palitoEnter ? (
        <Palito
          x={PALITO_X + enter.dx}
          y={FLOOR}
          expression={frame >= T.shock2 && frame < startOf('l8') ? 'neutral' : 'happy'}
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          rightArm={frame >= startOf('l6') && frame < T.shock2 ? 150 : wave(frame, startOf('l8'), endOf('l8'))}
          tilt={enter.tilt}
        />
      ) : null}
      <ImpactLines frame={frame} start={0} end={T.shockEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <ImpactLines frame={frame} start={T.shock2} end={T.shock2End} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={step(frame, [[0, 0], [startOf('l3'), 0.8], [T.palitoEnter + sec(0.4), -0.8], [T.acReveal, 0], [T.shock2End, -0.8], [T.twitchStart, 0]])}
        lookY={frame >= T.acReveal && frame < T.shock2 ? -0.8 : 0}
        leftArm={shocked ? 160 : frame >= startOf('l3') && frame < T.palitoEnter ? 110 : 15}
        rightArm={shocked ? 160 : frame >= startOf('l3') && frame < T.palitoEnter ? 110 : 15}
        squash={breathe(frame)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.question ? 1 : 0}
      />
    </EpisodeShell>
  );
};
