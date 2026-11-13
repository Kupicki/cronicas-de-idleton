/**
 * Guia do Aventureiro (Tutorial & Introdução) — Crônicas de Idleton
 * Módulo isolado para introdução interativa, dicas completas das mecânicas e recompensas.
 */

export const TUTORIAL_REWARD = {
    gold: 500,
    diamond: 15,
    scrap: 50,
    wood: 50,
    iron: 25,
};

export const TUTORIAL_STEPS = [
    {
        id: 'welcome',
        badge: 'Início da Jornada',
        title: 'Bem-vindo a Idleton!',
        icon: 'fa-dragon',
        iconColor: 'text-[#fbbf24]',
        desc: 'As Crônicas de Idleton é um RPG incremental medieval repleto de ação e estratégia. Seu herói treina, batalha e acumula riquezas continuamente — mesmo quando você estiver ocupado. Você comanda as builds, os mascotes, os encantamentos e a expansão do seu império!',
        highlights: [
            {
                icon: 'fa-heart-pulse',
                color: 'text-red-400',
                title: 'Vida, Energia & Mana',
                text: 'Seus atributos vitais definem sua sobrevivência e o uso de habilidades. Se seu HP zerar, seu herói descansa na segurança da vila e pode retornar à luta a partir de 50% de HP.',
            },
            {
                icon: 'fa-chart-line',
                color: 'text-amber-400',
                title: 'Atributos & Especializações (Nv. 10+)',
                text: 'Invista pontos por nível em Força, Defesa, Agilidade, Inteligência e Sorte. No Nível 10, escolha sua Classe (Berserker, Paladino, Mago Arcano ou Ladrão das Sombras) e evolua sua Constelação de Talentos!',
            },
            {
                icon: 'fa-scroll',
                color: 'text-yellow-300',
                title: 'Pergaminho de Crônicas & Conquistas',
                text: 'Acompanhe o histórico de saques no Pergaminho do topo e visite a aba Estatísticas para resgatar Diamantes e Ouro nas Conquistas de Idleton (🏆).',
            },
        ],
    },
    {
        id: 'city',
        badge: 'Aba: Cidade',
        title: 'A Vila de Idleton & Seus Estabelecimentos',
        icon: 'fa-city',
        iconColor: 'text-amber-400',
        desc: 'A Cidade é o refúgio seguro do seu herói e o coração de todos os seus aprimoramentos. Cada prédio possui múltiplas funções estratégicas:',
        highlights: [
            {
                icon: 'fa-hammer',
                color: 'text-orange-400',
                title: 'Ferreiro: Refino, Forja & Relíquias',
                text: 'Melhore seus equipamentos até +10 com Sucata, Ouro e Ferro, encomende armas raras na Forja Misteriosa e crie Relíquias Míticas de Chefes ao atingir 100 abates no Bestiário!',
            },
            {
                icon: 'fa-beer-mug-empty',
                color: 'text-amber-400',
                title: 'Taverna: Jogos, Estalagem & Contratos',
                text: 'Aposte em dados e moeda, contrate o Domador de Feras, descanse na Estalagem para ativar o buff Banquete do Javali (+35% Regen e +20% XP) e entregue Contratos de Suprimento por Diamantes!',
            },
            {
                icon: 'fa-eye',
                color: 'text-purple-400',
                title: 'Oráculo: Bênçãos & Encantamentos',
                text: 'Receba profecias temporárias poderosas e use o Altar de Encantamentos para infundir Fogo, Raio, Gelo ou Vampirismo permanentemente em seus equipamentos usando Essência Mágica.',
            },
            {
                icon: 'fa-store',
                color: 'text-emerald-400',
                title: 'Mercado: Ouro, Escambo & Mercado Negro',
                text: 'Compre materiais com Ouro, permute recursos excedentes sem custo na aba de Escambo e negocie Baús Épicos/Lendários e pacotes raros no Mercado Negro de Diamantes.',
            },
        ],
    },
    {
        id: 'explore',
        badge: 'Aba: Exploração',
        title: 'Biomas, Campeões Elite & Eventos',
        icon: 'fa-map-marked-alt',
        iconColor: 'text-red-400',
        desc: 'Desbrave 7 Biomas distintos — da Floresta Sombria ao Abismo do Vácuo — com efeitos climáticos dinâmicos, criaturas ferozes e encontros surpresa.',
        highlights: [
            {
                icon: 'fa-khanda',
                color: 'text-red-400',
                title: 'Combate Autônomo & Habilidades',
                text: 'Seu herói e seu Mascote Ativo atacam automaticamente. Use o Ataque Concentrado, a Cura Espontânea e a Super Habilidade da sua Classe nos momentos decisivos!',
            },
            {
                icon: 'fa-crown',
                color: 'text-amber-400',
                title: 'Monstros Elite Campeões (👑)',
                text: 'Criaturas com aura dourada podem surgir nas zonas! Elas são mais resistentes, mas concedem 3× Ouro e XP, materiais extras garantidos e 35% de chance de Diamantes.',
            },
            {
                icon: 'fa-compass',
                color: 'text-purple-400',
                title: 'Eventos Interativos & Chefes de Zona',
                text: 'Encontre Mercadores Nômades, Santuários Antigos e Baús Armadilha durante a exploração. Derrote 10 monstros na zona para desafiar o Chefe e avançar para terras mais ricas!',
            },
        ],
    },
    {
        id: 'inventory',
        badge: 'Aba: Inventário',
        title: 'Equipamentos, Conjuntos (Sets) & Auto-Loot',
        icon: 'fa-briefcase',
        iconColor: 'text-blue-400',
        desc: 'Gerencie seu arsenal de 8 peças, combine Conjuntos de Batalha e automatize sua mochila para nunca perder um saque lendário.',
        highlights: [
            {
                icon: 'fa-shield-halved',
                color: 'text-cyan-400',
                title: '8 Slots & Bônus de Conjunto (Sets)',
                text: 'Equipe 4 ou 8 peças do mesmo Conjunto (Protetor de Idleton, Tempestade Primordial ou Ouro do Ganancioso) para ativar bônus passivos e efeitos especiais em combate!',
            },
            {
                icon: 'fa-recycle',
                color: 'text-stone-300',
                title: 'Desmantelar & Trava de Segurança',
                text: 'Transforme equipamentos excedentes em Sucata para o Ferreiro. Use o ícone de Cadeado nos seus melhores itens para protegê-los contra vendas ou desmantelamentos acidentais.',
            },
            {
                icon: 'fa-filter',
                color: 'text-yellow-400',
                title: 'Expansão de Bolsa & Auto-Loot',
                text: 'Expanda sua mochila até 50 espaços e configure o Auto-Loot por raridade para vender ou transformar em sucata automaticamente enquanto você explora.',
            },
        ],
    },
    {
        id: 'domain',
        badge: 'Aba: Domínio',
        title: 'Domínio Real, Serraria & Sinergias',
        icon: 'fa-chess-rook',
        iconColor: 'text-emerald-400',
        desc: 'Construa um feudo próspero que não apenas gera Ouro e Madeira passivamente, mas também fortalece diretamente o seu herói em batalha!',
        highlights: [
            {
                icon: 'fa-tree',
                color: 'text-emerald-400',
                title: 'Produção de Ouro & Serraria Real',
                text: 'Evolua Cabanas, Fazendas, Minas e Castelos para gerar Ouro por segundo, e construa a Serraria Real para produzir Madeira Nobre automaticamente.',
            },
            {
                icon: 'fa-wand-magic-sparkles',
                color: 'text-purple-400',
                title: 'Sinergias Passivas de Construção',
                text: 'Cada prédio concede bônus reais ao herói: HP Máximo (Cabana), Regen (Fazenda), Madeira (Serraria), Desconto na Forja (Oficina), Ferro (Mina), Ouro (Mercado), XP (Biblioteca), Ataque (Quartel), Crítico (Tesouraria) e Todos os Atributos (Castelo)!',
            },
            {
                icon: 'fa-clock',
                color: 'text-blue-400',
                title: 'Fortificação & Lucro Offline',
                text: 'Fortifique a muralha da vila para multiplicar toda a renda do Domínio e colete seus ganhos acumulados sempre que retornar ao jogo.',
            },
        ],
    },
    {
        id: 'companions',
        badge: 'Aba: Companheiros',
        title: 'Mascotes, Afinidade & Talentos Bestiais',
        icon: 'fa-paw',
        iconColor: 'text-amber-400',
        desc: 'Após contratar o Domador na Taverna, adote até 8 Mascotes lendários que evoluem junto com você e lutam ao seu lado.',
        highlights: [
            {
                icon: 'fa-fire-flame-curved',
                color: 'text-amber-400',
                title: 'Sinergia 1.5× & Ataque Conjunto',
                text: 'Todos os mascotes adotados concedem seus bônus passivos simultaneamente! O Mascote equipado como Ativo tem seu bônus amplificado em 1.5× e desfere ataques conjuntos no combate.',
            },
            {
                icon: 'fa-drumstick-bite',
                color: 'text-emerald-400',
                title: 'Níveis de Afinidade (1 a 10)',
                text: 'Seus pets ganham XP em batalhas, expedições ou através do botão Treinar. Cada nível de Afinidade aumenta em +15% o bônus passivo e em +20% o dano do pet!',
            },
            {
                icon: 'fa-dna',
                color: 'text-purple-400',
                title: 'Talentos Bestiais & Expedições',
                text: 'Adoções e níveis de Afinidade concedem Pontos Bestiais para evoluir 6 Talentos (Presas Afiadas, Instinto Alfa, Vínculo Vital, Asas do Vento, Faro de Caçador e Rugido Primordial) e acelerar suas Expedições!',
            },
        ],
    },
    {
        id: 'advanced',
        badge: 'Desafios & Endgame',
        title: 'Torre, Chefe Mundial, Cercos & Ascensão',
        icon: 'fa-monument',
        iconColor: 'text-purple-400',
        desc: 'Teste os limites da sua build nos modos supremos de Idleton e eternize o poder da sua linhagem.',
        highlights: [
            {
                icon: 'fa-dungeon',
                color: 'text-purple-400',
                title: 'Torre dos Desafios (100 Andares)',
                text: 'Escale andares com modificadores cósmicos, Câmaras de Evento (Enigmas, Baús e Pactos) e escolha Cartas de Bênção a cada vitória para conquistar tesouros colossais.',
            },
            {
                icon: 'fa-dragon',
                color: 'text-red-400',
                title: 'Chefe Mundial Diário (60s DPS Check)',
                text: 'Na aba da Torre, enfrente o Titã Colossal do Dia em uma batalha de 60 segundos! Alcance os Patamares de Dano (Bronze até Mítico Imortal) para ganhar Equipamentos de Conjunto e Diamantes Ancestrais.',
            },
            {
                icon: 'fa-star',
                color: 'text-cyan-400',
                title: 'Cerco da Vila & 10 Bênçãos de Ascensão',
                text: 'Defenda a muralha quando o alarme de Cerco soar! Ao atingir o Nível 50 (Zona 10+), realize a Ascensão da Linhagem para ganhar Diamantes Ancestrais (💠) e evoluir 10 Bênçãos eternas.',
            },
        ],
    },
    {
        id: 'reward',
        badge: 'Recompensa de Conclusão',
        title: 'Pronto para Escrever sua Lenda!',
        icon: 'fa-gift',
        iconColor: 'text-[#fbbf24]',
        desc: 'Você completou o Guia do Aventureiro e conhece todos os segredos de Idleton. Como recompensa pelo seu preparo, os anciãos da vila concedem a você um Baú Inicial com recursos preciosos:',
        isFinalStep: true,
    },
];
