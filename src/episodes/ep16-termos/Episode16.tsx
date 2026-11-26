import React from 'react';
import {Easing, useCurrentFrame, useVideoConfig} from 'remotion';
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
import {Computer} from '../../props/Computer';
import {HomeOffice, HOME_OFFICE} from '../../scenes/HomeOffice';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP16 — "Termos de Uso" (temporada 2)
 * Gancho: o app pede para aceitar 84 páginas de termos.
 * Desenvolvimento: o Bolota lê tudo, página por página, até a madrugada.
 * Virada: última cláusula: "ao ler, você aceita a assinatura anual". O Palito aceitou sem ler e saiu de graça.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

const TOTAL_PAGES = 84;

export const T = {
  lapseStart: endOf('l2') + sec(0.2),
  palitoEnter: startOf('l3') - sec(0.6),
  lastPage: startOf('l4'),
  shock: startOf('l6'),
  shockEnd: endOf('l6') + sec(0.3),
  twitchStart: startOf('l8') - sec(0.5),
  irisStart: endOf('l8') + sec(0.1),
};
export const EP16_THUMBNAIL_FRAME = T.lapseStart + sec(2);

const FLOOR = HOME_OFFICE.floorY;
const BOLOTA = {x: 500, face: {x: 500, y: 1130}};
const COMPUTER_POS = {x: 790, y: HOME_OFFICE.deskTopY + 10};

export const Episode16: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP16_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const page = frame < T.lastPage ? Math.max(1, Math.round(kf(frame, [T.lapseStart, T.palitoEnter], [1, TOTAL_PAGES - 1], Easing.in(Easing.quad)))) : TOTAL_PAGES;
  const lapsing = frame >= T.lapseStart && frame < T.palitoEnter;
  const shocked = frame >= T.shock && frame < T.shockEnd;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.lapseStart, 'neutral'],
    [T.lapseStart + sec(1.5), 'tired'],
    [startOf('l4'), 'neutral'],
    [startOf('l5') + sec(1.2), 'annoyed'],
    [T.shock, 'shocked'],
    [T.shockEnd, 'tired'],
    [startOf('l7') + sec(1), 'annoyed'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);

  const zoom =
    frame < T.lapseStart
      ? kf(frame, [0, T.lapseStart], [1.45, 1.1])
      : frame < T.twitchStart
        ? Math.max(shockZoom(frame, T.shock, T.shockEnd, 1.45), lapsing ? kf(frame, [T.lapseStart, T.palitoEnter], [1.1, 1.35]) : 1)
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
      thumbnailText={thumbnail ? ['84 PÁGINAS', 'DE TERMOS?!'] : null}
      overlayInThumbnail
      overlay={
        <>
          <ScreenCard
            frame={frame}
            fps={fps}
            start={sec(0.3)}
            end={startOf('l5')}
            title="TERMOS DE USO"
            accent="#57606F"
            big={{text: `Página ${page} de ${TOTAL_PAGES}`}}
            progress={page / TOTAL_PAGES}
            footer={lapsing ? 'Lendo com atenção...' : 'Role até o fim para continuar'}
            top={600}
          />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={startOf('l5') + sec(1.4)}
            end={T.twitchStart}
            title="ASSINATURA CONTRATADA"
            accent={COLORS.danger}
            rows={[{text: 'Plano Anual Premium', bold: true}, {text: '12x de R$ 74,99', color: COLORS.danger, bold: true}]}
            footer="Obrigado por ler os termos!"
            top={600}
          />
        </>
      }
    >
      <HomeOffice />
      <Computer x={COMPUTER_POS.x} y={COMPUTER_POS.y} screen={{kind: 'terms', page, total: TOTAL_PAGES, finalClause: frame >= T.lastPage}} typed={0} cursorOn={false} />
      {frame >= T.palitoEnter ? (
        <Palito
          x={170 + enter.dx}
          y={FLOOR}
          expression={frame >= T.shock && frame < startOf('l7') ? 'neutral' : 'happy'}
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          rightArm={wave(frame, startOf('l7'), endOf('l7'))}
          tilt={enter.tilt}
        />
      ) : null}
      <ImpactLines frame={frame} start={T.shock} end={T.shockEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={step(frame, [[0, 0], [T.lapseStart, 0.8], [startOf('l3') + sec(0.4), -0.8], [startOf('l4') + sec(0.8), 0.8], [T.shock, 0], [startOf('l7'), -0.8], [T.twitchStart, 0]])}
        lookY={lapsing ? -0.2 : 0}
        leftArm={shocked ? 160 : lapsing ? 110 : 15}
        rightArm={shocked ? 160 : lapsing ? 110 + 6 * Math.sin(frame) : 15}
        squash={breathe(frame)}
        tilt={shocked ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
    </EpisodeShell>
  );
};
