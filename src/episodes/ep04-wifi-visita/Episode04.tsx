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
import {Router} from '../../props/Router';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';

/**
 * EP04 — "Wi-Fi da Visita"
 * Gancho: Palito chega pedindo a senha do Wi-Fi.
 * Desenvolvimento: a senha tem 16 caracteres; Bolota dita, Palito erra 3 vezes.
 * Virada: conecta… e o Palito tinha 5G ilimitado.
 */
const dialogue = dialogueJson as Dialogue;
export const TIMELINE = buildTimeline(dialogue, voicesJson as VoicesFile, VIDEO.fps);
const {startOf, endOf} = TIMELINE;

const PASSWORD = 'x7K@9QZ!mW#4vL0$';

export const T = {
  passwordCard: startOf('l3') - sec(0.2),
  attemptsStart: endOf('l4') + sec(0.3),
  shout: startOf('l5'),
  shoutEnd: endOf('l5') + sec(0.2),
  connected: startOf('l6') - sec(0.5),
  fiveG: startOf('l6') + sec(1.6),
  twitchStart: startOf('l7') - sec(0.5),
  irisStart: endOf('l7') + sec(0.1),
} as const;
const FAILS = [1.0, 2.2, 3.4].map((s) => endOf('l4') + sec(s));
export const EP04_THUMBNAIL_FRAME = T.shout + sec(0.4);

const FLOOR = KITCHEN.floorY;
const BOLOTA = {x: 640, face: {x: 640, y: 1130}};
const PALITO_X = 230;

export const Episode04: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
  const current = useCurrentFrame();
  const frame = thumbnail ? EP04_THUMBNAIL_FRAME : current;
  const {fps} = useVideoConfig();
  const cues = TIMELINE.cuesBySpeaker;

  const failCount = FAILS.filter((f) => frame >= f).length;
  const typingPhone = frame >= T.attemptsStart && frame < T.connected;
  const shouting = frame >= T.shout && frame < T.shoutEnd;

  const bolotaExpression = step<Expression>(frame, [
    [0, 'tired'],
    [T.attemptsStart, 'tired'],
    [FAILS[1], 'annoyed'],
    [T.shout, 'shocked'],
    [T.shoutEnd, 'annoyed'],
    [T.connected, 'happy'],
    [T.fiveG, 'shocked'],
    [T.fiveG + sec(1), 'annoyed'],
  ]);
  const palitoExpression = step<Expression>(frame, [
    [0, 'happy'],
    [FAILS[0], 'neutral'],
    [T.shout, 'shocked'],
    [T.shoutEnd, 'neutral'],
    [T.connected, 'happy'],
  ]);
  const enter = slideIn(frame, 0, fps);
  const phoneArm = typingPhone ? 115 + 10 * Math.sin(frame * 1.4) : 20;

  const zoom =
    frame < T.passwordCard
      ? kf(frame, [0, T.passwordCard], [1.45, 1])
      : frame < T.twitchStart
        ? shockZoom(frame, T.shout, T.shoutEnd, 1.4)
        : finaleZoom(frame, T.twitchStart, T.irisStart);

  return (
    <EpisodeShell
      dialogue={dialogue}
      timeline={TIMELINE}
      frame={frame}
      fps={fps}
      camera={{zoom, focusX: (BOLOTA.x + PALITO_X) / 2 + (frame >= T.twitchStart ? 205 : 0), focusY: BOLOTA.face.y, shake: shockShake(frame, T.shout, T.shoutEnd)}}
      speakerColors={SPEAKERS.colors}
      speakerNames={SPEAKERS.names}
      irisStart={T.irisStart}
      thumbnailText={thumbnail ? ['16 LETRAS', 'DE SENHA?!'] : null}
      overlay={
        <>
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.passwordCard}
            end={T.attemptsStart}
            title="ETIQUETA DO ROTEADOR"
            accent={COLORS.ink}
            rows={[{text: 'Rede: CASA_DO_BOLOTA'}, {text: 'Senha:'}]}
            big={{text: PASSWORD, color: COLORS.bankBlue}}
            top={620}
          />
          <ScreenCard
            frame={frame}
            fps={fps}
            start={T.attemptsStart}
            end={T.connected + sec(1.4)}
            title="Wi-Fi · CASA_DO_BOLOTA"
            accent={frame >= T.connected ? COLORS.ok : COLORS.danger}
            rows={
              frame >= T.connected
                ? [{text: '✓ Conectado', color: COLORS.ok, bold: true}]
                : failCount > 0
                  ? [{text: `✗ Senha incorreta (${failCount})`, color: COLORS.danger, bold: true}, {text: 'x7K@9QZ!mW#4vLO$', color: '#57606F'}]
                  : [{text: 'Digitando...'}]
            }
            top={620}
          />
        </>
      }
    >
      <Kitchen />
      <Router x={850} y={KITCHEN.counterTopY + 10} frame={frame} blinkFast={frame >= T.connected} />
      <Palito
        x={PALITO_X + enter.dx}
        y={FLOOR}
        expression={palitoExpression}
        mouth={mouthAt(cues.palito ?? [], frame)}
        lookX={0.8}
        lookY={typingPhone ? 0.5 : 0}
        rightArm={typingPhone ? phoneArm : wave(frame, startOf('l1'), endOf('l1'))}
        tilt={enter.tilt}
      />
      {typingPhone ? (
        <div style={{position: 'absolute', left: PALITO_X + 120, top: 1000, width: 60, height: 100, borderRadius: 12, background: COLORS.monitor, border: `6px solid ${COLORS.ink}`}} />
      ) : null}
      <ImpactLines frame={frame} start={T.shout} end={T.shoutEnd} x={BOLOTA.face.x} y={BOLOTA.face.y} />
      <Bolota
        x={BOLOTA.x}
        y={FLOOR}
        expression={bolotaExpression}
        mouth={mouthAt(cues.bolota ?? [], frame)}
        lookX={step(frame, [[0, -0.8], [T.passwordCard, 0.7], [T.attemptsStart, -0.8], [T.twitchStart, 0]])}
        leftArm={shouting ? 160 : 15}
        rightArm={shouting ? 160 : frame >= T.passwordCard && frame < T.attemptsStart ? 100 : 15}
        squash={breathe(frame)}
        tilt={shouting ? Math.sin(frame * 1.7) * 4 : 0}
        twitch={frame >= T.twitchStart && frame < T.irisStart ? 1 : 0}
      />
      {frame >= T.fiveG && frame < T.twitchStart ? (
        <div
          style={{
            position: 'absolute',
            left: PALITO_X - 40,
            top: 610,
            background: '#fff',
            border: `6px solid ${COLORS.ink}`,
            borderRadius: 24,
            padding: '8px 20px',
            fontFamily: FONTS.display,
            fontSize: 44,
            color: COLORS.ink,
          }}
        >
          5G ▮▮▮▮
        </div>
      ) : null}
    </EpisodeShell>
  );
};
