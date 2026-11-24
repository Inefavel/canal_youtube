import React from 'react';
import {Character} from './Character';
import type {CharacterProps} from './types';

/** Bolota: redondo, laranja, cansado e dramático. */
export const Bolota: React.FC<CharacterProps> = (props) => <Character id="bolota" blinkSeed={1} {...props} />;

/** Palito: alto, azul, calmo e otimista demais. */
export const Palito: React.FC<CharacterProps> = (props) => <Character id="palito" blinkSeed={4} {...props} />;

export type {CharacterProps, Expression, FaceMouth} from './types';
