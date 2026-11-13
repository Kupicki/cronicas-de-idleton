// ==========================================
// RARIDADES
// ==========================================
export const RARITIES = [
    { id: 'common',    name: 'Comum',    color: '#9ca3af', mult: 1.0,  chance: 60,  glowClass: '' },
    { id: 'uncommon',  name: 'Incomum',  color: '#4ade80', mult: 2.0,  chance: 25,  glowClass: '' },
    { id: 'rare',      name: 'Raro',     color: '#60a5fa', mult: 4.0,  chance: 10,  glowClass: '' },
    { id: 'epic',      name: 'Épico',    color: '#c084fc', mult: 8.0,  chance: 4,   glowClass: '' },
    { id: 'legendary', name: 'Lendário', color: '#fbbf24', mult: 10.0, chance: 0.8, glowClass: 'legendary-glow' },
    { id: 'mythic',    name: 'Mítico',   color: '#dc2626', mult: 20.0, chance: 0.2, glowClass: 'mythic-glow' },
];

// ==========================================
// TIPOS DE ITEM
// ==========================================
export const ITEM_TYPES = [
    { id: 'weapon', name: 'Espada',    icon: 'fa-khanda',        stat: 'str',   baseVal: 3  },
    { id: 'shield', name: 'Escudo',    icon: 'fa-shield-halved', stat: 'def',   baseVal: 2  },
    { id: 'helmet', name: 'Elmo',      icon: 'fa-crown',         stat: 'hpMax', baseVal: 10 },
    { id: 'chest',  name: 'Peitoral',  icon: 'fa-shirt',         stat: 'hpMax', baseVal: 15 },
    { id: 'legs',   name: 'Perneiras', icon: 'fa-socks',         stat: 'def',   baseVal: 2  },
    { id: 'boots',  name: 'Botas',     icon: 'fa-shoe-prints',   stat: 'agi',   baseVal: 1  },
    { id: 'ring',   name: 'Anel',      icon: 'fa-ring',          stat: 'int',   baseVal: 1  },
    { id: 'amulet', name: 'Amuleto',   icon: 'fa-gem',           stat: 'int',   baseVal: 2  },
];

// Materiais por nome de raridade (para geração de nome de item)
export const ITEM_MATERIALS = {
    common:    ['de Couro', 'de Ferro', 'de Madeira', 'Gasto'],
    uncommon:  ['de Aço', 'Reforçado', 'de Carvalho', 'de Ossos'],
    rare:      ['de Prata', 'Élfico', 'Anão', 'de Batalha'],
    epic:      ['de Aço Sombrio', 'Rúnico', 'de Cristal', 'de Ouro'],
    legendary: ['Celestial', 'de Obsidiana', 'Dracônico', 'de Mithril'],
    mythic:    ['do Vazio', 'Etéreo', 'Profano', 'Divino'],
};

// ==========================================
// GERAÇÃO PROCEDURAL DE MONSTROS
// ==========================================
export const MONSTER_ADJECTIVES = [
    'Voraz', 'Enfurecido', 'Corrompido', 'Implacável', 'Sanguinário',
    'Sombrio', 'Feroz', 'Decrépito', 'Macabro', 'Rastejante',
    'Gigante', 'Assassino', 'Vingativo', 'Retorcido', 'Dilacerador',
    'Putrefato', 'Caçador', 'Espreitador',
];

export const MONSTER_ELEMENTS = [
    'de Fogo', 'de Gelo', 'de Pedra', 'das Sombras',
    'de Cristal', 'de Ferro', 'do Vazio', 'de Lava', 'do Ar',
];

// Cada entrada: id, nome base, ícone canvas, cor, zonas onde aparece, mult HP, mult DMG
export const MONSTER_BASE_TYPES = [
    { id: 'goblin',    name: 'Goblin',    icon: '👺', color: '#84cc16', zones: [1, 2, 3],    hpMult: 1.0,  dmgMult: 1.0  },
    { id: 'slime',     name: 'Slime',     icon: '🟢', color: '#22c55e', zones: [1, 2],       hpMult: 1.3,  dmgMult: 0.7  },
    { id: 'lobo',      name: 'Lobo',      icon: '🐺', color: '#9ca3af', zones: [2, 3, 4],    hpMult: 0.9,  dmgMult: 1.3  },
    { id: 'esqueleto', name: 'Esqueleto', icon: '💀', color: '#e5e7eb', zones: [3, 4, 5],    hpMult: 0.8,  dmgMult: 1.1  },
    { id: 'orc',       name: 'Orc',       icon: '👹', color: '#16a34a', zones: [4, 5, 6],    hpMult: 1.5,  dmgMult: 1.4  },
    { id: 'zumbi',     name: 'Zumbi',     icon: '🧟', color: '#65a30d', zones: [5, 6, 7],    hpMult: 1.2,  dmgMult: 0.9  },
    { id: 'bandido',   name: 'Bandido',   icon: '🗡️', color: '#78716c', zones: [3, 4, 5, 6], hpMult: 1.0,  dmgMult: 1.2  },
    { id: 'kobold',    name: 'Kobold',    icon: '🦎', color: '#f59e0b', zones: [2, 3, 4],    hpMult: 0.7,  dmgMult: 0.8  },
    { id: 'morcego',   name: 'Morcego',   icon: '🦇', color: '#7c3aed', zones: [4, 5, 6],    hpMult: 0.6,  dmgMult: 1.0  },
    { id: 'harpia',    name: 'Harpia',    icon: '🦅', color: '#0ea5e9', zones: [6, 7, 8],    hpMult: 0.9,  dmgMult: 1.5  },
    { id: 'aranha',    name: 'Aranha',    icon: '🕷️', color: '#dc2626', zones: [5, 6, 7],    hpMult: 1.1,  dmgMult: 1.2  },
    { id: 'golem',     name: 'Golem',     icon: '🗿', color: '#57534e', zones: [7, 8, 9, 10], hpMult: 2.0,  dmgMult: 1.6  },
    { id: 'elemental', name: 'Elemental', icon: '🔥', color: '#f97316', zones: [8, 9, 10],   hpMult: 1.6,  dmgMult: 1.8  },
];

export const BOSS_PREFIXES = [
    'Senhor', 'Guardião', 'Devorador', 'Behemoth', 'Arauto', 'Titã', 'Colosso', 'Dragão',
];

export const BOSS_SUFFIXES = [
    'da Escuridão', 'do Abismo', 'das Sombras', 'da Ruína', 'da Destruição',
    'do Caos', 'da Desolação', 'Eterno', 'Imortal', 'Primordial',
];

// Exporta array para o template Alpine e sistemas do jogo
export const MONSTER_TYPES = MONSTER_BASE_TYPES.map(m => ({
    ...m,
    icon: m.icon,
    zone: m.zones ? m.zones[0] : 1
}));

// ==========================================
// BIOMAS DE EXPLORAÇÃO & TÍTULOS (GDD: Seções 8, 19, 26)
// ==========================================
export const ZONE_BIOMES = [
    { minZone: 1,  maxZone: 2,  id: 'dark_forest',   name: 'Floresta Sombria',    icon: 'fa-tree',       color: '#22c55e', bgTop: '#07140e', bgBot: '#0f2218', desc: 'Árvores retorcidas sussurram segredos antigos na penumbra.' },
    { minZone: 3,  maxZone: 4,  id: 'khaz_mines',    name: 'Minas de Khaz',       icon: 'fa-mountain',   color: '#94a3b8', bgTop: '#0f1218', bgBot: '#1c212c', desc: 'Túneis profundos ecoam com picaretas e gemas cintilantes.' },
    { minZone: 5,  maxZone: 6,  id: 'black_swamp',   name: 'Pântano Negro',       icon: 'fa-skull',      color: '#84cc16', bgTop: '#0f1609', bgBot: '#1c2612', desc: 'Névoas venenosas encobrem águas traiçoeiras e feras famintas.' },
    { minZone: 7,  maxZone: 8,  id: 'eldor_ruins',   name: 'Ruínas de Eldor',     icon: 'fa-monument',   color: '#eab308', bgTop: '#181209', bgBot: '#291f10', desc: 'Vestígios dourados de um império arcano engolido pelo tempo.' },
    { minZone: 9,  maxZone: 10, id: 'storm_peak',    name: 'Pico da Tempestade',  icon: 'fa-bolt',       color: '#38bdf8', bgTop: '#08131e', bgBot: '#102436', desc: 'Relâmpagos eternos rasgam o céu congelante das alturas.' },
    { minZone: 11, maxZone: 14, id: 'iron_citadel',  name: 'Cidadela de Ferro',   icon: 'fa-chess-rook', color: '#f97316', bgTop: '#1a0c08', bgBot: '#2d150e', desc: 'Fornalhas colossais alimentam legiões implacáveis de guerra.' },
    { minZone: 15, maxZone: 999, id: 'void_abyss',   name: 'Abismo do Vácuo',     icon: 'fa-ankh',       color: '#a855f7', bgTop: '#11071a', bgBot: '#200e30', desc: 'Onde a realidade se desfaz e os titãs primordiais despertam.' },
];

export const HERO_TITLES = [
    { minLevel: 1,   title: 'Zé Ninguém',          color: '#a8a29e', icon: 'fa-user' },
    { minLevel: 5,   title: 'Aventureiro',         color: '#4ade80', icon: 'fa-compass' },
    { minLevel: 10,  title: 'Caçador de Feras',    color: '#38bdf8', icon: 'fa-paw' },
    { minLevel: 20,  title: 'Guerreiro de Idleton', color: '#60a5fa', icon: 'fa-shield-halved' },
    { minLevel: 30,  title: 'Veterano de Guerra',  color: '#c084fc', icon: 'fa-khanda' },
    { minLevel: 40,  title: 'Campeão do Reino',    color: '#facc15', icon: 'fa-medal' },
    { minLevel: 50,  title: 'Herói Lendário',      color: '#fbbf24', icon: 'fa-crown' },
    { minLevel: 70,  title: 'Guardião Imortal',    color: '#f97316', icon: 'fa-fire-flame-curved' },
    { minLevel: 90,  title: 'Soberano Ancião',     color: '#ec4899', icon: 'fa-star' },
    { minLevel: 120, title: 'Deus da Guerra',      color: '#ef4444', icon: 'fa-dragon' },
];

// Afixos de Monstros Campeões / Elite na Exploração (GDD: Seção 7)
export const MONSTER_AFFIXES = [
    { id: 'frenzy',   name: 'Frenético',          badge: '⚡ Frenético',   color: '#fbbf24', hpMult: 1.35, dmgMult: 1.25, rewardMult: 2.5, desc: 'Ataca 35% mais rápido' },
    { id: 'vampiric', name: 'Sanguessuga',        badge: '🩸 Vampírico',   color: '#ef4444', hpMult: 1.45, dmgMult: 1.15, rewardMult: 2.6, desc: 'Drena vida a cada ataque' },
    { id: 'thorns',   name: 'Espinhoso',          badge: '🌵 Espinhoso',   color: '#a855f7', hpMult: 1.50, dmgMult: 1.10, rewardMult: 2.8, desc: 'Reflete 8% do dano recebido' },
    { id: 'hoarder',  name: 'Acumulador Dourado', badge: '💰 Acumulador',  color: '#eab308', hpMult: 1.60, dmgMult: 1.00, rewardMult: 4.0, desc: 'Carrega uma fortuna em Ouro e Materiais!' },
    { id: 'colossus', name: 'Colossal',           badge: '🛡️ Colossal',    color: '#38bdf8', hpMult: 2.10, dmgMult: 1.20, rewardMult: 3.2, desc: 'Vitalidade extrema e saque reforçado' },
];

// Eventos Rápidos de Exploração (GDD: Seção 19)
export const EXPLORATION_EVENTS = [
    {
        id: 'treasure_chest',
        title: 'Baú Esquecido na Trilha',
        icon: 'fa-box-open',
        color: '#fbbf24',
        desc: 'Você encontrou um baú trancado coberto de musgo brilhante entre os arbustos!',
        choices: [
            { id: 'careful', label: 'Abrir com Cuidado', icon: 'fa-key', tip: 'Ouro + Materiais garantidos' },
            { id: 'force',   label: 'Arrombar Tranca',   icon: 'fa-hammer', tip: 'Chance de Equipamento Raro+ e 💎!' },
        ],
    },
    {
        id: 'runic_shrine',
        title: 'Altar Rúnico Antigo',
        icon: 'fa-monument',
        color: '#a855f7',
        desc: 'Runas ancestrais pulsam com energia mística no centro da clareira.',
        choices: [
            { id: 'pray',      label: 'Absorver Luz',     icon: 'fa-hands-praying', tip: 'Cura 100% HP/Mana/Energia + XP' },
            { id: 'sacrifice', label: 'Oferendar Sangue', icon: 'fa-droplet',       tip: '-15% HP por Essências Mágicas e Ouro!' },
        ],
    },
    {
        id: 'wandering_merchant',
        title: 'Caravana de Mercadores',
        icon: 'fa-caravan',
        color: '#10b981',
        desc: 'Um mercador viajante agradece por você limpar a estrada de monstros!',
        choices: [
            { id: 'supplies', label: 'Aceitar Suprimentos', icon: 'fa-cubes-stacked', tip: 'Pacote de Madeira, Ferro e Sucata' },
            { id: 'bounty',   label: 'Recompensa de Escolta', icon: 'fa-coins',       tip: 'Bolsa generosa de Ouro e XP' },
        ],
    },
    {
        id: 'crystal_spring',
        title: 'Fonte Cristalina',
        icon: 'fa-faucet-drip',
        color: '#38bdf8',
        desc: 'Águas límpidas emanam vigor restaurador e escondem relíquias no fundo.',
        choices: [
            { id: 'drink', label: 'Beber da Fonte',    icon: 'fa-heart-pulse', tip: 'Restaura tudo + Fúria temporária' },
            { id: 'dive',  label: 'Mergulhar no Fundo', icon: 'fa-gem',        tip: 'Chance de Diamantes 💎 e Minérios' },
        ],
    },
];

// ==========================================
// ORÁCULO (GDD: Seção 16)
// ==========================================
export const ORACLE_BUFFS = [
    {
        id: 'GOLD_FROM_BUILDINGS',
        name: 'Bênção da Fortuna',
        icon: 'fa-coins',
        color: 'text-amber-400',
        mult: 1.5,
        desc: '+50% de Ouro produzido por construções (15 min)',
    },
    {
        id: 'ATTACK_BONUS',
        name: 'Bênção da Guerra',
        icon: 'fa-khanda',
        color: 'text-red-400',
        mult: 1.25,
        desc: '+25% de Dano de Ataque no combate (15 min)',
    },
    {
        id: 'XP_FROM_MONSTERS',
        name: 'Bênção da Sabedoria',
        icon: 'fa-scroll',
        color: 'text-purple-400',
        mult: 2.0,
        desc: '2× de Experiência obtida de monstros (15 min)',
    },
];

export const ORACLE_PROPHECIES = {
    GOLD_FROM_BUILDINGS: [
        "Das mãos dos humildes ergue-se o brilho que reluz além do tempo.",
        "Quando as pedras cantarem, o ouro dormirá em seus vãos.",
        "Entre paredes silenciosas, tesouros esperam pelo atento.",
    ],
    ATTACK_BONUS: [
        "Quando o trovão desperta, a lâmina dança mais rápido.",
        "O rugido do guerreiro ecoa além da própria voz.",
        "Na ponta da lâmina mora a tempestade.",
    ],
    XP_FROM_MONSTERS: [
        "Do ventre da fera nasce a sabedoria do amanhã.",
        "Cada sombra vencida ensina a luz a brilhar mais forte.",
        "A fera tombada abre portais para novos caminhos.",
    ],
};

// ==========================================
// FORJA SOB ENCOMENDA (GDD: Seção 11)
// ==========================================
export const CRAFTING_RECIPES = [
    {
        id: 'forge_steel',
        name: 'Forja de Aço Nobre',
        rarity: 'rare',
        color: '#60a5fa',
        possibleRarities: ['rare', 'epic'],
        cost: { iron: 20, scrap: 30, essence: 0, gold: 800, diamonds: 0 },
        desc: 'Forja um equipamento aleatório de qualidade Rara (70%) ou Épica (30%).',
    },
    {
        id: 'forge_master',
        name: 'Forja do Mestre Arcano',
        rarity: 'epic',
        color: '#c084fc',
        possibleRarities: ['epic', 'legendary'],
        setChance: 0.50,
        cost: { iron: 50, scrap: 70, essence: 25, gold: 3500, diamonds: 0 },
        desc: 'Forja um equipamento aleatório Épico (75%) ou Lendário (25%) com 50% de chance de Conjunto.',
    },
    {
        id: 'forge_mythic',
        name: 'Forja Mítica dos Titãs',
        rarity: 'mythic',
        color: '#f43f5e',
        possibleRarities: ['legendary', 'mythic'],
        setChance: 1.0,
        cost: { iron: 120, scrap: 150, essence: 60, gold: 12000, diamonds: 3 },
        desc: 'Forja um artefato supremo Lendário (60%) ou Mítico (40%) com Bônus de Conjunto garantido.',
    },
];

// ==========================================
// ENCANTAMENTOS ELEMENTAIS (GDD: Seção 16)
// ==========================================
export const ENCHANTMENT_TYPES = [
    {
        id: 'fire',
        name: 'Chama Primordial',
        icon: 'fa-fire',
        color: '#f97316',
        cost: { essence: 25, gold: 1500 },
        desc: 'Infunde chamas que queimam o monstro continuamente causando dano por segundo.',
    },
    {
        id: 'lightning',
        name: 'Fúria Tempestuosa',
        icon: 'fa-bolt',
        color: '#fbbf24',
        cost: { essence: 35, gold: 2500 },
        desc: '+20% de chance de desferir um Golpe Crítico Duplo relampejante.',
    },
    {
        id: 'ice',
        name: 'Gelo Eterno',
        icon: 'fa-snowflake',
        color: '#38bdf8',
        cost: { essence: 25, gold: 1500 },
        desc: 'Resfria o monstro, congelando seus movimentos e reduzindo sua velocidade de ataque em 25%.',
    },
    {
        id: 'vampiric',
        name: 'Sede Vampírica',
        icon: 'fa-droplet',
        color: '#ef4444',
        cost: { essence: 40, gold: 3000 },
        desc: 'Drena a essência vital do inimigo, curando o herói em 15% de todo dano causado.',
    },
];

// ==========================================
// TAVERNA & CIDADE (GDD: Seção 15 & Expansão 3.3)
// ==========================================
export const TAVERN_RUMORS = [
    "Dizem que há tesouros esquecidos nas profundezas das Minas de Khaz...",
    "Cuidado com os golpes rápidos das Harpias no Pico da Tempestade!",
    "Um bom ferreiro vale mais que um exército de recrutas.",
    "O Oráculo nunca mente, mas suas profecias exigem sabedoria para decifrar.",
    "Aventureiros que sabem a hora de recuar para treinar vivem para lutar outro dia.",
    "Os goblins adoram itens brilhantes. Se encontrar um chefe goblin, espere muito ouro!",
    "A cerveja de Idleton tem gosto de vitória... e um pouco de água da chuva.",
    "Criaturas Campeãs com aura brilhante têm o triplo de recompensas na exploração!",
    "O Contrabandista do Mercado Negro só aceita Diamantes, mas suas mercadorias são lendárias.",
];

export const TAVERN_CONTRACT_TEMPLATES = [
    {
        id: 'contract_wood',
        title: 'Madeira para as Muralhas',
        npc: 'Mestre Carpinteiro',
        icon: 'fa-tree',
        color: 'text-emerald-400',
        resource: 'wood',
        resourceName: 'Madeira',
        baseQty: 25,
        goldMult: 15,
        xpMult: 12,
        diamonds: 1,
        desc: 'A guarda real precisa reforçar as paliçadas antes do cair da noite.',
    },
    {
        id: 'contract_iron',
        title: 'Lingotes para a Milícia',
        npc: 'Capitão da Guarda',
        icon: 'fa-cubes-stacked',
        color: 'text-slate-300',
        resource: 'iron',
        resourceName: 'Ferro',
        baseQty: 12,
        goldMult: 28,
        xpMult: 20,
        diamonds: 1,
        desc: 'Nossas lanças estão quebradas. Traga minério de ferro refinado!',
    },
    {
        id: 'contract_scrap',
        title: 'Engrenagens de Cerco',
        npc: 'Engenheiro Anão',
        icon: 'fa-cogs',
        color: 'text-amber-400',
        resource: 'scrap',
        resourceName: 'Sucata',
        baseQty: 20,
        goldMult: 20,
        xpMult: 16,
        diamonds: 1,
        desc: 'As catapultas da cidadela precisam de peças de reposição urgentes.',
    },
    {
        id: 'contract_essence',
        title: 'Elixir da Corte Arcana',
        npc: 'Arquimago Valerius',
        icon: 'fa-bolt',
        color: 'text-purple-400',
        resource: 'essence',
        resourceName: 'Essência',
        baseQty: 8,
        goldMult: 55,
        xpMult: 40,
        diamonds: 2,
        desc: 'Os selos mágicos do reino estão enfraquecendo. Precisamos de Essência pura!',
    },
];

// ==========================================
// MERCADO, ESCAMBO & MERCADO NEGRO (GDD: Seção 15 & Expansão 4.2)
// ==========================================
export const MARKET_ITEMS = [
    { id: 'wood',    name: 'Madeira Nobre',    icon: 'fa-tree',          color: 'text-emerald-500', costGold: 20,  qty: 10, desc: 'Usado para expandir domínios e estruturas' },
    { id: 'scrap',   name: 'Lote de Sucata',   icon: 'fa-cogs',          color: 'text-gray-400',    costGold: 35,  qty: 5,  desc: 'Material essencial para forjar e aprimorar equipamentos' },
    { id: 'iron',    name: 'Minério de Ferro', icon: 'fa-cubes-stacked', color: 'text-slate-300',   costGold: 50,  qty: 3,  desc: 'Minério resistente para forja e refinamento de armaduras' },
    { id: 'essence', name: 'Essência Mágica',  icon: 'fa-bolt',          color: 'text-purple-400',  costGold: 100, qty: 1,  desc: 'Energia pura para encantamentos e alquimia' },
];

export const MARKET_TRADES = [
    { id: 'wood_to_iron',     name: 'Carpintaria por Minério', fromRes: 'wood',    fromName: 'Madeira',  fromIcon: '🌲', fromQty: 30, toRes: 'iron',    toName: 'Ferro',    toIcon: '🧱', toQty: 8,  desc: 'Troque toras de madeira por lingotes de ferro.' },
    { id: 'iron_to_wood',     name: 'Ferramentas por Lenha',   fromRes: 'iron',    fromName: 'Ferro',    fromIcon: '🧱', fromQty: 10, toRes: 'wood',    toName: 'Madeira',  toIcon: '🌲', toQty: 25, desc: 'Forneça ferro em troca de carradas de madeira.' },
    { id: 'scrap_to_iron',    name: 'Fundição de Sucata',      fromRes: 'scrap',   fromName: 'Sucata',   fromIcon: '⚙️', fromQty: 20, toRes: 'iron',    toName: 'Ferro',    toIcon: '🧱', toQty: 8,  desc: 'Recicle sucata metálica em ferro puro.' },
    { id: 'iron_to_scrap',    name: 'Desmonte Industrial',     fromRes: 'iron',    fromName: 'Ferro',    fromIcon: '🧱', fromQty: 10, toRes: 'scrap',   toName: 'Sucata',   toIcon: '⚙️', toQty: 16, desc: 'Converta barras de ferro em peças de sucata.' },
    { id: 'scrap_to_essence', name: 'Destilação Alquímica',    fromRes: 'scrap',   fromName: 'Sucata',   fromIcon: '⚙️', fromQty: 35, toRes: 'essence', toName: 'Essência', toIcon: '⚡', toQty: 4,  desc: 'Extraia resíduos arcanos de equipamentos desmontados.' },
    { id: 'essence_to_iron',  name: 'Transmutação Elemental',  fromRes: 'essence', fromName: 'Essência', fromIcon: '⚡', fromQty: 5,  toRes: 'iron',    toName: 'Ferro',    toIcon: '🧱', toQty: 15, desc: 'Condense energia mágica em minério sólido.' },
];

export const BLACK_MARKET_OFFERS = [
    {
        id: 'bm_epic_chest',
        name: 'Arca do Contrabandista',
        icon: 'fa-box-open',
        color: '#c084fc',
        costDiamonds: 6,
        badge: 'Épico / Lendário',
        desc: 'Contém 1 equipamento garantido de raridade Épica (70%) ou Lendária (30%) calibrado ao seu nível.',
    },
    {
        id: 'bm_set_reliquary',
        name: 'Relicário Real de Conjunto',
        icon: 'fa-crown',
        color: '#fbbf24',
        costDiamonds: 14,
        badge: 'Conjunto Garantido',
        desc: 'Forja 1 peça Lendária (75%) ou Mítica (25%) com Bônus de Conjunto 100% garantido!',
    },
    {
        id: 'bm_elixir_stats',
        name: 'Tomo Proibido dos Anciões',
        icon: 'fa-book-skull',
        color: '#38bdf8',
        costDiamonds: 10,
        badge: '+2 Atributos + XP',
        desc: 'Concede +2 Pontos de Atributo permanentes para o herói e +50% do XP do nível atual.',
    },
    {
        id: 'bm_war_chest',
        name: 'Carregamento de Guerra',
        icon: 'fa-Burst',
        color: '#10b981',
        costDiamonds: 5,
        badge: 'Pacote de Recursos',
        desc: 'Entrega imediata de +100 Madeira, +50 Ferro, +60 Sucata e +20 Essências Mágicas.',
    },
];

// ==========================================
// ASCENSÃO & PRESTÍGIO (GDD Expansão 1.4 & 2.1)
// ==========================================
export const ASCENSION_PERKS = [
    {
        id: 'dmg',
        name: 'Linhagem dos Deuses',
        icon: 'fa-khanda',
        color: '#f87171',
        cost: 1,                   // custo base em Diamantes Ancestrais
        desc: '+10% de Dano permanente por nível (💠 Diamante Ancestral)',
        bonusPerLevel: 0.10,
    },
    {
        id: 'gold',
        name: 'Cofre Ancestral',
        icon: 'fa-coins',
        color: '#fbbf24',
        cost: 1,
        desc: '+15% de Ouro permanente por nível (💠 Diamante Ancestral)',
        bonusPerLevel: 0.15,
    },
    {
        id: 'xp',
        name: 'Mente Iluminada',
        icon: 'fa-brain',
        color: '#c084fc',
        cost: 1,
        desc: '+20% de XP em combate permanente por nível (💠 Diamante Ancestral)',
        bonusPerLevel: 0.20,
    },
    {
        id: 'drop',
        name: 'Magnetismo de Recursos',
        icon: 'fa-magnet',
        color: '#38bdf8',
        cost: 2,
        desc: '+10% de chance de drops raros por nível (💠 Diamante Ancestral)',
        bonusPerLevel: 0.10,
    },
    {
        id: 'offline_cap',
        name: 'Sono dos Justos',
        icon: 'fa-hourglass-half',
        color: '#34d399',
        cost: 1,
        desc: '+2 Horas no limite de progresso Offline por nível (💠 Diamante Ancestral)',
        bonusPerLevel: 2,
    },
    {
        id: 'eternal_str',
        name: 'Força Primordial',
        icon: 'fa-dumbbell',
        color: '#f97316',
        cost: 1,
        desc: '+8 de Força (STR) e +4 de Agilidade (AGI) base por nível (💠 Diamante Ancestral)',
        bonusPerLevel: 8,
    },
    {
        id: 'eternal_def',
        name: 'Égide Imortal',
        icon: 'fa-shield-halved',
        color: '#60a5fa',
        cost: 1,
        desc: '+8 de Defesa (DEF) e +80 de HP Máximo base por nível (💠 Diamante Ancestral)',
        bonusPerLevel: 8,
    },
    {
        id: 'crit_master',
        name: 'Olho do Destino',
        icon: 'fa-crosshairs',
        color: '#e879f9',
        cost: 2,
        desc: '+3% Chance Crítica e +15% Dano Crítico permanentes por nível (💠)',
        bonusPerLevel: 3,
    },
    {
        id: 'fast_hunter',
        name: 'Predador Temporal',
        icon: 'fa-bolt',
        color: '#facc15',
        cost: 2,
        desc: '+8% Velocidade de Ataque e busca de monstros acelerada por nível (💠)',
        bonusPerLevel: 0.08,
    },
    {
        id: 'double_loot',
        name: 'Toque de Midas',
        icon: 'fa-sack-dollar',
        color: '#10b981',
        cost: 2,
        desc: '+10% de chance de Saque Duplo de materiais e itens por nível (💠)',
        bonusPerLevel: 0.10,
    },
];


// ==========================================
// COMPANHEIROS / PETS (GDD: Seção 18)
// ==========================================
export const TAMER_COST = 5000; // Custo de contratação do Domador na Taverna

export const PETS = [
    {
        id: 'coruja',
        name: 'Coruja Sábia',
        icon: 'fa-feather-pointed',
        emoji: '🦉',
        color: '#fbbf24',
        cost: 8000,
        effectDesc: '+15% de XP obtido de monstros',
        effectType: 'xp_boost',
        value: 0.15,
    },
    {
        id: 'pantera',
        name: 'Pantera Noturna',
        icon: 'fa-paw',
        emoji: '🐆',
        color: '#a855f7',
        cost: 12000,
        effectDesc: '+10% de Velocidade de Ataque',
        effectType: 'atk_speed',
        value: 0.10,
    },
    {
        id: 'rato_ladrao',
        name: 'Rato Ladrão',
        icon: 'fa-coins',
        emoji: '🐀',
        color: '#f59e0b',
        cost: 6000,
        effectDesc: '+20% de Ouro de monstros',
        effectType: 'gold_boost',
        value: 0.20,
    },
    {
        id: 'raposa',
        name: 'Raposa Astuta',
        icon: 'fa-clover',
        emoji: '🦊',
        color: '#ea580c',
        cost: 15000,
        effectDesc: '+2 em Sorte (Qualidade de Drops)',
        effectType: 'luck_bonus',
        value: 2,
    },
    {
        id: 'corvo_arcano',
        name: 'Corvo Arcano',
        icon: 'fa-dove',
        emoji: '🦅',
        color: '#38bdf8',
        cost: 20000,
        effectDesc: '+15% de Dano de Habilidades Ativas',
        effectType: 'skill_dmg',
        value: 0.15,
    },
    {
        id: 'lobo_alfa',
        name: 'Lobo Alfa',
        icon: 'fa-shield-dog',
        emoji: '🐺',
        color: '#ef4444',
        cost: 25000,
        effectDesc: '+12% de Ataque Base',
        effectType: 'atk_bonus',
        value: 0.12,
    },
    {
        id: 'salamandra',
        name: 'Salamandra Ignea',
        icon: 'fa-fire-flame-curved',
        emoji: '🦎',
        color: '#f97316',
        cost: 30000,
        effectDesc: '+0.5 HP de Regeneração por segundo',
        effectType: 'regen_hp',
        value: 0.5,
    },
    {
        id: 'golem_mini',
        name: 'Golem Guardião',
        icon: 'fa-cubes',
        emoji: '🗿',
        color: '#78716c',
        cost: 40000,
        effectDesc: '+15% de Defesa Total',
        effectType: 'def_bonus',
        value: 0.15,
    },
];

// ==========================================
// BESTIÁRIO & MARCOS (GDD: Seção 20)
// ==========================================
export const BESTIARY_MILESTONES = [
    { kills: 10,  label: '10 Abates',  desc: '+2% chance de drop de material' },
    { kills: 25,  label: '25 Abates',  desc: 'Revela atributos reais na interface' },
    { kills: 50,  label: '50 Abates',  desc: '+5% de dano contra esta espécie' },
    { kills: 100, label: '100 Abates', desc: '+15% de dano contra esta espécie' },
    { kills: 250, label: '250 Abates', desc: 'Desbloqueia Título Honorífico de Caçador' },
];

export const BESTIARY_TITLES = {
    goblin:    'Flagelo dos Goblins',
    slime:     'Dissolvedor de Slimes',
    lobo:      'Predador dos Lobos',
    esqueleto: 'Quebrador de Ossos',
    orc:       'Conquistador de Orcs',
    zumbi:     'Exterminador de Mortos',
    bandido:   'Justiceiro das Estradas',
    kobold:    'Caçador de Kobolds',
    morcego:   'Senhor da Noite',
    harpia:    'Ceifador dos Céus',
    aranha:    'Tecelão da Morte',
    golem:     'Destruidor de Rochas',
    elemental: 'Domador dos Elementos',
    boss:      'Matador de Titãs',
};

// ==========================================
// MISSÕES PROCEDURAIS (GDD: Seção 15)
// ==========================================
export const QUEST_TYPES = [
    {
        type: 'KILL_MONSTERS',
        title: 'Extermínio de Criaturas',
        icon: 'fa-skull-crossbones',
        color: 'text-red-400',
        baseTarget: 10,
        targetMultiplier: 5,
        descTemplate: (target) => `Derrote ${target} monstros em combate`,
    },
    {
        type: 'EARN_GOLD',
        title: 'Acúmulo de Riqueza',
        icon: 'fa-coins',
        color: 'text-amber-400',
        baseTarget: 50,
        targetMultiplier: 30,
        descTemplate: (target) => `Acumule ${target} de Ouro`,
    },
    {
        type: 'GATHER_MATERIALS',
        title: 'Coleta de Sucata',
        icon: 'fa-cogs',
        color: 'text-gray-400',
        baseTarget: 5,
        targetMultiplier: 3,
        descTemplate: (target) => `Obtenha ${target} de Sucata em desmontes ou compras`,
    },
    {
        type: 'SPEND_GOLD',
        title: 'Investimento na Cidade',
        icon: 'fa-shop',
        color: 'text-emerald-400',
        baseTarget: 60,
        targetMultiplier: 40,
        descTemplate: (target) => `Gaste ${target} de Ouro em compras, apostas ou forja`,
    },
    {
        type: 'UPGRADE_EQUIPMENT',
        title: 'Maestria da Forja',
        icon: 'fa-hammer',
        color: 'text-orange-400',
        baseTarget: 2,
        targetMultiplier: 1,
        descTemplate: (target) => `Melhore equipamentos ${target} vezes no Ferreiro`,
    },
    {
        type: 'CLEAR_TOWER',
        title: 'Conquista da Torre',
        icon: 'fa-dungeon',
        color: 'text-purple-400',
        baseTarget: 1,
        targetMultiplier: 1,
        descTemplate: (target) => `Conclua ${target} andar(es) na Torre dos Desafios`,
    },
    {
        type: 'CRITICAL_HITS',
        title: 'Golpes Precisos',
        icon: 'fa-bolt',
        color: 'text-yellow-400',
        baseTarget: 8,
        targetMultiplier: 4,
        descTemplate: (target) => `Desfira ${target} Golpes Críticos em combate`,
    },
    {
        type: 'FORGE_ITEMS',
        title: 'Encomendas de Guerra',
        icon: 'fa-hammer',
        color: 'text-rose-400',
        baseTarget: 1,
        targetMultiplier: 1,
        descTemplate: (target) => `Forje ou encante ${target} equipamento(s) no Ferreiro`,
    },
];

// ==========================================
// CONQUISTAS GLOBAIS (GDD: Seção 21)
// ==========================================
export const ACHIEVEMENTS = [
    { id: 'ach_kills_100',   title: 'Caçador Iniciante',    desc: 'Elimine 100 monstros na jornada',              icon: 'fa-skull',            color: '#f87171', statKey: 'kills',      target: 100,    rewardDiamonds: 2,  rewardGold: 500 },
    { id: 'ach_kills_1000',  title: 'Ceifador Implacável',  desc: 'Elimine 1.000 monstros na jornada',            icon: 'fa-skull-crossbones', color: '#ef4444', statKey: 'kills',      target: 1000,   rewardDiamonds: 5,  rewardGold: 3000 },
    { id: 'ach_kills_5000',  title: 'Lenda do Massacre',    desc: 'Elimine 5.000 monstros na jornada',            icon: 'fa-fire-flame-curved', color: '#dc2626', statKey: 'kills',     target: 5000,   rewardDiamonds: 12, rewardGold: 15000 },
    { id: 'ach_boss_10',     title: 'Matador de Gigantes',  desc: 'Derrote 10 Chefes de Zona',                    icon: 'fa-dragon',           color: '#fb923c', statKey: 'bosses',     target: 10,     rewardDiamonds: 3,  rewardGold: 1500 },
    { id: 'ach_boss_50',     title: 'Terror dos Titãs',     desc: 'Derrote 50 Chefes de Zona',                    icon: 'fa-crown',            color: '#f59e0b', statKey: 'bosses',     target: 50,     rewardDiamonds: 8,  rewardGold: 8000 },
    { id: 'ach_gold_10k',    title: 'Bolso Cheio',          desc: 'Acumule 10.000 de Ouro histórico',             icon: 'fa-coins',            color: '#fbbf24', statKey: 'goldEarned', target: 10000,  rewardDiamonds: 2,  rewardGold: 1000 },
    { id: 'ach_gold_500k',   title: 'Magnata de Idleton',   desc: 'Acumule 500.000 de Ouro histórico',            icon: 'fa-sack-dollar',      color: '#eab308', statKey: 'goldEarned', target: 500000, rewardDiamonds: 10, rewardGold: 20000 },
    { id: 'ach_tower_10',    title: 'Desbravador do Abismo', desc: 'Alcance o Andar 10 na Torre dos Desafios',    icon: 'fa-dungeon',          color: '#c084fc', statKey: 'towerFloor', target: 10,     rewardDiamonds: 4,  rewardGold: 2500 },
    { id: 'ach_tower_30',    title: 'Senhor da Torre',      desc: 'Alcance o Andar 30 na Torre dos Desafios',     icon: 'fa-monument',         color: '#a855f7', statKey: 'towerFloor', target: 30,     rewardDiamonds: 10, rewardGold: 12000 },
    { id: 'ach_forge_10',    title: 'Aprendiz da Bigorna',  desc: 'Forje ou aprimore equipamentos 10 vezes',      icon: 'fa-hammer',           color: '#38bdf8', statKey: 'forges',     target: 10,     rewardDiamonds: 3,  rewardGold: 1500 },
    { id: 'ach_pets_4',      title: 'Senhor das Feras',     desc: 'Adote pelo menos 4 Mascotes diferentes',       icon: 'fa-paw',              color: '#34d399', statKey: 'petsOwned',  target: 4,      rewardDiamonds: 5,  rewardGold: 4000 },
    { id: 'ach_ascend_1',    title: 'Despertar Divino',     desc: 'Realize sua primeira Ascensão da Linhagem',    icon: 'fa-star',             color: '#22d3ee', statKey: 'ascensions', target: 1,      rewardDiamonds: 10, rewardGold: 10000 },
];

// ==========================================
// BÔNUS DE CONJUNTO (GDD v1.2: Pilar 1)
// ==========================================
export const ITEM_SETS = {
    protector: {
        id: 'protector',
        name: 'Protetor de Idleton',
        icon: 'fa-shield-halved',
        color: '#3b82f6',
        bonus4: '+15% Armadura base & +10% HP Máx',
        bonus8: '🛡️ Barreira Sagrada (30% HP ao sofrer dano fatal por 5s)',
    },
    storm: {
        id: 'storm',
        name: 'Tempestade Primordial',
        icon: 'fa-bolt',
        color: '#fbbf24',
        bonus4: '+10% Vel. Ataque & +15% Dano Crítico',
        bonus8: '⚡ Corrente Elétrica (25% chance de 2º ataque instantâneo)',
    },
    greedy: {
        id: 'greedy',
        name: 'Ouro do Ganancioso',
        icon: 'fa-coins',
        color: '#eab308',
        bonus4: '+25% de Ouro de monstros e edifícios',
        bonus8: '💰 Fortuna Oculta (10% chance de baú com loot dobrado)',
    },
};

// ==========================================
// ESPECIALIZAÇÕES DE CLASSE (GDD v1.2: Pilar 1 - Nível 30+)
// ==========================================
export const CLASS_SPECIALIZATIONS = [
    {
        id: 'berserker',
        name: 'Berserker',
        icon: 'fa-fire-flame-curved',
        color: '#ef4444',
        role: 'DPS Sangrento & Fúria',
        desc: '+1% de Dano de Ataque a cada 2% de HP perdido. Fúria imparável em combate.',
        statBonus: { str: 10, lck: 5 },
        passives: [
            { name: 'Fúria Sangrenta', desc: '+1% de Dano a cada 2% de HP perdido.' },
            { name: 'Vigor Selvagem (Atributo Fixo)', desc: '+10 Força (STR) e +5 Sorte (LCK) permanentes.' },
            { name: 'Super Ativa Desbloqueável', desc: 'Golpe Devastador (dano massivo explosivo).' },
        ],
    },
    {
        id: 'paladin',
        name: 'Paladino',
        icon: 'fa-cross',
        color: '#facc15',
        role: 'Tanque Sagrado & Retaliação',
        desc: 'Cura 5% de todo dano sofrido e reflete 15% de volta como Dano Verdadeiro.',
        statBonus: { def: 12, hp: 80 },
        passives: [
            { name: 'Retaliação Sagrada', desc: 'Cura 5% do dano sofrido e reflete 15% como Dano Verdadeiro.' },
            { name: 'Bênção do Templo (Atributo Fixo)', desc: '+12 Defesa (DEF) e +80 HP Máx permanentes.' },
            { name: 'Super Ativa Desbloqueável', desc: 'Escudo Divino (Imunidade total a dano).' },
        ],
    },
    {
        id: 'arcane_mage',
        name: 'Mago Arcano',
        icon: 'fa-wand-magic-sparkles',
        color: '#a855f7',
        role: 'Dano Mágico & Mana',
        desc: 'Consome 5 de Mana por ataque para causar explosões arcanas de +40% de dano ignorando 50% de armadura.',
        statBonus: { int: 15, agi: 5, mana: 30 },
        passives: [
            { name: 'Explosão Arcana', desc: 'Ataques consomem 5 Mana para causar +40% Dano e ignorar 50% DEF.' },
            { name: 'Erudição Astral (Atributo Fixo)', desc: '+15 Inteligência (INT), +5 Agilidade e +30 Mana Máx.' },
            { name: 'Super Ativa Desbloqueável', desc: 'Meteoro Arcano (Dano Verdadeiro escalado em INT).' },
        ],
    },
    {
        id: 'shadow_thief',
        name: 'Ladrão das Sombras',
        icon: 'fa-mask',
        color: '#10b981',
        role: 'Agilidade, Crítico & Pilhagem',
        desc: 'Dobra a chance de Esquiva natural e dobra a taxa de drops raros e materiais no Bestiário.',
        statBonus: { agi: 12, lck: 12 },
        passives: [
            { name: 'Passo das Sombras', desc: 'Dobra a Esquiva natural e dobra a chance de materiais raros.' },
            { name: 'Instinto Letal (Atributo Fixo)', desc: '+12 Agilidade (AGI) e +12 Sorte (LCK) permanentes.' },
            { name: 'Super Ativa Desbloqueável', desc: 'Emboscada Letal (Crítico garantido + Veneno mortal).' },
        ],
    },
];

// ==========================================
// EXPEDIÇÕES DE MASCOTES (GDD v1.2: Pilar 2)
// ==========================================
export const PET_EXPEDITIONS_CONFIG = {
    forest: {
        id: 'forest',
        name: 'Floresta dos Sussurros',
        icon: 'fa-tree',
        color: '#10b981',
        zoneReq: 1,
        durations: [
            { minutes: 30,  wood: [10, 25],  xp: 150,  desc: '30 Minutos' },
            { minutes: 60,  wood: [25, 60],  xp: 350,  desc: '1 Hora' },
            { minutes: 120, wood: [60, 140], xp: 800,  desc: '2 Horas' },
        ],
    },
    mines: {
        id: 'mines',
        name: 'Minas Profundas de Khaz',
        icon: 'fa-mountain',
        color: '#94a3b8',
        zoneReq: 2,
        durations: [
            { minutes: 30,  iron: [6, 15],   gems: 1, desc: '30 Minutos' },
            { minutes: 60,  iron: [15, 35],  gems: 2, desc: '1 Hora' },
            { minutes: 120, iron: [35, 80],  gems: 5, desc: '2 Horas' },
        ],
    },
    volcano: {
        id: 'volcano',
        name: 'Terras Vulcânicas',
        icon: 'fa-volcano',
        color: '#f97316',
        zoneReq: 3,
        durations: [
            { minutes: 30,  essence: [3, 8],   scrap: [10, 20], desc: '30 Minutos' },
            { minutes: 60,  essence: [8, 20],  scrap: [25, 50], desc: '1 Hora' },
            { minutes: 120, essence: [20, 45], scrap: [60, 120], desc: '2 Horas' },
        ],
    },
    ruins: {
        id: 'ruins',
        name: 'Ruínas Antigas Esquecidas',
        icon: 'fa-monument',
        color: '#eab308',
        zoneReq: 4,
        durations: [
            { minutes: 30,  gold: [500, 1500],  diamonds: 1, desc: '30 Minutos' },
            { minutes: 60,  gold: [1500, 4000], diamonds: 2, desc: '1 Hora' },
            { minutes: 120, gold: [4000, 10000], diamonds: 5, desc: '2 Horas' },
        ],
    },
};

// ==========================================
// FORJA DE RELÍQUIAS MÍTICAS DE CHEFES (GDD v1.2: Pilar 2)
// ==========================================
export const RELIC_RECIPES = [
    {
        id: 'relic_blade',
        name: 'Lâmina Dentada de Kobold',
        slot: 'weapon',
        icon: 'fa-khanda',
        color: '#ef4444',
        rarity: 'mythic',
        reqMob: 'kobold',
        reqKills: 100,
        stats: { str: 45, lck: 15 },
        cost: { iron: 50, essence: 30, scrap: 100, gold: 15000 },
        desc: 'Lâmina serrilhada banhada em veneno mortal. (+45 Atk, inflige Sangramento constante)',
    },
    {
        id: 'relic_shield',
        name: 'Escudo de Placas de Golem',
        slot: 'shield',
        icon: 'fa-shield',
        color: '#38bdf8',
        rarity: 'mythic',
        reqMob: 'golem',
        reqKills: 100,
        stats: { def: 60, hp: 300 },
        cost: { iron: 80, essence: 20, scrap: 120, gold: 20000 },
        desc: 'Esculpido em granito puro de titãs. (+60 Def, +300 HP, reduz dano de chefes em 20%)',
    },
    {
        id: 'relic_chest',
        name: 'Manto Eólico da Harpia',
        slot: 'chest',
        icon: 'fa-feather',
        color: '#a855f7',
        rarity: 'mythic',
        reqMob: 'harpia',
        reqKills: 100,
        stats: { agi: 25, def: 35 },
        cost: { iron: 40, essence: 40, scrap: 80, gold: 22000 },
        desc: 'Tecido com penas abençoadas pelos ventos. (+25 Agi, concede 10% de chance de golpe duplo)',
    },
];

// ==========================================
// TORRE DOS DESAFIOS (GDD v1.2: Pilar 3)
// ==========================================
export const TOWER_MODIFIERS = [
    { id: 'frenzy',   name: 'Pés Ligeiros',        desc: 'Inimigo ataca com velocidade dobrada',                       icon: 'fa-bolt',             color: '#fbbf24', baseValue: 0.50, scalePerFloor: 0.005, cap: 0.70 },
    { id: 'curse',    name: 'Maldição da Praga',    desc: 'Regeneração de HP do herói é zerada',                        icon: 'fa-skull-crossbones', color: '#ef4444', baseValue: 1,    scalePerFloor: 0,     cap: 1 },
    { id: 'elements', name: 'Vórtice Elemental',    desc: 'Danos elementais são triplicados',                           icon: 'fa-fire',             color: '#f97316', baseValue: 3.0,  scalePerFloor: 0.05,  cap: 6.0 },
    { id: 'armored',  name: 'Carapaça de Ferro',    desc: 'Inimigo reduz dano físico recebido',                         icon: 'fa-shield',           color: '#94a3b8', baseValue: 0.40, scalePerFloor: 0.005, cap: 0.65 },
    { id: 'berserk',  name: 'Fúria Crescente',      desc: 'Guardião ganha dano a cada segundo de combate',              icon: 'fa-fire-flame-curved', color: '#dc2626', baseValue: 0.02, scalePerFloor: 0.002, cap: 0.08 },
    { id: 'regen',    name: 'Regeneração Sombria',   desc: 'Guardião regenera HP a cada segundo',                        icon: 'fa-heart-pulse',      color: '#22c55e', baseValue: 0.008, scalePerFloor: 0.001, cap: 0.025 },
    { id: 'silence',  name: 'Silêncio Arcano',      desc: 'Habilidades ativas custam o dobro de energia/mana',          icon: 'fa-volume-xmark',     color: '#7c3aed', baseValue: 2.0,  scalePerFloor: 0,     cap: 2.0 },
    { id: 'thorns',   name: 'Espinhos Profanos',    desc: 'Guardião reflete parte do dano recebido de volta ao herói',  icon: 'fa-burst',            color: '#a855f7', baseValue: 0.08, scalePerFloor: 0.003, cap: 0.20 },
    { id: 'gravity',  name: 'Gravidade Cósmica',    desc: 'Herói ataca mais lentamente',                                icon: 'fa-weight-hanging',   color: '#64748b', baseValue: 0.25, scalePerFloor: 0.005, cap: 0.50 },
    { id: 'drain',    name: 'Dreno Vital',          desc: 'Guardião rouba vida ao atacar, curando a si mesmo',          icon: 'fa-droplet',          color: '#06b6d4', baseValue: 0.10, scalePerFloor: 0.003, cap: 0.25 },
    { id: 'amplify',  name: 'Amplificação Cósmica', desc: 'Guardião causa dano significativamente aumentado',           icon: 'fa-arrows-up-down',   color: '#e11d48', baseValue: 0.25, scalePerFloor: 0.008, cap: 0.60 },
    { id: 'wither',   name: 'Decomposição',         desc: 'Herói perde HP passivamente a cada segundo',                 icon: 'fa-biohazard',        color: '#84cc16', baseValue: 0.008, scalePerFloor: 0.001, cap: 0.025 },
];


// ==========================================
// UPGRADES DA MOCHILA (GDD v1.2: Pilar 4)
// ==========================================
export const BAG_UPGRADES = [
    { level: 1, slots: 20, name: 'Bolsa de Viagem',     cost: { gold: 0, wood: 0 } },
    { level: 2, slots: 25, name: 'Bolsa de Couro',      cost: { gold: 1500, wood: 50 } },
    { level: 3, slots: 30, name: 'Mochila Reforçada',   cost: { gold: 5000, wood: 100, iron: 20 } },
    { level: 4, slots: 38, name: 'Mochila Tática',      cost: { gold: 15000, wood: 200, iron: 40 } },
    { level: 5, slots: 50, name: 'Bolsa Dimensional',   cost: { gold: 35000, essence: 50, diamonds: 20 } },
];

// ==========================================
// CONFIGURAÇÕES DE AUTO-LOOT (GDD v1.2: Pilar 4)
// ==========================================
export const AUTO_LOOT_RARITIES = [
    { id: 'common',    name: 'Comum',    color: '#9ca3af', dotClass: 'bg-stone-400' },
    { id: 'uncommon',  name: 'Incomum',  color: '#4ade80', dotClass: 'bg-green-400' },
    { id: 'rare',      name: 'Raro',     color: '#60a5fa', dotClass: 'bg-blue-400' },
    { id: 'epic',      name: 'Épico',    color: '#c084fc', dotClass: 'bg-purple-400' },
    { id: 'legendary', name: 'Lendário', color: '#fbbf24', dotClass: 'bg-amber-400' },
];

export const AUTO_LOOT_ACTIONS = [
    { id: 'none',      label: 'Bolsa',  icon: 'fa-box-archive' },
    { id: 'sell',      label: 'Vender', icon: 'fa-coins' },
    { id: 'dismantle', label: 'Sucata', icon: 'fa-cogs' },
];

// ==========================================
// ÁRVORE DE HABILIDADES (GDD Fase 2.2)
// ==========================================
// Estrutura de cada nó:
//   id, name, branch ('active'|'passive'|'utility'), icon, color,
//   maxLevel, costPerLevel, requires (id ou null), row, col,
//   descFn(lvl) → string, effect (chave usada em recalcDerived/combat)
export const SKILL_TREE = {
    berserker: {
        color: '#ef4444',
        name: 'Berserker',
        role: 'DPS Sangrento & Fúria',
        nodes: [
            // ── RAMO DE COMBATE & ATIVAS (Esquerda) ────────────────────
            {
                id: 'brs_a1', name: 'Golpe Brutal', type: 'basica', tier: 1, branch: 'combat',
                icon: 'fa-khanda', color: '#f97316', maxLevel: 3, baseCost: 1,
                requires: null,
                descFn: (l) => `Aprimora o Ataque Concentrado: causa +${l}× Dano (base 3× → ${3 + l}×) e consome -${l * 3}⚡ Energia.`,
                effect: 'brs_focus_boost',
            },
            {
                id: 'brs_act', name: 'Golpe Devastador', type: 'ativa', tier: 2, branch: 'combat',
                icon: 'fa-burst', color: '#dc2626', maxLevel: 3, baseCost: 2,
                requires: 'brs_a1',
                descFn: (l) => `Nova Super Ativa: Consome 50⚡. Causa ${4 + l}× Dano devastador, mas reduz sua Defesa em 50% por 10s (CD: 14s).`,
                effect: 'devastating_strike_unlock',
            },
            {
                id: 'brs_p3', name: 'Sede de Sangue', type: 'keystone', tier: 3, branch: 'combat',
                icon: 'fa-droplet', color: '#b91c1c', maxLevel: 2, baseCost: 3,
                requires: 'brs_act',
                descFn: (l) => `Cada monstro abatido acumula +${l * 5}% Dano (máx 10 stacks = +${l * 50}% Dano). Cura 5% HP por abate. Reseta ao morrer.`,
                effect: 'bloodlust_kill_stack',
            },
            // ── RAMO DE RESILIÊNCIA & PASSIVAS (Direita) ───────────────
            {
                id: 'brs_p1', name: 'Fúria Sangrenta', type: 'passiva', tier: 1, branch: 'passive',
                icon: 'fa-fire', color: '#ef4444', maxLevel: 3, baseCost: 1,
                requires: null,
                descFn: (l) => `Aumenta o dano em +${l * 1}% a cada 2% de HP perdido. (Mais vida perdida = maior massacre)`,
                effect: 'fury_dmg',
            },
            {
                id: 'brs_p2', name: 'Pele de Aço', type: 'passiva', tier: 2, branch: 'passive',
                icon: 'fa-shield', color: '#fb7185', maxLevel: 3, baseCost: 2,
                requires: 'brs_p1',
                descFn: (l) => `Aumenta a Defesa em +${l * 6}% e o HP Máximo em +${l * 5}%.`,
                effect: 'iron_skin',
            },
            {
                id: 'brs_u1', name: 'Resistência Selvagem', type: 'utilidade', tier: 3, branch: 'passive',
                icon: 'fa-paw', color: '#78716c', maxLevel: 2, baseCost: 2,
                requires: 'brs_p2',
                descFn: (l) => `Cura Espontânea restaura +${l * 10}% HP. +${l * 30}min no limite de farm offline.`,
                effect: 'berserker_utility',
            },
        ],
    },

    paladin: {
        color: '#facc15',
        name: 'Paladino',
        role: 'Tanque Sagrado & Retaliação',
        nodes: [
            // ── RAMO DE COMBATE & ATIVAS (Esquerda) ────────────────────
            {
                id: 'pal_a1', name: 'Graça Restauradora', type: 'basica', tier: 1, branch: 'combat',
                icon: 'fa-hand-holding-medical', color: '#fde047', maxLevel: 3, baseCost: 1,
                requires: null,
                descFn: (l) => `Aprimora a Cura Espontânea: restaura +${l * 10}% HP Máx (base 25% → ${25 + l * 10}%) e consome -${l * 3}🧪 Mana.`,
                effect: 'pal_heal_boost',
            },
            {
                id: 'pal_act', name: 'Escudo Divino', type: 'ativa', tier: 2, branch: 'combat',
                icon: 'fa-shield-halved', color: '#eab308', maxLevel: 3, baseCost: 2,
                requires: 'pal_a1',
                descFn: (l) => `Nova Super Ativa: Consome 40🧪. Torna o herói 100% IMUNE a todo dano por ${4 + l}s (CD: 25s).`,
                effect: 'divine_shield_unlock',
            },
            {
                id: 'pal_p3', name: 'Aura de Luz', type: 'keystone', tier: 3, branch: 'combat',
                icon: 'fa-sun', color: '#ca8a04', maxLevel: 2, baseCost: 3,
                requires: 'pal_act',
                descFn: (l) => `Aumenta Regen de HP em +${l * 15}%. Seus Mascotes e Aliados causam +${l * 20}% Dano e trazem +${l * 15}% recompensas!`,
                effect: 'aura_of_light',
            },
            // ── RAMO DE RESILIÊNCIA & PASSIVAS (Direita) ───────────────
            {
                id: 'pal_p1', name: 'Retaliação Sagrada', type: 'passiva', tier: 1, branch: 'passive',
                icon: 'fa-cross', color: '#facc15', maxLevel: 3, baseCost: 1,
                requires: null,
                descFn: (l) => `Cura ${3 + l * 2}% de todo dano recebido e reflete ${10 + l * 5}% como Dano Verdadeiro ao atacante.`,
                effect: 'retaliation_boost',
            },
            {
                id: 'pal_p2', name: 'Baluarte da Fé', type: 'passiva', tier: 2, branch: 'passive',
                icon: 'fa-shield-virus', color: '#fef08a', maxLevel: 3, baseCost: 2,
                requires: 'pal_p1',
                descFn: (l) => `Aumenta a Armadura em +${l * 8}% e adiciona ${l * 40}% da sua Defesa ao dano do Ataque Concentrado!`,
                effect: 'paladin_bastion',
            },
            {
                id: 'pal_u1', name: 'Santuário Sagrado', type: 'utilidade', tier: 3, branch: 'passive',
                icon: 'fa-monument', color: '#78716c', maxLevel: 2, baseCost: 2,
                requires: 'pal_p2',
                descFn: (l) => `+${l * 40}min no limite de farm offline e regeneração de vida pós-morte 50% mais rápida.`,
                effect: 'paladin_utility',
            },
        ],
    },

    arcane_mage: {
        color: '#a855f7',
        name: 'Mago Arcano',
        role: 'Dano Mágico & Mana',
        nodes: [
            // ── RAMO DE COMBATE & ATIVAS (Esquerda) ────────────────────
            {
                id: 'mag_a1', name: 'Transmutação Arcana', type: 'basica', tier: 1, branch: 'combat',
                icon: 'fa-bolt', color: '#c084fc', maxLevel: 3, baseCost: 1,
                requires: null,
                descFn: (l) => `Ataque Concentrado consome 30 Mana em vez de Energia e causa dano mágico com base em INT (${3 + l}× Inteligência).`,
                effect: 'mag_focus_boost',
            },
            {
                id: 'mag_act', name: 'Meteoro Arcano', type: 'ativa', tier: 2, branch: 'combat',
                icon: 'fa-meteor', color: '#9333ea', maxLevel: 3, baseCost: 2,
                requires: 'mag_a1',
                descFn: (l) => `Nova Super Ativa: Consome 80🧪. Invoca meteoro cósmico causando ${6 + l * 2}× Inteligência em Dano Verdadeiro (CD: 18s).`,
                effect: 'arcane_meteor_unlock',
            },
            {
                id: 'mag_p3', name: 'Mente Cósmica', type: 'keystone', tier: 3, branch: 'combat',
                icon: 'fa-hat-wizard', color: '#7e22ce', maxLevel: 2, baseCost: 3,
                requires: 'mag_act',
                descFn: (l) => `Converte ${l * 10}% da sua Mana Máxima em Dano Mágico adicional em todos os seus golpes e feitiços!`,
                effect: 'cosmic_mind',
            },
            // ── RAMO DE RESILIÊNCIA & PASSIVAS (Direita) ───────────────
            {
                id: 'mag_p1', name: 'Explosão Arcana', type: 'passiva', tier: 1, branch: 'passive',
                icon: 'fa-wand-magic-sparkles', color: '#a855f7', maxLevel: 3, baseCost: 1,
                requires: null,
                descFn: (l) => `Ataques básicos consomem 5 Mana para causar +${30 + l * 15}% Dano ignorando 50% da armadura inimiga.`,
                effect: 'arcane_blast_boost',
            },
            {
                id: 'mag_p2', name: 'Sobrecarga de Mana', type: 'passiva', tier: 2, branch: 'passive',
                icon: 'fa-brain', color: '#d8b4fe', maxLevel: 3, baseCost: 2,
                requires: 'mag_p1',
                descFn: (l) => `+${l * 25} Mana Máxima e +${(l * 0.4).toFixed(1)} Mana Regen/s. Ataques têm ${l * 10}% chance de recuperar 15 Mana.`,
                effect: 'mana_overload',
            },
            {
                id: 'mag_u1', name: 'Canalização Etérea', type: 'utilidade', tier: 3, branch: 'passive',
                icon: 'fa-moon', color: '#78716c', maxLevel: 2, baseCost: 2,
                requires: 'mag_p2',
                descFn: (l) => `Cura Espontânea restaura +${l * 20} de Mana junto com a vida. +${l * 30}min de farm offline.`,
                effect: 'mage_utility',
            },
        ],
    },

    shadow_thief: {
        color: '#10b981',
        name: 'Ladrão das Sombras',
        role: 'Agilidade, Crítico & Pilhagem',
        nodes: [
            // ── RAMO DE COMBATE & ATIVAS (Esquerda) ────────────────────
            {
                id: 'thf_a1', name: 'Precisão Mortal', type: 'basica', tier: 1, branch: 'combat',
                icon: 'fa-crosshairs', color: '#34d399', maxLevel: 3, baseCost: 1,
                requires: null,
                descFn: (l) => `Ataque Concentrado sempre causa Acerto Crítico com ${3 + l * 0.8}× Dano e consome -${l * 4}⚡ Energia.`,
                effect: 'thf_focus_boost',
            },
            {
                id: 'thf_act', name: 'Emboscada Letal', type: 'ativa', tier: 2, branch: 'combat',
                icon: 'fa-skull', color: '#059669', maxLevel: 3, baseCost: 2,
                requires: 'thf_a1',
                descFn: (l) => `Nova Super Ativa: Consome 35⚡. Golpe surpresa crítico com ${4 + l}× Dano e aplica Veneno por 5s (${l * 15}% dano/s) (CD: 12s).`,
                effect: 'ambush_unlock',
            },
            {
                id: 'thf_p3', name: 'Mão Leve & Saqueador', type: 'keystone', tier: 3, branch: 'combat',
                icon: 'fa-coins', color: '#047857', maxLevel: 2, baseCost: 3,
                requires: 'thf_act',
                descFn: (l) => `+${l * 30}% de Ouro e +${l * 20}% chance de drops e itens raros de monstros e baús.`,
                effect: 'master_thief',
            },
            // ── RAMO DE RESILIÊNCIA & PASSIVAS (Direita) ───────────────
            {
                id: 'thf_p1', name: 'Passo das Sombras', type: 'passiva', tier: 1, branch: 'passive',
                icon: 'fa-mask', color: '#10b981', maxLevel: 3, baseCost: 1,
                requires: null,
                descFn: (l) => `Dobra Esquiva natural, concede +${l * 6}% Esquiva extra e +${l * 15}% chance de drops raros e materiais.`,
                effect: 'shadow_step_boost',
            },
            {
                id: 'thf_p2', name: 'Reflexos Assassinos', type: 'passiva', tier: 2, branch: 'passive',
                icon: 'fa-person-running', color: '#6ee7b7', maxLevel: 3, baseCost: 2,
                requires: 'thf_p1',
                descFn: (l) => `Ao esquivar de um golpe, contra-ataca imediatamente com ${50 + l * 25}% do seu Dano e recupera 15⚡ Energia!`,
                effect: 'assassin_counter',
            },
            {
                id: 'thf_u1', name: 'Astúcia das Sombras', type: 'utilidade', tier: 3, branch: 'passive',
                icon: 'fa-user-ninja', color: '#78716c', maxLevel: 2, baseCost: 2,
                requires: 'thf_p2',
                descFn: (l) => `Reduz o cooldown do Ataque Concentrado e Cura Espontânea em ${l * 15}%. +${l * 30}min farm offline.`,
                effect: 'thief_utility',
            },
        ],
    },
};

/**
 * Calcula o custo progressivo do próximo nível de um nó da Árvore.
 * Ex: Tier 1 (base 1): Nv 1 = 1 pt, Nv 2 = 2 pts, Nv 3 = 3 pts.
 *     Tier 2 (base 2): Nv 1 = 2 pts, Nv 2 = 3 pts, Nv 3 = 4 pts.
 *     Tier 3 (base 3): Nv 1 = 3 pts, Nv 2 = 4 pts...
 */
export function getNodeUpgradeCost(node, currentLevel = 0) {
    if (!node) return 1;
    const base = node.baseCost || (node.tier === 1 ? 1 : (node.tier === 2 ? 2 : (node.type === 'keystone' ? 3 : 2)));
    return base + currentLevel;
}

/**
 * Calcula o total de pontos investidos acumulados num nó para reembolso exato no Respec.
 */
export function getNodeTotalInvested(node, currentLevel = 0) {
    if (!node || currentLevel <= 0) return 0;
    const base = node.baseCost || (node.tier === 1 ? 1 : (node.tier === 2 ? 2 : (node.type === 'keystone' ? 3 : 2)));
    let total = 0;
    for (let i = 0; i < currentLevel; i++) {
        total += (base + i);
    }
    return total;
}

// ==========================================
// HELPER: efeitos da Árvore de Habilidades
// ==========================================
// Colocado em constants.js (que não importa nada) para evitar
// qualquer dependência circular entre combat.js e ui.js.

/**
 * Agrega os níveis de todos os nós comprados num mapa de efeitos.
 * Ex.: { fury_dmg: 2, iron_skin: 1, offline_cap_bonus: 2 }
 */
export function getTreeEffects(state) {
    const spec = state.hero?.specialization;
    if (!spec || !SKILL_TREE[spec]) return {};
    const effects = {};
    const nodes   = SKILL_TREE[spec].nodes;
    const bought  = state.treeSkills || {};
    nodes.forEach(node => {
        const lvl = bought[node.id] || 0;
        if (lvl > 0) effects[node.effect] = (effects[node.effect] || 0) + lvl;
    });
    // Aliases unificados para utilidades e pilhagem
    const utilLvl = (effects.berserker_utility || 0) + (effects.paladin_utility || 0) + (effects.mage_utility || 0) + (effects.thief_utility || 0);
    if (utilLvl > 0) {
        effects.offline_cap_bonus = (effects.offline_cap_bonus || 0) + utilLvl;
    }
    if (effects.master_thief > 0 || effects.shadow_step_boost > 0) {
        effects.loot_boost = (effects.loot_boost || 0) + (effects.master_thief || 0) * 2 + (effects.shadow_step_boost || 0);
    }
    return effects;
}

// ==========================================
// EVOLUÇÃO DE AFINIDADE & ÁRVORE DE TALENTOS DOS PETS
// ==========================================
export const PET_MAX_LEVEL = 10;

export function getPetXpRequired(level = 1) {
    return Math.floor(100 * Math.pow(1.45, Math.max(0, level - 1)));
}

export const PET_TALENTS = [
    {
        id: 'sharp_fangs',
        name: 'Presas Afiadas',
        icon: 'fa-paw',
        color: 'text-red-400 border-red-700/60',
        hexColor: '#ef4444',
        cost: 1,
        maxLevel: 5,
        desc: '+25% Dano de Combate e +5% Chance Crítica ao Mascote Ativo por nível.',
        descFn: (l) => `Aumenta o dano de combate do Pet Ativo em +${l * 25}% e concede +${l * 5}% de Chance Crítica ao Pet.`,
    },
    {
        id: 'alpha_instinct',
        name: 'Instinto Alfa',
        icon: 'fa-crown',
        color: 'text-amber-400 border-amber-700/60',
        hexColor: '#fbbf24',
        cost: 1,
        maxLevel: 5,
        desc: 'Amplifica os bônus passivos de TODOS os Pets adotados em +10% por nível (Pet Ativo recebe 1.5×).',
        descFn: (l) => `Amplifica os bônus passivos de TODOS os Pets adotados em +${l * 10}% (Pet Ativo recebe +50% extra).`,
    },
    {
        id: 'vital_bond',
        name: 'Vínculo Vital',
        icon: 'fa-heart-pulse',
        color: 'text-emerald-400 border-emerald-700/60',
        hexColor: '#4ade80',
        cost: 1,
        maxLevel: 5,
        desc: 'Cada ataque do Pet Ativo em combate restaura +1.5% do HP Máximo do Herói por nível.',
        descFn: (l) => `Cada ataque do Pet Ativo em combate restaura ${(l * 1.5).toFixed(1)}% do HP Máximo do Herói.`,
    },
    {
        id: 'wind_wings',
        name: 'Asas do Vento',
        icon: 'fa-feather-pointed',
        color: 'text-sky-400 border-sky-700/60',
        hexColor: '#38bdf8',
        cost: 1,
        maxLevel: 5,
        desc: 'Reduz o tempo necessário de todas as Expedições de Mascotes em -8% por nível.',
        descFn: (l) => `Reduz o tempo necessário de todas as Expedições de Mascotes em -${l * 8}%.`,
    },
    {
        id: 'hunter_scent',
        name: 'Faro de Caçador',
        icon: 'fa-compass',
        color: 'text-orange-400 border-orange-700/60',
        hexColor: '#f97316',
        cost: 1,
        maxLevel: 5,
        desc: '+15% nas recompensas de Expedições de Mascotes e +6% de Ouro de monstros por nível.',
        descFn: (l) => `Aumenta as recompensas de Expedições de Mascotes em +${l * 15}% e o Ouro de monstros em +${l * 6}%.`,
    },
    {
        id: 'primordial_roar',
        name: 'Rugido Primordial',
        icon: 'fa-dragon',
        color: 'text-purple-400 border-purple-700/60',
        hexColor: '#c084fc',
        cost: 1,
        maxLevel: 5,
        desc: 'O Pet Ativo causa +40% de dano por nível contra Chefes de Zona, Guardiões da Torre e o Chefe Mundial!',
        descFn: (l) => `O Pet Ativo causa +${l * 40}% de dano contra Chefes de Zona, Guardiões da Torre e o Chefe Mundial!`,
    },
];

/**
 * Calcula o multiplicador de eficiência do bônus passivo de um Pet possuído.
 * Todos os pets adotados concedem seu bônus passivo (escalado pelo Nível de Afinidade e Instinto Alfa),
 * e o Pet Ativo em combate recebe um bônus de sinergia adicional de +50% (1.5x).
 */
export function getPetBonusMultiplier(state, petId) {
    if (!state?.pets?.owned?.includes(petId)) return 0;
    const lvl = state.pets?.levels?.[petId] || 1;
    const alphaLvl = state.pets?.talents?.alpha_instinct || 0;
    const activeMult = state.pets?.active === petId ? 1.5 : 1.0;
    return (1 + (lvl - 1) * 0.15) * (1 + alphaLvl * 0.10) * activeMult;
}

// ==========================================
// MASMORRA DIÁRIA DE CHEFE MUNDIAL (WORLD BOSS — 60s DPS CHECK)
// ==========================================
export const WORLD_BOSS_DAILY_ATTEMPTS = 3;
export const WORLD_BOSS_EXTRA_COST_DIAMONDS = 15;
export const WORLD_BOSS_DURATION = 60; // 60 segundos de confronto

export const WORLD_BOSSES = [
    {
        id: 'ignis_dragon',
        name: 'Ignis, o Dragão do Apocalipse',
        title: 'Titã das Cinzas Eternas',
        lore: 'Forjado nas entranhas vulcânicas do mundo antigo, suas asas incendeiam os céus de Idleton.',
        icon: '🐉',
        faIcon: 'fa-dragon',
        emoji: '🐉',
        color: '#ef4444',
        element: 'Fogo Primordial',
        baseAtk: 35,
        atkSpeed: 2.2,
        trait: 'Sopro Vulcânico: seu ataque escala +12% a cada 10s de batalha. Recompensa +20% Ouro extra.',
        traitDesc: 'Sopro Vulcânico: seu ataque escala +12% a cada 10s de batalha. Recompensa +20% Ouro extra.',
        bonusResource: 'gold',
        bonusMult: 1.20,
    },
    {
        id: 'abyssal_leviathan',
        name: 'Leviatã das Fendas Abissais',
        title: 'Devorador dos Mares Profundos',
        lore: 'Uma entidade ancestral que emerge das trincheiras oceânicas para drenar a magia dos mortais.',
        icon: '🐙',
        faIcon: 'fa-water',
        emoji: '🐙',
        color: '#38bdf8',
        element: 'Abismo Cósmico',
        baseAtk: 32,
        atkSpeed: 2.0,
        trait: 'Maré Negra: drena 4 de Energia/Mana por golpe. Recompensa +25% Essência Mágica extra.',
        traitDesc: 'Maré Negra: drena 4 de Energia/Mana por golpe. Recompensa +25% Essência Mágica extra.',
        bonusResource: 'essence',
        bonusMult: 1.25,
    },
    {
        id: 'obsidian_colossus',
        name: 'Kronos, o Colosso de Obsidiana',
        title: 'Forjador de Continentes',
        lore: 'Uma montanha viva de obsidiana e magma cujo caminhar estremece as fundações do reino.',
        icon: '🗿',
        faIcon: 'fa-shield-virus',
        emoji: '🗿',
        color: '#f59e0b',
        element: 'Rocha Titânica',
        baseAtk: 38,
        atkSpeed: 2.5,
        trait: 'Crosta de Magma: reduz em 15% o dano físico direto. Recompensa +30% Ferro e Sucata extras.',
        traitDesc: 'Crosta de Magma: reduz em 15% o dano físico direto. Recompensa +30% Ferro e Sucata extras.',
        bonusResource: 'iron',
        bonusMult: 1.30,
    },
    {
        id: 'void_harbinger',
        name: 'Valkyon, o Arauto do Vazio',
        title: 'Sombra Devoradora de Estrelas',
        lore: 'Um Soberano Dimensional nascido além do véu cósmico para testar a linhagem dos heróis.',
        icon: '👁️',
        faIcon: 'fa-skull-crossbones',
        emoji: '👁️',
        color: '#c084fc',
        element: 'Vazio Astral',
        baseAtk: 34,
        atkSpeed: 1.9,
        trait: 'Foice Astral: golpes velozes que testam sua regeneração. Recompensa +20% Diamantes extras.',
        traitDesc: 'Foice Astral: golpes velozes que testam sua regeneração. Recompensa +20% Diamantes extras.',
        bonusResource: 'diamond',
        bonusMult: 1.20,
    },
];

export const WORLD_BOSS_TIERS = [
    {
        tier: 1,
        id: 'bronze',
        name: 'Tier I — Bronze',
        icon: '🥉',
        minDamage: 500,
        minDmg: 500,
        color: 'text-amber-500',
        hexColor: '#d97706',
        badgeClass: 'bg-amber-950/80 border-amber-700 text-amber-300',
        gold: 800,
        diamonds: 3,
        essence: 8,
        scrap: 20,
        iron: 10,
        itemRarity: null,
        ancestral: 0,
        rewards: { gold: 800, diamond: 3, essence: 8, scrap: 20, iron: 10, itemRarity: null, ancestralDiamonds: 0 },
    },
    {
        tier: 2,
        id: 'silver',
        name: 'Tier II — Prata',
        icon: '🥈',
        minDamage: 3000,
        minDmg: 3000,
        color: 'text-slate-300',
        hexColor: '#cbd5e1',
        badgeClass: 'bg-slate-900 border-slate-500 text-slate-200',
        gold: 2500,
        diamonds: 6,
        essence: 18,
        scrap: 35,
        iron: 25,
        itemRarity: 'rare',
        ancestral: 0,
        rewards: { gold: 2500, diamond: 6, essence: 18, scrap: 35, iron: 25, itemRarity: 'rare', ancestralDiamonds: 0 },
    },
    {
        tier: 3,
        id: 'gold',
        name: 'Tier III — Ouro',
        icon: '🥇',
        minDamage: 12000,
        minDmg: 12000,
        color: 'text-yellow-400',
        hexColor: '#fbbf24',
        badgeClass: 'bg-yellow-950/80 border-yellow-500 text-yellow-300',
        gold: 7500,
        diamonds: 10,
        essence: 35,
        scrap: 60,
        iron: 45,
        itemRarity: 'epic',
        ancestral: 0,
        rewards: { gold: 7500, diamond: 10, essence: 35, scrap: 60, iron: 45, itemRarity: 'epic', ancestralDiamonds: 0 },
    },
    {
        tier: 4,
        id: 'platinum',
        name: 'Tier IV — Platina',
        icon: '💎',
        minDamage: 45000,
        minDmg: 45000,
        color: 'text-cyan-400',
        hexColor: '#38bdf8',
        badgeClass: 'bg-cyan-950/80 border-cyan-400 text-cyan-200',
        gold: 20000,
        diamonds: 16,
        essence: 65,
        scrap: 100,
        iron: 80,
        itemRarity: 'epic',
        ancestral: 0,
        rewards: { gold: 20000, diamond: 16, essence: 65, scrap: 100, iron: 80, itemRarity: 'epic', ancestralDiamonds: 0 },
    },
    {
        tier: 5,
        id: 'diamond',
        name: 'Tier V — Diamante',
        icon: '🔮',
        minDamage: 150000,
        minDmg: 150000,
        color: 'text-purple-400',
        hexColor: '#c084fc',
        badgeClass: 'bg-purple-950/80 border-purple-400 text-purple-200',
        gold: 50000,
        diamonds: 25,
        essence: 120,
        scrap: 160,
        iron: 130,
        itemRarity: 'legendary',
        ancestral: 0,
        rewards: { gold: 50000, diamond: 25, essence: 120, scrap: 160, iron: 130, itemRarity: 'legendary', ancestralDiamonds: 0 },
    },
    {
        tier: 6,
        id: 'mythic',
        name: 'Tier VI — Mítico Imortal',
        icon: '👑',
        minDamage: 450000,
        minDmg: 450000,
        color: 'text-rose-400',
        hexColor: '#f43f5e',
        badgeClass: 'bg-rose-950/90 border-rose-400 text-rose-200',
        gold: 120000,
        diamonds: 40,
        essence: 220,
        scrap: 260,
        iron: 220,
        itemRarity: 'mythic',
        ancestral: 1,
        rewards: { gold: 120000, diamond: 40, essence: 220, scrap: 260, iron: 220, itemRarity: 'mythic', ancestralDiamonds: 1 },
    },
];


