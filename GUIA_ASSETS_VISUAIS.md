# 🎨 Guia Completo de Criação e Nomenclatura de Assets Visuais
### *As Crônicas de Idleton*

Este documento serve como mapa definitivo para criação, exportação e organização de todas as artes visuais do jogo (em formato **PNG transparente**, **SVG vetorial** ou **WebP**).

> **Legenda:** ✅ = Arte já existe na pasta · ⬜ = Arte ainda não criada

---

## ⚡ Como Funciona o Carregador Automático Multi-Formato

O jogo conta com um **Carregador Automático Inteligente com Fallback em Cascata**:
1. **Suporte Nativo a PNG e SVG:** Você pode exportar direto do Figma ou Illustrator como `.png` ou `.svg` (ou `.webp`).
2. **Prioridade Dinâmica:** O jogo procura o arquivo na pasta correspondente. Se você colocou um `.png`, ele carrega o `.png`. Se colocou um `.svg`, ele carrega o `.svg`.
3. **Fallback Invisível & Sem Erros:** Se você **ainda não colocou** uma arte para determinado item/prédio/monstro, o jogo continuará exibindo automaticamente o visual procedural atual e os ícones do FontAwesome, sem quebrar o layout nem poluir o console com erros!

---

## 📊 Progresso Geral de Assets

| Categoria | Prontos | Total | % |
| :--- | :---: | :---: | :---: |
| 👑 Logo | 1 | 1 | 100% |
| 📜 Menu | 1 | 9 | 11% |
| 🛡️ Equipamentos | 8 | 8 | 100% |
| 🗡️ Relíquias Míticas | 3 | 3 | 100% |
| 🪙 Recursos | 6 | 6 | 100% |
| 🏛️ Vila (Cidade) | 4 | 4 | 100% |
| 🏰 Domínio Real | 10 | 10 | 100% |
| 🌌 Ascensão | 2 | 9 | 22% |
| 🐾 Companheiros | 8 | 8 | 100% |
| 👹 Monstros | 13 | 15 | 87% |
| 🗡️ Herói | 0 | 5 | 0% |
| 📜 Missões | 0 | 6 | 0% |
| 🎲 Taverna | 0 | 5 | 0% |
| 🗼 Torre | 0 | 13 | 0% |
| **TOTAL** | **56** | **102** | **55%** |

---

## 📁 Estrutura Geral de Diretórios (`public/assets/`)

```text
public/assets/
├── logo.png / logo.svg           -> Logo principal do jogo (Cabeçalho)
├── menu/                         -> Ícones das abas do menu lateral
├── items/                        -> Equipamentos, relíquias e itens da mochila
├── resources/                    -> Ouro, diamantes ancestrais e materiais
├── city/                         -> Edifícios da Vila de Idleton
├── domain/                       -> Fortificação e construções do Domínio Real
├── ascension/                    -> Diamantes ancestrais e bênçãos cósmicas
├── pets/                         -> Companheiros e mascotes
├── monsters/                     -> Monstros, feras e chefões (Canvas e Bestiário)
├── hero/                         -> Sprites do Herói e Especializações (Canvas)
├── quests/                       -> Ícones das Missões do Mural da Vila
├── tavern/                       -> Moedas e Dados dos Minijogos da Taverna
└── tower/                        -> Emblemas dos Modificadores Cósmicos da Torre
```

---

## 👑 0. Logotipo do Jogo
* **Local:** `public/assets/logo.png` ou `public/assets/logo.svg`
* **Dimensões recomendadas:** Retangular proporcional (ex: **320×80px** ou **400×100px** com fundo transparente).
* **Comportamento:** Ao adicionar o arquivo, ele substitui automaticamente o ícone de dragão e o texto "Crônicas de Idleton" no topo do cabeçalho.

| Status | Arquivo | Descrição |
| :---: | :--- | :--- |
| ✅ | `Logo.svg` | Logo principal do jogo |

---

## 📜 1. Menu Lateral (Abas de Navegação)
* **Pasta de destino:** `public/assets/menu/`
* **Dimensões recomendadas:** Prancheta quadrada de **48×48px** ou **64×64px** (PNG transparente ou SVG).

| Status | Arquivo | Aba do Menu | Descrição / Dica Visual |
| :---: | :--- | :--- | :--- |
| ⬜ | `city.png` | **Cidade** | Vila medieval, casas de pedra ou muralhas |
| ⬜ | `inventory.png` | **Inventário** | Mochila de couro de aventureiro ou baú aberto |
| ✅ | `explore.png` | **Exploração** | Mapa de pergaminho, bússola ou espada embainhada |
| ⬜ | `tower.png` | **Torre dos Desafios** | Torre imponente com runas cósmicas |
| ⬜ | `domain.png` | **Domínio** | Fortaleza medieval, castelo ou torre de vigia |
| ⬜ | `companions.png` | **Companheiros** | Pata de fera estilizada ou silhueta de mascote |
| ⬜ | `bestiary.png` | **Bestiário** | Grimório/livro de couro antigo com marca de garra |
| ⬜ | `stats.png` | **Estatísticas** | Pergaminho com selo de cera ou gráfico rúnico |
| ⬜ | `ascension.png` | **Ascensão** | Estrela de 8 pontas, constelação ou asas celestes |

---

## 🛡️ 2. Equipamentos & Mochila
* **Pasta de destino:** `public/assets/items/`
* **Dimensões recomendadas:** Prancheta quadrada de **64×64px** ou **128×128px**.

### Itens Base (Equipados e Inventário):
| Status | Arquivo | Slot / Tipo | Descrição / Dica Visual |
| :---: | :--- | :--- | :--- |
| ✅ | `sword.png` *(ou `weapon.png`)* | **Espada / Arma** | Espada de aço, lâmina rúnica ou adaga |
| ✅ | `shield.png` | **Escudo** | Escudo de metal/madeira com brasão |
| ✅ | `helmet.png` | **Elmo** | Elmo de guerreiro com visor ou elmo alado |
| ✅ | `armor.png` *(ou `chest.png`)* | **Peitoral / Armadura** | Peitoral de placas de aço ou cota de malha |
| ✅ | `legs.png` | **Perneiras** | Calças/grevas de aço com reforço nos joelhos |
| ✅ | `boot.png` *(ou `boots.png`)* | **Botas** | Par de botas de couro com fivelas |
| ✅ | `ring.png` | **Anel** | Anel dourado/prateado com gema rúnica |
| ✅ | `amulet.png` | **Amuleto** | Colar com talismã sagrado ou pingente mágico |

### Relíquias Míticas de Chefes (Forja):
| Status | Arquivo | Relíquia Mítica | Descrição / Dica Visual |
| :---: | :--- | :--- | :--- |
| ✅ | `relic_blade.png` | **Lâmina Dentada de Kobold** | Adaga serrilhada tribal banhada em veneno carmesim |
| ✅ | `relic_shield.png` | **Escudo de Placas de Golem** | Escudo maciço esculpido em granito puro de titãs |
| ✅ | `relic_chest.png` | **Manto Eólico da Harpia** | Manto de couro leve tecido com penas turquesa/violetas |

---

## 🪙 3. Moedas & Recursos
* **Pasta de destino:** `public/assets/resources/`
* **Dimensões recomendadas:** **48×48px** ou **64×64px**.

| Status | Arquivo | Recurso | Descrição / Dica Visual |
| :---: | :--- | :--- | :--- |
| ✅ | `gold.png` | **Ouro** | Moeda de ouro reluzente com símbolo medieval gravado |
| ✅ | `diamonds.png` *(ou `diamond.png`)* | **Diamantes Comuns** | Gema lapidada ciano/azulada (recurso de loot/forja/mochila) |
| ✅ | `wood.png` | **Madeira Nobre** | Feixe de toras com folhas esmeraldas |
| ✅ | `iron.png` | **Minério de Ferro** | Bloco de minério de ferro azul-aço bruto |
| ✅ | `essence.png` | **Essência Mágica** | Orbe violeta mística emanando faíscas arcanas |
| ✅ | `scrap.png` | **Sucata de Metal** | Par de engrenagens de ferro com parafusos |

> 💎 **Diferença Importante:** `diamonds.png` aqui é o diamante/gema convencional do jogo. O **Diamante Ancestral** (da Ascensão) possui arte própria e fica na pasta `public/assets/ascension/`!

---

## 🏛️ 4. Vila de Idleton (Cidade)
* **Pasta de destino:** `public/assets/city/`
* **Dimensões recomendadas:** **96×96px** ou **128×128px**.

| Status | Arquivo | Edifício / Função | Descrição / Dica Visual |
| :---: | :--- | :--- | :--- |
| ✅ | `blacksmith.png` | **Ferreiro** | Bigorna de ferro com martelo em brasa ou fornalha acesa |
| ✅ | `tavern.png` | **Taverna** | Caneca de cerveja espumante de carvalho com tochas |
| ✅ | `oracle.png` | **O Oráculo** | Olho arcano místico luminoso ou bola de cristal púrpura |
| ✅ | `market.png` | **Mercado** | Tenda medieval listrada com caixotes de provisões |

---

## 🏰 5. Domínio Real (Construções e Fortificação)
* **Pasta de destino:** `public/assets/domain/`
* **Dimensões recomendadas:** **80×80px** ou **128×128px**.

| Status | Arquivo | Construção | Descrição / Dica Visual |
| :---: | :--- | :--- | :--- |
| ✅ | `fortification.png` | **Fortificação do Domínio** | Muralha de pedra com estandarte e paliçadas |
| ✅ | `hut.png` | **Cabana** | Pequena cabana rústica de lenhador |
| ✅ | `farm.png` | **Fazenda** | Moinho de vento com campo de trigo dourado |
| ✅ | `workshop.png` | **Oficina** | Galpão de artesãos com ferramentas e roda d'água |
| ✅ | `mine.png` | **Mina** | Entrada de mina escavada na rocha com trilho de carrinho |
| ✅ | `market.png` | **Mercado do Domínio** | Feira de mercadores com tendas de especiarias |
| ✅ | `library.png` | **Biblioteca** | Torre de estudiosos com estantes de tomos antigos |
| ✅ | `garrison.png` | **Quartel** | Quartel militar de pedra com escudos e armas |
| ✅ | `treasury.png` | **Tesouro Real** | Cofre reforçado abarrotado de baús dourados |
| ✅ | `castle.png` | **Castelo Soberano** | Grande castelo imperial com torres pontiagudas |

---

## 🌌 6. Ascensão Cósmica & Bênçãos
* **Pasta de destino:** `public/assets/ascension/`
* **Dimensões recomendadas:** **64×64px** ou **96×96px**.

| Status | Arquivo | Bênção / Ícone | Descrição / Dica Visual |
| :---: | :--- | :--- | :--- |
| ✅ | `ancestral_diamond.png` *(ou `ancestral diamond.svg`)* | **Diamante Ancestral** | Diamante celestial flutuante com brilho estelar cósmico (moeda da Ascensão e Bênçãos) |
| ⬜ | `eternal_str.png` | **Força Ancestral** | Punho blindado flamejante |
| ⬜ | `eternal_def.png` | **Baluarte Eterno** | Escudo divino envolto em aura dourada protetora |
| ⬜ | `eternal_hp.png` | **Vitalidade Titânica** | Coração pulsante de rubi ou árvore da vida cósmica |
| ⬜ | `resource_master.png` | **Mestre dos Recursos** | Mochila de couro transbordando ouro e gemas |
| ⬜ | `golden_touch.png` | **Toque de Midas** | Mão dourada derramando moedas cintilantes |
| ⬜ | `double_loot.png` | **Olho da Fortuna** | Olho aberto com brilho de sorte estelar |
| ⬜ | `fast_hunter.png` | **Caçador Implacável** | Flecha ou asa veloz cortando o vento |
| ⬜ | `crit_master.png` | **Golpe Fatal** | Espada partindo um cristal ao meio com faíscas |

---

## 🐾 7. Companheiros & Mascotes (Pets)
* **Pasta de destino:** `public/assets/pets/`
* **Dimensões recomendadas:** **96×96px** ou **128×128px**.

| Status | Arquivo | Mascote | Efeito | Dica Visual |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `coruja.png` | **Coruja Sábia** | +15% Ganho de XP | Corujinha sábia de penas azul-celeste e olhos luminosos |
| ✅ | `pantera.png` | **Pantera Noturna** | +10% Vel. Ataque | Felino negro elegante com olhos amarelos |
| ✅ | `rato_ladrao.png` | **Rato Ladrão** | +20% Ouro de monstros | Ratinho esperto com moeda na boca |
| ✅ | `raposa.png` | **Raposa Astuta** | +2 Sorte | Raposa com olhos brilhantes e cauda fofa |
| ✅ | `corvo_arcano.png` | **Corvo Arcano** | +15% Dano de Habilidades | Corvo negro com brilho azulado místico |
| ✅ | `lobo_alfa.png` | **Lobo Alfa** | +12% Ataque Base | Lobo feroz com pelagem cinzenta e olhos vermelhos |
| ✅ | `salamandra.png` | **Salamandra Ígnea** | +0.5 HP Regen/s | Salamandra flamejante de escamas laranjas |
| ✅ | `golem_mini.png` | **Golem Guardião** | +15% Defesa Total | Mini golem de pedra com runas brilhantes |

---

## 👹 8. Monstros & Chefões (Canvas & Bestiário)
* **Pasta de destino:** `public/assets/monsters/`
* **Dimensões recomendadas:** **128×128px** ou **256×256px**.
* **Orientação importante:** O monstro deve estar voltado para a **esquerda** (para encarar o herói de frente na arena de combate).

| Status | Arquivo | Espécie | Zonas | Dica Visual |
| :---: | :--- | :--- | :---: | :--- |
| ✅ | `slime.png` | **Slime** | 1, 2 | Gelatina esmeralda com reflexos aquosos |
| ✅ | `goblin.png` | **Goblin** | 1, 2, 3 | Criatura verde orelhuda com adaga afiada |
| ✅ | `lobo.png` | **Lobo** | 2, 3, 4 | Lobo cinzento predador rosnando |
| ✅ | `kobold.png` | **Kobold** | 2, 3, 4 | Réptil humanoide ágil com lança curta |
| ✅ | `esqueleto.png` | **Esqueleto** | 3, 4, 5 | Guerreiro morto-vivo de ossos com escudo rústico |
| ✅ | `bandido.png` | **Bandido** | 3, 4, 5, 6 | Fora-da-lei com capuz escuro e máscara |
| ✅ | `orc.png` | **Orc** | 4, 5, 6 | Guerreiro bruto com pintura de guerra e machado |
| ✅ | `morcego.png` | **Morcego** | 4, 5, 6 | Morcego gigante vampiresco de olhos escarlates |
| ✅ | `zumbi.png` | **Zumbi** | 5, 6, 7 | Zumbi putrefato de trapos rasgados |
| ✅ | `aranha.png` | **Aranha** | 5, 6, 7 | Aracnídeo colossal com presas gotejando veneno |
| ✅ | `harpia.png` | **Harpia** | 6, 7, 8 | Mulher-pássaro com penas afiadas como lâminas |
| ✅ | `golem.png` | **Golem** | 7, 8, 9, 10 | Colosso de pedra esculpida com runas de titãs |
| ✅ | `elemental.png` | **Elemental** | 8, 9, 10 | Entidade viva envolta em labaredas místicas |
| ⬜ | `boss_dragon.png` | **Dragão Titânico** | Chefão | Dragão colossal com asas abertas e presas mortais |
| ⬜ | `boss_generic.png` | **Chefe Genérico** | Chefão | Silhueta imponente coroada com olhos flamejantes |

> 📌 **Nota:** Existe um `boss/boss.svg` avulso que não está na pasta padrão `monsters/`. Considere mover ou criar os sprites de chefão diretamente em `monsters/`.

---

## 🗡️ 9. Herói & Especializações de Classe (Canvas)
* **Pasta de destino:** `public/assets/hero/`
* **Dimensões recomendadas:** **128×128px** ou **256×256px**.
* **Orientação importante:** O herói deve estar voltado para a **direita** (olhando em direção aos monstros na arena).

| Status | Arquivo | Especialização / Papel | Descrição / Dica Visual |
| :---: | :--- | :--- | :--- |
| ⬜ | `hero_base.png` | **Aventureiro Inicial** | Espadachim clássico com túnica azul/marrom e espada |
| ⬜ | `hero_paladin.png` | **Paladino da Luz (Tanque)** | Armadura de placas reluzente com escudo dourado |
| ⬜ | `hero_berserker.png` | **Berserker Sangrento (DPS Físico)** | Guerreiro furioso com machado duplo e marcas de batalha |
| ⬜ | `hero_archmage.png` | **Arquimago Elemental (DPS Mágico)** | Mago de túnica arcana com cajado cristalino e runas |
| ⬜ | `hero_shadow_thief.png` | **Ladrão das Sombras (Crítico)** | Assassino com capuz escuro e adagas curvas gêmeas |

---

## 📜 10. Quadro de Missões da Vila
* **Pasta de destino:** `public/assets/quests/` (para as missões) e `public/assets/city/` (para o quadro)
* **Dimensões recomendadas:** **64×64px** ou **96×96px** (PNG ou SVG com fundo transparente).

| Status | Arquivo | Localização | Missão / Elemento | Descrição / Dica Visual |
| :---: | :--- | :--- | :--- | :--- |
| ⬜ | `quests_board.png` | `public/assets/city/` | **Quadro de Missões** | Pergaminho real ou mural de avisos de madeira com prego |
| ⬜ | `kill_monsters.png` | `public/assets/quests/` | **Extermínio de Criaturas** | Caveira ameaçadora, espadas cruzadas ou presa de monstro |
| ⬜ | `earn_gold.png` | `public/assets/quests/` | **Acúmulo de Riqueza** | Baú aberto com moedas douradas ou pilha de moedas |
| ⬜ | `gather_materials.png` | `public/assets/quests/` | **Coleta de Sucata** | Engrenagens mecânicas, martelo ou barras de metal |
| ⬜ | `spend_gold.png` | `public/assets/quests/` | **Investimento na Cidade** | Tenda de comércio, bolsa de compras ou estalagem |
| ⬜ | `upgrade_equipment.png` | `public/assets/quests/` | **Maestria da Forja** | Martelo brilhante batendo na bigorna com faíscas |

> **Nota das Recompensas:** As tags de recompensas de cada missão (Ouro 🪙, Diamantes 💎, Sucata ⚙️) já utilizam automaticamente as mesmas imagens que você colocar em `public/assets/resources/` (`gold.png`, `diamonds.png`, `scrap.png`).

---

## 🎲 11. Jogos de Aposta da Taverna
* **Pasta de destino:** `public/assets/tavern/`
* **Dimensões recomendadas:** **64×64px** ou **96×96px** (PNG transparente ou SVG).

| Status | Arquivo | Elemento / Jogo | Descrição / Dica Visual |
| :---: | :--- | :--- | :--- |
| ⬜ | `coin_heads.png` | **Moeda: Lado Cara** | Coroa imperial dourada reluzente em alto-relevo |
| ⬜ | `coin_tails.png` | **Moeda: Lado Coroa** | Brasão de armas com espada ou dragão entalhado |
| ⬜ | `dice_hero.png` | **Dado do Jogador** | Dado de 6 faces esmeralda brilhante com vértices arredondados |
| ⬜ | `dice_npc.png` | **Dado do Adversário** | Dado de 6 faces vermelho/carmesim rústico com pontilhado de osso |
| ⬜ | `streak_fire.png` | **Chama de Sequência** | Fogo ardente dourado/alaranjado indicando vitórias seguidas |

---

## 🗼 12. Torre dos Desafios & Modificadores Cósmicos
* **Pasta de destino:** `public/assets/tower/`
* **Dimensões recomendadas:** **64×64px** ou **80×80px** (PNG transparente ou SVG).

| Status | Arquivo | Modificador Cósmico | Efeito no Combate | Dica Visual |
| :---: | :--- | :--- | :--- | :--- |
| ⬜ | `tower_portal.png` | **Portal Astral** | Entrada da Torre | Fenda dimensional púrpura giratória |
| ⬜ | `mod_frenzy.png` | **Pés Ligeiros** | Inimigo +100% vel. ataque | Bota alada ou feixe de raios dourados |
| ⬜ | `mod_curse.png` | **Maldição da Praga** | Regen HP do herói zerada | Caveira com névoa púrpura/carmesim |
| ⬜ | `mod_elements.png` | **Vórtice Elemental** | Danos elementais 3x | Turbilhão de fogo, gelo e relâmpago |
| ⬜ | `mod_armored.png` | **Carapaça de Ferro** | -40% dano físico recebido | Escudo pesado blindado com cravos |
| ⬜ | `mod_berserk.png` | **Fúria Crescente** | Boss ganha ATK a cada seg. | Labareda de fúria avermelhada crescente |
| ⬜ | `mod_regen.png` | **Regeneração Sombria** | Boss regenera HP/s | Coração espectral com tentáculos vitais |
| ⬜ | `mod_silence.png` | **Silêncio Arcano** | Habilidades custam 2x mana | Runa mágica rachada com boca costurada |
| ⬜ | `mod_thorns.png` | **Espinhos Profanos** | Boss reflete dano recebido | Gavinhas pontiagudas de vinhas espinhosas |
| ⬜ | `mod_gravity.png` | **Gravidade Cósmica** | Herói ataca mais lento | Peso esmagador ou vórtice de atração |
| ⬜ | `mod_drain.png` | **Dreno Vital** | Boss rouba HP ao golpear | Gota sanguínea mística sugando energia |
| ⬜ | `mod_amplify.png` | **Amplificação Cósmica** | Boss causa dano aumentado | Seta estelar quádrupla divergente |
| ⬜ | `mod_wither.png` | **Decomposição** | Herói perde HP/s passivo | Gás corrosivo esmeralda gotejando veneno |

---

## 💡 Dicas Práticas de Exportação (Figma / Illustrator)

1. **Fundo Transparente Sempre:** Certifique-se de exportar os PNGs com canal alfa (sem preenchimento branco ou cinza no fundo da prancheta).
2. **Respiro / Margem Interna:** Deixe sempre **2 a 4 pixels de folga** entre o desenho e a borda da prancheta para evitar que traçados ou sombras fiquem cortados.
3. **Se for usar SVG:** Marque a opção "Include viewBox" e "Outline Strokes" (converter traçados em curvas).
4. **Sem necessidade de recarregar o servidor:** Colocou o arquivo na pasta com o nome certo? É só dar **F5** na página do jogo que ele carrega instantaneamente!
