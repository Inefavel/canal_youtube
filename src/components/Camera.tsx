import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {VIDEO} from '../config/tokens';

type CameraProps = {
  /** Zoom (1 = enquadramento normal). */
  zoom: number;
  /** Ponto focal no canvas (px) que fica no centro da tela quando zoom > 1. */
  focusX: number;
  focusY: number;
  /** Intensidade do tremor (px). */
  shake?: number;
  frame: number;
  children: React.ReactNode;
};

/** Câmera virtual: zoom em um ponto focal + tremor determinístico (seguro para render). */
export const Camera: React.FC<CameraProps> = ({zoom, focusX, focusY, shake = 0, frame, children}) => {
  const sx = shake > 0 ? (random(`cam-x-${frame}`) - 0.5) * 2 * shake : 0;
  const sy = shake > 0 ? (random(`cam-y-${frame}`) - 0.5) * 2 * shake : 0;
  // Move o ponto focal para o centro e aplica o zoom a partir dele.
  const tx = VIDEO.width / 2 - focusX;
  const ty = VIDEO.height / 2 - focusY;
  const blend = Math.min(1, Math.max(0, zoom - 1)); // em zoom 1 não desloca
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transformOrigin: `${focusX}px ${focusY}px`,
          transform: `translate(${tx * blend + sx}px, ${ty * blend + sy}px) scale(${zoom})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
