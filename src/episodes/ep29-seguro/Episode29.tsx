import React from 'react';
import {COLORS} from '../../config/tokens';
import {makeT3Episode} from '../../components/T3Episode';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {kf} from '../../components/keyframes';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';
import {Computer} from '../../props/Computer';
import {HomeOffice, HOME_OFFICE} from '../../scenes/HomeOffice';

/**
 * EP29 — "Seguro do Celular" (temporada 3)
 * Gancho (frame 0): o celular caindo em câmera lenta + "whoosh" + "MEU CELULAR!".
 * Desenvolvimento: ele pega no ar... e derruba o café no notebook.
 * Virada: o seguro era só do celular.
 */
const MONITOR = {x: 790, y: HOME_OFFICE.deskTopY + 10};
const Phone: React.FC<{x: number; y: number; color?: string}> = ({x, y, color = '#9AD8FF'}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 60, height: 100, borderRadius: 12, background: color, border: `6px solid ${COLORS.ink}`}} />
);

export const {Episode: Episode29, TIMELINE} = makeT3Episode({
  dialogue: dialogueJson as Dialogue,
  voices: voicesJson as VoicesFile,
  scene: () => <HomeOffice />,
  floorY: HOME_OFFICE.floorY,
  bolotaX: 480,
  palitoX: 170,
  palitoEnter: {line: 'l3'},
  focusDx: 80,
  shocks: [{from: {line: 'l5', edge: 'end', offset: 0.1}, to: {line: 'l5', edge: 'end', offset: 1.3}}, {from: {line: 'l7', edge: 'end'}, to: {line: 'l7', edge: 'end', offset: 0.8}}],
  bolota: [
    [{line: 'l2'}, 'happy'],
    [{line: 'l4'}, 'neutral'],
    [{line: 'l6'}, 'tired'],
    [{line: 'l7', edge: 'end', offset: 0.8}, 'annoyed'],
  ],
  bolotaArms: [[{line: 'l2'}, {line: 'l3'}, 15, 150]],
  bolotaLook: [[0, 0.3], [{line: 'l3'}, -0.8], [{line: 'l5'}, 0.8], [{line: 'l6'}, -0.8], [{line: 'l8', offset: -0.5}, 0]],
  props: (frame, at) => {
    const spill = at({line: 'l4', edge: 'end', offset: 0.2});
    const tip = kf(frame, [spill, spill + 8], [0, 95]);
    const coffee = kf(frame, [spill + 4, spill + 30], [0, 1]);
    // o celular cai devagar no gancho e para na mão do Bolota
    const phoneY = frame < at({line: 'l2'}) ? kf(frame, [0, at({line: 'l2'})], [760, 1000]) : 1000;
    return (
      <>
        <Computer x={MONITOR.x} y={MONITOR.y} typed={0} cursorOn={false} screen={{kind: 'accepted'}} />
        {coffee > 0 ? <div style={{position: 'absolute', left: MONITOR.x - 268, top: MONITOR.y - 458, width: 536, height: 370 * coffee, background: '#6F4E37', opacity: 0.92, borderRadius: 10}} /> : null}
        <div style={{position: 'absolute', left: 1000, top: MONITOR.y - 130, width: 70, height: 90, background: '#FFFFFF', border: `8px solid ${COLORS.ink}`, borderRadius: '6px 6px 18px 18px', transform: `rotate(${-tip}deg)`, transformOrigin: '0% 100%'}} />
        <div style={{transform: `rotate(${frame < at({line: 'l2'}) ? frame * 9 : 0}deg)`, transformOrigin: '660px 1050px', position: 'absolute', inset: 0}}>
          <Phone x={630} y={phoneY} />
        </div>
      </>
    );
  },
  cards: [
    {from: -8, to: {line: 'l2'}, top: 560, content: {title: 'CELULAR', accent: COLORS.danger, rows: [{text: 'Em queda livre', bold: true, color: COLORS.danger}], footer: 'Altura: 1,20 m'}},
    {from: {line: 'l2', offset: 0.2}, to: {line: 'l3'}, top: 560, content: {title: 'CELULAR', accent: COLORS.ok, big: {text: 'SALVO!', color: COLORS.ok}}},
    {from: {line: 'l7', edge: 'end', offset: 0.1}, to: {line: 'l8', offset: -0.5}, top: 560, content: {title: 'APÓLICE DE SEGURO', accent: COLORS.bankBlue, rows: [{text: '✓ Celular', bold: true, color: COLORS.ok}, {text: '✗ Notebook  ✗ Café', bold: true, color: COLORS.danger}]}},
  ],
  question: 'Você faz seguro do celular ou vive perigosamente?',
  thumbnailText: ['MEU', 'CELULAR!'],
});
