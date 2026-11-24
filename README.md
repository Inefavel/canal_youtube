# Bolota & Palito

Repositório de produção do canal **Bolota & Palito** no YouTube.

Estúdio de **desenho animado programático** para YouTube Shorts (9:16), feito com React, TypeScript e [Remotion](https://www.remotion.dev/). Cada episódio é código: personagens, expressões, lip-sync, câmera, legendas e áudio são gerados e renderizados sem editor de vídeo.

## Começando
Requer Node 18+.

```bash
npm install
npm run dev          # gera os áudios placeholder e abre o Remotion Studio
npm run render:ep01  # renderiza out/ep01-cafe-segunda.mp4
npm run thumb:ep01   # gera out/ep01-thumb.png
npm run typecheck
npm run brand        # foto de perfil (800x800), banner (2560x1440) e post de divulgação (1080x1350) em out/brand/
```

Para usar um Chrome/Chromium já instalado em vez do que o Remotion baixa, defina `REMOTION_BROWSER=/caminho/do/chrome`.

## Estrutura
```
src/
  config/        tokens.ts (cores, fontes, proporções, FPS, zonas seguras) · timing.ts (sec(), molas, piscada)
  characters/    Character.tsx (corpo, braços, pernas, piscada) · parts/Eye.tsx · parts/Mouth.tsx
                 expressions.ts (tired, shocked, happy, annoyed, sleeping…) · index.tsx (Bolota, Palito)
  lipsync/       cues.ts (texto → bocas · Rhubarb JSON → bocas · busca binária por frame)
  components/    Camera (zoom/tremor) · Captions (palavra a palavra) · Transitions (íris, cartela, Zzz, impacto)
                 EpisodeAudio (monta falas, efeitos e trilha do dialogue.json) · keyframes (kf, step)
  branding/      ProfilePicture.tsx (foto de perfil) · ChannelBanner.tsx (banner com área segura do YouTube) · PromoPost.tsx (post de divulgação)
  scenes/        Kitchen.tsx (cenário estático e memoizado)
  props/         CoffeeMachine, Cup, WallClock
  episodes/      ep01-cafe-segunda/ dialogue.json (roteiro e tempos) · Episode01.tsx · METADATA.md
scripts/         generate-placeholder-audio.mjs (vozes "blip", efeitos e trilha em WAV)
docs/            biblia-do-canal.md
```

## Criando um novo episódio
1. Copie `src/episodes/ep01-cafe-segunda` para `src/episodes/ep02-<nome>`.
2. Edite `dialogue.json` (falas, tempos em segundos e efeitos) e o componente do episódio.
3. Registre a `<Composition>` em `src/Root.tsx` e adicione os scripts `render:ep02` e `thumb:ep02` no `package.json`.
4. `npm run dev` para iterar, e depois `npm run render:ep02`.

## Vozes (ElevenLabs)
As falas são geradas pela API da ElevenLabs com **tempo por caractere**, que alimenta o lip-sync e as legendas palavra a palavra.

| Personagem | Voz | Estilo |
|---|---|---|
| Bolota | Callum | rouca, cansada e dramática |
| Palito | Will | relaxada e otimista |
| Máquina | Daniel | locutor formal e neutro |

As vozes, o modelo e os ajustes (estabilidade, estilo, velocidade) ficam em `src/config/voices.json`.

```bash
ELEVENLABS_API_KEY=sk_... npm run voices                # gera só as falas novas ou alteradas (cache por hash)
ELEVENLABS_API_KEY=sk_... npm run voices -- --only=ep01
ELEVENLABS_API_KEY=sk_... npm run voices -- --force     # regenera tudo
```

- **Saída:** `public/voices/<ep>/<id>.mp3` mais `src/episodes/<pasta>/voices.json` (duração e alinhamento). Os dois vão para o git, para que o render não dependa da API.
- **Ajustes:** se uma fala real ficar mais longa que o espaço até a próxima, o script avisa. Ajuste `start` no `dialogue.json`; as ações da cena se movem junto, porque os marcadores são derivados das falas.
- **Pronúncia diferente da legenda:** use o campo `tts` no `dialogue.json` (ex.: legenda "UM café", fala "um café"). Precisa ter o mesmo número de palavras.
- **Atrás de proxy (Node 22.21+):** acrescente `NODE_USE_ENV_PROXY=1` ao comando.

Efeitos sonoros e trilha (`public/audio`) continuam sendo **placeholders gerados por código** e ficam fora do git. Uma fala sem voz gerada usa automaticamente o placeholder "blip".
