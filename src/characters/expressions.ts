import type {Expression, FaceMouth} from './types';

export type ExpressionSpec = {
  /** Pálpebra superior: 0 = aberta, 1 = fechada. */
  lid: number;
  /** Rotação das sobrancelhas (graus; positivo = "bravo", negativo = "triste"). */
  browAngle: number;
  /** Altura das sobrancelhas em relação ao olho (px; maior = mais surpreso). */
  browLift: number;
  /** Escala do olho (choque aumenta). */
  eyeScale: number;
  /** Escala da pupila (choque diminui). */
  pupilScale: number;
  restMouth: FaceMouth;
  blush: boolean;
};

export const EXPRESSIONS: Record<Expression, ExpressionSpec> = {
  neutral: {lid: 0.05, browAngle: 0, browLift: 22, eyeScale: 1, pupilScale: 1, restMouth: 'closed', blush: false},
  tired: {lid: 0.55, browAngle: -12, browLift: 14, eyeScale: 1, pupilScale: 0.9, restMouth: 'frown', blush: false},
  shocked: {lid: 0, browAngle: -6, browLift: 46, eyeScale: 1.28, pupilScale: 0.45, restMouth: 'round', blush: false},
  happy: {lid: 0.15, browAngle: -8, browLift: 30, eyeScale: 1, pupilScale: 1.1, restMouth: 'smile', blush: true},
  annoyed: {lid: 0.45, browAngle: 14, browLift: 10, eyeScale: 1, pupilScale: 0.8, restMouth: 'flat', blush: false},
  sleeping: {lid: 1, browAngle: -4, browLift: 16, eyeScale: 1, pupilScale: 1, restMouth: 'small', blush: false},
};
