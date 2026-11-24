/**
 * Design tokens centrais do canal.
 * TODA cor, fonte, proporção e taxa de quadros deve vir daqui.
 */

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

export const COLORS = {
  // Base
  ink: '#1E1B2E', // contorno e texto
  paper: '#FFF8EC',
  shadow: 'rgba(30, 27, 46, 0.18)',

  // Personagens
  bolotaBody: '#FF9F43',
  bolotaBelly: '#FFD29A',
  palitoBody: '#4FA3F7',
  palitoBelly: '#B8DCFF',
  eyeWhite: '#FFFFFF',
  cheek: '#FF6B81',
  mouthInside: '#7A1F35',
  tongue: '#FF6B81',

  // Cenário (cozinha)
  wall: '#FCE7C8',
  wallStripe: '#F8D9AE',
  floor: '#C98B5B',
  floorDark: '#A86E43',
  counter: '#6C5B7B',
  counterTop: '#E8E1F0',

  // Props
  machine: '#2F3542',
  machineScreen: '#1DD1A1',
  machineScreenText: '#0B3D2E',
  progress: '#1DD1A1',
  progressTrack: '#57606F',
  coffee: '#6F4E37',
  tea: '#C9D86B',
  cup: '#FFFFFF',

  // Cenário (escritório em casa)
  officeWall: '#DDEBFF',
  officeWallStripe: '#CFE1FA',
  desk: '#B07A4E',
  deskTop: '#D9A06B',
  plantPot: '#E2725B',
  plant: '#3FB27F',

  // Cenário (quarto)
  bedroomWall: '#EADCF8',
  bedroomWallStripe: '#E1CEF4',
  bedFrame: '#8E6C88',
  blanket: '#4ECDC4',
  blanketDark: '#3BAFA6',
  pillow: '#FFFFFF',
  rug: '#F8A5C2',
  nightSky: '#2C3E73',
  daySky: '#9AD8FF',
  clockDigits: '#FF4757',

  // Props (computador)
  monitor: '#2F3542',
  screenBg: '#F5F7FB',
  bankBlue: '#2E5BFF',
  ok: '#20BF6B',
  danger: '#EB3B5A',

  // Marca (foto de perfil, banner)
  brand: '#FFD32A',
  brandDeep: '#F7B500',

  // UI / legendas
  captionText: '#FFFFFF',
  captionStroke: '#1E1B2E',
  captionHighlight: '#FFD32A',
  bolotaTag: '#FF9F43',
  palitoTag: '#4FA3F7',
} as const;

export const FONTS = {
  display: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
  body: '"Helvetica Neue", Arial, sans-serif',
} as const;

export const TYPE = {
  captionSize: 78,
  captionStroke: 14,
  titleSize: 120,
  screenSize: 44,
} as const;

/** Proporções dos personagens (em px no canvas de 1080x1920). */
export const CHARACTER = {
  bolota: {
    bodyWidth: 420,
    bodyHeight: 380,
    eyeRadius: 46,
    eyeGap: 120,
    legLength: 70,
  },
  palito: {
    bodyWidth: 210,
    bodyHeight: 640,
    eyeRadius: 34,
    eyeGap: 80,
    legLength: 110,
  },
  outline: 10,
} as const;

/** Zonas seguras dos Shorts (a UI do YouTube cobre topo e rodapé). */
export const SAFE_AREA = {
  top: 220,
  bottom: 420,
  side: 60,
} as const;
