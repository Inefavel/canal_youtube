import React from 'react';
import {Composition, Still} from 'remotion';
import {VIDEO} from './config/tokens';
import {sec} from './config/timing';
import {Episode01} from './episodes/ep01-cafe-segunda/Episode01';
import ep01 from './episodes/ep01-cafe-segunda/dialogue.json';

/** Registro de todos os episódios. Para um novo episódio: crie a pasta em src/episodes e adicione uma <Composition>. */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Ep01CafeSegunda"
      component={Episode01}
      durationInFrames={sec(ep01.durationSeconds)}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Still id="Ep01Thumb" component={Episode01} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
  </>
);
