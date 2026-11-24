import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import type {Dialogue, Timeline} from './timeline';

type EpisodeAudioProps = {
  dialogue: Dialogue;
  timeline: Timeline;
};

/**
 * Monta todas as faixas de áudio do episódio:
 *  - falas: voz real (public/voices/...) ou placeholder (public/audio/<ep>/<id>.wav), com velocidade por fala
 *  - efeitos: public/audio/sfx/<tipo>.wav · trilha: public/audio/music/<id>.wav
 */
export const EpisodeAudio: React.FC<EpisodeAudioProps> = ({dialogue, timeline}) => (
  <>
    {dialogue.music ? <Audio src={staticFile(`audio/music/${dialogue.music.id}.wav`)} volume={dialogue.music.volume} /> : null}
    {timeline.lines.map((l) => (
      <Sequence key={l.id} from={l.startFrame} layout="none">
        <Audio src={staticFile(l.audioSrc)} playbackRate={l.playbackRate} />
      </Sequence>
    ))}
    {timeline.sfx.map((s) => (
      <Sequence key={s.id} from={s.frame} layout="none">
        <Audio src={staticFile(`audio/sfx/${s.type}.wav`)} volume={s.volume} />
      </Sequence>
    ))}
  </>
);
