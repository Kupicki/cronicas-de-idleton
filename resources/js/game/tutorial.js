/**
 * Guia do Aventureiro (Tutorial & Introdução) — Crônicas de Idleton
 * Módulo isolado para introdução interativa, dicas para iniciantes e recompensas.
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
        desc: 'As Crônicas de Idleton é um RPG incremental medieval. Seu herói treina, batalha e acumula riquezas e glórias continuamente — mesmo quando você estiver ocupado. Você é o mentor que comanda a evolução, os equipamentos e a expansão do seu império!',
        highlights: [
            {
                icon: 'fa-heart-pulse',
                color: 'text-red-400',
                title: 'Vida, Energia & Mana',
                text: 'Seus atributos vitais definem sua sobrevivência e o uso de habilidades. Se seu HP zerar em combate, seu herói descansa na segurança da vila e se recupera automaticamente.',
            },
            {
                icon: 'fa-chart-line',
                color: 'text-amber-400',
                title: 'Atributos Personalizados',
                text: 'A cada nível você ganha pontos para investir livremente em Força, Defesa, Agilidade, Inteligência, Sorte, Percepção e mais!',
            },
            {
                icon: 'fa-scroll',
                color: 'text-yellow-300',
                title: 'Pergaminho de Crônicas',
                text: 'No topo da tela, clique no ícone de Pergaminho para ler o histórico detalhado de todas as suas lutas, drops e conquistas.',
            },
        ],
    },
    {
        id: 'city',
        badge: 'Aba: Cidade',
        title: 'A Vila de Idleton & Seus Prédios',
        icon: 'fa-city',
        iconColor: 'text-amber-400',
        desc: 'A Cidade é o refúgio seguro do seu herói e o centro de todos os seus aprimoramentos. Cada estabelecimento oferece vantagens únicas:',
        highlights: [
            {
                icon: 'fa-hammer',
                color: 'text-orange-400',
                title: 'Ferreiro Ancestral',
                text: 'Melhore armas e armaduras com Sucata e Ouro para multiplicar seu poder. Você também pode forjar novos itens e relíquias raras com lingotes de ferro!',
            },
            {
                icon: 'fa-beer-mug-empty',
                color: 'text-amber-400',
                title: 'Taverna & Domador',
                text: 'Relaxe apostando em jogos de dados e moeda, ouça rumores de terras distantes e contrate o Domador para colecionar Mascotes que enviam itens em expedições.',
            },
            {
                icon: 'fa-eye',
                color: 'text-purple-400',
                title: 'O Oráculo Místico',
                text: 'Consulte o Oráculo para receber Profecias e bênçãos sagradas temporárias (+Dano, +Ouro, +Drops e velocidade).',
            },
            {
                icon: 'fa-store',
                color: 'text-emerald-400',
                title: 'Mercado de Recursos',
                text: 'Compre madeira, sucata, ferro e essências arcanas para acelerar construções e forjas lendárias.',
            },
        ],
    },
    {
        id: 'explore',
        badge: 'Aba: Exploração',
        title: 'Exploração & Combate em Tempo Real',
        icon: 'fa-map-marked-alt',
        iconColor: 'text-red-400',
        desc: 'Embarque em expedições por florestas, cavernas e ruínas antigas para enfrentar monstros selvagens e chefes implacáveis.',
        highlights: [
            {
                icon: 'fa-sword',
                color: 'text-red-400',
                title: 'Combate Autônomo',
                text: 'Seu herói ataca automaticamente no ritmo de sua velocidade de ataque. Enquanto explora, ele acumula Ouro, Experiência (XP) e equipamentos.',
            },
            {
                icon: 'fa-bolt',
                color: 'text-amber-400',
                title: 'Habilidades de Combate',
                text: 'Acione habilidades manuais no momento decisivo: use o Ataque Concentrado para desferir 3x de dano crítico ou a Cura Espontânea para salvar sua vida.',
            },
            {
                icon: 'fa-skull',
                color: 'text-rose-500',
                title: 'Zonas & Chefes',
                text: 'Derrote 10 monstros normais de uma zona para desafiar o Chefe local. Vencê-lo desbloqueia a próxima zona com melhores recompensas.',
            },
        ],
    },
    {
        id: 'inventory',
        badge: 'Aba: Inventário',
        title: 'Inventário, Equipamentos & Auto-Loot',
        icon: 'fa-briefcase',
        iconColor: 'text-blue-400',
        desc: 'Gerencie os itens conquistados em suas batalhas e equipe o melhor conjunto para maximizar seus atributos de combate.',
        highlights: [
            {
                icon: 'fa-shield-halved',
                color: 'text-cyan-400',
                title: '8 Slots de Equipamento',
                text: 'Equipe Arma, Escudo, Elmo, Peitoral, Perneiras, Botas, Anel e Amuleto. Itens possuem raridades que vão de Comum até Mítico!',
            },
            {
                icon: 'fa-recycle',
                color: 'text-stone-300',
                title: 'Desmantelar por Sucata',
                text: 'Não venda tudo por ouro: desmantelar equipamentos obsoletos gera Sucata, material indispensável para o Ferreiro refinar seus itens.',
            },
            {
                icon: 'fa-filter',
                color: 'text-yellow-400',
                title: 'Filtro de Auto-Loot',
                text: 'Configure o Auto-Loot para vender ou desmantelar itens comuns e incomuns automaticamente, evitando que sua mochila lote durante a exploração.',
            },
        ],
    },
    {
        id: 'domain',
        badge: 'Aba: Domínio',
        title: 'Seu Domínio & Riqueza Passiva',
        icon: 'fa-chess-rook',
        iconColor: 'text-emerald-400',
        desc: 'Construa e expanda um feudo próspero para sustentar sua jornada militar com um fluxo constante de ouro passivo.',
        highlights: [
            {
                icon: 'fa-house',
                color: 'text-emerald-400',
                title: 'Construções Produtivas',
                text: 'Evolua de Cabanas e Fazendas até Minas de Ouro, Quartéis e Castelos. Cada edifício produz ouro a cada segundo, dia e noite.',
            },
            {
                icon: 'fa-shield',
                color: 'text-amber-400',
                title: 'Fortificação da Vila',
                text: 'Invista madeira e ouro para fortificar a muralha de Idleton, aplicando um multiplicador percentual em todas as rendas do Domínio.',
            },
            {
                icon: 'fa-clock',
                color: 'text-blue-400',
                title: 'Lucro Offline',
                text: 'Quando você fechar o jogo e voltar mais tarde, todo o ouro acumulado pelas suas propriedades estará guardado pronto para você coletar.',
            },
        ],
    },
    {
        id: 'advanced',
        badge: 'Desafios & Endgame',
        title: 'Torre, Invasões & Ascensão',
        icon: 'fa-monument',
        iconColor: 'text-purple-400',
        desc: 'Conforme seu herói se torna uma lenda, modos especiais e eventos de alto desafio se abrem no reino.',
        highlights: [
            {
                icon: 'fa-dungeon',
                color: 'text-purple-400',
                title: 'Torre dos Desafios',
                text: 'Um modo roguelike andar por andar onde você escolhe bênçãos e enfrenta modificadores perigosos em troca de cartas e tesouros lendários.',
            },
            {
                icon: 'fa-bell',
                color: 'text-red-500',
                title: 'Cerco à Vila de Idleton',
                text: 'Fique atento ao alarme! Invasões de monstros ocorrem periodicamente. Suba na muralha e repila o General Invasor para garantir um grande bônus.',
            },
            {
                icon: 'fa-star',
                color: 'text-yellow-400',
                title: 'Ascensão Heroica',
                text: 'Ao atingir o nível máximo, ascenda seu herói para renascer com Diamantes Ancestrais e destravar bônus divinos permanentes.',
            },
        ],
    },
    {
        id: 'reward',
        badge: 'Recompensa de Conclusão',
        title: 'Pronto para Escrever sua Lenda!',
        icon: 'fa-gift',
        iconColor: 'text-[#fbbf24]',
        desc: 'Você completou o Guia do Aventureiro e está mais que preparado para dominar as terras de Idleton. Como recompensa pelo seu empenho, os anciãos da vila concedem a você um Baú Inicial com recursos preciosos:',
        isFinalStep: true,
    },
];
