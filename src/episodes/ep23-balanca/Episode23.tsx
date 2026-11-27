import React from 'react';
import {COLORS, FONTS} from '../../config/tokens';
import {makeT3Episode} from '../../components/T3Episode';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';
import {Bedroom, BEDROOM} from '../../scenes/Bedroom';

/**
 * EP23 — "A Balança" (temporada 3)
 * Gancho (frame 0): a balança mostra "ERRO" + alarme.
 * Desenvolvimento: tira relógio, sapato, meia, prende a respiração... 120 kg?!
 * Virada: o Palito estava com o pé na balança "pra dar apoio moral".
 */
const FLOOR = BEDROOM.floorY;
const BOLOTA_X = 640;

/** Balança de chão com visor. */
const Scale: React.FC<{text: string; color: string}> = ({text, color}) => (
  <div style={{position: 'absolute', left: BOLOTA_X - 190, top: FLOOR - 30, width: 380, height: 60, background: '#DFE4EA', border: `8px solid ${COLORS.ink}`, borderRadius: 18}}>
    <div style={{position: 'absolute', right: 20, top: 6, padding: '0 10px', background: COLORS.monitor, color, fontFamily: FONTS.display, fontSize: 26, borderRadius: 6}}>{text}</div>
  </div>
);

export const {Episode: Episode23, TIMELINE} = makeT3Episode({
  dialogue: dialogueJson as Dialogue,
  voices: voicesJson as VoicesFile,
  scene: () => <Bedroom daylight={1} />,
  floorY: FLOOR - 20,
  bolotaX: BOLOTA_X,
  palitoX: 300,
  palitoEnter: null,
  palito: [[0, 'neutral'], [{line: 'l5'}, 'happy']],
  palitoArm: (frame, at) => (frame < at({line: 'l5'}) ? 20 : null),
  shocks: [
    {from: {line: 'l4'}, to: {line: 'l4', edge: 'end', offset: 0.3}},
    {from: {line: 'l6'}, to: {line: 'l6', edge: 'end', offset: 0.2}},
  ],
  bolota: [
    [{line: 'l2'}, 'neutral'],
    [{line: 'l3', offset: 1.4}, 'tired'],
    [{line: 'l5'}, 'neutral'],
    [{line: 'l7', edge: 'end'}, 'annoyed'],
  ],
  bolotaArms: [[{line: 'l2', offset: 1}, {line: 'l3', edge: 'end'}, 60, 120]],
  bolotaLook: [[{line: 'l2'}, 0], [{line: 'l5'}, -0.8]],
  bolotaLookY: [[{line: 'l2'}, 0.6], [{line: 'l5'}, 0]],
  props: (frame, at) => {
    const kg = frame < at({line: 'l2'}) ? 'ERRO' : frame < at({line: 'l4', offset: -0.3}) ? '---' : '120 kg';
    return <Scale text={kg} color={kg === '120 kg' || kg === 'ERRO' ? COLORS.clockDigits : '#DFE4EA'} />;
  },
  front: (frame, at) =>
    // o "pé de apoio" do Palito na beirada da balança
    frame >= at({line: 'l5'}) ? <div style={{position: 'absolute', left: BOLOTA_X - 200, top: FLOOR - 50, width: 70, height: 34, borderRadius: 17, background: COLORS.palitoBody, border: `6px solid ${COLORS.ink}`}} /> : null,
  cards: [
    {from: -8, to: {line: 'l2'}, content: {title: 'BALANÇA', accent: COLORS.danger, big: {text: 'ERRO', color: COLORS.danger}, footer: 'Peso fora do limite'}},
    {
      from: {line: 'l2', offset: 0.6},
      to: {line: 'l4', offset: -0.3},
      content: (frame, at) => {
        const items = ['Relógio', 'Sapato', 'Meia', 'Ar dos pulmões'];
        const n = [at({line: 'l2', offset: 1.2}), at({line: 'l2', edge: 'end', offset: -0.3}), at({line: 'l3', offset: 0.6}), at({line: 'l3', edge: 'end', offset: -0.4})].filter((f) => frame >= f).length;
        return {title: 'OPERAÇÃO PESO LEVE', accent: COLORS.ok, rows: items.slice(0, Math.max(1, n)).map((t, i) => ({text: `${i < n ? '✓' : '○'} ${t}`, bold: i < n}))};
      },
    },
    {from: {line: 'l4', offset: -0.3}, to: {line: 'l6'}, content: {title: 'BALANÇA', accent: COLORS.danger, big: {text: '120 kg', color: COLORS.danger}, footer: '(com apoio moral incluso)'}},
  ],
  question: 'Qual é a sua desculpa favorita na balança?',
  thumbnailText: ['ERRO', 'NA BALANÇA?!'],
});
