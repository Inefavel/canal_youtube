import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../../characters';
import type {Expression} from '../../characters';
import {COLORS, VIDEO} from '../../config/tokens';
import {sec} from '../../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, slideIn} from '../../components/beats';
import {EpisodeShell, SPEAKERS} from '../../components/EpisodeShell';
import {kf, step} from '../../components/keyframes';
import {buildTimeline} from '../../components/timeline';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {ImpactLines} from '../../components/Transitions';
import {mouthAt} from '../../lipsync/cues';
import {HomeOffice, HOME_OFFICE} from '../../scenes/HomeOffice';
import {Computer} from '../../props/Computer';
import type {ComputerScreen} from '../../props/Computer';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP12 — "O Captcha" (temporada 2)
 * Gancho: "Só falta provar que não sou um robô. Fácil."
 * Desenvolvimento: 7 tentativas erradas nos semáforos ("esse pedacinho de poste conta?").
 * Virada: o Palito resolve em 0,2 s e o site o bloqueia por ser rápido demais para um humano.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

const ATTEMPT_GAP = sec(0.45);
// Seleções erradas diferentes a cada tentativa (o quadrado 8 é o "pedacinho de poste").
const WRONG_PICKS = [[0, 4], [0, 4, 5, 8], [0, 1, 4, 5, 7], [4, 5, 7, 8], [0, 4, 5, 7, 8], [0, 3, 4, 5, 7], [0, 4, 5, 6, 7, 8]];

export const T = {
  captcha: startOf('l2') - sec(0.3),
  attemptsStart: endOf('l2') + sec(0.3),
  doubt: startOf('l3'),
  doubtEnd: endOf('l3') + sec(0.2),
  palitoEnter: startOf('l4') - sec(0.6),
  palitoClick: endOf('l4') + sec(0.3),
  verified: endOf('l4') + sec(0.6),
  robot: startOf('l6'),
  palitoShock: startOf('l7'),
  twitchStart: startOf('l8') - sec(0.5),
  irisStart: endOf('l8') + sec(0.1),
};
export const EP12_THUMBNAIL_FRAME = T.doubt + sec(0.5);

const FLOOR = HOME_OFFICE.floorY;
const BOLOTA = {x: 500, face: {x: 500, y: 1130}};
const COMPUTER_POS = {x: 790, y: HOME_OFFICE.deskTopY + 10};
const PALITO = {start: 170, click: 330};

export const Episode12: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP12_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  // tentativas: cada uma seleciona, e no fim do intervalo vem "tente novamente"
  const attemptIdx = Math.floor((frame - T.attemptsStart) / ATTEMPT_GAP);
  const inAttempts = frame >= T.attemptsStart && attemptIdx < WRONG_PICKS.length;
  const attempt = Math.max(0, Math.min(WRONG_PICKS.length, attemptIdx + 1));
  const lastWrong = frame >= T.attemptsStart && frame < T.palitoClick;
  const flashWrong = inAttempts && (frame - T.attemptsStart) % ATTEMPT_GAP > ATTEMPT_GAP * 0.55;

  const screen: ComputerScreen =
    frame < T.captcha
      ? {kind: 'login'}
      : frame >= T.robot
        ? {kind: 'captcha', selected: [], status: 'robot', attempt}
        : frame >= T.verified
          ? {kind: 'captcha', selected: [0, 4, 5, 7], status: 'ok', attempt}
          : frame >= T.palitoClick
            ? {kind: 'captcha', selected: [0, 4, 5, 7].slice(0, Math.min(4, Math.floor((frame - T.palitoClick) / 2) + 1)), status: 'pick', attempt}
            : inAttempts
              ? {kind: 'captcha', selected: WRONG_PICKS[attemptIdx], status: flashWrong ? 'wrong' : 'pick', attempt}
              : lastWrong
                ? {kind: 'captcha', selected: WRONG_PICKS[WRONG_PICKS.length - 1], status: 'wrong', attempt: WRONG_PICKS.length}
                : {kind: 'captcha', selected: [], status: 'pick', attempt};

  const doubting = frame >= T.doubt && frame < T.doubtEnd;
  const robotShock = frame >= T.robot && frame < T.robot + sec(1);
  const clicking = (inAttempts || (frame >= T.captcha && frame < T.attemptsStart)) && frame < T.palitoEnter;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.captcha, 'neutral'],
    [T.attemptsStart + ATTEMPT_GAP * 3, 'annoyed'],
    [T.doubt, 'shocked'],
    [T.doubtEnd, 'tired'],
    [T.verified, 'shocked'],
    [T.verified + sec(0.6), 'neutral'],
    [T.robot, 'shocked'],
    [T.robot + sec(1), 'tired'],
    [T.palitoShock + sec(0.8), 'annoyed'],
  ]);
  const palitoExpression = step<Expression>(frame, [
    [0, 'happy'],
    [T.robot, 'shocked'],
    [endOf('l7'), 'neutral'],
  ]);
  const enter = slideIn(frame, T.palitoEnter, fps);
  const palitoX = (frame >= T.palitoClick - sec(0.2) && frame < T.robot ? kf(frame, [T.palitoClick - sec(0.2), T.palitoClick], [PALITO.start, PALITO.click]) : PALITO.start) + enter.dx;

  const zoom =
    frame < T.captcha
      ? kf(frame, [0, T.captcha], [1.5, 1])
      : frame < T.twitchStart
        ? Math.max(shockZoom(frame, T.doubt, T.doubtEnd, 1.4), shockZoom(frame, T.robot, T.robot + sec(1), 1.25))
        : finaleZoom(frame, T.twitchStart, T.irisStart);
  const shake = Math.max(shockShake(frame, T.doubt, T.doubtEnd), robotShock ? 10 : 0);
  const redOverlay = frame >= T.robot ? kf(frame, [T.robot, T.robot + sec(2)], [0.3, 0]) : 0;

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: BOLOTA.face.x + 60, focusY: BOLOTA.face.y, shake}}
      speakerColors={SPEAKERS.colors}
      speakerNames={{...SPEAKERS.names, site: 'SITE'}}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['CAPTCHA', '7 VEZES?!'] : null}
      overlay={redOverlay > 0 ? <div style={{position: 'absolute', inset: 0, background: COLORS.danger, opacity: redOverlay}} /> : null}
    >
      <HomeOffice />
      <Computer x={COMPUTER_POS.x} y={COMPUTER_POS.y} screen={screen} typed={4} cursorOn={false} />
      {frame >= T.palitoEnter ? (
        <Palito
          x={palitoX}
          y={FLOOR}
          expression={palitoExpression}
          mouth={mouthAt(cues.palito ?? [], frame)}
          lookX={0.8}
          rightArm={frame >= T.palitoClick - sec(0.2) && frame < T.verified + sec(0.3) ? 95 + 8 * Math.sin(frame * 2) : frame >= startOf('l4') && frame < endOf('l4') ? 150 : 20}
          tilt={enter.tilt}
        />
      ) : null}
      <ImpactLines frame={frame} start={T.doubt} end={T.doubtEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={step(frame, [[0, 0], [T.captcha, 0.8], [T.doubt, 0], [T.doubtEnd, 0.8], [T.palitoShock, -0.8], [T.twitchStart, 0]])}
        lookY={clicking ? -0.3 : 0}
        leftArm={doubting ? 160 : clicking ? 115 + 12 * Math.sin(frame * 1.4) : 15}
        rightArm={doubting ? 160 : clicking ? 115 + 12 * Math.sin(frame * 1.4 + 1.6) : 15}
        squash={breathe(frame)}
        tilt={doubting ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
    </EpisodeShell>
  );
};
