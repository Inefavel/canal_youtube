# EP01 — O Café da Segunda

**Duração:** 30 s · **Formato:** Shorts 9:16 · **Composição:** `Ep01CafeSegunda` · **Thumbnail:** `Ep01Thumb` (frame 207)

## Roteiro
| Tempo | Quem | Fala / ação |
|---|---|---|
| 0,3–2,7 s | Bolota | "Segunda-feira. Eu só preciso de UM café." (close, olhos pesados) |
| 2,8–3,6 s | — | Bolota pula e aperta o botão (*click*, *ding*) |
| 3,8–6,0 s | Máquina | "Atualização obrigatória. Tempo estimado: três horas." |
| 6,3–7,6 s | Bolota | "TRÊS HORAS?!" (zoom, tremor, linhas de impacto) |
| 8,0 s | Palito | Entra pela esquerda com uma mola (*whoosh*) |
| 9,0–11,5 s | Palito | "Relaxa. Se ninguém olhar, vai mais rápido." |
| 11,8–13,5 s | Bolota | "Isso não faz o menor sentido." |
| 14,5–16,5 s | — | Cartela "3 HORAS DEPOIS..." |
| 16,5–21,0 s | — | Time-lapse: relógio gira, os dois dormem, progresso de 2% a 99% |
| 21,0 s | Máquina | 100%: "CaféOS 2.0 — BEM-VINDO!" (*ding*) |
| 21,3–23,4 s | Máquina | "Novidade: agora servimos apenas chá de camomila." |
| 23,5 s | — | Sai o copo de chá (*pop*) |
| 24,5–25,8 s | Palito | "Olha só... relaxante!" |
| 26,2 s | Bolota | Tique no olho (*boing*), zoom lento |
| 27,0–28,8 s | Bolota | "...Eu odeio segunda." |
| 28,8–30 s | — | Fechamento em íris |

## Títulos (escolha 1)
1. **3 HORAS pra fazer UM café ☕😩 #shorts**
2. **Quando a cafeteira resolve atualizar na segunda-feira**
3. **Eu só queria um café... (a máquina tinha outros planos)**

## Descrição (SEO)
```
Segunda-feira, 7h da manhã, e tudo que o Bolota queria era UM café. Mas a cafeteira decidiu fazer uma atualização obrigatória de 3 horas... e o resultado foi pior do que ele imaginava. ☕😩

Quem nunca foi traído pela tecnologia logo de manhã? Marca aquele amigo que não funciona sem café!

Bolota & Palito: desenho animado sobre os pequenos dramas da vida adulta.
Novos episódios toda semana.

#shorts #animação #humor #segundafeira #café #desenhoanimado #vidaadulta #memes
```

## Tags
`animação, desenho animado, humor, shorts, segunda-feira, café, cafeteira, atualização, tecnologia, vida adulta, memes brasileiros, bolota e palito, animação curta, comédia, humor de escritório`

## Thumbnail
- **Frame:** 207 (6,9 s), com Bolota em choque, braços para cima, linhas de impacto e a tela "ATUALIZANDO... 1%" ao fundo.
- **Texto:** "3 HORAS PRA UM CAFÉ?!" em amarelo `#FFD32A` com contorno grosso, inclinado -6°.
- **Gerar:** `npm run thumb:ep01` cria `out/ep01-thumb.png`. Nos Shorts, a capa é escolhida entre os frames do vídeo no app do YouTube; esse PNG serve para o pin da comunidade e para outras redes.

## Para substituir por áudio real
1. Grave cada fala e salve como `public/audio/ep01/l1.wav` … `l8.wav`.
2. Ajuste `start` e `end` em `dialogue.json` para a duração real.
3. Rode o Rhubarb em cada fala e troque `cuesFromText` por `cuesFromRhubarb` em `Episode01.tsx`.
4. Use `npm run audio -- --keep-existing` para não sobrescrever os arquivos reais.
