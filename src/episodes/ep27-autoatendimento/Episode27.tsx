import React from 'react';
import {COLORS} from '../../config/tokens';
import {makeT3Episode} from '../../components/T3Episode';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';
import {Supermarket, SUPERMARKET} from '../../scenes/Supermarket';

/**
 * EP27 — "Autoatendimento" (temporada 3)
 * Gancho (frame 0): "ITEM INESPERADO NA ÁREA DE ENSACAMENTO" + alarme.
 * Desenvolvimento: uma banana dispara o alarme; depois, nada dispara o alarme.
 * Virada: o atendente é o Palito: "isso na balança é a sua mochila".
 */
const Banana: React.FC<{x: number; y: number}> = ({x, y}) => (
  <svg style={{position: 'absolute', left: x, top: y - 70}} width={130} height={70} viewBox="0 0 130 70">
    <path d="M 8 20 Q 60 80 122 14 Q 120 40 64 58 Q 22 56 8 20 Z" fill="#FECA57" stroke={COLORS.ink} strokeWidth={6} />
  </svg>
);
const Backpack: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x, top: y - 120, width: 110, height: 120, borderRadius: '30px 30px 16px 16px', background: '#2E86DE', border: `8px solid ${COLORS.ink}`}}>
    <div style={{position: 'absolute', left: 18, right: 18, top: 50, height: 40, borderRadius: 10, background: '#54A0FF', border: `5px solid ${COLORS.ink}`}} />
  </div>
);

export const {Episode: Episode27, TIMELINE} = makeT3Episode({
  dialogue: dialogueJson as Dialogue,
  voices: voicesJson as VoicesFile,
  scene: () => <Supermarket />,
  floorY: SUPERMARKET.floorY,
  bolotaX: 420,
  palitoX: 120,
  palitoEnter: {line: 'l5'},
  speakerNames: {maquina: 'CAIXA'},
  focusDx: 120,
  shocks: [
    {from: {line: 'l3'}, to: {line: 'l3', edge: 'end'}},
    {from: {line: 'l6'}, to: {line: 'l6', edge: 'end', offset: 0.2}},
  ],
  bolota: [
    [{line: 'l2'}, 'annoyed'],
    [{line: 'l4'}, 'annoyed'],
    [{line: 'l5'}, 'neutral'],
    [{line: 'l7', edge: 'end'}, 'tired'],
  ],
  bolotaArms: [[{line: 'l2'}, {line: 'l2', edge: 'end'}, 15, 120], [{line: 'l4'}, {line: 'l4', edge: 'end'}, 150, 150]],
  bolotaLook: [[0, 0.8], [{line: 'l5'}, -0.8], [{line: 'l8', offset: -0.5}, 0]],
  props: () => (
    <>
      <Banana x={640} y={SUPERMARKET.counterTopY} />
      <Backpack x={860} y={SUPERMARKET.counterTopY} />
    </>
  ),
  overlay: (frame, at) => {
    const alarm = (frame < at({line: 'l1', edge: 'end'}) || (frame >= at({line: 'l3'}) && frame < at({line: 'l3', edge: 'end'}))) && Math.floor(frame / 6) % 2 === 0;
    return alarm ? <div style={{position: 'absolute', inset: 0, background: COLORS.danger, opacity: 0.18}} /> : null;
  },
  cards: [
    {from: -8, to: {line: 'l2'}, content: {title: 'CAIXA DE AUTOATENDIMENTO', accent: COLORS.danger, rows: [{text: 'ITEM INESPERADO NA ÁREA DE ENSACAMENTO', bold: true, color: COLORS.danger}], footer: 'Aguarde um atendente'}},
    {from: {line: 'l2', edge: 'end'}, to: {line: 'l5'}, content: (frame, at) => ({title: 'CAIXA DE AUTOATENDIMENTO', accent: COLORS.danger, big: {text: `Alertas: ${frame >= at({line: 'l3'}) ? 2 : 1}`, color: COLORS.danger}, footer: 'Itens escaneados: 0'})},
    {from: {line: 'l7', edge: 'end', offset: 0.1}, to: {line: 'l8', offset: -0.5}, content: {title: 'ITEM IDENTIFICADO', accent: COLORS.ok, rows: [{text: 'Mochila do cliente · 4,2 kg', bold: true}, {text: 'Tempo na fila: 25 min', color: COLORS.danger}]}},
  ],
  question: 'Caixa normal ou autoatendimento? Responde aqui',
  thumbnailText: ['ITEM', 'INESPERADO?!'],
});
