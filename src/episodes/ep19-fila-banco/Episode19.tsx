import React from 'react';
import {Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, VIDEO} from '../../config/tokens';
import {MOTION, sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {ScreenCard} from '../../components/ScreenCard';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines, Zzz} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {BankAgency, BankCounterFront, BANK} from '../../scenes/BankAgency';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP19 — "Fila do Banco" (temporada 2)
 * Gancho: senha 001; o painel chama a 847.
 * Desenvolvimento: time-lapse até a senha dele.
 * Virada: no guichê, o Palito (atendente desde hoje): "Esse guichê só atende de 002 a 999."
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

export const T = {
  call847: startOf('l2') - sec(0.3),
  shock1: startOf('l3'),
  shock1End: startOf('l3') + sec(1.2),
  lapseStart: endOf('l3') + sec(0.3),
  call001: startOf('l4') - sec(0.3),
  run: startOf('l5'),
  palitoUp: startOf('l6') - sec(0.5),
  shock2: startOf('l7'),
  shock2End: endOf('l7') + sec(0.2),
  twitchStart: startOf('l9') - sec(0.5),
  irisStart: endOf('l9') + sec(0.1),
};
export const EP19_THUMBNAIL_FRAME = T.shock1 + sec(0.5);

const FLOOR = BANK.floorY;
const BOLOTA = {x: 330, runX: 560};
const PALITO_X = 890;

export const Episode19: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP19_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  // painel: 846 → 847 → time-lapse até 999 → 001
  const lapsing = frame >= T.lapseStart && frame < T.call001;
  const calling =
    frame >= T.call001
      ? '001'
      : lapsing
        ? String(Math.round(kf(frame, [T.lapseStart, T.call001 - 4], [848, 999], Easing.in(Easing.quad))))
        : frame >= T.call847
          ? '847'
          : '846';
  const callFlash = Math.max(
    frame >= T.call847 ? kf(frame, [T.call847, T.call847 + 15], [1, 0]) : 0,
    frame >= T.call001 ? kf(frame, [T.call001, T.call001 + 20], [1, 0]) : 0,
  );

  const shocked1 = frame >= T.shock1 && frame < T.shock1End;
  const shocked2 = frame >= T.shock2 && frame < T.shock2End;
  const shocked = shocked1 || shocked2;
  const bolotaX = kf(frame, [T.run, T.run + sec(0.5)], [BOLOTA.x, BOLOTA.runX], Easing.out(Easing.back(1.4)));
  const face = {x: bolotaX, y: 1130};
  const palitoRise = frame >= T.palitoUp ? spring({frame: frame - T.palitoUp, fps, config: MOTION.springBouncy}) : 0;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.call847 + sec(0.3), 'neutral'],
    [T.shock1, 'shocked'],
    [T.shock1End, 'annoyed'],
    [T.lapseStart + sec(0.6), 'sleeping'],
    [T.call001, 'shocked'],
    [T.run, 'happy'],
    [startOf('l6') + sec(1.6), 'neutral'],
    [startOf('l6') + sec(3), 'annoyed'],
    [T.shock2, 'shocked'],
    [T.shock2End, 'tired'],
    [endOf('l8'), 'annoyed'],
  ]);

  const zoom = thumbnail
    ? 1
    : frame < T.call847
      ? kf(frame, [0, T.call847], [1.35, 1])
      : frame < T.twitchStart
        ? Math.max(shockZoom(frame, T.shock1, T.shock1End, 1.4), shockZoom(frame, T.shock2, T.shock2End, 1.35))
        : finaleZoom(frame, T.twitchStart, T.irisStart);
  const shake = Math.max(shockShake(frame, T.shock1, T.shock1End), shockShake(frame, T.shock2, T.shock2End));

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: frame < T.palitoUp ? face.x + 120 : (face.x + PALITO_X) / 2, focusY: frame < T.call847 ? 900 : face.y - 60, shake}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['SENHA 001', 'CHAMANDO 847?!'] : null}
      overlayInThumbnail
      overlay={
        <ScreenCard
          frame={frame}
          fps={fps}
          start={sec(0.2)}
          end={T.call847}
          title="SUA SENHA"
          accent={COLORS.bankBlue}
          big={{text: '001'}}
          footer="Atendimento rápido!"
          top={1140}
        />
      }
    >
      <BankAgency calling={calling} window={frame >= T.call001 ? 5 : 3} flash={callFlash} />
      {frame >= T.palitoUp ? (
        <Palito
          x={PALITO_X}
          y={FLOOR + 380 * (1 - palitoRise)}
          scale={0.9}
          expression="happy"
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={-0.8}
          leftArm={frame >= startOf('l6') && frame < endOf('l6') ? 120 + 15 * Math.sin(frame / 3) : 20}
        />
      ) : null}
      <BankCounterFront />
      <ImpactLines frame={frame} start={T.shock1} end={T.shock1End} x={face.x} y={face.y} />
      <ImpactLines frame={frame} start={T.shock2} end={T.shock2End} x={face.x} y={face.y} />
      <Bolota
        x={bolotaX}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={frame >= T.palitoUp && frame < T.twitchStart && !shocked ? 0.8 : 0}
        lookY={frame < T.call847 ? 0.4 : frame < T.lapseStart ? -0.6 : 0}
        leftArm={shocked ? 160 : frame >= T.run && frame < startOf('l6') ? 160 : 15}
        rightArm={shocked ? 160 : frame < T.call847 ? 70 : frame >= T.run && frame < startOf('l6') ? 160 : 15}
        squash={breathe(frame, lapsing ? 20 : 10)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : lapsing ? 8 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
      {lapsing ? <Zzz frame={frame} x={bolotaX + 120} y={880} /> : null}
    </EpisodeShell>
  );
};
