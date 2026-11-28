import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Bolota, Palito} from '../characters';
import {COLORS, FONTS} from '../config/tokens';

/** Post de feed do Instagram no formato retrato 4:5 (1080x1350). */
export const PROMO = {width: 1080, height: 1350} as const;

export const LinkCard: React.FC<{badge: string; badgeColor: string; label: string; value: string; top: number}> = ({
  badge,
  badgeColor,
  label,
  value,
  top,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 70,
      right: 70,
      top,
      height: 150,
      background: '#FFFFFF',
      border: `8px solid ${COLORS.ink}`,
      borderRadius: 34,
      boxShadow: `10px 10px 0 ${COLORS.ink}`,
      display: 'flex',
      alignItems: 'center',
      gap: 28,
      padding: '0 30px',
    }}
  >
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: 26,
        background: badgeColor,
        border: `6px solid ${COLORS.ink}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontFamily: FONTS.display,
        fontSize: 50,
        flexShrink: 0,
      }}
    >
      {badge}
    </div>
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <div style={{fontFamily: FONTS.body, fontWeight: 700, fontSize: 34, color: COLORS.ink, opacity: 0.7}}>{label}</div>
      <div style={{fontFamily: FONTS.display, fontSize: 52, color: COLORS.ink, whiteSpace: 'nowrap'}}>{value}</div>
    </div>
  </div>
);

export const PromoPost: React.FC = () => {
  const dots = Array.from({length: 11 * 14}, (_, i) => ({x: (i % 11) * 100 + (Math.floor(i / 11) % 2) * 50, y: Math.floor(i / 11) * 100}));
  return (
    <AbsoluteFill style={{background: COLORS.brand, overflow: 'hidden'}}>
      <svg width={PROMO.width} height={PROMO.height} style={{position: 'absolute'}}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x + 25} cy={d.y + 25} r={8} fill={COLORS.brandDeep} />
        ))}
      </svg>

      {/* título */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONTS.display,
          fontSize: 118,
          lineHeight: 0.95,
          color: '#FFFFFF',
          WebkitTextStroke: `22px ${COLORS.ink}`,
          paintOrder: 'stroke fill',
          transform: 'rotate(-3deg)',
        }}
      >
        Bolota <span style={{color: COLORS.bolotaBody}}>&amp;</span> Palito
      </div>
      <div
        style={{
          position: 'absolute',
          top: 215,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONTS.display,
          fontSize: 50,
          color: COLORS.ink,
        }}
      >
        os pequenos dramas da vida adulta
      </div>

      {/* personagens */}
      <Palito x={770} y={1010} scale={0.78} expression="happy" lookX={-0.6} leftArm={20} rightArm={155} blinkSeed={2} />
      <Bolota x={380} y={940} scale={0.95} expression="tired" lookX={0.5} leftArm={20} rightArm={20} blinkSeed={1} />

      {/* balão do Palito */}
      <div
        style={{
          position: 'absolute',
          left: 600,
          top: 330,
          background: '#FFFFFF',
          border: `7px solid ${COLORS.ink}`,
          borderRadius: 30,
          padding: '14px 26px',
          fontFamily: FONTS.display,
          fontSize: 40,
          color: COLORS.ink,
          transform: 'rotate(3deg)',
        }}
      >
        Segue a gente!
      </div>

      <LinkCard badge="▶" badgeColor={COLORS.danger} label="Episódios no YouTube" value="youtube.com/@bolotaepalito" top={980} />
      <LinkCard badge="@" badgeColor={COLORS.bankBlue} label="Bastidores no Instagram" value="@bolotaepalito" top={1160} />
    </AbsoluteFill>
  );
};
