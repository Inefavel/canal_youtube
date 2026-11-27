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
import {Episode11, TIMELINE as EP11} from './episodes/ep11-grupo-familia/Episode11';
import {Episode12, TIMELINE as EP12} from './episodes/ep12-captcha/Episode12';
import {Episode13, TIMELINE as EP13} from './episodes/ep13-carregador/Episode13';
import {Episode14, TIMELINE as EP14} from './episodes/ep14-spoiler/Episode14';
import {Episode15, TIMELINE as EP15} from './episodes/ep15-entrega/Episode15';
import {Episode16, TIMELINE as EP16} from './episodes/ep16-termos/Episode16';
import {Episode17, TIMELINE as EP17} from './episodes/ep17-promocao/Episode17';
import {Episode18, TIMELINE as EP18} from './episodes/ep18-modo-aviao/Episode18';
import {Episode19, TIMELINE as EP19} from './episodes/ep19-fila-banco/Episode19';
import {Episode20, TIMELINE as EP20} from './episodes/ep20-senha-cartao/Episode20';
import {Episode21, TIMELINE as EP21} from './episodes/ep21-conta-de-luz/Episode21';
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
    <Composition id="Ep11GrupoFamilia" component={Episode11} durationInFrames={EP11.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep11Thumb" component={Episode11} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep12Captcha" component={Episode12} durationInFrames={EP12.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep12Thumb" component={Episode12} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep13Carregador" component={Episode13} durationInFrames={EP13.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep13Thumb" component={Episode13} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep14Spoiler" component={Episode14} durationInFrames={EP14.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep14Thumb" component={Episode14} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep15Entrega" component={Episode15} durationInFrames={EP15.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep15Thumb" component={Episode15} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep16Termos" component={Episode16} durationInFrames={EP16.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep16Thumb" component={Episode16} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep17Promocao" component={Episode17} durationInFrames={EP17.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep17Thumb" component={Episode17} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep18ModoAviao" component={Episode18} durationInFrames={EP18.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep18Thumb" component={Episode18} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep19FilaBanco" component={Episode19} durationInFrames={EP19.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep19Thumb" component={Episode19} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep20SenhaCartao" component={Episode20} durationInFrames={EP20.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep20Thumb" component={Episode20} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Ep21ContaDeLuz" component={Episode21} durationInFrames={EP21.durationInFrames} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Still id="Ep21Thumb" component={Episode21} defaultProps={{thumbnail: true}} width={VIDEO.width} height={VIDEO.height} />
    <Still id="ProfilePicture" component={ProfilePicture} width={PROFILE.width} height={PROFILE.height} />
    <Still id="PromoPost" component={PromoPost} width={PROMO.width} height={PROMO.height} />
    <Still id="ChannelBanner" component={ChannelBanner} defaultProps={{showSafeArea: false}} width={BANNER.width} height={BANNER.height} />
  </>
);
