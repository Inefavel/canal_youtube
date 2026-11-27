import {COLORS} from '../../config/tokens';
import {sec} from '../../config/timing';
import {makeT3Episode} from '../../components/T3Episode';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {kf} from '../../components/keyframes';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';
import {Bedroom, BEDROOM} from '../../scenes/Bedroom';

/**
 * EP30 — "Fim de Ano" (fim da temporada 3)
 * Gancho (frame 0): o calendário vira de janeiro a dezembro num piscar + "boing" + "JÁ É DEZEMBRO?!".
 * Desenvolvimento: metas do ano: academia, dieta, doze livros. Zero de três.
 * Virada: o Palito cumpriu todas: acordar, comer e dormir.
 */
const MONTHS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export const {Episode: Episode30, TIMELINE} = makeT3Episode({
  dialogue: dialogueJson as Dialogue,
  voices: voicesJson as VoicesFile,
  scene: () => <Bedroom daylight={0.7} />,
  floorY: BEDROOM.floorY,
  bolotaX: 640,
  palitoX: 280,
  palitoEnter: {line: 'l4'},
  shocks: [{from: {line: 'l5'}, to: {line: 'l5', edge: 'end', offset: 0.2}}],
  bolota: [
    [{line: 'l2'}, 'neutral'],
    [{line: 'l3'}, 'tired'],
    [{line: 'l6'}, 'neutral'],
    [{line: 'l6', edge: 'end'}, 'annoyed'],
  ],
  cards: [
    {from: -8, to: {line: 'l2'}, content: (frame) => {
      const m = Math.min(11, Math.floor(kf(frame, [0, sec(0.4)], [0, 11.99])));
      return {title: 'CALENDÁRIO', accent: COLORS.danger, big: {text: `${m === 11 ? 31 : 1} ${MONTHS[m]}`, color: COLORS.danger}, footer: 'Ano: quase acabando'};
    }},
    {from: {line: 'l2', offset: 0.6}, to: {line: 'l4', offset: -0.6}, content: (frame, at) => {
      const n = [at({line: 'l2', offset: 1.0}), at({line: 'l2', offset: 1.8}), at({line: 'l2', edge: 'end', offset: -0.4})].filter((f) => frame >= f).length;
      const goals = ['Academia', 'Dieta', 'Ler 12 livros'];
      return {title: 'METAS DO BOLOTA', accent: COLORS.bolotaTag, rows: goals.slice(0, Math.max(1, n)).map((g) => ({text: `✗ ${g}`, bold: true, color: COLORS.danger})), footer: frame >= at({line: 'l3'}) ? 'Cumpridas: 0 de 3' : undefined};
    }},
    {from: {line: 'l6', offset: 0.3}, to: {line: 'l7', offset: -0.5}, content: {title: 'METAS DO PALITO', accent: COLORS.palitoTag, rows: [{text: '✓ Acordar', bold: true, color: COLORS.ok}, {text: '✓ Comer', bold: true, color: COLORS.ok}, {text: '✓ Dormir', bold: true, color: COLORS.ok}], footer: 'Cumpridas: 365 de 365'}},
  ],
  question: 'Quantas metas deste ano você cumpriu? Seja sincero',
  thumbnailText: ['JÁ É', 'DEZEMBRO?!'],
});

