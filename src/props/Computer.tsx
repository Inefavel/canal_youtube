import React from 'react';
import {COLORS, FONTS} from '../config/tokens';

export type PasswordRule = {label: string; ok: boolean};

export type ComputerScreen =
  | {kind: 'login'}
  | {kind: 'rules'; rules: PasswordRule[]}
  | {kind: 'accepted'}
  | {kind: 'blocked'; flash: number}
  | {kind: 'call'; title: string; timer: string; tiles: {name: string; color: string; speaking: boolean; asleep?: boolean}[]}
  | {kind: 'captcha'; selected: number[]; status: 'pick' | 'wrong' | 'ok' | 'robot'; attempt: number}
  | {kind: 'player'; title: string; subtitle: string; progress: number; paused: boolean; souffle: number};

/** Quadrados da grade do captcha que têm semáforo inteiro (true) ou só um pedacinho de poste ('pole'). */
const CAPTCHA_TILES: (boolean | 'pole')[] = [true, false, false, false, true, true, false, true, 'pole'];

const TrafficLight: React.FC<{partial?: boolean}> = ({partial = false}) => (
  <svg width="100%" height="100%" viewBox="0 0 60 60">
    <rect x={27} y={partial ? 0 : 30} width={6} height={partial ? 60 : 30} fill="#57606F" />
    {partial ? null : (
      <>
        <rect x={19} y={4} width={22} height={34} rx={5} fill="#2F3542" />
        <circle cx={30} cy={11} r={4} fill="#FF4757" />
        <circle cx={30} cy={21} r={4} fill="#FFA502" />
        <circle cx={30} cy={31} r={4} fill="#2ED573" />
      </>
    )}
  </svg>
);

type ComputerProps = {
  /** Base (centro) do monitor, apoiada na mesa. */
  x: number;
  y: number;
  screen: ComputerScreen;
  /** Quantos caracteres (bolinhas) aparecem no campo de senha. */
  typed: number;
  /** Cursor piscando no campo de senha. */
  cursorOn: boolean;
  shake?: number;
};

const W = 580;
const H = 480;
const SCREEN = {x: 22, y: 22, w: W - 44, h: 370};

const Header: React.FC<{color: string; title: string}> = ({color, title}) => (
  <div style={{background: color, color: '#fff', fontFamily: FONTS.display, fontSize: 30, padding: '10px 16px'}}>{title}</div>
);

export const Computer: React.FC<ComputerProps> = ({x, y, screen, typed, cursorOn, shake = 0}) => {
  const field = (
    <div
      style={{
        margin: '10px 14px',
        height: 56,
        border: `3px solid ${COLORS.ink}`,
        borderRadius: 8,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        fontFamily: FONTS.display,
        fontSize: 36,
        letterSpacing: 6,
        color: COLORS.ink,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}
    >
      {'•'.repeat(Math.min(typed, 16))}
      <span style={{opacity: cursorOn ? 1 : 0, marginLeft: 2}}>|</span>
    </div>
  );

  let body: React.ReactNode;
  switch (screen.kind) {
    case 'login':
      body = (
        <>
          <Header color={COLORS.bankBlue} title="BANCO SEGURO" />
          <div style={{fontFamily: FONTS.body, fontSize: 30, margin: '24px 16px 0', color: COLORS.ink}}>Digite sua senha:</div>
          {field}
        </>
      );
      break;
    case 'rules':
      body = (
        <>
          <Header color={COLORS.bankBlue} title="CRIE UMA NOVA SENHA" />
          <div style={{padding: '10px 16px', fontFamily: FONTS.body, fontSize: 29, lineHeight: 1.3, color: COLORS.ink, fontWeight: 600}}>
            {screen.rules.map((r) => (
              <div key={r.label} style={{display: 'flex', gap: 8}}>
                <span style={{color: r.ok ? COLORS.ok : COLORS.danger, fontFamily: FONTS.display, width: 30}}>{r.ok ? '✓' : '✗'}</span>
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        </>
      );
      break;
    case 'accepted':
      body = (
        <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#E9FBF1'}}>
          <div style={{fontFamily: FONTS.display, fontSize: 110, color: COLORS.ok, lineHeight: 1}}>✓</div>
          <div style={{fontFamily: FONTS.display, fontSize: 46, color: COLORS.ok}}>SENHA ACEITA!</div>
        </div>
      );
      break;
    case 'blocked':
      body = (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: screen.flash > 0.5 ? COLORS.danger : '#7A1F35',
            color: '#fff',
            fontFamily: FONTS.display,
          }}
        >
          <div style={{fontSize: 90, lineHeight: 1}}>⚠</div>
          <div style={{fontSize: 50, lineHeight: 1.05}}>CONTA</div>
          <div style={{fontSize: 50, lineHeight: 1.05}}>BLOQUEADA</div>
          <div style={{fontFamily: FONTS.body, fontSize: 24, marginTop: 10}}>Tente novamente em 72 horas</div>
        </div>
      );
      break;
    case 'call':
      body = (
        <div style={{height: '100%', background: '#1E1B2E', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', color: '#fff', fontFamily: FONTS.display, fontSize: 24, padding: '10px 16px'}}>
            <span>{screen.title}</span>
            <span style={{color: COLORS.danger}}>● {screen.timer}</span>
          </div>
          <div style={{flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 12px 12px'}}>
            {screen.tiles.map((t) => (
              <div
                key={t.name}
                style={{
                  background: '#2F3542',
                  borderRadius: 12,
                  border: `5px solid ${t.speaking ? '#2ED573' : '#2F3542'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontFamily: FONTS.display,
                  fontSize: 22,
                }}
              >
                <div style={{width: 64, height: 64, borderRadius: 32, background: t.color, border: '4px solid #fff', marginBottom: 6, opacity: t.asleep ? 0.5 : 1}} />
                {t.asleep ? `${t.name} (zzz)` : t.name}
              </div>
            ))}
          </div>
        </div>
      );
      break;
    case 'captcha':
      body =
        screen.status === 'robot' ? (
          <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: COLORS.danger, color: '#fff', fontFamily: FONTS.display, textAlign: 'center'}}>
            <div style={{fontSize: 80, lineHeight: 1}}>⚠</div>
            <div style={{fontSize: 44, lineHeight: 1.05}}>ROBÔ</div>
            <div style={{fontSize: 44, lineHeight: 1.05}}>DETECTADO</div>
            <div style={{fontFamily: FONTS.body, fontSize: 24, marginTop: 8}}>Acesso bloqueado</div>
          </div>
        ) : (
          <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <div style={{background: COLORS.bankBlue, color: '#fff', fontFamily: FONTS.display, fontSize: 24, padding: '8px 14px', lineHeight: 1.1}}>
              Selecione todos os
              <br />
              SEMÁFOROS
            </div>
            <div style={{flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, padding: 8, background: '#DFE4EA'}}>
              {CAPTCHA_TILES.map((t, i) => {
                const sel = screen.selected.includes(i);
                return (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      background: t ? '#9AD8FF' : i % 2 === 0 ? '#A4B0BE' : '#CED6E0',
                      border: sel ? `5px solid ${COLORS.bankBlue}` : '5px solid transparent',
                      transform: sel ? 'scale(0.9)' : 'none',
                    }}
                  >
                    {t ? <TrafficLight partial={t === 'pole'} /> : null}
                    {sel ? (
                      <div style={{position: 'absolute', left: -4, top: -4, width: 26, height: 26, borderRadius: 13, background: COLORS.bankBlue, color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.display}}>
                        ✓
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 22,
                padding: '6px 12px',
                textAlign: 'center',
                color: '#fff',
                background: screen.status === 'wrong' ? COLORS.danger : screen.status === 'ok' ? COLORS.ok : '#57606F',
              }}
            >
              {screen.status === 'wrong' ? `✗ Tente novamente (${screen.attempt})` : screen.status === 'ok' ? '✓ Verificado em 0,2 s' : 'Não sou um robô'}
            </div>
          </div>
        );
      break;
    case 'player': {
      // suflê: 1 = alto e dourado, 0 = murcho
      const h = 40 + 60 * screen.souffle;
      body = (
        <div style={{height: '100%', background: '#111', display: 'flex', flexDirection: 'column'}}>
          <div style={{flex: 1, position: 'relative', background: 'linear-gradient(#3B2F2F, #1B1B1B)'}}>
            <svg width="100%" height="100%" viewBox="0 0 536 280" style={{position: 'absolute'}}>
              <rect x={168} y={150} width={200} height={110} rx={14} fill="#F1F2F6" stroke="#000" strokeWidth={6} />
              <ellipse cx={268} cy={150 - h / 2 + 10} rx={95} ry={h / 2 + 4} fill="#F7C873" stroke="#000" strokeWidth={6} />
              <rect x={168} y={150} width={200} height={20} fill="#F1F2F6" />
              {screen.paused ? (
                <g>
                  <circle cx={268} cy={110} r={46} fill="rgba(0,0,0,0.55)" />
                  <path d="M 252 86 L 252 134 L 292 110 Z" fill="#fff" />
                </g>
              ) : null}
            </svg>
            <div style={{position: 'absolute', left: 14, top: 10, color: '#fff', fontFamily: FONTS.display, fontSize: 26, lineHeight: 1.1}}>
              {screen.title}
              <div style={{fontFamily: FONTS.body, fontSize: 18, opacity: 0.8}}>{screen.subtitle}</div>
            </div>
          </div>
          <div style={{height: 14, background: '#444', margin: '10px 14px'}}>
            <div style={{width: `${Math.round(screen.progress * 100)}%`, height: '100%', background: COLORS.danger}} />
          </div>
        </div>
      );
      break;
    }
    default: {
      const exhaustive: never = screen;
      return exhaustive;
    }
  }

  return (
    <div style={{position: 'absolute', left: x - W / 2 + shake, top: y - H, width: W, height: H}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
        <rect x={W / 2 - 30} y={SCREEN.y + SCREEN.h + 20} width={60} height={60} fill={COLORS.monitor} stroke={COLORS.ink} strokeWidth={8} />
        <rect x={W / 2 - 110} y={H - 26} width={220} height={22} rx={10} fill={COLORS.monitor} stroke={COLORS.ink} strokeWidth={8} />
        <rect x={6} y={6} width={W - 12} height={SCREEN.h + 32} rx={22} fill={COLORS.monitor} stroke={COLORS.ink} strokeWidth={10} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: SCREEN.x,
          top: SCREEN.y,
          width: SCREEN.w,
          height: SCREEN.h,
          background: COLORS.screenBg,
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {body}
      </div>
    </div>
  );
};

export const COMPUTER = {width: W, height: H} as const;
