import {COLORS} from '../../config/tokens';
import {sec} from '../../config/timing';
import {makeT3Episode} from '../../components/T3Episode';
import type {Dialogue, VoicesFile} from '../../components/timeline';
import {kf} from '../../components/keyframes';
import dialogueJson from './dialogue.json';
import voicesJson from './voices.json';
import {Computer} from '../../props/Computer';
import {HomeOffice, HOME_OFFICE} from '../../scenes/HomeOffice';

/**
 * EP24 — "Reunião que Podia Ser um E-mail" (temporada 3)
 * Gancho (frame 0): "REUNIÃO: 3 h 12 min" + alarme.
 * Desenvolvimento: pauta única, a cor do botão. O Palito não se decide.
 * Virada: o chefe marca outra reunião "pra alinhar".
 */
const dialogue = dialogueJson as Dialogue;

export const {Episode: Episode24, TIMELINE} = makeT3Episode({
  dialogue,
  voices: voicesJson as VoicesFile,
  scene: () => <HomeOffice />,
  floorY: HOME_OFFICE.floorY,
  bolotaX: 500,
  focusDx: 80,
  shocks: [{from: {line: 'l6', edge: 'end', offset: 0.1}, to: {line: 'l6', edge: 'end', offset: 1.2}}],
  bolota: [
    [{line: 'l2'}, 'tired'],
    [{line: 'l3'}, 'happy'],
    [{line: 'l4'}, 'annoyed'],
    [{line: 'l5', offset: 1.5}, 'tired'],
  ],
  bolotaLook: [[{line: 'l2'}, 0.8], [{line: 'l7'}, 0]],
  props: (frame, at) => {
    // 3h12 no gancho, o relógio da chamada corre rápido durante a indecisão do Palito
    const minutes = 192 + Math.round(kf(frame, [at({line: 'l5'}), at({line: 'l6'})], [0, 45]));
    const speaking = (id: string) => frame >= at({line: id}) && frame < at({line: id, edge: 'end'});
    return (
      <Computer
        x={790}
        y={HOME_OFFICE.deskTopY + 10}
        typed={0}
        cursorOn={false}
        screen={{
          kind: 'call',
          title: 'Cor do botão',
          timer: `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}:00`,
          tiles: [
            {name: 'Chefe', color: '#57606F', speaking: speaking('l2') || speaking('l4') || speaking('l6')},
            {name: 'Palito', color: COLORS.palitoBody, speaking: speaking('l5')},
            {name: 'Bolota', color: COLORS.bolotaBody, speaking: speaking('l3')},
            {name: 'Estagiário', color: '#C56CF0', speaking: false, asleep: true},
          ],
        }}
      />
    );
  },
  cards: [
    {from: -8, to: {line: 'l2'}, content: {title: 'REUNIÃO EM ANDAMENTO', accent: COLORS.danger, big: {text: '3 h 12 min', color: COLORS.danger}, footer: 'Pauta: 1 item'}},
    {from: {line: 'l5'}, to: {line: 'l6'}, content: (frame, at) => {
      const opts = ['Azul-claro', 'Azul-escuro', 'Azul-claro', 'Azul-escuro', 'Azul-claro'];
      const i = Math.min(opts.length - 1, Math.floor((frame - at({line: 'l5'})) / sec(0.7)));
      return {title: 'VOTO DO PALITO', accent: COLORS.palitoTag, big: {text: opts[i], color: COLORS.bankBlue}, footer: `Mudou de ideia ${i} vez${i === 1 ? '' : 'es'}`};
    }},
    {from: {line: 'l6', edge: 'end', offset: 0.1}, to: {line: 'l7', offset: -0.5}, content: {title: 'NOVO CONVITE', accent: COLORS.bankBlue, rows: [{text: 'Alinhamento: cor do botão (parte 2)', bold: true}, {text: 'Duração: 4 h · Obrigatória', color: COLORS.danger}]}},
  ],
  question: 'Quanto tempo durou a sua pior reunião?',
  thumbnailText: ['3 HORAS', 'DE REUNIÃO?!'],
});
