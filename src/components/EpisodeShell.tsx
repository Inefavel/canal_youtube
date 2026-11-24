import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COLORS, FONTS} from '../config/tokens';
import {Camera} from './Camera';
import {Captions} from './Captions';
import {EpisodeAudio} from './EpisodeAudio';
import type {Dialogue, Timeline} from './timeline';
import {IrisOut} from './Transitions';

type EpisodeShellProps = {
  dialogue: Dialogue;
  timeline: Timeline;
  frame: number;
  fps: number;
  camera: {zoom: number; focusX: number; focusY: number; shake?: number};
  speakerColors: Record<string, string>;
  speakerNames: Record<string, string>;
  /** Frame em que começa o fechamento em íris (termina no fim do episódio). */
  irisStart: number;
  /** Conteúdo dentro da câmera (cenário, personagens, props). */
  children: React.ReactNode;
  /** Camada fora da câmera (notificações, cartões, contadores), abaixo das legendas. */
  overlay?: React.ReactNode;
  /** Modo thumbnail: sem legenda e sem áudio, com este texto grande no topo. */
  thumbnailText?: string[] | null;
  /** Mostra a camada `overlay` também na thumbnail. */
  overlayInThumbnail?: boolean;
};

/** Estrutura comum dos episódios: câmera, camadas, legendas, áudio, íris e thumbnail. */
export const EpisodeShell: React.FC<EpisodeShellProps> = ({
  dialogue,
  timeline,
  frame,
  fps,
  camera,
  speakerColors,
  speakerNames,
  irisStart,
  children,
  overlay,
  thumbnailText = null,
  overlayInThumbnail = false,
}) => (
  <AbsoluteFill style={{backgroundColor: COLORS.paper}}>
    <Camera zoom={camera.zoom} focusX={camera.focusX} focusY={camera.focusY} shake={camera.shake ?? 0} frame={frame}>
      {children}
    </Camera>
    {!thumbnailText || overlayInThumbnail ? overlay : null}
    <IrisOut frame={frame} start={irisStart} end={timeline.durationInFrames} x={540} y={900} />
    {thumbnailText ? (
      <div
        style={{
          position: 'absolute',
          top: 240,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONTS.display,
          // encolhe para a linha mais longa caber na largura (≈0,64 em por caractere)
          fontSize: Math.min(170, Math.floor(980 / (Math.max(...thumbnailText.map((t) => t.length)) * 0.64))),
          lineHeight: 0.95,
          color: COLORS.captionHighlight,
          WebkitTextStroke: `26px ${COLORS.ink}`,
          paintOrder: 'stroke fill',
          transform: 'rotate(-6deg)',
        }}
      >
        {thumbnailText.map((t, i) => (
          <div key={i}>{t}</div>
        ))}
      </div>
    ) : (
      <>
        <Captions lines={timeline.lines} frame={frame} fps={fps} speakerColors={speakerColors} speakerNames={speakerNames} />
        <EpisodeAudio dialogue={dialogue} timeline={timeline} />
      </>
    )}
  </AbsoluteFill>
);

/** Nomes e cores padrão dos falantes do canal. */
export const SPEAKERS = {
  colors: {
    bolota: COLORS.bolotaTag,
    palito: COLORS.palitoTag,
    maquina: COLORS.machineScreen,
    site: COLORS.bankBlue,
    celular: COLORS.danger,
    chefe: '#57606F',
  } as Record<string, string>,
  names: {
    bolota: 'BOLOTA',
    palito: 'PALITO',
    maquina: 'MÁQUINA',
    site: 'BANCO',
    celular: 'CELULAR',
    chefe: 'CHEFE',
  } as Record<string, string>,
};
