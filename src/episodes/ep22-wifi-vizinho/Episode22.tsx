import React from 'react';
import {COLORS} from '../../config/tokens';
import {makeT3Episode} from '../../components/T3Episode';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {kf} from '../../components/keyframes';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';
import {HomeOffice, HOME_OFFICE} from '../../scenes/HomeOffice';

/**
 * EP22 — "Senha do Wi-Fi do Vizinho" (temporada 3)
 * Gancho (frame 0): "Wi-Fi: 0 redes" + vibração + "SEM INTERNET?!".
 * Desenvolvimento: 30 tentativas na rede "Vizinho123".
 * Virada: a rede é do Palito, do quarto ao lado. Senha: palito123.
 */
const Phone: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 60, height: 100, borderRadius: 12, background: '#9AD8FF', border: `6px solid ${COLORS.ink}`}} />
);

export const {Episode: Episode22, TIMELINE} = makeT3Episode({
  dialogue: dialogueJson as Dialogue,
  voices: voicesJson as VoicesFile,
  scene: () => <HomeOffice />,
  floorY: HOME_OFFICE.floorY,
  bolotaX: 560,
  palitoX: 220,
  palitoEnter: {line: 'l5'},
  shocks: [{from: {line: 'l6'}, to: {line: 'l6', edge: 'end', offset: 0.2}}],
  bolota: [
    [{line: 'l2'}, 'neutral'],
    [{line: 'l3', offset: 1.5}, 'annoyed'],
    [{line: 'l4'}, 'tired'],
    [{line: 'l7', edge: 'end'}, 'annoyed'],
  ],
  bolotaArms: [[{line: 'l2'}, {line: 'l5', offset: -0.6}, 15, 70]],
  bolotaLookY: [[{line: 'l2'}, 0.5], [{line: 'l5', offset: -0.4}, 0]],
  props: (frame, at) => (frame >= at({line: 'l2'}) && frame < at({line: 'l5', offset: -0.4}) ? <Phone x={810} y={1120} /> : null),
  cards: [
    {from: -8, to: {line: 'l2'}, content: {title: 'WI-FI', accent: COLORS.danger, big: {text: '0 redes', color: COLORS.danger}, footer: 'Sem conexão com a internet'}},
    {
      from: {line: 'l2', offset: 0.6},
      to: {line: 'l5', offset: -0.6},
      content: (frame, at) => {
        const tries = Math.max(0, Math.min(30, Math.round(kf(frame, [at({line: 'l3'}), at({line: 'l4'})], [0, 30]))));
        return {
          title: 'REDES DISPONÍVEIS',
          accent: COLORS.bankBlue,
          rows: [{text: 'Vizinho123 (protegida)', bold: true}, {text: tries > 0 ? `Senha incorreta · tentativa ${tries}` : 'Digite a senha', color: tries > 0 ? COLORS.danger : '#57606F'}],
        };
      },
    },
    {from: {line: 'l5', edge: 'end', offset: 0.1}, to: {line: 'l8', offset: -0.5}, content: {title: 'CONECTADO ✓', accent: COLORS.ok, rows: [{text: 'Vizinho123', bold: true}, {text: 'Dono da rede: Palito (quarto ao lado)', color: COLORS.palitoTag}]}},
  ],
  question: 'Você já pediu a senha do Wi-Fi do vizinho? 1 = sim, 2 = nunca',
  thumbnailText: ['SEM', 'INTERNET?!'],
});
