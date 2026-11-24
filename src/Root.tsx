import React from 'react';
import {Composition, Still} from 'remotion';
import {VIDEO} from './config/tokens';
import {Episode01, TIMELINE as EP01} from './episodes/ep01-cafe-segunda/Episode01';
import {Episode02, TIMELINE as EP02} from './episodes/ep02-senha-perfeita/Episode02';
import {BANNER, ChannelBanner} from './branding/ChannelBanner';
import {PROFILE, ProfilePicture} from './branding/ProfilePicture';
import {PROMO, PromoPost} from './branding/PromoPost';

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
    <Composition
      id="Ep02SenhaPerfeita"
      component={Episode02}
      durationInFrames={EP02.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Still id="Ep02Thumb" component={Episode02} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Still id="ProfilePicture" component={ProfilePicture} width={PROFILE.width} height={PROFILE.height} />
    <Still id="PromoPost" component={PromoPost} width={PROMO.width} height={PROMO.height} />
    <Still id="ChannelBanner" component={ChannelBanner} defaultProps={{showSafeArea: false}} width={BANNER.width} height={BANNER.height} />
  </>
);
