import React from 'react';
import {spring} from 'remotion';
import {COLORS, FONTS, SAFE_AREA} from '../config/tokens';

/** A notificação desce até logo abaixo da área das legendas. */
const NOTIFICATION_TOP = SAFE_AREA.top + 330;

type PhoneNotificationProps = {
  frame: number;
  fps: number;
  start: number;
  end: number;
  app: string;
  title: string;
  body: string;
  /** Posição final do topo do cartão (padrão: logo abaixo das legendas). */
  top?: number;
};

/** Notificação de celular que desliza de cima (fora da câmera, sempre legível). */
export const PhoneNotification: React.FC<PhoneNotificationProps> = ({frame, fps, start, end, app, title, body, top = NOTIFICATION_TOP}) => {
  if (frame < start || frame >= end) {
    return null;
  }
  const inP = spring({frame: frame - start, fps, config: {damping: 14, stiffness: 180, mass: 0.7}});
  const outP = spring({frame: frame - (end - 10), fps, config: {damping: 20, stiffness: 200}});
  const y = top - 260 + 260 * inP - 300 * outP;
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: y,
        background: 'rgba(255,255,255,0.97)',
        border: `7px solid ${COLORS.ink}`,
        borderRadius: 36,
        padding: '22px 30px',
        boxShadow: `0 12px 0 ${COLORS.ink}`,
        transform: `rotate(${Math.sin(frame * 3) * 1.2}deg)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONTS.body, fontSize: 30, color: '#57606F', fontWeight: 700}}>
        <div style={{width: 40, height: 40, borderRadius: 10, background: COLORS.danger}} />
        {app} · agora
      </div>
      <div style={{fontFamily: FONTS.display, fontSize: 52, color: COLORS.ink, marginTop: 8}}>{title}</div>
      <div style={{fontFamily: FONTS.body, fontSize: 38, color: COLORS.ink, marginTop: 4}}>{body}</div>
    </div>
  );
};
