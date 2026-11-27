import React from 'react';
import {COLORS} from '../../config/tokens';
import {makeT3Episode} from '../../components/T3Episode';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {kf} from '../../components/keyframes';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';
import {Bedroom, BEDROOM} from '../../scenes/Bedroom';

/**
 * EP26 — "Atualização do Celular" (temporada 3)
 * Gancho (frame 0): "Atualizando... 147%" + vibração.
 * Desenvolvimento: o celular reinicia nove vezes.
 * Virada: a novidade é a remoção do botão de voltar; o Palito comemora 30 emojis novos.
 */
const Phone: React.FC<{x: number; y: number; color?: string}> = ({x, y, color = '#9AD8FF'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 60, height: 100, borderRadius: 12, background: color, border: `6px solid ${COLORS.ink}`}} />
);

export const {Episode: Episode26, TIMELINE} = makeT3Episode({
  dialogue: dialogueJson as Dialogue,
  voices: voicesJson as VoicesFile,
  scene: () => <Bedroom daylight={1} />,
  floorY: BEDROOM.floorY,
  bolotaX: 640,
  palitoX: 280,
  palitoEnter: {line: 'l6'},
  speakerNames: {celular: 'CELULAR'},
  shocks: [{from: {line: 'l5'}, to: {line: 'l5', edge: 'end', offset: 0.2}}],
  bolota: [
    [{line: 'l2'}, 'tired'],
    [{line: 'l3'}, 'annoyed'],
    [{line: 'l4'}, 'neutral'],
    [{line: 'l5', edge: 'end'}, 'tired'],
    [{line: 'l6', edge: 'end'}, 'annoyed'],
  ],
  bolotaArms: [[{line: 'l1', edge: 'end'}, {line: 'l5'}, 15, 70]],
  bolotaLookY: [[{line: 'l1', edge: 'end'}, 0.5], [{line: 'l5'}, 0]],
  props: (frame, at) => (frame >= at({line: 'l1', edge: 'end'}) && frame < at({line: 'l5'}) ? <Phone x={890} y={1120} color={frame < at({line: 'l4'}) ? '#1E1B2E' : '#9AD8FF'} /> : null),
  cards: [
    {from: -8, to: {line: 'l2'}, content: {title: 'ATUALIZAÇÃO OBRIGATÓRIA', accent: COLORS.bankBlue, big: {text: 'Atualizando... 147%', color: COLORS.bankBlue}, progress: 1}},
    {from: {line: 'l2'}, to: {line: 'l4', offset: -0.3}, content: (frame, at) => {
      const n = Math.min(9, 1 + Math.floor(kf(frame, [at({line: 'l2'}), at({line: 'l3', edge: 'end'})], [0, 8.99])));
      return {title: 'REINICIANDO', accent: '#57606F', big: {text: `${n}ª vez`}, footer: 'Não desligue o aparelho'};
    }},
    {from: {line: 'l4', offset: -0.3}, to: {line: 'l6'}, content: {title: 'NOVIDADES DA VERSÃO 147.0', accent: COLORS.bankBlue, rows: [{text: '✗ Removido: botão de voltar', bold: true, color: COLORS.danger}, {text: '✓ Novo: ícone 2 pixels mais redondo'}]}},
    {from: {line: 'l6', offset: 0.4}, to: {line: 'l7', offset: -0.5}, content: {title: 'NOVOS EMOJIS', accent: COLORS.brandDeep, big: {text: '+30'}, footer: 'Nenhum deles é um botão de voltar'}},
  ],
  question: 'Qual atualização acabou com o seu celular?',
  thumbnailText: ['ATUALIZANDO', '147%?!'],
});
