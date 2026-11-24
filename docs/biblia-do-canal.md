# Bíblia do Canal — Bolota & Palito

| Item | Definição |
|---|---|
| Nome do canal | **Bolota & Palito** |
| Público | Humor geral / adulto jovem (18–35), **não** marcado como "conteúdo para crianças" |
| Formato | YouTube Shorts 9:16, 1080x1920, 30 fps, 25–45 s |
| Idioma | Português do Brasil |
| Stack | React + TypeScript + Remotion |

## Conceito
Desenho minimalista e geométrico sobre **pequenas tragédias do cotidiano adulto**: tecnologia que não colabora, segunda-feira, trabalho, contas, burocracia. Situações universais e reconhecíveis, com uma virada absurda no final.

## Pilares de conteúdo
1. **Tecnologia contra mim:** atualizações, senhas, Wi-Fi, impressora.
2. **Segunda-feira eterna:** trabalho, reuniões, despertador.
3. **Vida adulta:** contas, mercado, academia que nunca começa.
4. **Lógica do Palito:** conselhos inúteis ditos com total confiança.

## Personagens

### Bolota (protagonista)
- **Forma:** retângulo arredondado largo (420x380), laranja `#FF9F43`, barriga `#FFD29A`.
- **Personalidade:** exausto, dramático e realista. Sempre quer algo simples (café, silêncio, 5 minutos).
- **Expressões-assinatura:** `tired` (padrão) e `annoyed` com tique no olho (`twitch`) no desfecho.
- **Voz placeholder:** grave (165 Hz).

### Palito (alívio cômico)
- **Forma:** pílula alta (210x640), azul `#4FA3F7`, barriga `#B8DCFF`.
- **Personalidade:** otimista demais e calmo em excesso. Dá conselhos sem sentido com total confiança.
- **Expressão-assinatura:** `happy` com bochechas rosadas.
- **Voz placeholder:** aguda (300 Hz).

### Regras de consistência visual
- Contorno sempre `COLORS.ink`, espessura `CHARACTER.outline` (10 px).
- Olhos, boca e expressões apenas pelos componentes de `src/characters`, nunca desenhados à parte.
- Cores e fontes só de `src/config/tokens.ts`.

## Estrutura narrativa (Shorts)
| Tempo | Função | Regra |
|---|---|---|
| 0–3 s | **Gancho** | Close no personagem com um desejo ou problema claro. A legenda já aparece no frame 9. |
| 3–8 s | **Conflito** | O obstáculo aparece com reação exagerada (zoom, tremor, linhas de impacto). |
| 8–20 s | **Escalada** | O Palito piora tudo, ou o tempo passa (time-lapse). |
| 20–27 s | **Virada** | A "solução" chega e é pior que o problema. |
| 27–30 s | **Punchline + loop** | Frase curta de desfecho e fechamento em íris. O fim deve chamar o começo, para o loop do Shorts. |

## Diretrizes de plataforma
- O conteúdo é para público geral, então CTAs são permitidos, mas use no máximo um, falado ou escrito no fim, sem interromper a piada.
- Sem marcas reais na tela (a máquina se chama "CaféOS", que é fictício).
- Trilha e efeitos são gerados por código (sem direitos autorais). Ao trocar por áudio real, use apenas bibliotecas livres ou licenciadas.
