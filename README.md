# canal_youtube

Estúdio de **desenho animado programático** para YouTube Shorts (9:16), feito com React, TypeScript e [Remotion](https://www.remotion.dev/). Cada episódio é código: personagens, expressões, lip-sync, câmera, legendas e áudio são gerados e renderizados sem editor de vídeo.

## Começando
Requer Node 18+.

```bash
npm install
npm run dev          # gera os áudios placeholder e abre o Remotion Studio
npm run render:ep01  # renderiza out/ep01-cafe-segunda.mp4
npm run thumb:ep01   # gera out/ep01-thumb.png
npm run typecheck
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

## Áudio
Tudo em `public/audio` é **placeholder gerado por código** e fica fora do git. Para usar voz real, salve os arquivos com os mesmos nomes e rode `npm run audio -- --keep-existing`. Veja a seção de áudio em `src/episodes/ep01-cafe-segunda/METADATA.md`.
