import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import type {Dialogue, TimedLine} from './timeline';

type EpisodeAudioProps = {
  dialogue: Dialogue;
  lines: TimedLine[];
  fps: number;
};

/**
 * Monta todas as faixas de áudio do episódio:
 *  - falas: voz real (public/voices/...) ou placeholder (public/audio/<ep>/<id>.wav)
 *  - efeitos: public/audio/sfx/<tipo>.wav · trilha: public/audio/music/<id>.wav
 */
export const EpisodeAudio: React.FC<EpisodeAudioProps> = ({dialogue, lines, fps}) => (
  <>
    {dialogue.music ? <Audio src={staticFile(`audio/music/${dialogue.music.id}.wav`)} volume={dialogue.music.volume} /> : null}
    {lines.map((l) => (
      <Sequence key={l.id} from={l.startFrame} layout="none">
        <Audio src={staticFile(l.audioSrc)} />
      </Sequence>
    ))}
    {dialogue.sfx.map((s) => (
      <Sequence key={s.id} from={Math.round(s.at * fps)} layout="none">
        <Audio src={staticFile(`audio/sfx/${s.type}.wav`)} volume={0.6} />
      </Sequence>
    ))}
  </>
);
