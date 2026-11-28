import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Bolota, Palito} from '../characters';
import type {Expression} from '../characters';
import {COLORS, FONTS} from '../config/tokens';
import {LinkCard, PROMO} from './PromoPost';

/**
 * Série de 10 posts de feed (4:5) para o Instagram que convidam a seguir @bolotaepalito
 * e a se inscrever no canal do YouTube. Cada post faz piada com um episódio.
 */
type Bubble = {text: string; side: 'bolota' | 'palito'};
export type FollowPostSpec = {
  bg: string;
  dots: string;
  headline: [string, string];
  sub: string;
  bolota: {expression: Expression; leftArm?: number; rightArm?: number};
  palito: {expression: Expression; leftArm?: number; rightArm?: number};
  bubbles: Bubble[];
  sticker?: {text: string; color: string};
  caption: string;
};

const IG = '@bolotaepalito';
const TAGS = '#bolotaepalito #animação #desenhoanimado #humor #vidaadulta #memes #humorbrasileiro';

export const FOLLOW_POSTS: FollowPostSpec[] = [
  {
    bg: COLORS.brand,
    dots: COLORS.brandDeep,
    headline: ['ACORDEI CEDO', 'SÓ PRA PEDIR:'],
    sub: 'segue a gente, por favor',
    bolota: {expression: 'tired', rightArm: 150},
    palito: {expression: 'happy', leftArm: 155},
    bubbles: [{side: 'bolota', text: 'Às 7 da manhã...'}, {side: 'palito', text: 'SEGUE A GENTE!'}],
    caption: `O Bolota acordou cedo (raridade) só pra pedir isso. 😴\n\nSegue ${IG} aqui e se inscreve no canal do YouTube: episódio novo todo dia ao meio-dia! 👇\n\n${TAGS}`,
  },
  {
    bg: '#9AD8FF',
    dots: '#7CC4F0',
    headline: ['1 CLIQUE.', 'SÓ ISSO.'],
    sub: 'é o esforço que a gente pede',
    bolota: {expression: 'annoyed'},
    palito: {expression: 'happy', leftArm: 150},
    bubbles: [{side: 'palito', text: 'Já segui 3 vezes!'}, {side: 'bolota', text: 'Uma basta, Palito.'}],
    caption: `Seguir: 1 clique. Se inscrever: mais 1 clique. 🖱️\n\nO Palito já fez os dois. Três vezes. 🙃\n\nSegue ${IG} e se inscreve no YouTube (link na bio)! 👇\n\n${TAGS}`,
  },
  {
    bg: '#FFB8B8',
    dots: '#FF9F9F',
    headline: ['EPISÓDIO NOVO', 'TODO DIA 12H'],
    sub: 'no YouTube e aqui no Instagram',
    bolota: {expression: 'shocked', leftArm: 160, rightArm: 160},
    palito: {expression: 'happy', leftArm: 150},
    bubbles: [{side: 'bolota', text: 'Até no domingo?!'}, {side: 'palito', text: 'Até no domingo!'}],
    sticker: {text: '12:00', color: COLORS.danger},
    caption: `Todo dia, meio-dia, tem drama novo do Bolota. 🕛\n\nAtiva as notificações pra não perder: segue ${IG} e se inscreve no canal do YouTube! 🔔\n\n${TAGS}`,
  },
  {
    bg: '#C8F7C5',
    dots: '#A8EBA4',
    headline: ['ANTES QUE A', 'BATERIA ACABE...'],
    sub: 'segue e se inscreve!',
    bolota: {expression: 'shocked', rightArm: 70},
    palito: {expression: 'happy', leftArm: 120},
    bubbles: [{side: 'bolota', text: 'UM POR CENTO!'}, {side: 'palito', text: 'Dá tempo de seguir!'}],
    sticker: {text: '🔋 1%', color: COLORS.danger},
    caption: `Seu celular tá com 1%? Dá tempo de seguir ${IG}. 🔋\n\n(E de se inscrever no YouTube, se for rápido.) 😅\n\nInspirado no episódio "Carregador Emprestado".\n\n${TAGS}`,
  },
  {
    bg: '#EADCF8',
    dots: '#DCC6F3',
    headline: ['TERMOS', 'DE USO'],
    sub: 'ao ler este post, você aceita seguir @bolotaepalito*',
    bolota: {expression: 'shocked', leftArm: 160, rightArm: 160},
    palito: {expression: 'happy', leftArm: 150},
    bubbles: [{side: 'bolota', text: 'EU SÓ LI!'}, {side: 'palito', text: 'Pra mim saiu de graça!'}],
    sticker: {text: '*grátis', color: COLORS.ok},
    caption: `Cláusula 1: ao ler esta legenda, você aceita seguir ${IG}. 📜\nCláusula 2: e se inscrever no YouTube.\nCláusula 3: brincadeira. Mas segue, vai! 😅\n\n${TAGS}`,
  },
  {
    bg: '#DDEBFF',
    dots: '#C6DCFB',
    headline: ['PROVE QUE NÃO', 'É UM ROBÔ:'],
    sub: '☐ clique em SEGUIR',
    bolota: {expression: 'annoyed'},
    palito: {expression: 'happy', leftArm: 150},
    bubbles: [{side: 'bolota', text: 'O poste conta?'}, {side: 'palito', text: 'Só clica em seguir!'}],
    sticker: {text: '✓ humano', color: COLORS.ok},
    caption: `Captcha do dia: clique em SEGUIR para provar que você é humano. 🚦🤖\n\nSegue ${IG} e se inscreve no canal do YouTube! 👇\n\n${TAGS}`,
  },
  {
    bg: '#FFE3C2',
    dots: '#FFD3A0',
    headline: ['ATIVA O', 'SININHO 🔔'],
    sub: 'uma notificação por dia, prometido',
    bolota: {expression: 'shocked', leftArm: 160, rightArm: 160},
    palito: {expression: 'happy', leftArm: 150},
    bubbles: [{side: 'bolota', text: '214 notificações?!'}, {side: 'palito', text: 'Só uma por dia!'}],
    caption: `Prometemos: não é o grupo da família. 📱\n\nSó UMA notificação por dia, ao meio-dia, com episódio novo. Ativa o sininho no YouTube e segue ${IG}! 🔔\n\n${TAGS}`,
  },
  {
    bg: '#2C3E73',
    dots: '#364A87',
    headline: ['O DETOX', 'PODE ESPERAR'],
    sub: 'o próximo episódio, não',
    bolota: {expression: 'happy', rightArm: 70},
    palito: {expression: 'happy', leftArm: 150},
    bubbles: [{side: 'bolota', text: 'Só mais um...'}, {side: 'palito', text: 'Segue que tem mais!'}],
    caption: `Detox digital? Começa amanhã. 📵😂\n\nHoje: segue ${IG} e maratona os episódios no canal do YouTube! 🍿\n\n${TAGS}`,
  },
  {
    bg: '#FF6B81',
    dots: '#FF8195',
    headline: ['PROMOÇÃO', 'IMPERDÍVEL'],
    sub: 'seguir e se inscrever: 100% OFF',
    bolota: {expression: 'happy', leftArm: 160, rightArm: 160},
    palito: {expression: 'happy', leftArm: 150},
    bubbles: [{side: 'bolota', text: 'Só hoje?!'}, {side: 'palito', text: 'Todo dia! É grátis!'}],
    sticker: {text: '100% OFF', color: COLORS.ink},
    caption: `PROMOÇÃO: seguir ${IG} está 100% OFF. 💸\nE amanhã? Continua de graça. (Sem cupom no e-mail do Bolota.) 😅\n\nSe inscreve também no canal do YouTube! 👇\n\n${TAGS}`,
  },
  {
    bg: COLORS.brand,
    dots: COLORS.brandDeep,
    headline: ['SEGUIR NÃO', 'GASTA LUZ'],
    sub: 'nem ar-condicionado pro gato',
    bolota: {expression: 'neutral', rightArm: 120},
    palito: {expression: 'happy', leftArm: 150},
    bubbles: [{side: 'bolota', text: 'Nem um centavo?'}, {side: 'palito', text: 'Nem um centavo!'}],
    sticker: {text: 'R$ 0,00', color: COLORS.ok},
    caption: `Conta de luz de R$ 847? Aqui não. 💡\n\nSeguir ${IG} e se inscrever no YouTube custa R$ 0,00. Bora? 👇\n\n${TAGS}`,
  },
];

const SpeechBubble: React.FC<{b: Bubble; dark: boolean}> = ({b}) => (
  <div
    style={{
      position: 'absolute',
      left: b.side === 'bolota' ? 60 : undefined,
      right: b.side === 'palito' ? 50 : undefined,
      top: b.side === 'bolota' ? 450 : 375,
      maxWidth: 470,
      background: '#FFFFFF',
      border: `7px solid ${COLORS.ink}`,
      borderRadius: 30,
      padding: '14px 26px',
      fontFamily: FONTS.display,
      fontSize: 42,
      lineHeight: 1.1,
      color: COLORS.ink,
      transform: `rotate(${b.side === 'bolota' ? -3 : 3}deg)`,
      boxShadow: `6px 6px 0 ${COLORS.ink}`,
    }}
  >
    {b.text}
  </div>
);

export const FollowPost: React.FC<{index: number}> = ({index}) => {
  const p = FOLLOW_POSTS[index];
  const dark = p.bg === '#2C3E73';
  const dots = Array.from({length: 11 * 14}, (_, i) => ({x: (i % 11) * 100 + (Math.floor(i / 11) % 2) * 50, y: Math.floor(i / 11) * 100}));
  const longest = Math.max(...p.headline.map((h) => h.length));
  return (
    <AbsoluteFill style={{background: p.bg, overflow: 'hidden'}}>
      <svg width={PROMO.width} height={PROMO.height} style={{position: 'absolute'}}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x + 25} cy={d.y + 25} r={8} fill={p.dots} />
        ))}
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 50,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONTS.display,
          fontSize: Math.min(118, Math.floor(1000 / (longest * 0.62))),
          lineHeight: 0.95,
          color: '#FFFFFF',
          WebkitTextStroke: `20px ${COLORS.ink}`,
          paintOrder: 'stroke fill',
          transform: 'rotate(-3deg)',
        }}
      >
        {p.headline.map((h) => (
          <div key={h}>{h}</div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 300, width: '100%', textAlign: 'center', fontFamily: FONTS.display, fontSize: 40, color: dark ? '#FFFFFF' : COLORS.ink, padding: '0 40px'}}>
        {p.sub}
      </div>

      <Palito x={790} y={1000} scale={0.72} expression={p.palito.expression} lookX={-0.6} leftArm={p.palito.leftArm ?? 20} rightArm={p.palito.rightArm ?? 20} blinkSeed={2} />
      <Bolota x={360} y={950} scale={0.85} expression={p.bolota.expression} lookX={0.5} leftArm={p.bolota.leftArm ?? 20} rightArm={p.bolota.rightArm ?? 20} blinkSeed={1} />
      {p.bubbles.map((b) => (
        <SpeechBubble key={b.side} b={b} dark={dark} />
      ))}
      {p.sticker ? (
        <div
          style={{
            position: 'absolute',
            left: 430,
            top: 870,
            padding: '10px 26px',
            background: p.sticker.color,
            border: `7px solid ${COLORS.ink}`,
            borderRadius: 999,
            fontFamily: FONTS.display,
            fontSize: 46,
            color: '#FFFFFF',
            transform: 'rotate(-10deg)',
            boxShadow: `6px 6px 0 ${COLORS.ink}`,
          }}
        >
          {p.sticker.text}
        </div>
      ) : null}

      <LinkCard badge="▶" badgeColor={COLORS.danger} label="Inscreva-se no YouTube" value="youtube.com/@bolotaepalito" top={990} />
      <LinkCard badge="@" badgeColor={COLORS.bankBlue} label="Siga no Instagram" value="@bolotaepalito" top={1170} />
    </AbsoluteFill>
  );
};
