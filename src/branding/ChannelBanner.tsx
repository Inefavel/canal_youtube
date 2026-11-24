import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Bolota, Palito} from '../characters';
import {COLORS, FONTS} from '../config/tokens';

export const BANNER = {width: 2560, height: 1440} as const;

/** Área visível em todos os dispositivos (diretriz do YouTube): 1546x423 centralizada. */
const SAFE = {width: 1546, height: 423, x: (2560 - 1546) / 2, y: (1440 - 423) / 2};

/**
 * Banner do canal (2560x1440). Texto e rostos dentro da área segura;
 * o restante é fundo decorativo, visível só em TVs e telas largas.
 */
export const ChannelBanner: React.FC<{showSafeArea?: boolean}> = ({showSafeArea = false}) => {
  const dots = Array.from({length: 26 * 15}, (_, i) => ({x: (i % 26) * 100 + ((Math.floor(i / 26) % 2) * 50), y: Math.floor(i / 26) * 100}));
  return (
    <AbsoluteFill style={{background: COLORS.brand, overflow: 'hidden'}}>
      <svg width={BANNER.width} height={BANNER.height} style={{position: 'absolute'}}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x + 25} cy={d.y + 25} r={9} fill={COLORS.brandDeep} />
        ))}
        {/* faixa central onde fica o conteúdo */}
        <rect x={0} y={SAFE.y - 40} width={BANNER.width} height={SAFE.height + 80} fill={COLORS.paper} />
        <line x1={0} x2={BANNER.width} y1={SAFE.y - 40} y2={SAFE.y - 40} stroke={COLORS.ink} strokeWidth={10} />
        <line x1={0} x2={BANNER.width} y1={SAFE.y + SAFE.height + 40} y2={SAFE.y + SAFE.height + 40} stroke={COLORS.ink} strokeWidth={10} />
      </svg>

      {/* personagens nas laterais da área segura, "saindo" da faixa */}
      <Bolota x={SAFE.x + 190} y={SAFE.y + SAFE.height + 150} scale={0.95} expression="tired" lookX={0.7} leftArm={20} rightArm={20} blinkSeed={1} />
      <Palito x={SAFE.x + SAFE.width - 110} y={SAFE.y + SAFE.height + 330} scale={0.8} expression="happy" lookX={-0.7} leftArm={20} rightArm={150} blinkSeed={2} />

      <div
        style={{
          position: 'absolute',
          left: SAFE.x + 420,
          width: SAFE.width - 640,
          top: SAFE.y,
          height: SAFE.height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 124,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            color: COLORS.brand,
            WebkitTextStroke: `22px ${COLORS.ink}`,
            paintOrder: 'stroke fill',
            transform: 'rotate(-2deg)',
          }}
        >
          Bolota <span style={{color: COLORS.bolotaBody}}>&amp;</span> Palito
        </div>
        <div style={{fontFamily: FONTS.display, fontSize: 50, color: COLORS.ink, marginTop: 30, whiteSpace: 'nowrap'}}>
          os pequenos dramas da vida adulta
        </div>
      </div>

      {showSafeArea ? (
        <div style={{position: 'absolute', left: SAFE.x, top: SAFE.y, width: SAFE.width, height: SAFE.height, border: '6px dashed red'}} />
      ) : null}
    </AbsoluteFill>
  );
};
