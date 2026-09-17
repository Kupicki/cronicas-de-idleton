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
    { id: 'weapon', name: 'Espada',    icon: 'fa-dagger',        stat: 'str',   baseVal: 3  },
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
// TAVERNA & CIDADE (GDD: Seção 15)
// ==========================================
export const TAVERN_RUMORS = [
    "Dizem que há tesouros esquecidos nas profundezas das Minas de Khaz...",
    "Cuidado com os golpes rápidos das Harpias no Pico da Tempestade!",
    "Um bom ferreiro vale mais que um exército de recrutas.",
    "O Oráculo nunca mente, mas suas profecias exigem sabedoria para decifrar.",
    "Aventureiros que sabem a hora de recuar para treinar vivem para lutar outro dia.",
    "Os goblins adoram itens brilhantes. Se encontrar um chefe goblin, espere muito ouro!",
    "A cerveja de Idleton tem gosto de vitória... e um pouco de água da chuva.",
];

// ==========================================
// MERCADO (GDD: Seção 15)
// ==========================================
export const MARKET_ITEMS = [
    { id: 'wood',    name: 'Madeira Nobre',    icon: 'fa-tree',          color: 'text-emerald-500', costGold: 20,  qty: 10, desc: 'Usado para expandir domínios e estruturas' },
    { id: 'scrap',   name: 'Lote de Sucata',   icon: 'fa-cogs',          color: 'text-gray-400',    costGold: 35,  qty: 5,  desc: 'Material essencial para forjar e aprimorar equipamentos' },
    { id: 'iron',    name: 'Minério de Ferro', icon: 'fa-cubes-stacked', color: 'text-slate-300',   costGold: 50,  qty: 3,  desc: 'Minério resistente para forja e refinamento de armaduras' },
    { id: 'essence', name: 'Essência Mágica',  icon: 'fa-bolt',          color: 'text-purple-400',  costGold: 100, qty: 1,  desc: 'Energia pura para encantamentos e alquimia' },
];

// ==========================================
// ASCENSÃO & PRESTÍGIO (GDD: Seção 21)
// ==========================================
export const ASCENSION_PERKS = [
    {
        id: 'dmg',
        name: 'Linhagem dos Deuses',
        icon: 'fa-khanda',
        color: '#f87171',
        cost: 1,
        desc: '+10% de Dano permanente por nível',
        bonusPerLevel: 0.10,
    },
    {
        id: 'gold',
        name: 'Cofre Ancestral',
        icon: 'fa-coins',
        color: '#fbbf24',
        cost: 1,
        desc: '+15% de Ouro permanente por nível',
        bonusPerLevel: 0.15,
    },
    {
        id: 'xp',
        name: 'Mente Iluminada',
        icon: 'fa-brain',
        color: '#c084fc',
        cost: 1,
        desc: '+20% de XP em combate permanente por nível',
        bonusPerLevel: 0.20,
    },
    {
        id: 'drop',
        name: 'Magnetismo de Recursos',
        icon: 'fa-magnet',
        color: '#38bdf8',
        cost: 2,
        desc: '+10% de chance de drops raros (Ferro/Essência) por nível',
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
    },
    {
        id: 'paladin',
        name: 'Paladino',
        icon: 'fa-cross',
        color: '#facc15',
        role: 'Tanque Sagrado & Retaliação',
        desc: 'Cura 5% de todo dano sofrido e reflete 15% de volta como Dano Verdadeiro.',
        statBonus: { def: 12, hp: 50 },
    },
    {
        id: 'arcane_mage',
        name: 'Mago Arcano',
        icon: 'fa-wand-magic-sparkles',
        color: '#a855f7',
        role: 'Dano Mágico & Mana',
        desc: 'Consome 5 de Mana por ataque para causar explosões arcanas de +40% de dano ignorando 50% de armadura.',
        statBonus: { int: 15, mana: 30 },
    },
    {
        id: 'shadow_thief',
        name: 'Ladrão das Sombras',
        icon: 'fa-mask',
        color: '#10b981',
        role: 'Agilidade, Crítico & Pilhagem',
        desc: 'Dobra a chance de Esquiva natural e dobra a taxa de drops raros e materiais no Bestiário.',
        statBonus: { agi: 12, lck: 10 },
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




