import React from 'react';
import {COLORS} from '../../config/tokens';
import {makeT3Episode} from '../../components/T3Episode';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';
import {Kitchen, KITCHEN} from '../../scenes/Kitchen';

/**
 * EP25 — "O Último Pedaço" (temporada 3)
 * Gancho (frame 0): close no último pedaço de pizza + "ding" + "O ÚLTIMO PEDAÇO É MEU!".
 * Desenvolvimento: duelo de "vi primeiro / pensei primeiro"; decidem dividir.
 * Virada: enquanto discutiam, o entregador comeu a pizza.
 */
const Slice: React.FC<{x: number; y: number}> = ({x, y}) => (
  <svg style={{position: 'absolute', left: x - 90, top: y - 120}} width={180} height={130} viewBox="0 0 180 130">
    <ellipse cx={90} cy={110} rx={88} ry={18} fill="#FFFFFF" stroke={COLORS.ink} strokeWidth={6} />
    <path d="M 20 100 L 160 100 L 90 10 Z" fill="#FECA57" stroke={COLORS.ink} strokeWidth={6} />
    <path d="M 20 100 L 160 100" stroke="#E17055" strokeWidth={14} />
    {[[80, 60], [105, 80], [70, 85]].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r={9} fill="#D63031" />)}
  </svg>
);

export const {Episode: Episode25, TIMELINE} = makeT3Episode({
  dialogue: dialogueJson as Dialogue,
  voices: voicesJson as VoicesFile,
  scene: () => <Kitchen />,
  floorY: KITCHEN.floorY,
  bolotaX: 700,
  palitoX: 300,
  palitoEnter: null,
  hookZoom: 1.6,
  focusDx: -40,
  shocks: [{from: {line: 'l6', offset: 0.8}, to: {line: 'l7', edge: 'end', offset: 0.3}}],
  palito: [[0, 'annoyed'], [{line: 'l5', edge: 'end'}, 'happy'], [{line: 'l6', offset: 0.8}, 'shocked'], [{line: 'l7', edge: 'end'}, 'neutral']],
  bolota: [
    [{line: 'l2'}, 'annoyed'],
    [{line: 'l5'}, 'neutral'],
    [{line: 'l5', edge: 'end'}, 'happy'],
    [{line: 'l7', edge: 'end'}, 'tired'],
  ],
  bolotaLook: [[0, -0.8], [{line: 'l6', offset: 0.8}, 0.8], [{line: 'l7', edge: 'end'}, -0.8], [{line: 'l8', offset: -0.5}, 0]],
  props: (frame, at) => (frame < at({line: 'l6', offset: 0.5}) ? <Slice x={830} y={KITCHEN.counterTopY} /> : null),
  cards: [
    {from: -8, to: {line: 'l3'}, top: 560, content: {title: 'PIZZA', accent: COLORS.danger, big: {text: '1 PEDAÇO', color: COLORS.danger}, footer: '2 interessados'}},
    {from: {line: 'l3'}, to: {line: 'l5'}, top: 560, content: (frame, at) => ({title: 'PLACAR DO DUELO', accent: COLORS.brandDeep, big: {text: `${frame >= at({line: 'l3'}) ? 1 : 0} × ${frame >= at({line: 'l4'}) ? 1 : 0}`}, footer: 'Bolota × Palito'})},
    {from: {line: 'l7', edge: 'end', offset: 0.1}, to: {line: 'l8', offset: -0.5}, top: 560, content: {title: 'ENTREGADOR (VOLTOU PRA PEGAR A MAQUININHA)', accent: '#57606F', rows: [{text: 'Comeu: 1 pedaço', bold: true}, {text: 'Avaliação: 5 estrelas', color: COLORS.ok}]}},
  ],
  question: 'Último pedaço: você divide ou disputa?',
  thumbnailText: ['O ÚLTIMO', 'PEDAÇO!'],
});
