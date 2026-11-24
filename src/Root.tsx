import React from 'react';
import {Composition, Still} from 'remotion';
import {VIDEO} from './config/tokens';
import {Episode01, TIMELINE as EP01} from './episodes/ep01-cafe-segunda/Episode01';
import {Episode02, TIMELINE as EP02} from './episodes/ep02-senha-perfeita/Episode02';
import {Episode03, TIMELINE as EP03} from './episodes/ep03-despertador/Episode03';
import {Episode04, TIMELINE as EP04} from './episodes/ep04-wifi-visita/Episode04';
import {Episode05, TIMELINE as EP05} from './episodes/ep05-atualizacao-2/Episode05';
import {Episode06, TIMELINE as EP06} from './episodes/ep06-academia-amanha/Episode06';
import {Episode07, TIMELINE as EP07} from './episodes/ep07-boleto/Episode07';
import {Episode08, TIMELINE as EP08} from './episodes/ep08-reuniao/Episode08';
import {Episode09, TIMELINE as EP09} from './episodes/ep09-audio-5-minutos/Episode09';
import {Episode10, TIMELINE as EP10} from './episodes/ep10-feliz-sexta/Episode10';
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
    <Composition
      id="Ep03Despertador"
      component={Episode03}
      durationInFrames={EP03.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Still id="Ep03Thumb" component={Episode03} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep04WifiVisita" component={Episode04} durationInFrames={EP04.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep04Thumb" component={Episode04} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep05Atualizacao2" component={Episode05} durationInFrames={EP05.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep05Thumb" component={Episode05} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep06AcademiaAmanha" component={Episode06} durationInFrames={EP06.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep06Thumb" component={Episode06} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep07Boleto" component={Episode07} durationInFrames={EP07.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep07Thumb" component={Episode07} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep08Reuniao" component={Episode08} durationInFrames={EP08.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep08Thumb" component={Episode08} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep09Audio5Minutos" component={Episode09} durationInFrames={EP09.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep09Thumb" component={Episode09} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep10FelizSexta" component={Episode10} durationInFrames={EP10.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep10Thumb" component={Episode10} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Still id="ProfilePicture" component={ProfilePicture} width={PROFILE.width} height={PROFILE.height} />
    <Still id="PromoPost" component={PromoPost} width={PROMO.width} height={PROMO.height} />
    <Still id="ChannelBanner" component={ChannelBanner} defaultProps={{showSafeArea: false}} width={BANNER.width} height={BANNER.height} />
  </>
);
