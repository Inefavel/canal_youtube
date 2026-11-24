import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

export type EpisodeAudioData = {
  episode: string;
  music?: {id: string; volume: number};
  lines: {id: string; start: number}[];
  sfx: {id: string; type: string; at: number}[];
};

/**
 * Monta todas as faixas de áudio do episódio a partir do dialogue.json.
 * Arquivos esperados (gerados por `npm run audio` ou substituídos por áudio real):
 *   public/audio/<episode>/<lineId>.wav, public/audio/sfx/<tipo>.wav, public/audio/music/<id>.wav
 */
export const EpisodeAudio: React.FC<{data: EpisodeAudioData; fps: number}> = ({data, fps}) => (
  <>
    {data.music ? <Audio src={staticFile(`audio/music/${data.music.id}.wav`)} volume={data.music.volume} /> : null}
    {data.lines.map((l) => (
      <Sequence key={l.id} from={Math.round(l.start * fps)} layout="none">
        <Audio src={staticFile(`audio/${data.episode}/${l.id}.wav`)} />
      </Sequence>
    ))}
    {data.sfx.map((s) => (
      <Sequence key={s.id} from={Math.round(s.at * fps)} layout="none">
        <Audio src={staticFile(`audio/sfx/${s.type}.wav`)} volume={0.7} />
      </Sequence>
    ))}
  </>
);
