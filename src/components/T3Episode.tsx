import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Bolota, Palito} from '../characters';
import type {Expression} from '../characters';
import {COLORS, VIDEO} from '../config/tokens';
import {sec} from '../config/timing';
import {breathe, finaleZoom, shockShake, shockZoom, slideIn, wave} from './beats';
import {EpisodeShell, SPEAKERS} from './EpisodeShell';
import {kf, step} from './keyframes';
import {ScreenCard} from './ScreenCard';
import type {ScreenRow} from './ScreenCard';
import {buildTimeline} from './timeline';
import type {Dialogue, Timeline, VoicesFile} from './timeline';
import {ImpactLines} from './Transitions';
import {mouthAt} from '../lipsync/cues';

/**
 * Molde dos episódios da temporada 3 (recomendações do vidIQ):
 *  1. Gancho no frame 0: cartão do conflito já na tela, zoom no rosto em choque e SFX em `at: 0`.
 *  2. Pergunta final: cartela "E VOCÊ?" depois do bordão, antes da íris.
 * Cada episódio descreve só o que é dele (cenário, cartões, props); tempo, expressões,
 * braços, câmera, choque, tique e pergunta saem daqui.
 */

/** Momento do episódio: frame absoluto ou relativo ao início/fim de uma fala (s). */
export type Anchor = number | {line: string; edge?: 'start' | 'end'; offset?: number};
export type At = (a: Anchor) => number;

type CardContent = {
  title: string;
  accent: string;
  rows?: ScreenRow[];
  big?: {text: string; color?: string};
  footer?: string;
  progress?: number;
};

export type T3Card = {
  from: Anchor;
  to: Anchor;
  top?: number;
  /** Conteúdo; pode variar com o frame (contadores, tentativas…). */
  content: CardContent | ((frame: number, at: At) => CardContent);
};

export type T3Config = {
  dialogue: Dialogue;
  voices: VoicesFile;
  /** Cenário (dentro da câmera, atrás de tudo). */
  scene: (frame: number, at: At) => React.ReactNode;
  floorY: number;
  bolotaX: number;
  palitoX?: number;
  /** Quando o Palito entra (desliza 0,6 s antes). `null`: em cena desde o início. Omitido: não aparece. */
  palitoEnter?: Anchor | null;
  palitoScale?: number;
  /** Intervalos de choque do Bolota (além do gancho, que é automático). */
  shocks?: {from: Anchor; to: Anchor}[];
  /** Expressões do Bolota depois do gancho (o choque e o tique final são automáticos). */
  bolota: [Anchor, Expression][];
  palito?: [Anchor, Expression][];
  /** Braços do Bolota fora dos choques: [de, até, esquerdo, direito]. */
  bolotaArms?: [Anchor, Anchor, number, number][];
  palitoArm?: (frame: number, at: At) => number | null;
  bolotaLook?: [Anchor, number][];
  bolotaLookY?: [Anchor, number][];
  cards: T3Card[];
  /** Props entre o cenário e os personagens. */
  props?: (frame: number, at: At) => React.ReactNode;
  /** Props na frente dos personagens (ex.: balcão). */
  front?: (frame: number, at: At) => React.ReactNode;
  /** Camada fora da câmera, além dos cartões. */
  overlay?: (frame: number, at: At) => React.ReactNode;
  question: string;
  thumbnailText: [string, string];
  speakerNames?: Record<string, string>;
  focusDx?: number;
  hookZoom?: number;
};

export const makeT3Episode = (config: T3Config): {Episode: React.FC<{thumbnail?: boolean}>; TIMELINE: Timeline} => {
  const TIMELINE = buildTimeline(config.dialogue, config.voices, VIDEO.fps);
  const {startOf, endOf} = TIMELINE;
  const at: At = (a) => (typeof a === 'number' ? a : (a.edge === 'end' ? endOf(a.line) : startOf(a.line)) + sec(a.offset ?? 0));

  const lines = config.dialogue.lines;
  const first = lines[0].id;
  const last = lines[lines.length - 1].id;
  const hookEnd = endOf(first) + sec(0.2);
  const shocks = [{from: 0, to: hookEnd}, ...(config.shocks ?? []).map((s) => ({from: at(s.from), to: at(s.to)}))];
  const T = {
    twitchStart: startOf(last) - sec(0.5),
    question: endOf(last) + sec(0.3),
    irisStart: TIMELINE.durationInFrames - sec(0.5),
  };
  const palitoEnterFrame = config.palitoEnter === undefined ? null : config.palitoEnter === null ? 0 : at(config.palitoEnter) - sec(0.6);
  const palitoLines = lines.filter((l) => l.speaker === 'palito' && !l.offscreen).map((l) => l.id);
  const bolotaX = config.bolotaX;
  const palitoX = config.palitoX ?? 260;
  const face = {x: bolotaX, y: config.floorY - 340};

  const Episode: React.FC<{thumbnail?: boolean}> = ({thumbnail = false}) => {
    const current = useCurrentFrame();
    const frame = thumbnail ? sec(0.5) : current;
    const {fps} = useVideoConfig();
    const cues = TIMELINE.cuesBySpeaker;

    const shock = shocks.find((s) => frame >= s.from && frame < s.to);
    const twitching = frame >= T.twitchStart && frame < T.question;
    const palitoIn = palitoEnterFrame !== null && frame >= palitoEnterFrame;
    const enter = palitoEnterFrame ? slideIn(frame, palitoEnterFrame, fps) : {dx: 0, tilt: 0, progress: 1};

    const bolotaBase = step<Expression>(frame, [[0, 'neutral'], ...config.bolota.map(([a, e]) => [at(a), e] as [number, Expression])]);
    const bolotaExpression: Expression = shock ? 'shocked' : twitching ? 'annoyed' : bolotaBase;
    const palitoExpression = config.palito ? step<Expression>(frame, [[0, 'happy'], ...config.palito.map(([a, e]) => [at(a), e] as [number, Expression])]) : 'happy';

    const pose = (config.bolotaArms ?? []).find(([a, b]) => frame >= at(a) && frame < at(b));
    const arms = shock ? [160, 160] : pose ? [pose[2], pose[3]] : [15, 15];

    const speakingPalito = palitoLines.find((id) => frame >= startOf(id) && frame < endOf(id));
    const customArm = config.palitoArm?.(frame, at);
    const palitoArm = customArm ?? (speakingPalito ? wave(frame, startOf(speakingPalito), endOf(speakingPalito)) : 20);

    const defaultLook = palitoIn && !shock && !twitching ? (palitoX < bolotaX ? -0.8 : 0.8) : 0;
    const lookX = config.bolotaLook ? step(frame, [[0, 0], ...config.bolotaLook.map(([a, v]) => [at(a), v] as [number, number])]) : defaultLook;
    const lookY = config.bolotaLookY ? step(frame, [[0, 0], ...config.bolotaLookY.map(([a, v]) => [at(a), v] as [number, number])]) : 0;

    const zoom =
      frame < hookEnd
        ? kf(frame, [0, sec(0.6)], [config.hookZoom ?? 1.5, 1.15])
        : frame < T.twitchStart
          ? Math.max(1, ...shocks.slice(1).map((s) => shockZoom(frame, s.from, s.to, 1.4)))
          : frame < T.question
            ? finaleZoom(frame, T.twitchStart, T.question)
            : kf(frame, [T.question, T.question + sec(0.4)], [1.8, 1]);
    const shake = Math.max(0, ...shocks.map((s) => shockShake(frame, s.from, s.to)));

    return (
      <EpisodeShell
        dialogue={config.dialogue}
        timeline={TIMELINE}
        frame={frame}
        fps={fps}
        camera={{zoom, focusX: face.x + (config.focusDx ?? -60), focusY: face.y - 40, shake}}
        speakerColors={SPEAKERS.colors}
        speakerNames={{...SPEAKERS.names, ...config.speakerNames}}
        irisStart={T.irisStart}
        thumbnailText={thumbnail ? config.thumbnailText : null}
        overlayInThumbnail
        overlay={
          <>
            {config.overlay?.(frame, at)}
            {config.cards.map((c, i) => {
              const content = typeof c.content === 'function' ? c.content(frame, at) : c.content;
              return <ScreenCard key={i} frame={frame} fps={fps} start={at(c.from)} end={Math.min(at(c.to), T.question)} top={c.top ?? 620} {...content} />;
            })}
            <ScreenCard
              frame={frame}
              fps={fps}
              start={T.question}
              end={TIMELINE.durationInFrames + 10}
              title="E VOCÊ?"
              accent={COLORS.brandDeep}
              rows={[{text: config.question, bold: true}, {text: 'Responde nos comentários!', color: '#57606F'}]}
              top={620}
            />
          </>
        }
      >
        {config.scene(frame, at)}
        {config.props?.(frame, at)}
        {palitoIn ? (
          <Palito
            x={palitoX + (palitoX < bolotaX ? enter.dx : -enter.dx)}
            y={config.floorY}
            scale={config.palitoScale}
            expression={palitoExpression}
            mouth={mouthAt(cues.palito ?? [], frame)}
            lookX={palitoX < bolotaX ? 0.8 : -0.8}
            rightArm={palitoX < bolotaX ? palitoArm : 20}
            leftArm={palitoX < bolotaX ? 20 : palitoArm}
            tilt={enter.tilt}
          />
        ) : null}
        {shocks.map((s, i) => (
          <ImpactLines key={i} frame={frame} start={s.from} end={s.to} x={face.x} y={face.y} />
        ))}
        <Bolota
          x={bolotaX}
          y={config.floorY}
          expression={bolotaExpression}
          mouth={mouthAt(cues.bolota ?? [], frame)}
          lookX={lookX}
          lookY={lookY}
          leftArm={arms[0]}
          rightArm={arms[1]}
          squash={breathe(frame)}
          tilt={shock ? Math.sin(frame * 1.7) * 4 : 0}
          twitch={twitching ? 1 : 0}
        />
        {config.front?.(frame, at)}
      </EpisodeShell>
    );
  };
  return {Episode, TIMELINE};
};
