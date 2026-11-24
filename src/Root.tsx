import React from 'react';
import {Composition, Still} from 'remotion';
import {VIDEO} from './config/tokens';
import {Episode01, TIMELINE as EP01} from './episodes/ep01-cafe-segunda/Episode01';

/** Registro de todos os episódios. Para um novo episódio: crie a pasta em src/episodes e adicione uma <Composition>. */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Ep01CafeSegunda"
      component={Episode01}
      durationInFrames={EP01.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Still id="Ep01Thumb" component={Episode01} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
  </>
);
