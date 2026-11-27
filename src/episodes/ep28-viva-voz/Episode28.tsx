import React from 'react';
import {COLORS} from '../../config/tokens';
import {makeT3Episode} from '../../components/T3Episode';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';
import {Bus, BUS} from '../../scenes/Bus';

/**
 * EP28 — "Áudio no Viva-Voz" (temporada 3)
 * Gancho (frame 0): o áudio do Palito vaza no viva-voz do ônibus: "o Bolota falou que o chefe...".
 * Desenvolvimento: ele tenta parar e o áudio continua: "...ronca nas reuniões!".
 * Virada: o passageiro do lado é o chefe. "Bom dia, Bolota."
 */
const Phone: React.FC<{x: number; y: number; color?: string}> = ({x, y, color = '#9AD8FF'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 60, height: 100, borderRadius: 12, background: color, border: `6px solid ${COLORS.ink}`}} />
);

export const {Episode: Episode28, TIMELINE} = makeT3Episode({
  dialogue: dialogueJson as Dialogue,
  voices: voicesJson as VoicesFile,
  scene: (frame) => <Bus frame={frame} />,
  floorY: BUS.floorY,
  bolotaX: 540,
  speakerNames: {palito: 'ÁUDIO DO PALITO', chefe: 'PASSAGEIRO AO LADO'},
  shocks: [
    {from: {line: 'l3'}, to: {line: 'l3', edge: 'end'}},
    {from: {line: 'l5'}, to: {line: 'l5', edge: 'end', offset: 0.8}},
  ],
  bolota: [
    [{line: 'l4'}, 'happy'],
    [{line: 'l5', edge: 'end', offset: 0.8}, 'tired'],
  ],
  bolotaArms: [[{line: 'l2'}, {line: 'l2', edge: 'end'}, 15, 90], [{line: 'l4'}, {line: 'l4', edge: 'end'}, 15, 70]],
  bolotaLook: [[{line: 'l2'}, 0.6], [{line: 'l5'}, -0.8], [{line: 'l6', offset: -0.5}, 0]],
  bolotaLookY: [[{line: 'l2'}, 0.4], [{line: 'l5'}, 0]],
  props: (frame, at) => <Phone x={780} y={frame < at({line: 'l4'}) ? 1060 + Math.sin(frame) * 6 : 1110} color={frame < at({line: 'l4', edge: 'end'}) ? '#9AD8FF' : '#1E1B2E'} />,
  cards: [
    {from: -8, to: {line: 'l2', edge: 'end'}, content: (frame) => ({title: 'ÁUDIO · PALITO · VIVA-VOZ', accent: COLORS.ok, big: {text: '🔊 0:0' + Math.min(9, Math.floor(frame / 30)), color: COLORS.ok}, progress: Math.min(1, frame / 300), footer: 'Volume: máximo'})},
    {from: {line: 'l5', edge: 'end', offset: 0.1}, to: {line: 'l6', offset: -0.5}, content: {title: 'PASSAGEIRO AO LADO', accent: '#57606F', rows: [{text: 'Seu chefe', bold: true}, {text: 'Ouviu: 100% do áudio', color: COLORS.danger}]}},
  ],
  question: 'Já passou vergonha com áudio no viva-voz?',
  thumbnailText: ['ÁUDIO NO', 'VIVA-VOZ?!'],
});
