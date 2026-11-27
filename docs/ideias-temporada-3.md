# Ideias — Temporada 3

Base: as duas recomendações do vidIQ.
1. **Abertura mais rápida:** o conflito precisa aparecer na tela (imagem **e** som) entre **0 e 1 s**, antes do "swipe".
2. **Puxar conversa:** toda descrição termina com uma pergunta, e um **comentário fixado** repete essa pergunta logo depois da estreia.

## Regras de produção da T3

| Regra | Como aplicar no código |
|---|---|
| **Abrir no meio do problema** | Nada de apresentar a situação antes. O frame 0 já mostra o conflito: número absurdo, alarme, tela de erro. A explicação vem depois, se for necessária. |
| **Gancho visual no frame 0** | `ScreenCard` ou `PhoneNotification` com `start={0}` e zoom inicial alto (1,5 → 1,1 em 0,6 s). |
| **Gancho sonoro no frame 0** | SFX com `at: 0` (alarm, buzz, boing) e a primeira fala com `start: 0.15`, sem pausa. |
| **Primeira fala curta** | No máximo 6 palavras, de preferência uma exclamação ("QUATRO MIL REAIS?!"). |
| **Thumbnail = frame 0** | O primeiro quadro já funciona como capa do Shorts, porque é ele que aparece no feed. |
| **Final que pede resposta** | A última fala ou a cartela final faz uma pergunta direta ao público, com opções A/B que facilitem responder. |
| **Comentário fixado** | Cada `METADATA.md` ganha a seção "Comentário fixado", que é postada e fixada no dia da estreia. |

## Episódios sugeridos

| # | Título | 0–1 s (imagem + som) | Conflito → virada | Pergunta para os comentários | Cenário |
|---|---|---|---|---|---|
| 21 | ✅ **Conta de Luz** (EP21) | Cartão "CONTA DE LUZ: R$ 847" + alarme. Bolota: "OITOCENTOS REAIS?!" | Ele desliga tudo, até a geladeira. Descobre que o Palito deixou o ar-condicionado ligado "pro gato", e eles nem têm gato. | "Qual foi a conta mais absurda que já chegou pra você?" | Cozinha |
| 22 | **Senha do Wi-Fi do Vizinho** | Tela "Wi-Fi: 0 redes" + buzz. "SEM INTERNET?!" | Ele tenta 30 senhas na rede do vizinho. Era "palito123": o vizinho é o Palito. | "Você já pediu a senha do Wi-Fi do vizinho? 1 = sim, 2 = nunca" | Escritório |
| 23 | **A Balança** | Balança grita "ERRO" + boing logo no primeiro quadro. | Ele tira o relógio, os sapatos, a meia, prende a respiração... A balança: "Uma pessoa por vez." Era o Palito apoiando o pé. | "Qual é a sua desculpa favorita na balança?" | Quarto |
| 24 | **Reunião que Podia Ser um E-mail** | Tela "Reunião: 3 h 12 min" + alarme. | Uma reunião de 3 horas para decidir a cor de um botão. No fim, o chefe: "Vamos marcar outra para alinhar." | "Quanto tempo durou a sua pior reunião?" | Escritório |
| 25 | **O Último Pedaço** | Close no último pedaço de pizza + "ding". Os dois: "É MEU!" | Duelo de olhares em câmera lenta. Enquanto discutem, o entregador come. | "Último pedaço: você divide ou disputa?" | Cozinha |
| 26 | **Atualização do Celular** | "Atualização obrigatória: 147%" + buzz. | O celular reinicia 9 vezes. Quando volta, o app novo tirou o botão que ele mais usava. | "Qual atualização acabou com seu celular?" | Quarto |
| 27 | **Autoatendimento** | "ITEM INESPERADO NA ÁREA DE ENSACAMENTO" + alarme. | Cada item dispara o alarme. O atendente chega... é o Palito: "Senhor, isso é sua mochila." | "Caixa normal ou autoatendimento? Responde aqui" | Mercado |
| 28 | **Áudio no Viva-Voz** | Áudio no viva-voz no ônibus + "pop": "...e aí o Bolota falou que o chefe..." | Ele tenta parar o áudio e aumenta o volume. O ônibus inteiro ouve o resto. | "Já passou vergonha com áudio no viva-voz?" | Novo: ônibus |
| 29 | **Seguro do Celular** | Celular caindo em câmera lenta no primeiro quadro + "whoosh". | Ele pega o celular no ar, comemora e derruba o café no notebook. O seguro só cobria o celular. | "Você faz seguro do celular ou vive perigosamente?" | Escritório |
| 30 | **Fim de Ano (final da T3)** | Calendário rasgando de 1º de janeiro a 31 de dezembro + "boing". "JÁ É DEZEMBRO?!" | As metas do ano (academia, dieta, ler 12 livros) passam em 2 segundos. O Palito cumpriu todas... da lista de 2025. | "Quantas metas desse ano você cumpriu? Seja sincero" | Quarto → cozinha |

## Ordem sugerida
EP21 Conta de Luz · EP22 Senha do Wi-Fi · EP23 A Balança · EP24 Reunião · EP25 O Último Pedaço · EP26 Atualização · EP27 Autoatendimento · EP28 Áudio no Viva-Voz · EP29 Seguro do Celular · EP30 Fim de Ano

**Por quê:** a ordem abre com temas de dinheiro e internet, que geram mais comentários, e reaproveita os cenários que já existem. O ônibus é o único cenário novo. O EP30 encerra o ano e faz eco ao EP10 ("Feliz Sexta").

## Modelo de comentário fixado
```
E você? [pergunta do episódio] 👇
(Os melhores comentários podem virar episódio da T4!)
```
O "pode virar episódio" convida a pessoa a responder e ainda gera ideias para a próxima temporada.
