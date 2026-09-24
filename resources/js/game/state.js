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
        hut: { name: 'Cabana', qty: 0, baseCost: 150, prod: 0.5 },
        farm: { name: 'Fazenda', qty: 0, baseCost: 600, prod: 1.5 },
        workshop: { name: 'Oficina', qty: 0, baseCost: 2500, prod: 4.0 },
        mine: { name: 'Mina', qty: 0, baseCost: 10000, prod: 10.0 },
        market: { name: 'Mercado', qty: 0, baseCost: 40000, prod: 25.0 },
        library: { name: 'Biblioteca', qty: 0, baseCost: 150000, prod: 60.0 },
        garrison: { name: 'Quartel', qty: 0, baseCost: 600000, prod: 150.0 },
        treasury: { name: 'Tesouro', qty: 0, baseCost: 2500000, prod: 400.0 },
        castle: { name: 'Castelo', qty: 0, baseCost: 12000000, prod: 1000.0 },
    },
    domainLevel: 0,      // Fortificação do Domínio (+10% prod de ouro por nível, consome Madeira e Ouro)
    bestiary: {},
    quests: [],          // 4 missões ativas simultâneas [{ id, type, title, icon, color, desc, current, target, reward: { gold, diamond, xp, scrap }, completed, claimed }]
    pets: {
        tamerUnlocked: false, // Desbloqueado ao contratar o Domador na Taverna (5.000 Ouro)
        owned: [],            // IDs dos pets comprados ['coruja', 'pantera', ...]
        active: null,         // ID do pet ativo ('coruja', 'lobo_alfa', etc)
    },
    petExpeditions: [],       // [{ id, petId, zoneId, durationMinutes, startedAt, expiresAt, rewards }]
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
            dmg: 0,   // Linhagem dos Deuses (+10% Dano por nível)
            gold: 0,  // Cofre Ancestral (+15% Ouro por nível)
            xp: 0,    // Mente Iluminada (+20% XP por nível)
            drop: 0,  // Magnetismo de Recursos (+10% Chance de drop por nível)
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
};
