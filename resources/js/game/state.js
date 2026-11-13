// ==========================================
// ESTADO PADRÃO (DEFAULT SAVE) — v3.0
// ==========================================

export const defaultState = {
    hero: {
        name: 'Zé Ninguém',
        level: 1,
        xp: 0,
        nextXp: 100,
        hp: 50,
        energy: 30,
        mana: 30,
        isDead: false,
        isRecovering: false,
        pe: 0,
        statPoints: 0,   // pontos para alocar em STR/DEF/INT/AGI/LCK/PER/REG/ENE
        treePoints: 0,   // pontos para investir na Árvore de Habilidades (pool separado)
        nameChanges: 0,
        specialization: null, // 'berserker' | 'paladin' | 'arcane_mage' | 'shadow_thief'
    },
    baseStats: {
        hpMax: 50,
        str: 1,
        def: 1,
        int: 1,
        agi: 1,
        lck: 1,
        per: 1,
        reg: 1,
        ene: 1,        // pontos alocados em energia
        energyMax: 20,
        energyReg: 0.5,
        manaMax: 20,
        manaReg: 0.5,
    },
    derived: {
        hpMax: 50,
        str: 1,
        def: 1,
        int: 1,
        agi: 1,
        lck: 1,
        per: 1,
        regen: 0.5,
        atkSpeed: 3.00,
    },
    equipment: {
        weapon: null, shield: null, helmet: null, chest: null,
        legs: null, boots: null, ring: null, amulet: null,
    },
    inventory: [],
    inventoryMaxSlots: 20, // 20 -> 25 -> 30 -> 38 -> 50 slots
    resources: {
        gold: 0,
        diamond: 0,
        ancestralDiamonds: 0,   // Diamante Ancestral — exclusivo de Ascensão (GDD Expansão 1.4)
        wood: 0,
        essence: 0,
        scrap: 0,
        iron: 0,
    },
    buildings: {
        hut:      { name: 'Cabana',            qty: 0, baseCost: 150,      prod: 0.5,    category: 'gold',      utilityDesc: '+2 HP Máx para o herói por nível',              utilityType: 'hp_flat',      utilityVal: 2 },
        farm:     { name: 'Fazenda',           qty: 0, baseCost: 600,      prod: 1.5,    category: 'support',   utilityDesc: '+0.15 Regen de HP/s por nível',                  utilityType: 'regen_hp',     utilityVal: 0.15 },
        sawmill:  { name: 'Serraria Real',     qty: 0, baseCost: 1400,     prod: 2.5,    category: 'resources', utilityDesc: 'Extrai Madeira 🌲 passivamente a cada 20s',      utilityType: 'passive_wood', utilityVal: 1 },
        workshop: { name: 'Oficina',           qty: 0, baseCost: 2500,     prod: 4.0,    category: 'resources', utilityDesc: 'Recicla Sucata ⚙️ passivamente a cada 25s',     utilityType: 'passive_scrap', utilityVal: 1 },
        mine:     { name: 'Mina Profunda',     qty: 0, baseCost: 10000,    prod: 10.0,   category: 'resources', utilityDesc: 'Extrai Ferro 🧱 passivamente a cada 30s',       utilityType: 'passive_iron', utilityVal: 1 },
        market:   { name: 'Empório Comercial', qty: 0, baseCost: 40000,    prod: 25.0,   category: 'gold',      utilityDesc: '+2% Ouro obtido de monstros por nível',         utilityType: 'combat_gold',  utilityVal: 0.02 },
        library:  { name: 'Biblioteca Arcana', qty: 0, baseCost: 150000,   prod: 60.0,   category: 'support',   utilityDesc: 'Gera +1.5 XP passivo/s e +2 INT por nível',      utilityType: 'passive_xp',   utilityVal: 1.5 },
        garrison: { name: 'Quartel General',   qty: 0, baseCost: 600000,   prod: 150.0,  category: 'support',   utilityDesc: '+3 STR e +3 DEF para o herói por nível',        utilityType: 'combat_stats', utilityVal: 3 },
        treasury: { name: 'Câmara do Tesouro', qty: 0, baseCost: 2500000,  prod: 400.0,  category: 'resources', utilityDesc: 'Condensa Essência ⚡ passivamente a cada 45s',   utilityType: 'passive_essence', utilityVal: 1 },
        castle:   { name: 'Castelo Real',      qty: 0, baseCost: 12000000, prod: 1000.0, category: 'gold',      utilityDesc: '+5% Produção Global de Ouro no Domínio/nível',  utilityType: 'global_gold',  utilityVal: 0.05 },
    },
    domainLevel: 0,      // Fortificação do Domínio (+10% prod de ouro por nível, consome Madeira e Ouro)
    bestiary: {},
    quests: [],          // 4 missões ativas simultâneas [{ id, type, title, icon, color, desc, current, target, reward: { gold, diamond, xp, scrap }, completed, claimed }]
    tavernContracts: [], // 3 contratos de suprimentos na Taverna (GDD Expansão 3.3)
    tavernRestBuff: null, // { expiresAt, name } — Buff de Descanso na Estalagem (GDD Expansão 3.3)
    explorationEvent: null, // Evento rápido interativo na tela de exploração (GDD Seção 19)
    achievementsClaimed: {}, // { [achId]: true } (GDD Seção 21)
    pets: {
        tamerUnlocked: false, // Desbloqueado ao contratar o Domador na Taverna (5.000 Ouro)
        owned: [],            // IDs dos pets comprados ['coruja', 'pantera', ...]
        active: null,         // ID do pet ativo ('coruja', 'lobo_alfa', etc)
        levels: {},           // { [petId]: 1..10 } — Nível de Afinidade de cada Pet
        xp: {},               // { [petId]: number } — XP atual de Afinidade de cada Pet
        talents: {},          // { [talentId]: 0..5 } — Árvore de Talentos Bestiais
        talentPoints: 0,      // Pontos de Talento Bestial disponíveis
    },
    petExpeditions: [],       // [{ id, petId, zoneId, durationMinutes, startedAt, expiresAt, rewards }]
    worldBoss: {
        inBattle: false,
        timer: 60,
        damageDealt: 0,
        bossAtkTimer: 0,
        bestDamage: 0,
        dailyAttemptsLeft: 3,
        lastResetDate: '',
        lastResult: null,
        logs: [],
    },
    tower: {
        floor: 1,
        maxFloor: 1,
        inBattle: false,
        heroHp: 100,
        heroHpMax: 100,
        heroAtkTimer: 0,
        monster: null,
        modifier: null,
        eventRoom: null,          // { type: 'puzzle'|'chest'|'curse', ... }
        logs: [],
    },
    villageSiege: {
        active: false,
        timerSec: 180,        // 3 minutos para repelir o cerco
        endsAt: 0,
        monster: null,
        buffExpiresAt: 0,     // Buff de +50% de ouro em todas as construções por 24h
        nextCheckAt: 0,
    },
    autoLootFilter: {
        enabled: false,
        collapsed: false,
        common: 'none',       // 'none' | 'dismantle' | 'sell'
        uncommon: 'none',     // 'none' | 'dismantle' | 'sell'
        rare: 'none',         // 'none' | 'dismantle' | 'sell'
        epic: 'none',         // 'none' | 'dismantle' | 'sell'
        legendary: 'none',    // 'none' | 'dismantle' | 'sell'
        saveUpgrades: true,   // Se o item for superior ao equipado atual, preserva na mochila
        saveSets: true,       // Se for item de conjunto ([Bárbaro], etc.), preserva na mochila
    },
    audioEnabled: false,      // Desativado por padrão
    audioVolume: 0.5,
    marketLastReset: Date.now(),
    statResets: 0,            // Quantidade de resets de atributos realizados
    forgeCount: 0,            // Quantidade de forjas realizadas no Ferreiro
    lifetimeStats: {
        kills: 0,
        bosses: 0,
        goldEarned: 0,
        itemsCrafted: 0,
        itemsUpgraded: 0,
        enchantmentsDone: 0,
        timePlayedSec: 0,
        highestTowerFloor: 1,
        criticalHits: 0,
    },
    statsSession: {
        startedAt: Date.now(),
        kills: 0,
        goldEarned: 0,
        xpEarned: 0,
        damageDealt: 0,
    },
    pendingDropItem: null,    // Item pendente quando o inventário está cheio
    skills: {
        flat_strength: { name: 'Força Bruta', level: 0, desc: '+5 Ataque/nível' },
        flat_resilience: { name: 'Vigor de Touro', level: 0, desc: '+20 HP Máx/nível' },
        percent_strength: { name: 'Fúria Contida', level: 0, desc: '+2% Ataque/nível' },
        thick_hide: { name: 'Casca Grossa', level: 0, desc: '+5 Defesa/nível' },
        golden_hands: { name: 'Mãos de Ouro', level: 0, desc: '+5% Ouro/nível' },
    },
    treeSkills: {},   // { [nodeId]: level } — nós da Árvore de Habilidades (GDD Fase 2.2)
    marketPurchases: {
        wood: 0,
        scrap: 0,
        iron: 0,
        essence: 0,
    },
    ascension: {
        count: 0,
        totalAncestralEarned: 0, // Total de Diamantes Ancestrais já ganhos (histórico)
        perks: {
            dmg: 0,          // Linhagem dos Deuses (+10% Dano por nível)
            gold: 0,         // Cofre Ancestral (+15% Ouro por nível)
            xp: 0,           // Mente Iluminada (+20% XP por nível)
            drop: 0,         // Magnetismo de Recursos (+10% Chance de drop por nível)
            offline_cap: 0,  // Sono dos Justos (+2h limite offline por nível)
            eternal_str: 0,  // Força Primordial (+8 STR, +4 AGI por nível)
            eternal_def: 0,  // Égide Imortal (+8 DEF, +80 HP por nível)
            crit_master: 0,  // Olho do Destino (+3% Crit, +15% Crit Dmg por nível)
            fast_hunter: 0,  // Predador Temporal (+8% Vel. Ataque por nível)
            double_loot: 0,  // Toque de Midas (+10% chance de saque duplo por nível)
        },
    },
    zone: 1,
    maxZone: 1,
    killsInZone: 0,
    totalKills: 0,
    bossSafeMode: false,
    oracleBuff: null,
    isExploring: false,
    autoBattle: true,
    monster: null,
    logs: [],
    tutorial: {
        completed: false,
        skipped: false,
        rewardClaimed: false,
    },
};
