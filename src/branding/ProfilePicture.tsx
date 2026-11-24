import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Bolota, Palito} from '../characters';
import {COLORS} from '../config/tokens';

export const PROFILE = {width: 800, height: 800} as const;

/**
 * Foto de perfil (800x800). O YouTube e o Instagram recortam em círculo:
 * os rostos ficam dentro do círculo central (raio ~360 px).
 */
export const ProfilePicture: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${COLORS.brand} 0%, ${COLORS.brandDeep} 100%)`, overflow: 'hidden'}}>
    <Palito x={575} y={1030} scale={1.0} expression="happy" lookX={-0.7} lookY={0.1} leftArm={20} rightArm={20} blinkSeed={2} tilt={-4} />
    <Bolota x={330} y={860} scale={1.05} expression="tired" lookX={0.6} lookY={-0.1} leftArm={20} rightArm={20} blinkSeed={1} />
  </AbsoluteFill>
);
