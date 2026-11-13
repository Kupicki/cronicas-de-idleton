import {
    MONSTER_TYPES,
    ZONE_BIOMES,
    HERO_TITLES,
    MONSTER_AFFIXES,
    EXPLORATION_EVENTS,
    TAVERN_CONTRACT_TEMPLATES,
    ORACLE_BUFFS,
    ORACLE_PROPHECIES,
    TAVERN_RUMORS,
    MARKET_ITEMS,
    MARKET_TRADES,
    BLACK_MARKET_OFFERS,
    PETS,
    TAMER_COST,
    BESTIARY_MILESTONES,
    BESTIARY_TITLES,
    QUEST_TYPES,
    ACHIEVEMENTS,
    CRAFTING_RECIPES,
    ENCHANTMENT_TYPES,
    ITEM_TYPES,
    ASCENSION_PERKS,
    ITEM_SETS,
    CLASS_SPECIALIZATIONS,
    PET_EXPEDITIONS_CONFIG,
    RELIC_RECIPES,
    TOWER_MODIFIERS,
    BAG_UPGRADES,
    AUTO_LOOT_RARITIES,
    AUTO_LOOT_ACTIONS,
    SKILL_TREE,
    PET_MAX_LEVEL,
    PET_TALENTS,
    WORLD_BOSSES,
    WORLD_BOSS_TIERS,
    WORLD_BOSS_DAILY_ATTEMPTS,
    WORLD_BOSS_EXTRA_COST_DIAMONDS,
    WORLD_BOSS_DURATION,
    getTreeEffects,
    getNodeUpgradeCost,
    getNodeTotalInvested,
    getPetXpRequired,
    getPetBonusMultiplier,
} from './constants.js';
import { defaultState } from './state.js';
import {
    createMonster, processCombatTick, calcHeroDmg, calcKillRewards,
    calcActiveSetBonuses, startTowerRun, resolveTowerEventChoice, processTowerCombatTick,
    handleTowerMonsterKill, processSiegeCombatTick,
    getTowerModifierIntensity,
    getDailyWorldBoss, syncWorldBossDailyReset, getWorldBossTierInfo,
    startWorldBossBattle, processWorldBossCombatTick, finishWorldBossBattle,
} from './combat.js';
import {
    renderCanvas, makeHeroDmgFloat, makeMonsterDmgFloat,
    makeSpecialFloat, makeHeroHealFloat, makeMonsterEffectFloat,
    setupCanvas as initStars, resizeCanvas,
} from './canvas.js';
import {
    getBuildingCost, buyBuilding, processBuildings,
    generateLoot, getUpgradeCost, upgradeItem,
    equipItem, unequipItem, sellItem, dismantleItem,
    getMarketPrice, buyMarketResource, tradeMarketResources, buyBlackMarketOffer,
    getTavernRestCost, restAtTavernInn, generateTavernContracts, completeTavernContract,
    getDomainFortificationCost,
    upgradeDomain, calcGoldIncomeRate, craftItem,
    enchantEquipment, calcMonsterMaterialDrops,
    calcAscensionReward, performAscension, buyAscensionPerk,
    getNextBagUpgrade, upgradeBag, applyAutoLootFilter,
    startPetExpedition, claimPetExpedition, craftRelic,
    grantPetXp, getPetTrainCost, trainPet, buyPetTalent,
    resolveSiegeVictory, resolveSiegeDefeat,
    getForgeCost, resetHeroStats, getStatResetCost,
} from './economy.js';
import {
    createLogEntry, recalcDerived, getItemDelta,
    changeHeroName, buySkill, allocateStat,
    playTavernGame, loadGame, saveGame,
    buyTreeNode, respecSkillTree,
} from './ui.js';
import {
    playSwordSlash, playCritSlash, playCoinClink,
    playItemDrop, playLevelUpFanfare, playDefeatTone,
    playSiegeAlert, playCoinFlip, playDiceRoll,
    playTavernWin, playTavernLose,
} from './audio.js';
import {
    ensureQuests, trackQuestProgress, claimQuestReward,
} from './quests.js';
import { t, setLang, getLang, getAvailableLangs, LANG_META } from './lang/index.js';
import { v, getLibraryAssetUrl, getLibraryIcon } from './visuals/index.js';
import { calcXpForLevel, formatNumber, formatInt } from './formulas.js';
import { TUTORIAL_STEPS, TUTORIAL_REWARD } from './tutorial.js';

// ==========================================
// ALPINE COMPONENT — gameData()
// ==========================================

export function gameData() {
    return {
        // --- Constantes expostas no template ---
        MONSTER_TYPES,
        ZONE_BIOMES,
        HERO_TITLES,
        MONSTER_AFFIXES,
        EXPLORATION_EVENTS,
        TAVERN_CONTRACT_TEMPLATES,
        ORACLE_BUFFS,
        MARKET_ITEMS,
        MARKET_TRADES,
        BLACK_MARKET_OFFERS,
        TAVERN_RUMORS,
        PETS,
        TAMER_COST,
        BESTIARY_MILESTONES,
        BESTIARY_TITLES,
        QUEST_TYPES,
        ACHIEVEMENTS,
        CRAFTING_RECIPES,
        ENCHANTMENT_TYPES,
        ITEM_TYPES,
        ASCENSION_PERKS,
        ITEM_SETS,
        CLASS_SPECIALIZATIONS,
        SKILL_TREE,
        PET_MAX_LEVEL,
        PET_TALENTS,
        WORLD_BOSSES,
        WORLD_BOSS_TIERS,
        WORLD_BOSS_DAILY_ATTEMPTS,
        WORLD_BOSS_EXTRA_COST_DIAMONDS,
        WORLD_BOSS_DURATION,
        PET_EXPEDITIONS_CONFIG,
        RELIC_RECIPES,
        TOWER_MODIFIERS,
        BAG_UPGRADES,
        AUTO_LOOT_RARITIES,
        AUTO_LOOT_ACTIONS,
        v,                         // Biblioteca Visual: v('chave', 'prop?')
        getLibraryAssetUrl,        // Atalho: v('chave') → '/assets/path.png'
        getLibraryIcon,            // Atalho: v('chave') → 'fa-icon'
        formatNumber,              // Notação abreviada K/M/B/T
        formatInt,                 // Notação inteira abreviada
        currentRumor: TAVERN_RUMORS[Math.floor(Math.random() * TAVERN_RUMORS.length)],
        // --- Estado & UI ---
        state: JSON.parse(JSON.stringify(defaultState)),
        menuOpen: false,
        settingsOpen: false,
        language: getLang(),   // idioma ativo (sincronizado com o módulo i18n)
        LANG_META,                         // metadados p/ UI de seleção de idioma
        activeTab: 'city',
        cityPanel: null,
        marketSubTab: 'gold',              // 'gold' | 'barter' | 'black_market' (GDD Expansão 4.2)
        tavernSubTab: 'games',             // 'games' | 'inn' | 'contracts' (GDD Expansão 3.3)
        domainCategory: 'all',             // 'all' | 'gold' | 'resources' | 'support' (GDD Expansão 4.1)
        questWidgetOpen: true,             // Mini-widget retrátil de missões na Exploração (GDD Expansão 3.2)
        blacksmithTab: 'upgrade',   // 'upgrade' | 'craft' | 'relics'
        petTab: 'list',             // 'list' | 'expeditions' | 'talents'
        towerSubTab: 'abyss',       // 'abyss' | 'world_boss'
        selectedExpeditionZone: 'forest',
        selectedExpeditionPet: null,
        selectedExpeditionMinutes: 30,
        selectedRelicId: 'relic_blade',
        craftRecipeId: 'iron_basic',
        craftSlot: 'weapon',
        enchantSlot: 'weapon',
        selectedEnchantId: 'fire',
        specializationModalOpen: false,
        selectedSpecializationId: 'berserker',
        skillTreeOpen: false,       // modal da Árvore de Habilidades
        selectedSkillNodeId: null,  // nó inspecionado no Altar de Talentos
        skillTreeBranch: 'active',    // aba ativa no painel: 'active'|'passive'|'utility'
        warCryCooldownTimer: 0,     // novo ativo Berserker
        holyBarrierCooldownTimer: 0,     // novo ativo Paladino
        holyBarrierActiveTimer: 0,     // duração do escudo ativo
        holyBarrierShieldHp: 0,     // HP atual do escudo
        arcaneNovaCooldownTimer: 0,     // novo ativo Mago
        doubleStrikeCooldownTimer: 0,     // novo ativo Ladrão
        towerModalOpen: false,
        selectedTowerFloor: 1,
        siegeModalOpen: false,
        statsExpanded: false,
        respawnPercent: 0,
        globalNotification: null,
        selectedItemIndex: null,
        itemModalOpen: false,
        selectedEquippedSlot: null,
        equippedModalOpen: false,
        defeatModalOpen: false,
        pendingDropModalOpen: false,
        selectedBestiaryMob: null,
        upgradeSlot: null,
        // --- Guia do Aventureiro (Tutorial) ---
        tutorialModalOpen: false,
        tutorialConfirmSkipOpen: false,
        tutorialStep: 0,
        TUTORIAL_STEPS,
        TUTORIAL_REWARD,

        // --- Taverna: estado de animação ---
        tavernAnim: {
            active: false,
            game: null,        // 'coin' | 'dice'
            phase: 'idle',     // 'idle' | 'rolling' | 'result'
            result: null,      // dados do resultado
            displayRoll: 0,    // valor exibido durante rolling
            displayDice: [1, 1],
            npcDisplayDice: [1, 1],
        },
        tavernStreak: 0,
        tavernLastResult: null,  // 'win' | 'lose' | 'draw'
        tavernHistory: [],       // últimos 10 resultados para histórico visual

        // --- UI local state ---
        skillsExpanded: false,
        combatLogOpen: false,
        combatLogFilter: 'all', // 'all' | 'combat' | 'loot' | 'level'

        // --- Canvas ---
        canvas: null,
        ctx: null,
        stars: [],
        floats: [],
        lastTick: performance.now(),
        heroAttacking: false,
        attackFlashMs: 0,
        heroIsHit: false,
        heroHitMs: 0,
        activeCooldownTimer: 0,  // cooldown do Ataque Concentrado
        healCooldownTimer: 0,    // cooldown da Cura Espontânea
        devastatingStrikeTimer: 0, // cooldown do Golpe Devastador (Berserker)
        divineShieldTimer: 0,      // cooldown do Escudo Divino (Paladino)
        arcaneMeteorTimer: 0,      // cooldown do Meteoro Arcano (Mago)
        ambushTimer: 0,            // cooldown da Emboscada (Ladrão)

        // --- Config de stats visível no template ---
        statConfig: [
            { key: 'str', name: 'Força', icon: 'fa-dumbbell', color: 'text-red-400', tip: '+1 Dano Base' },
            { key: 'def', name: 'Defesa', icon: 'fa-shield', color: 'text-blue-400', tip: '+3 Defesa & +3 HP' },
            { key: 'ene', name: 'Energia', icon: 'fa-bolt', color: 'text-amber-400', tip: '+5 Máx & +0.5 Rec/s' },
            { key: 'int', name: 'Inteligência', icon: 'fa-brain', color: 'text-purple-400', tip: '+5 Mana & +0.1 Rec/s' },
            { key: 'agi', name: 'Agilidade', icon: 'fa-person-running', color: 'text-yellow-400', tip: '+Velocidade Ataque' },
            { key: 'lck', name: 'Sorte', icon: 'fa-star', color: 'text-green-400', tip: '+Drop Rate' },
            { key: 'per', name: 'Percepção', icon: 'fa-eye', color: 'text-cyan-400', tip: '+Qualidade Loot' },
            { key: 'reg', name: 'Regeneração', icon: 'fa-heart', color: 'text-pink-400', tip: '+0.5 HP Regen/s' },
        ],

        // --- Habilidades Ativas do GDD (para visualização no Grimório/Painel) ---
        activeSkills: [
            { id: 'focused_attack', name: 'Ataque Concentrado', icon: 'fa-bolt', cost: '30 ⚡ Energia', cd: 8, desc: 'Desfere um golpe devastador causando 3× do seu Dano Base.', unlocked: true },
            { id: 'quick_heal', name: 'Cura Espontânea', icon: 'fa-hand-holding-medical', cost: '30 🧪 Mana', cd: 12, desc: 'Restaura 25% do seu HP Máximo instantaneamente.', unlocked: true },
            { id: 'war_cry', name: 'Grito de Guerra', icon: 'fa-bullhorn', cost: '40 ⚡ Energia', cd: 25, desc: 'Aumenta seu Dano Base em +30% por 10s.', unlocked: false, reqLv: 5 },
            { id: 'shield_barrier', name: 'Barreira Sagrada', icon: 'fa-shield-halved', cost: '35 🧪 Mana', cd: 20, desc: 'Reduz todo o dano recebido em 50% por 6s.', unlocked: false, reqLv: 10 },
        ],

        // --- Dados constantes acessíveis no template ---
        MONSTER_TYPES,
        tabs: [
            { id: 'city', name: 'Cidade', icon: 'fa-city' },
            { id: 'inventory', name: 'Inventário', icon: 'fa-briefcase' },
            { id: 'explore', name: 'Exploração', icon: 'fa-map-marked-alt' },
            { id: 'tower', name: 'Torre dos Desafios', icon: 'fa-monument' },
            { id: 'domain', name: 'Domínio', icon: 'fa-chess-rook' },
            { id: 'companions', name: 'Companheiros', icon: 'fa-paw' },
            { id: 'bestiary', name: 'Bestiário', icon: 'fa-dragon' },
            { id: 'stats', name: 'Estatísticas', icon: 'fa-chart-pie' },
            { id: 'ascension', name: 'Ascensão', icon: 'fa-star' },
        ],

        // ==========================================
        // INIT
        // ==========================================

        async initGame() {
            // Restaura idioma salvo ('pt-br', 'es' ou 'en')
            const savedLang = localStorage.getItem('idleton_lang');
            const availableLangs = getAvailableLangs();
            const initialLang = availableLangs.includes(savedLang) ? savedLang : 'pt-br';
            setLang(initialLang);
            this.language = getLang();
            localStorage.setItem('idleton_lang', initialLang);
            this._refreshLocalizedConfig();

            const savedName = localStorage.getItem('idleton_hero_name') || 'Zé Ninguém';
            try {
                const data = await loadGame(savedName);
                if (data) {
                    // Mescla save com o defaultState para não perder campos novos
                    this.state = this._migrateState({ ...JSON.parse(JSON.stringify(defaultState)), ...data });
                    localStorage.setItem('idleton_hero_name', this.state.hero.name);
                }
            } catch (e) {
                console.error('Erro ao carregar save:', e);
            }

            ensureQuests(this.state);
            generateTavernContracts(this.state);
            this.recalcStats();
            this._setupCanvas();

            // Salva timestamp do último tick para catch-up offline
            this.state.lastTickAt = Date.now();

            requestAnimationFrame(ts => this._gameLoop(ts));
            setInterval(() => this.saveGame(), 30000);

            // Backup interval para processamento em background (quando a aba está inativa)
            setInterval(() => this._backgroundTick(), 1000);

            // Listener de visibilidade: catch-up quando a aba volta ao foco
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && this.state.lastTickAt) {
                    const now = Date.now();
                    const elapsedMs = now - this.state.lastTickAt;
                    if (elapsedMs > 2000) { // Só faz catch-up se ausente por mais de 2s
                        const te = getTreeEffects(this.state);
                        const offlineBonusSec = (te.offline_cap_bonus || 0) * 30 * 60;
                        const ascOfflineSec = (this.state.ascension?.perks?.offline_cap || 0) * 2 * 3600;
                        const maxOfflineSec = 3600 + offlineBonusSec + ascOfflineSec;
                        const elapsedSec = Math.min(elapsedMs / 1000, maxOfflineSec);
                        this._processOfflineProgress(elapsedSec);
                    }
                    this.state.lastTickAt = now;
                    this.lastTick = performance.now();
                }
            });

            this.addLog('Aventura iniciada!', 'narrative');

            // Exibe a introdução para novatos (caso não tenha completado nem pulado)
            if (!this.state.tutorial || (!this.state.tutorial.completed && !this.state.tutorial.skipped)) {
                this.$nextTick(() => {
                    this.openTutorial();
                });
            }
        },

        /** Migrações de save antigo para novo schema. */
        _migrateState(s) {
            if (!s.logs) s.logs = [];
            if (!s.equipment) s.equipment = JSON.parse(JSON.stringify(defaultState.equipment));
            if (!s.inventory) s.inventory = [];
            if (!s.bestiary) s.bestiary = {};
            if (!s.skills) s.skills = JSON.parse(JSON.stringify(defaultState.skills));

            // Garante nós de Pets e Quests
            if (!s.pets) {
                s.pets = { tamerUnlocked: false, owned: [], active: null };
            }
            if (!s.pets.owned) s.pets.owned = [];
            if (typeof s.pendingDropItem === 'undefined') s.pendingDropItem = null;

            // Garante que cada item do inventário tenha flag isLocked
            (s.inventory || []).forEach(item => {
                if (typeof item.isLocked === 'undefined') item.isLocked = false;
            });

            // Garante que equipamentos tenham isLocked normalizado
            if (s.equipment) {
                Object.values(s.equipment).forEach(item => {
                    if (item && typeof item.isLocked === 'undefined') item.isLocked = false;
                });
            }

            if (typeof s.domainLevel === 'undefined') s.domainLevel = 0;

            ensureQuests(s);

            if (typeof s.hero.pe === 'undefined' || s.hero.pe === null) {
                s.hero.pe = (s.hero.skillPoints || 0);
            }
            delete s.hero.skillPoints;

            if (typeof s.hero.nameChanges === 'undefined') s.hero.nameChanges = 0;

            // Migra buildings antigos (hut/farm/mine) para novo schema
            if (!s.buildings || !s.buildings.hut) {
                s.buildings = JSON.parse(JSON.stringify(defaultState.buildings));
            }
            // Garante que novas construções existam e sincroniza metadados de utilidade e categoria
            for (const key in defaultState.buildings) {
                if (!s.buildings[key]) s.buildings[key] = { ...defaultState.buildings[key] };
                s.buildings[key].name = defaultState.buildings[key].name;
                s.buildings[key].icon = defaultState.buildings[key].icon;
                s.buildings[key].prod = defaultState.buildings[key].prod;
                s.buildings[key].baseCost = defaultState.buildings[key].baseCost;
                s.buildings[key].resource = defaultState.buildings[key].resource;
                s.buildings[key].category = defaultState.buildings[key].category;
                s.buildings[key].utilityDesc = defaultState.buildings[key].utilityDesc;
                s.buildings[key].utilityType = defaultState.buildings[key].utilityType;
                s.buildings[key].utilityVal = defaultState.buildings[key].utilityVal;
            }

            // Normalização de Diamante comum (singular)
            if (typeof s.resources.diamonds === 'number') {
                s.resources.diamond = (s.resources.diamond || 0) + s.resources.diamonds;
                delete s.resources.diamonds;
            }
            if (!s.resources.diamond && s.resources.diamond !== 0) s.resources.diamond = 0;
            if (typeof s.maxZone === 'undefined') s.maxZone = s.zone || 1;
            if (typeof s.totalKills === 'undefined') s.totalKills = 0;
            if (typeof s.hero.statPoints === 'undefined') s.hero.statPoints = 0;
            if (typeof s.hero.energy === 'undefined' || s.hero.energy < 30) s.hero.energy = Math.max(s.hero.energy || 0, 30);
            if (typeof s.hero.mana === 'undefined' || s.hero.mana < 30) s.hero.mana = Math.max(s.hero.mana || 0, 30);
            if (typeof s.bossSafeMode === 'undefined') s.bossSafeMode = false;
            if (!s.tutorial) {
                s.tutorial = { completed: false, skipped: false, rewardClaimed: false };
            }
            if (typeof s.oracleBuff === 'undefined') s.oracleBuff = null;
            if (s.oracleBuff && s.oracleBuff.expiresAt && s.oracleBuff.expiresAt <= Date.now()) {
                s.oracleBuff = null;
            }
            if (typeof s.tavernRestBuff === 'undefined') s.tavernRestBuff = null;
            if (s.tavernRestBuff && s.tavernRestBuff.expiresAt && s.tavernRestBuff.expiresAt <= Date.now()) {
                s.tavernRestBuff = null;
            }
            if (typeof s.explorationEvent === 'undefined') s.explorationEvent = null;
            if (!s.achievementsClaimed) s.achievementsClaimed = {};

            if (!s.marketPurchases) {
                s.marketPurchases = { wood: 0, scrap: 0, iron: 0, essence: 0 };
            }
            if (!s.ascension) {
                s.ascension = JSON.parse(JSON.stringify(defaultState.ascension));
            }
            if (!s.ascension.perks) {
                s.ascension.perks = JSON.parse(JSON.stringify(defaultState.ascension.perks));
            } else {
                for (const pKey in defaultState.ascension.perks) {
                    if (typeof s.ascension.perks[pKey] === 'undefined') {
                        s.ascension.perks[pKey] = 0;
                    }
                }
            }
            // GDD Expansão 1.4: Migração de saves antigos
            // Se o save usa o sistema antigo (ascension.diamonds), migrar para ancestralDiamonds
            if (typeof s.ascension.diamonds === 'number' && s.ascension.diamonds > 0) {
                s.resources.ancestralDiamonds = (s.resources.ancestralDiamonds || 0) + s.ascension.diamonds;
                s.ascension.totalAncestralEarned = (s.ascension.totalAncestralEarned || 0) + s.ascension.diamonds;
                delete s.ascension.diamonds;
            }
            if (typeof s.ascension.totalAncestralEarned === 'undefined') {
                s.ascension.totalAncestralEarned = 0;
            }
            if (typeof s.resources.ancestralDiamonds === 'undefined') {
                s.resources.ancestralDiamonds = 0;
            }
            // Recalcula nextXp para a nova curva 1.19× (migração de saves com curvas antigas)
            if (s.hero.level && s.hero.nextXp) {
                const expectedNextXp = calcXpForLevel(s.hero.level);
                // Se o nextXp armazenado difere muito do esperado, corrige
                if (Math.abs(s.hero.nextXp - expectedNextXp) > expectedNextXp * 0.1) {
                    s.hero.nextXp = expectedNextXp;
                }
            }

            // GDD v1.2 Normalizações
            if (typeof s.inventoryMaxSlots === 'undefined') s.inventoryMaxSlots = 20;
            if (typeof s.hero.specialization === 'undefined') s.hero.specialization = null;
            if (!s.petExpeditions) s.petExpeditions = [];
            if (!s.pets) {
                s.pets = { tamerUnlocked: false, owned: [], active: null, levels: {}, xp: {}, talents: {}, talentPoints: 0 };
            } else {
                if (!s.pets.levels) s.pets.levels = {};
                if (!s.pets.xp) s.pets.xp = {};
                if (!s.pets.talents) s.pets.talents = {};
                if (typeof s.pets.talentPoints === 'undefined') {
                    // Concede pontos retroativos baseados no Domador (+1) e mascotes adotados (+1 cada)
                    const spent = Object.values(s.pets.talents || {}).reduce((a, b) => a + (b || 0), 0);
                    const earned = (s.pets.tamerUnlocked ? 1 : 0) + (s.pets.owned?.length || 0);
                    s.pets.talentPoints = Math.max(0, earned - spent);
                }
                for (const pId of (s.pets.owned || [])) {
                    if (!s.pets.levels[pId]) s.pets.levels[pId] = 1;
                    if (typeof s.pets.xp[pId] === 'undefined') s.pets.xp[pId] = 0;
                }
            }
            // Chefe Mundial Diário (GDD Expansão 1.6)
            syncWorldBossDailyReset(s);
            if (s.worldBoss?.inBattle) {
                s.worldBoss.inBattle = false;
            }
            if (!s.tower) {
                s.tower = { floor: 1, maxFloor: 1, inBattle: false, monster: null, modifier: null, logs: [], roomType: 'monster', eventRoom: null, isVictory: false, isDefeat: false };
            } else {
                if (typeof s.tower.floor === 'undefined') s.tower.floor = 1;
                if (typeof s.tower.maxFloor === 'undefined') s.tower.maxFloor = 1;
                if (typeof s.tower.inBattle === 'undefined') s.tower.inBattle = false;
                if (typeof s.tower.logs === 'undefined') s.tower.logs = [];
                // Se a sessão anterior ficou com inBattle=true mas sem monstro nem evento, normaliza
                if (s.tower.inBattle && !s.tower.monster && !s.tower.eventRoom) {
                    s.tower.inBattle = false;
                }
            }
            if (!s.villageSiege) {
                s.villageSiege = { active: false, timerSec: 180, endsAt: 0, monster: null, buffExpiresAt: 0, nextCheckAt: 0 };
            }
            if (!s.autoLootFilter || typeof s.autoLootFilter.enabled === 'undefined') {
                s.autoLootFilter = {
                    enabled: false,
                    collapsed: false,
                    common: 'none',
                    uncommon: 'none',
                    rare: 'none',
                    epic: 'none',
                    legendary: 'none',
                    saveUpgrades: true,
                    saveSets: true,
                };
            } else {
                if (typeof s.autoLootFilter.collapsed === 'undefined') s.autoLootFilter.collapsed = false;
                if (typeof s.autoLootFilter.epic === 'undefined') s.autoLootFilter.epic = 'none';
                if (typeof s.autoLootFilter.legendary === 'undefined') s.autoLootFilter.legendary = 'none';
                if (typeof s.autoLootFilter.saveUpgrades === 'undefined') s.autoLootFilter.saveUpgrades = true;
                if (typeof s.autoLootFilter.saveSets === 'undefined') s.autoLootFilter.saveSets = true;
            }
            if (typeof s.audioEnabled === 'undefined') s.audioEnabled = false;
            if (typeof s.audioVolume === 'undefined') s.audioVolume = 0.5;
            if (typeof s.marketLastReset === 'undefined') s.marketLastReset = Date.now();
            if (typeof s.statResets === 'undefined') s.statResets = 0;
            if (typeof s.forgeCount === 'undefined') s.forgeCount = 0;
            if (!s.lifetimeStats) {
                s.lifetimeStats = {
                    kills: 0,
                    bosses: 0,
                    goldEarned: 0,
                    itemsCrafted: 0,
                    itemsUpgraded: 0,
                    enchantmentsDone: 0,
                    timePlayedSec: 0,
                    highestTowerFloor: 1,
                    criticalHits: 0,
                };
            } else if (typeof s.lifetimeStats.criticalHits === 'undefined') {
                s.lifetimeStats.criticalHits = 0;
            }
            if (!s.statsSession) {
                s.statsSession = { startedAt: Date.now(), kills: 0, goldEarned: 0, xpEarned: 0, damageDealt: 0 };
            }

            // Garante contratos de suprimento da taverna
            if (!Array.isArray(s.tavernContracts) || s.tavernContracts.length === 0) {
                generateTavernContracts(s, true);
            }

            // Garante que se um monstro da zona 1 estiver ativo com HP antigo, ele seja recriado com 5 HP
            if (s.monster && s.zone === 1 && s.monster.maxHp > 10) {
                s.monster = createMonster(s.zone, s.killsInZone || 0, s.bossSafeMode);
            }

            // GDD Fase 2.2 / 4A: migração da Árvore de Habilidades
            if (!s.treeSkills) s.treeSkills = {};
            if (s.treeSkills.brs_a2) { s.treeSkills.brs_act = s.treeSkills.brs_a2; delete s.treeSkills.brs_a2; }
            if (s.treeSkills.pal_a2) { s.treeSkills.pal_act = s.treeSkills.pal_a2; delete s.treeSkills.pal_a2; }
            if (s.treeSkills.mag_a2) { s.treeSkills.mag_act = s.treeSkills.mag_a2; delete s.treeSkills.mag_a2; }
            if (s.treeSkills.thf_a2) { s.treeSkills.thf_act = s.treeSkills.thf_a2; delete s.treeSkills.thf_a2; }

            if (typeof s.hero.treePoints === 'undefined') {
                // Retroativo: jogadores que já passaram do nível 10 recebem os pontos acumulados
                const pastLevels = Math.max(0, (s.hero.level || 1) - 9);
                s.hero.treePoints = pastLevels;
            }

            // Migração de ícones legados FontAwesome Pro -> FontAwesome Free 6.6.0
            const fixBrokenFaIcon = (ic) => {
                if (ic === 'fa-dagger' || ic === 'fa-sword' || ic === 'fa-swords') return 'fa-khanda';
                if (ic === 'fa-anvil') return 'fa-hammer';
                if (ic === 'fa-sparkles') return 'fa-wand-magic-sparkles';
                if (ic === 'fa-fort-awesome') return 'fa-chess-rook';
                return ic;
            };
            if (Array.isArray(s.inventory)) {
                s.inventory.forEach(it => { if (it && it.icon) it.icon = fixBrokenFaIcon(it.icon); });
            }
            if (s.equipment && typeof s.equipment === 'object') {
                Object.values(s.equipment).forEach(it => { if (it && it.icon) it.icon = fixBrokenFaIcon(it.icon); });
            }
            if (Array.isArray(s.quests)) {
                s.quests.forEach(q => { if (q && q.icon) q.icon = fixBrokenFaIcon(q.icon); });
            }

            return s;
        },

        async saveGame() {
            try {
                await saveGame(this.state.hero.name, this.state);
            } catch (e) {
                console.error('Erro no autosave:', e);
            }
        },

        // ==========================================
        // UI HELPERS
        // ==========================================

        addLog(text, type = 'narrative') {
            if (!this.state.logs) this.state.logs = [];
            this.state.logs.unshift(createLogEntry(text, type));
            if (this.state.logs.length > 100) this.state.logs.pop();
        },

        clearCombatLogs() {
            this.state.logs = [];
        },

        getFilteredLogs() {
            if (!this.state.logs) return [];
            if (this.combatLogFilter === 'all') return this.state.logs;
            if (this.combatLogFilter === 'combat') {
                return this.state.logs.filter(l => l.type === 'narrative' || l.type === 'danger');
            }
            if (this.combatLogFilter === 'loot') {
                return this.state.logs.filter(l => l.type === 'loot');
            }
            if (this.combatLogFilter === 'level') {
                return this.state.logs.filter(l => l.type === 'level' || l.type === 'prestige');
            }
            return this.state.logs;
        },

        pushCombatFloat(f, delayMs = 0) {
            if (!f) return;
            if (delayMs <= 0) {
                this._addFloatWithSeparation(f);
            } else {
                setTimeout(() => {
                    if (this.canvas && this.state.isExploring) {
                        this._addFloatWithSeparation(f);
                    }
                }, delayMs);
            }
        },

        _addFloatWithSeparation(f) {
            if (!this.floats) this.floats = [];
            let attempts = 0;
            while (attempts < 5) {
                const colliding = this.floats.find(other =>
                    Math.abs(other.x - f.x) < 42 && Math.abs(other.y - f.y) < 24
                );
                if (!colliding) break;
                f.y -= 20;
                f.x += (attempts % 2 === 0 ? 15 : -15);
                attempts++;
            }
            if (this.floats.length > 20) {
                this.floats.splice(0, this.floats.length - 20);
            }
            this.floats.push(f);
        },

        showNotification(text) {
            this.globalNotification = text;
            setTimeout(() => { this.globalNotification = null; }, 3000);
        },

        toggleMenu() { this.menuOpen = !this.menuOpen; },
        switchTab(id) {
            this.activeTab = id;
            if (window.innerWidth < 1024) this.menuOpen = false;
            if (id === 'explore') {
                this.$nextTick(() => {
                    this._setupCanvas();
                    if (this.canvas && this.ctx) {
                        resizeCanvas(this.canvas, this.ctx);
                    }
                });
            }
        },

        _refreshLocalizedConfig() {
            this.tabs = this.tabs.map(tb => ({
                ...tb,
                name: t(`nav.tab.${tb.id}`) !== `nav.tab.${tb.id}` ? t(`nav.tab.${tb.id}`) : tb.name,
            }));
            this.statConfig = this.statConfig.map(sc => ({
                ...sc,
                name: t(`stat.${sc.key}`) !== `stat.${sc.key}` ? t(`stat.${sc.key}`) : sc.name,
                tip: t(`stat.${sc.key}.tip`) !== `stat.${sc.key}.tip` ? t(`stat.${sc.key}.tip`) : sc.tip,
            }));
        },

        // Troca idioma e persiste a preferência
        switchLang(lang) {
            if (!getAvailableLangs().includes(lang)) return;
            setLang(lang);
            this.language = getLang();
            localStorage.setItem('idleton_lang', lang);
            this._refreshLocalizedConfig();
            this.showNotification(t('settings.language_changed'));
        },

        // Função de tradução exposta no template Alpine
        t(key, params) { return t(key, params); },

        // ==========================================
        // GUIA DO AVENTUREIRO (TUTORIAL & INTRODUÇÃO)
        // ==========================================

        openTutorial() {
            this.tutorialStep = 0;
            this.tutorialConfirmSkipOpen = false;
            this.tutorialModalOpen = true;
        },

        closeTutorial() {
            this.tutorialModalOpen = false;
            this.tutorialConfirmSkipOpen = false;
        },

        nextTutorialStep() {
            if (this.tutorialStep < this.TUTORIAL_STEPS.length - 1) {
                this.tutorialStep++;
            }
        },

        prevTutorialStep() {
            if (this.tutorialStep > 0) {
                this.tutorialStep--;
            }
        },

        setTutorialStep(idx) {
            if (idx >= 0 && idx < this.TUTORIAL_STEPS.length) {
                this.tutorialStep = idx;
            }
        },

        requestSkipTutorial() {
            this.tutorialConfirmSkipOpen = true;
        },

        cancelSkipTutorial() {
            this.tutorialConfirmSkipOpen = false;
        },

        confirmSkipTutorial() {
            if (!this.state.tutorial) this.state.tutorial = {};
            this.state.tutorial.skipped = true;
            this.tutorialConfirmSkipOpen = false;
            this.tutorialModalOpen = false;
            this.saveGame();
            this.showNotification('Introdução pulada. Você pode consultar o guia a qualquer momento no ícone [?] no topo!');
        },

        claimTutorialReward() {
            if (!this.state.tutorial) this.state.tutorial = {};
            if (this.state.tutorial.rewardClaimed) {
                this.showNotification('Você já resgatou sua recompensa de introdução!');
                this.closeTutorial();
                return;
            }

            this.state.resources.gold = (this.state.resources.gold || 0) + this.TUTORIAL_REWARD.gold;
            this.state.resources.diamond = (this.state.resources.diamond || 0) + this.TUTORIAL_REWARD.diamond;
            this.state.resources.scrap = (this.state.resources.scrap || 0) + this.TUTORIAL_REWARD.scrap;
            this.state.resources.wood = (this.state.resources.wood || 0) + this.TUTORIAL_REWARD.wood;
            this.state.resources.iron = (this.state.resources.iron || 0) + this.TUTORIAL_REWARD.iron;

            this.state.tutorial.completed = true;
            this.state.tutorial.rewardClaimed = true;
            this.state.tutorial.skipped = false;

            if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
            this.showNotification('🎉 Guia concluído! 500 Ouro, 15 Diamantes e Recursos Iniciais recebidos!');
            this.saveGame();
            this.closeTutorial();
        },

        // ==========================================
        // HERÓI
        // ==========================================

        changeHeroName(newName) {
            const result = changeHeroName(this.state, this.state.resources, newName);
            this.showNotification(result.msg);
            if (result.ok) this.saveGame();
        },

        resetProgress() {
            this.state = JSON.parse(JSON.stringify(defaultState));
            localStorage.setItem('idleton_hero_name', this.state.hero.name);
            this.recalcStats();
            this.saveGame();
            this.showNotification('Progresso resetado com sucesso!');
            this.activeTab = 'city';
            this.settingsOpen = false;
        },

        // ==========================================
        // STATS
        // ==========================================

        recalcStats() {
            const d = recalcDerived(this.state);
            this.state.derived = d;
            if (this.state.hero.hp > d.hpMax) this.state.hero.hp = d.hpMax;
        },

        /**
         * Verifica e processa level ups pendentes.
         * Reutilizável: chamado ao matar monstro, coletar missão, ou qualquer fonte de XP.
         */
        _checkLevelUp() {
            while (this.state.hero.xp >= this.state.hero.nextXp) {
                this.state.hero.level++;
                this.state.hero.xp -= this.state.hero.nextXp;
                this.state.hero.nextXp = calcXpForLevel(this.state.hero.level);
                // GDD Expansão 1.1: +2 pontos de atributo por nível
                this.state.hero.statPoints = (this.state.hero.statPoints || 0) + 2;
                this.state.baseStats.hpMax += 10;

                // Bônus de marco a cada 10 níveis (+2 pontos de atributo bônus)
                if (this.state.hero.level % 10 === 0) {
                    this.state.hero.statPoints += 2;
                    this.addLog(`🌟 MARCO! Nível ${this.state.hero.level} — +2 Pontos de Atributo Bônus!`, 'prestige');
                }

                this.recalcStats();
                this.state.hero.hp = this.state.derived.hpMax;

                const f = makeSpecialFloat(this.canvas, 'LEVEL UP!', '#fbbf24');
                if (f) this.pushCombatFloat(f, 0);

                if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);

                this.addLog(`LEVEL UP! Nível ${this.state.hero.level} (+2 Pontos de Atributo) ✨`, 'level');
                this.showNotification(`LEVEL UP! Você alcançou o Nível ${this.state.hero.level}!`);

                // Nível 10+: ganha +1 Ponto de Árvore por nível
                if (this.state.hero.level >= 10) {
                    this.state.hero.treePoints = (this.state.hero.treePoints || 0) + 1;
                }

                // Nível 10: Desbloqueio da Especialização de Classe e Árvore de Habilidades
                if (this.state.hero.level === 10 && !this.state.hero.specialization) {
                    // Pausa qualquer combate que estiver ocorrendo para decisão do jogador
                    if (this.state.isExploring) {
                        this.state.isExploring = false;
                        if (this.state.monster) {
                            this.state.monster.hp = this.state.monster.maxHp;
                            this.state.monster.atkTimer = 0;
                        }
                    }
                    if (this.state.tower?.inBattle) {
                        this.state.tower.inBattle = false;
                    }
                    if (this.state.villageSiege?.inBattle) {
                        this.state.villageSiege.inBattle = false;
                    }

                    this.specializationModalOpen = true;
                    this.addLog('🔮 Nível 10 Alcançado! Combate pausado para escolha de Especialização e desbloqueio da Árvore de Habilidades.', 'prestige');
                    this.showNotification('Nível 10! Escolha sua Especialização.');
                }
            }
        },

        // ==========================================
        // HABILIDADES
        // ==========================================

        buySkill(skillId) {
            const result = buySkill(this.state, skillId);
            if (result.ok) {
                this.recalcStats();
                this.showNotification(result.msg);
            } else {
                this.addLog(result.msg, 'danger');
            }
        },

        // ==========================================
        // ATRIBUTOS (Stat Points)
        // ==========================================

        allocateStat(statKey) {
            const ok = allocateStat(this.state, statKey);
            if (ok) {
                this.recalcStats();
                // Ajusta Energy/Mana se o max mudou
                if (this.state.hero.energy > this.state.derived.energyMax) this.state.hero.energy = this.state.derived.energyMax;
                if (this.state.hero.mana > this.state.derived.manaMax) this.state.hero.mana = this.state.derived.manaMax;
            } else if ((this.state.hero.statPoints || 0) <= 0) {
                this.addLog('Nenhum ponto de atributo disponível.', 'danger');
            }
        },

        // ==========================================
        // HABILIDADE ATIVA — Ataque Concentrado (Modificado pela Árvore)
        // ==========================================

        useFocusedAttack() {
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) return;
            const te = getTreeEffects(this.state);
            const isSilenced = this.state.tower?.inBattle && this.state.tower?.modifier?.id === 'silence';
            const silenceMult = isSilenced ? 2 : 1;

            // Determina custo e recurso (Mago usa Mana, outros usam Energia com desconto da árvore)
            const isArcane = !!te.mag_focus_boost;
            const energyCost = Math.max(15, 30 - (te.brs_focus_boost ? te.brs_focus_boost * 3 : (te.thf_focus_boost ? te.thf_focus_boost * 4 : 0))) * silenceMult;
            const manaCost = 30 * silenceMult;

            if (isArcane) {
                if ((this.state.hero.mana || 0) < manaCost) {
                    this.addLog(`Mana insuficiente para Transmutação Arcana! (${manaCost} 🧪)`, 'danger');
                    this.showNotification(`Mana insuficiente (${manaCost} 🧪)!`);
                    return;
                }
            } else {
                if ((this.state.hero.energy || 0) < energyCost) {
                    this.addLog(`Energia insuficiente para Ataque Concentrado! (${energyCost} ⚡)`, 'danger');
                    this.showNotification(`Energia insuficiente (${energyCost} ⚡)!`);
                    return;
                }
            }

            if (this.activeCooldownTimer > 0) return;

            // Consumo de recurso
            if (isArcane) {
                this.state.hero.mana -= manaCost;
            } else {
                this.state.hero.energy -= energyCost;
            }

            // Cooldown ajustado por utilidade do ladrão se houver
            let cd = 8;
            if (te.thief_utility) cd = Math.max(4, cd * (1 - te.thief_utility * 0.15));
            this.activeCooldownTimer = cd;

            // Cálculo de multiplicador e atributo base
            let baseStat = this.state.derived.str;
            let mult = 3;
            if (te.brs_focus_boost) mult += te.brs_focus_boost * 1;
            if (te.mag_focus_boost) {
                baseStat = this.state.derived.int;
                mult = 3 + te.mag_focus_boost * 1;
            }
            if (te.thf_focus_boost) mult = (3 + te.thf_focus_boost * 0.8) * 1.5; // crítico letal

            // Rastreia acerto crítico da habilidade
            trackQuestProgress(this.state, 'CRITICAL_HITS', 1);
            if (this.state.lifetimeStats) {
                this.state.lifetimeStats.criticalHits = (this.state.lifetimeStats.criticalHits || 0) + 1;
            }

            // Paladino: Baluarte soma defesa ao ataque
            let bonusDefDmg = 0;
            if (te.paladin_bastion) bonusDefDmg = Math.floor(this.state.derived.def * te.paladin_bastion * 0.40);

            // Corvo Arcano: +15% Dano de Habilidades Ativas (escalado pela Afinidade/Instinto Alfa)
            const crowMult = 1 + 0.15 * getPetBonusMultiplier(this.state, 'corvo_arcano');

            // Chefe Mundial Diário em combate
            if (this.state.worldBoss?.inBattle) {
                const dmg = Math.floor((baseStat * mult + bonusDefDmg) * crowMult * (0.9 + Math.random() * 0.2));
                this.state.worldBoss.damageDealt = (this.state.worldBoss.damageDealt || 0) + dmg;
                const name = isArcane ? 'Transmutação Arcana' : 'Ataque Concentrado';
                this.state.worldBoss.logs.unshift(`⚡ ${name} causou ${dmg.toLocaleString('pt-BR')} de dano ao Chefe Mundial!`);
                if (this.state.worldBoss.logs.length > 35) this.state.worldBoss.logs.pop();
                return;
            }

            // Torre em combate
            if (this.state.tower?.inBattle && this.state.tower.roomType === 'monster' && this.state.tower.monster) {
                const tm = this.state.tower.monster;
                const towerMult = (this.state.tower.heroDmgMult || 1.0);
                const dmg = Math.floor((baseStat * mult + bonusDefDmg) * crowMult * towerMult * (0.9 + Math.random() * 0.2));
                tm.hp -= dmg;
                tm.isHit = true;
                tm.hitTimer = 0.5;

                const name = isArcane ? 'Transmutação Arcana' : 'Ataque Concentrado';
                this.state.tower.logs.unshift(`⚡ ${name} atingiu ${tm.name} causando ${dmg} de dano!`);
                this.addLog(`⚡ ${name} na Torre: -${dmg} HP no ${tm.name}!`, 'level');

                if (tm.hp <= 0) {
                    handleTowerMonsterKill(this.state);
                    this._checkLevelUp();
                }
                return;
            }

            // Cerco da Vila
            if (this.state.villageSiege?.active && this.state.villageSiege?.inBattle && this.state.villageSiege.monster) {
                const sm = this.state.villageSiege.monster;
                const dmg = Math.floor((baseStat * mult + bonusDefDmg) * crowMult * (0.9 + Math.random() * 0.2));
                sm.hp -= dmg;
                sm.isHit = true;
                sm.hitTimer = 0.5;

                this.addLog(`⚡ Ataque Concentrado no Invasor: -${dmg} HP!`, 'level');

                if (sm.hp <= 0) {
                    sm.hp = 0;
                    const vicRes = resolveSiegeVictory(this.state);
                    this.state.villageSiege.inBattle = false;
                    this.state.villageSiege.active = false;
                    this.siegeModalOpen = false;
                    this.addLog(vicRes.msg, 'prestige');
                    this.showNotification('🏆 Invasão da Vila Repelida com Sucesso!');
                    if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
                }
                return;
            }

            // Exploração regular
            if (this.state.isExploring && this.state.monster) {
                const dmg = Math.floor((baseStat * mult + bonusDefDmg) * crowMult * (0.9 + Math.random() * 0.2));
                this.state.monster.hp -= dmg;
                this.state.monster.isHit = true;
                this.state.monster.hitTimer = 0.5;

                const f = makeHeroDmgFloat(this.canvas, dmg, true);
                if (f) this.pushCombatFloat(f);

                const name = isArcane ? 'Transmutação Arcana' : 'Ataque Concentrado';
                this.addLog(`⚡ ${name} em ${this.state.monster.name}: -${dmg} HP!`, 'level');

                if (this.state.monster.hp <= 0) {
                    this._killMonster();
                }
            }
        },

        // ==========================================
        // HABILIDADE ATIVA — Cura Espontânea (Modificada pela Árvore)
        // ==========================================

        useQuickHeal() {
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) return;
            const te = getTreeEffects(this.state);
            const isSilenced = this.state.tower?.inBattle && this.state.tower?.modifier?.id === 'silence';
            const silenceMult = isSilenced ? 2 : 1;
            const manaCost = Math.max(15, 30 - (te.pal_heal_boost ? te.pal_heal_boost * 3 : 0)) * silenceMult;

            if ((this.state.hero.mana || 0) < manaCost) {
                this.addLog(`Mana insuficiente para Cura Espontânea! (${manaCost} 🧪)`, 'danger');
                this.showNotification(`Mana insuficiente (${manaCost} 🧪)!`);
                return;
            }
            if (this.healCooldownTimer > 0) return;

            this.state.hero.mana -= manaCost;

            let cd = 12;
            if (te.thief_utility) cd = Math.max(6, cd * (1 - te.thief_utility * 0.15));
            this.healCooldownTimer = cd;

            let healPct = 0.25;
            if (te.pal_heal_boost) healPct += te.pal_heal_boost * 0.10;
            if (te.berserker_utility) healPct += te.berserker_utility * 0.10;

            const healAmt = Math.floor(this.state.derived.hpMax * healPct);
            this.state.hero.hp = Math.min(this.state.derived.hpMax, (this.state.hero.hp || 0) + healAmt);

            // Mago Arcano: Canalização Etérea restaura Mana junto com HP
            if (te.mage_utility) {
                const manaRestore = te.mage_utility * 20;
                this.state.hero.mana = Math.min(this.state.derived.manaMax, (this.state.hero.mana || 0) + manaRestore);
                this.addLog(`✨ Canalização Etérea restaurou +${manaRestore} 🧪 de Mana!`, 'level');
            }

            if (this.canvas) {
                const f = makeSpecialFloat(this.canvas, `+${healAmt} HP`, '#4ade80');
                if (f) this.pushCombatFloat(f);
            }

            if (this.state.tower?.inBattle) {
                this.state.tower.logs.unshift(`🧪 Cura Espontânea restaurou +${healAmt} HP!`);
            }
            if (this.state.worldBoss?.inBattle) {
                this.state.worldBoss.logs.unshift(`🧪 Cura Espontânea restaurou +${healAmt} HP!`);
            }
            this.addLog(`🧪 Cura Espontânea restaurou +${healAmt} HP!`, 'level');
        },

        // ==========================================
        // EXPLORAÇÃO, BIOMAS, TÍTULOS & EVENTOS
        // ==========================================

        getCurrentBiome() {
            const z = this.state?.zone || 1;
            return ZONE_BIOMES.find(b => z >= b.minZone && z <= b.maxZone) || ZONE_BIOMES[0];
        },

        getHeroTitle() {
            const lvl = this.state?.hero?.level || 1;
            let current = HERO_TITLES[0];
            for (const t of HERO_TITLES) {
                if (lvl >= t.minLevel) current = t;
            }
            return current;
        },

        getActivePetDef() {
            const activeId = this.state?.pets?.active;
            if (!activeId) return null;
            return PETS.find(p => p.id === activeId) || null;
        },

        resolveExplorationEvent(choiceIdx) {
            const ev = this.state.explorationEvent;
            if (!ev || !ev.choices || !ev.choices[choiceIdx]) return;
            const choice = ev.choices[choiceIdx];
            const z = Math.max(1, this.state.zone || 1);
            const lvl = Math.max(1, this.state.hero?.level || 1);

            if (choice.action === 'open_chest') {
                if (Math.random() < 0.72) {
                    const goldGain = Math.floor(80 * z * (0.9 + Math.random() * 0.4));
                    const matTypes = ['wood', 'iron', 'scrap', 'essence'];
                    const matKey = matTypes[Math.floor(Math.random() * matTypes.length)];
                    const matQty = Math.max(2, Math.floor(2 + z * 0.6));
                    this.state.resources.gold = (this.state.resources.gold || 0) + goldGain;
                    this.state.resources[matKey] = (this.state.resources[matKey] || 0) + matQty;
                    trackQuestProgress(this.state, 'EARN_GOLD', goldGain);
                    const msg = `📦 Baú Ancestral aberto! Ganhou +${goldGain} Ouro e +${matQty} ${matKey.toUpperCase()}!`;
                    this.addLog(msg, 'loot');
                    this.showNotification(msg);
                    if (this.state.audioEnabled) playItemDrop(this.state.audioVolume);
                } else {
                    const trapDmg = Math.max(1, Math.floor((this.state.derived?.hpMax || 100) * 0.15));
                    const scrapGain = Math.max(3, Math.floor(3 + z * 0.5));
                    this.state.hero.hp = Math.max(1, (this.state.hero.hp || 10) - trapDmg);
                    this.state.resources.scrap = (this.state.resources.scrap || 0) + scrapDmgSafe(scrapGain);
                    const msg = `💥 O baú tinha uma armadilha! Perdeu ${trapDmg} HP, mas desmontou a trava (+${scrapGain} Sucata).`;
                    this.addLog(msg, 'danger');
                    this.showNotification(msg);
                }
            } else if (choice.action === 'leave_chest') {
                const xpGain = Math.floor(25 * z);
                this.state.hero.xp = (this.state.hero.xp || 0) + xpGain;
                this._checkLevelUp();
                const msg = `🧭 Você seguiu com cautela e estudou o terreno (+${xpGain} XP).`;
                this.addLog(msg, 'narrative');
                this.showNotification(msg);
            } else if (choice.action === 'pray_dmg') {
                this.state.hero.energy = this.state.derived?.energyMax || 100;
                this.state.hero.mana = this.state.derived?.manaMax || 100;
                const xpGain = Math.floor(40 * z);
                this.state.hero.xp = (this.state.hero.xp || 0) + xpGain;
                this._checkLevelUp();
                const msg = `⛩️ As runas energizaram seu espírito! Energia/Mana em 100% e +${xpGain} XP!`;
                this.addLog(msg, 'prestige');
                this.showNotification(msg);
            } else if (choice.action === 'pray_heal') {
                this.state.hero.hp = this.state.derived?.hpMax || 100;
                this.state.hero.energy = this.state.derived?.energyMax || 100;
                this.state.hero.mana = this.state.derived?.manaMax || 100;
                const msg = `✨ A luz rúnica restaurou 100% do seu HP, Energia e Mana!`;
                this.addLog(msg, 'level');
                this.showNotification(msg);
            } else if (choice.action === 'buy_mystery') {
                const cost = Math.floor(45 * lvl);
                if ((this.state.resources.gold || 0) < cost) {
                    this.showNotification(`Ouro insuficiente para o Mercador Nômade (${cost} 🪙)!`);
                    return;
                }
                this.state.resources.gold -= cost;
                trackQuestProgress(this.state, 'SPEND_GOLD', cost);
                const essGain = Math.max(2, Math.floor(2 + z * 0.5));
                const diaChance = Math.random() < 0.35 ? 2 : 0;
                this.state.resources.essence = (this.state.resources.essence || 0) + essGain;
                if (diaChance > 0) this.state.resources.diamond = (this.state.resources.diamond || 0) + diaChance;
                const msg = `🐪 Sacola Misteriosa aberta: +${essGain} Essências ⚡${diaChance > 0 ? ` e +${diaChance} Diamantes 💎!` : '!'}`;
                this.addLog(msg, 'loot');
                this.showNotification(msg);
            } else if (choice.action === 'skip_merchant') {
                const goldTip = Math.floor(15 * z);
                this.state.resources.gold = (this.state.resources.gold || 0) + goldTip;
                const msg = `🐪 O mercador agradeceu a conversa e deixou +${goldTip} Ouro de lembrança.`;
                this.addLog(msg, 'narrative');
                this.showNotification(msg);
            } else if (choice.action === 'drink_spring') {
                this.state.hero.hp = this.state.derived?.hpMax || 100;
                this.state.hero.energy = this.state.derived?.energyMax || 100;
                this.state.hero.mana = this.state.derived?.manaMax || 100;
                const xpGain = Math.floor(35 * z);
                this.state.hero.xp = (this.state.hero.xp || 0) + xpGain;
                this._checkLevelUp();
                const msg = `⛲ Você bebeu da Nascente Cristalina! HP/Energia/Mana restaurados + ${xpGain} XP!`;
                this.addLog(msg, 'level');
                this.showNotification(msg);
            }

            this.state.explorationEvent = null;
            this.saveGame();

            function scrapDmgSafe(v) { return Math.max(1, v || 1); }
        },

        dismissExplorationEvent() {
            this.state.explorationEvent = null;
        },

        toggleExploration() {
            // Se o herói estiver morto / se recuperando:
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) {
                const minHp = (this.state.derived?.hpMax || 100) * 0.5;
                if ((this.state.hero.hp || 0) >= minHp) {
                    this.state.hero.isDead = false;
                    this.defeatModalOpen = false;
                    this.addLog('Herói retornou à batalha com mais de 50% de vida!', 'narrative');
                } else {
                    this.showNotification('Herói muito ferido! Aguarde pelo menos 50% de vida para retornar.');
                    return;
                }
            }

            // Exclusividade mútua: se iniciar exploração, encerra combate ativo da torre
            if (this.state.tower?.inBattle) {
                this.leaveTower();
            }

            this.state.isExploring = !this.state.isExploring;
            if (this.state.isExploring && !this.state.monster) {
                this.state.monster = createMonster(this.state.zone, this.state.killsInZone, this.state.bossSafeMode);
            } else if (!this.state.isExploring && this.state.monster) {
                // Restaura HP do monstro ao pausar
                this.state.monster.hp = this.state.monster.maxHp;
                this.state.monster.atkTimer = 0;
            }
        },

        toggleBossSafeMode() {
            this.state.bossSafeMode = !this.state.bossSafeMode;
            if (this.state.bossSafeMode) {
                if (this.state.monster && this.state.monster.isBoss) {
                    this.state.monster = createMonster(this.state.zone, 0, true);
                    this.addLog('🏃‍♂️ Você recuou para o Modo Farm! Treinando com monstros comuns.', 'narrative');
                }
                this.showNotification('Modo Farm Ativado!');
            } else {
                this.showNotification('Modo Desafio Ativado!');
                if (this.state.killsInZone >= 9) {
                    this.state.monster = createMonster(this.state.zone, 9, false);
                    this.addLog('⚔️ O Chefe da Zona se aproxima! Prepare-se!', 'danger');
                }
            }
            this.saveGame();
        },

        challengeBoss() {
            this.state.bossSafeMode = false;
            this.state.killsInZone = 9;
            this.state.monster = createMonster(this.state.zone, 9, false);
            this.addLog(`⚔️ Desafiando o Chefe da Zona ${this.state.zone}!`, 'danger');
            this.showNotification('O Chefe da Zona apareceu!');
            this.saveGame();
        },

        changeZone(delta) {
            const nextZone = (this.state.zone || 1) + delta;
            const maxZ = this.state.maxZone || 1;
            if (nextZone < 1 || nextZone > maxZ) return;
            this.state.zone = nextZone;
            this.state.killsInZone = 0;
            this.state.monster = createMonster(this.state.zone, 0, this.state.bossSafeMode);
            this.addLog(`Viajou para a Zona ${this.state.zone}!`, 'narrative');
            this.showNotification(`Zona ${this.state.zone}`);
            this.saveGame();
        },

        _killMonster() {
            const m = this.state.monster;

            if (!this.state.bestiary[m.baseType]) this.state.bestiary[m.baseType] = 0;
            this.state.bestiary[m.baseType]++;
            this.state.totalKills = (this.state.totalKills || 0) + 1;

            // Rastreia missão de abates
            trackQuestProgress(this.state, 'KILL_MONSTERS', 1);

            // Recompensas calculadas com bônus de Pets, Oráculo e Habilidades
            const { gold, xp } = calcKillRewards(m, this.state);
            this.state.resources.gold += gold;
            this.state.hero.xp += xp;
            this.state.killsInZone++;

            // Rastreia missão de ganho de ouro
            trackQuestProgress(this.state, 'EARN_GOLD', gold);

            // Estatísticas da Sessão e Históricas (Lifetime)
            if (!this.state.statsSession) {
                this.state.statsSession = { startedAt: Date.now(), kills: 0, goldEarned: 0, xpEarned: 0, damageDealt: 0 };
            }
            if (!this.state.lifetimeStats) {
                this.state.lifetimeStats = { kills: 0, bosses: 0, goldEarned: 0, itemsCrafted: 0, itemsUpgraded: 0, enchantmentsDone: 0, timePlayedSec: 0, highestTowerFloor: 1, criticalHits: 0 };
            }
            this.state.statsSession.kills++;
            this.state.statsSession.goldEarned += gold;
            this.state.statsSession.xpEarned += xp;

            this.state.lifetimeStats.kills++;
            this.state.lifetimeStats.goldEarned += gold;
            if (m.isBoss) this.state.lifetimeStats.bosses++;
            if (this.state.tower?.maxFloor) {
                this.state.lifetimeStats.highestTowerFloor = Math.max(this.state.lifetimeStats.highestTowerFloor, this.state.tower.maxFloor);
            }

            if (this.state.audioEnabled) playCoinClink(this.state.audioVolume);

            this.addLog(`Derrotou ${m.name} (+${gold} Ouro, +${xp} XP)`, 'narrative');

            // Cooldown e espaçamento sequencial de textos flutuantes de recompensas
            let rewardDelay = 120;
            if (gold > 0) {
                const gf = makeMonsterEffectFloat(this.canvas, `+${gold} 🪙`, '#fbbf24');
                if (gf) this.pushCombatFloat(gf, rewardDelay);
                rewardDelay += 140;
            }
            if (xp > 0) {
                const xpf = makeMonsterEffectFloat(this.canvas, `+${xp} XP`, '#38bdf8');
                if (xpf) this.pushCombatFloat(xpf, rewardDelay);
                rewardDelay += 140;
            }

            // Drops de Materiais Brutos (Madeira, Ferro, Essência, Sucata) com cooldown entre itens
            const matDrops = calcMonsterMaterialDrops(this.state, m);
            for (const md of matDrops) {
                const iconEmoji = md.id === 'wood' ? '🌲' : (md.id === 'iron' ? '🧱' : (md.id === 'essence' ? '⚡' : '⚙️'));
                this.addLog(`Coletou +${md.qty} ${md.name} ${iconEmoji}!`, 'loot');
                const mf = makeMonsterEffectFloat(this.canvas, `+${md.qty} ${md.name}`, md.color);
                if (mf) this.pushCombatFloat(mf, rewardDelay);
                rewardDelay += 160;
            }

            // Loot de Equipamentos com Filtros de Auto-Loot
            const lootResult = generateLoot(this.state, m);
            if (lootResult) {
                const filtered = applyAutoLootFilter(this.state, lootResult);
                if (filtered?.autoAction) {
                    this.addLog(filtered.msg, 'loot');
                } else if (lootResult.isOverflow) {
                    this.state.pendingDropItem = lootResult.item;
                    this.pendingDropModalOpen = true;
                    this.addLog(`🎒 Mochila cheia! Novo drop [${lootResult.item.name}] aguarda sua decisão.`, 'danger');
                } else {
                    this.state.inventory.push(lootResult);
                    if (filtered?.protectedReason === 'upgrade') {
                        this.addLog(`⭐ [Auto-Loot] Upgrade protegido: ${lootResult.name}!`, 'level');
                    } else if (filtered?.protectedReason === 'set') {
                        this.addLog(`🧩 [Auto-Loot] Peça de conjunto protegida: ${lootResult.name}!`, 'level');
                    } else {
                        this.addLog(`Drop: ${lootResult.name}!`, 'loot');
                    }
                    if (['rare', 'epic', 'legendary', 'mythic'].includes(lootResult.rarity) && this.state.audioEnabled) {
                        playItemDrop(this.state.audioVolume);
                    }
                }
            }

            // Level Up — delega para método reutilizável
            this._checkLevelUp();

            // XP de Afinidade para o Mascote Ativo
            if (this.state.pets?.active) {
                const petRes = grantPetXp(this.state, this.state.pets.active, m.isBoss ? 45 : 15);
                if (petRes?.leveledUp) {
                    const petDef = PETS.find(p => p.id === this.state.pets.active);
                    this.recalcStats();
                    this.addLog(`🐾 Afinidade de ${petDef?.name || 'Mascote'} subiu para Nível ${petRes.level}! (+1 Ponto de Talento Bestial)`, 'prestige');
                    this.showNotification(`🐾 ${petDef?.name} alcançou Afinidade Nv. ${petRes.level}!`);
                }
            }

            // Avanço de zona (boss)
            if (m.isBoss) {
                this.state.zone++;
                if (this.state.zone > this.state.maxZone) this.state.maxZone = this.state.zone;
                this.state.killsInZone = 0;
                this.addLog(`⚔️ Avançou para Zona ${this.state.zone}!`, 'level');
                this.showNotification(`Zona ${this.state.zone} desbloqueada!`);
            }

            // Evento Interativo de Exploração (12% de chance ao derrotar monstro quando não há evento pendente)
            if (!this.state.explorationEvent && Math.random() < 0.12 && EXPLORATION_EVENTS.length > 0) {
                const ev = EXPLORATION_EVENTS[Math.floor(Math.random() * EXPLORATION_EVENTS.length)];
                this.state.explorationEvent = {
                    ...JSON.parse(JSON.stringify(ev)),
                    triggeredAt: Date.now(),
                };
                this.addLog(`🗺️ Evento de Exploração encontrado: ${ev.title}!`, 'prestige');
            }

            // Spawn próximo monstro
            this.state.monster = createMonster(this.state.zone, this.state.killsInZone, this.state.bossSafeMode);

            // Perk de Ascensão: Caçador Veloz (fast_hunter) pré-carrega o timer de ataque a cada novo monstro
            const fastHunterLvl = this.state.ascension?.perks?.fast_hunter || 0;
            if (fastHunterLvl > 0) {
                const atkInterval = 1 / Math.max(0.5, this.state.derived?.atkSpeed || 1);
                this.state.hero.atkTimer = Math.min(atkInterval * 0.75, (this.state.hero.atkTimer || 0) + atkInterval * fastHunterLvl * 0.12);
            }
        },

        // ==========================================
        // MISSÕES PROCEDURAIS (GDD: Seção 15)
        // ==========================================

        claimQuest(questId) {
            const result = claimQuestReward(this.state, questId);
            if (result.ok) {
                this.addLog(result.msg, 'level');
                this.showNotification(result.msg);
                this._checkLevelUp(); // Verifica level up pelo XP da missão
                this.recalcStats();
                this.saveGame();
            } else {
                this.showNotification(result.msg);
            }
        },

        // ==========================================
        // COMPANHEIROS / PETS (GDD: Seção 18)
        // ==========================================

        buyTamer() {
            if ((this.state.resources.gold || 0) < TAMER_COST) {
                this.showNotification(`Ouro insuficiente! Necessário ${TAMER_COST} 🪙`);
                return;
            }
            this.state.resources.gold -= TAMER_COST;
            if (!this.state.pets) {
                this.state.pets = { tamerUnlocked: true, owned: [], active: null, levels: {}, xp: {}, talents: {}, talentPoints: 1 };
            } else {
                this.state.pets.tamerUnlocked = true;
                this.state.pets.talentPoints = (this.state.pets.talentPoints || 0) + 1;
            }
            trackQuestProgress(this.state, 'SPEND_GOLD', TAMER_COST);
            this.addLog('🐾 Você contratou o Domador de Feras! A aba de Companheiros foi desbloqueada (+1 Ponto de Talento Bestial).', 'level');
            this.showNotification('Domador Contratado com sucesso!');
            this.saveGame();
        },

        buyPet(petId) {
            const pet = PETS.find(p => p.id === petId);
            if (!pet) return;
            if ((this.state.resources.gold || 0) < pet.cost) {
                this.showNotification(`Ouro insuficiente! Necessário ${pet.cost} 🪙`);
                return;
            }
            this.state.resources.gold -= pet.cost;
            if (!this.state.pets.owned) this.state.pets.owned = [];
            this.state.pets.owned.push(petId);
            if (!this.state.pets.levels) this.state.pets.levels = {};
            if (!this.state.pets.xp) this.state.pets.xp = {};
            this.state.pets.levels[petId] = 1;
            this.state.pets.xp[petId] = 0;
            this.state.pets.talentPoints = (this.state.pets.talentPoints || 0) + 1;
            if (!this.state.pets.active) {
                this.state.pets.active = petId;
            }
            trackQuestProgress(this.state, 'SPEND_GOLD', pet.cost);
            this.recalcStats();
            this.addLog(`🐾 Você adotou ${pet.name}! (${pet.effectDesc}) [+1 Ponto de Talento Bestial]`, 'loot');
            this.showNotification(`${pet.name} agora é seu companheiro!`);
            this.saveGame();
        },

        equipPet(petId) {
            if (!this.state.pets?.owned?.includes(petId)) return;
            this.state.pets.active = petId;
            this.recalcStats();
            const pet = PETS.find(p => p.id === petId);
            this.showNotification(`Companheiro ativo: ${pet?.name || 'Pet'} (Sinergia 1.5x Ativa!)`);
            this.saveGame();
        },

        unequipPet() {
            if (!this.state.pets) return;
            this.state.pets.active = null;
            this.recalcStats();
            this.showNotification('Companheiro desequipado.');
            this.saveGame();
        },

        getPetLevel(petId) {
            return this.state.pets?.levels?.[petId] || 1;
        },

        getPetXp(petId) {
            return this.state.pets?.xp?.[petId] || 0;
        },

        getPetNextXp(petId) {
            return getPetXpRequired(this.getPetLevel(petId));
        },

        getPetBonusText(pet) {
            if (!pet) return '';
            const owned = this.state.pets?.owned?.includes(pet.id);
            if (!owned) return pet.effectDesc;
            const mult = getPetBonusMultiplier(this.state, pet.id);
            const map = {
                coruja: `+${Math.round(15 * mult)}% de XP ganho`,
                pantera: `+${(5 * mult).toFixed(1)}% de Chance Crítica`,
                rato_ladrao: `+${Math.round(20 * mult)}% de Ouro saqueado`,
                raposa: `+${Math.round(10 * mult)} de Agilidade (AGI)`,
                corvo_arcano: `+${Math.round(15 * mult)}% Dano de Habilidades Ativas`,
                lobo_alfa: `+${Math.round(15 * mult)}% de Força Total (STR)`,
                salamandra: `+${Math.round(20 * mult)}% de Inteligência Total (INT)`,
                golem_mini: `+${Math.round(25 * mult)}% de Defesa Total (DEF)`,
            };
            return map[pet.id] || pet.effectDesc;
        },

        getPetTrainCost(petId) {
            return getPetTrainCost(this.state, petId);
        },

        trainPetById(petId) {
            const res = trainPet(this.state, petId);
            if (res.ok) {
                this.recalcStats();
                this.addLog(res.msg, res.leveledUp ? 'prestige' : 'loot');
                this.showNotification(res.msg);
                this.saveGame();
            } else {
                this.showNotification(res.msg);
            }
        },

        getPetTalentLevel(talentId) {
            return this.state.pets?.talents?.[talentId] || 0;
        },

        upgradePetTalent(talentId) {
            const res = buyPetTalent(this.state, talentId);
            if (res.ok) {
                this.recalcStats();
                this.addLog(res.msg, 'prestige');
                this.showNotification(res.msg);
                this.saveGame();
            } else {
                this.showNotification(res.msg);
            }
        },

        // ==========================================
        // DOMÍNIO & FORTIFICAÇÃO
        // ==========================================

        getFilteredBuildings() {
            const entries = Object.entries(this.state.buildings || {});
            if (!this.domainCategory || this.domainCategory === 'all') return entries;
            return entries.filter(([, b]) => b.category === this.domainCategory);
        },

        getBuildingCost(id) {
            return getBuildingCost(this.state.buildings, id);
        },

        buyBuilding(id) {
            const ok = buyBuilding(this.state, id);
            if (ok) {
                this.recalcStats();
                this.showNotification(`Construiu ${this.state.buildings[id].name}!`);
                this.saveGame();
            } else {
                this.addLog('Ouro insuficiente para construir.', 'danger');
            }
        },

        getDomainFortificationCost() {
            return getDomainFortificationCost(this.state.domainLevel || 0);
        },

        upgradeDomain() {
            const cost = this.getDomainFortificationCost();
            const ok = upgradeDomain(this.state);
            if (ok) {
                this.showNotification(`🏰 Domínio fortificado para Nível ${this.state.domainLevel}! (+${this.state.domainLevel * 10}% Ouro)`);
                this.addLog(`Fortificou o Domínio Real para Nível ${this.state.domainLevel}!`, 'narrative');
                this.saveGame();
            } else {
                this.showNotification(`Recursos insuficientes! Requer ${cost.wood} Madeira e ${cost.gold} Ouro.`);
            }
        },

        getGoldIncomeRate() {
            return calcGoldIncomeRate(this.state);
        },

        // ==========================================
        // FERREIRO & FORJA (GDD: Seção 11)
        // ==========================================

        getUpgradeCost(slot) {
            return getUpgradeCost(this.state.equipment[slot]);
        },

        upgradeItem(slot) {
            const ok = upgradeItem(this.state, slot);
            if (ok) {
                this.recalcStats();
                const item = this.state.equipment[slot];
                this.showNotification(`Equipamento melhorado para +${item.level}!`);
                this.saveGame();
            } else {
                this.addLog('Recursos insuficientes para forjar.', 'danger');
            }
        },

        getForgeCost(recipe) {
            return getForgeCost(this.state, recipe);
        },

        craftEquipment(recipeId) {
            const targetRecipeId = recipeId || this.craftRecipeId || 'forge_steel';
            const result = craftItem(this.state, targetRecipeId);
            if (!result.ok) {
                this.showNotification(result.msg);
                this.addLog(result.msg, 'danger');
                return;
            }
            this.showNotification(result.msg);
            this.addLog(result.msg, 'loot');
            if (this.state.audioEnabled) playItemDrop(this.state.audioVolume);
            this.saveGame();
        },

        enchantSelectedEquipment() {
            const result = enchantEquipment(this.state, this.enchantSlot, this.selectedEnchantId);
            if (!result.ok) {
                this.showNotification(result.msg);
                this.addLog(result.msg, 'danger');
                return;
            }
            this.showNotification(result.msg);
            this.addLog(result.msg, 'prestige');
            if (this.state.audioEnabled) playItemDrop(this.state.audioVolume);
            this.saveGame();
        },

        getStatResetCost() {
            return getStatResetCost(this.state);
        },

        resetHeroAttributes() {
            const cost = getStatResetCost(this.state);
            if ((this.state.resources.diamond || 0) < cost) {
                this.showNotification(`Necessário ${cost} Diamantes 💎 para redistribuir os pontos!`);
                return;
            }
            if (!confirm(`Deseja redistribuir todos os seus pontos de atributo por ${cost} Diamantes 💎?`)) return;
            const res = resetHeroStats(this.state);
            if (res.ok) {
                this.recalcStats();
                this.addLog(res.msg, 'prestige');
                this.showNotification(res.msg);
                if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
                this.saveGame();
            } else {
                this.showNotification(res.msg);
            }
        },

        getFormattedTimePlayed() {
            const sec = Math.floor(this.state.lifetimeStats?.timePlayedSec || 0);
            const hrs = Math.floor(sec / 3600);
            const mins = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            return `${hrs}h ${mins}m ${s}s`;
        },

        // ==========================================
        // TAVERNA (JOGOS, ESTALAGEM & CONTRATOS — GDD Expansão 3.3)
        // ==========================================

        getTavernInnCost() {
            return getTavernRestCost(this.state);
        },

        getTavernRestRemainingFormatted() {
            if (!this.state.tavernRestBuff || !this.state.tavernRestBuff.remaining) return '';
            const mins = Math.floor(this.state.tavernRestBuff.remaining / 60);
            const secs = Math.floor(this.state.tavernRestBuff.remaining % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        restInTavern() {
            const res = restAtTavernInn(this.state);
            if (!res.ok) {
                this.showNotification(res.msg);
                this.addLog(res.msg, 'danger');
                return;
            }
            this.recalcStats();
            this.addLog(res.msg, 'level');
            this.showNotification(res.msg);
            if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
            this.saveGame();
        },

        deliverTavernContract(contractIndex) {
            const res = completeTavernContract(this.state, contractIndex);
            if (!res.ok) {
                this.showNotification(res.msg);
                this.addLog(res.msg, 'danger');
                return;
            }
            this._checkLevelUp();
            this.recalcStats();
            this.addLog(res.msg, 'loot');
            this.showNotification(res.msg);
            if (this.state.audioEnabled) playCoinClink(this.state.audioVolume);
            this.saveGame();
        },

        refreshTavernContracts() {
            const allDone = (this.state.tavernContracts || []).every(c => c.completed);
            const cost = allDone ? 0 : Math.max(25, Math.floor(25 * (this.state.hero?.level || 1)));
            if (cost > 0 && (this.state.resources.gold || 0) < cost) {
                this.showNotification(`Necessário ${cost} Ouro 🪙 para solicitar novos contratos!`);
                return;
            }
            if (cost > 0) {
                this.state.resources.gold -= cost;
                trackQuestProgress(this.state, 'SPEND_GOLD', cost);
            }
            generateTavernContracts(this.state, true);
            this.showNotification('📜 Novos Contratos de Suprimento afixados no mural!');
            this.saveGame();
        },

        playTavernGame(game, bet) {
            if (this.tavernAnim.active) return; // Bloqueia se já está animando

            const parsedBet = parseFloat(bet) || 0;
            const result = playTavernGame(this.state, game, parsedBet);
            if (!result.ok) {
                this.addLog(result.msg, 'danger');
                this.showNotification(result.msg);
                return;
            }

            // Inicia animação
            this.tavernAnim.active = true;
            this.tavernAnim.game = game;
            this.tavernAnim.phase = 'rolling';
            this.tavernAnim.result = result;

            // Toca som de rolling
            if (this.state.audioEnabled) {
                if (game === 'coin') playCoinFlip(this.state.audioVolume);
                else if (game === 'dice') playDiceRoll(this.state.audioVolume);
            }

            // Animação de rolling com valores aleatórios
            let rollCount = 0;
            const rollMax = game === 'coin' ? 12 : 15;
            const rollInterval = setInterval(() => {
                rollCount++;
                if (game === 'coin') {
                    this.tavernAnim.displayRoll = rollCount % 2 === 0 ? 'cara' : 'coroa';
                } else {
                    this.tavernAnim.displayDice = [
                        Math.floor(Math.random() * 6) + 1,
                        Math.floor(Math.random() * 6) + 1,
                    ];
                    this.tavernAnim.npcDisplayDice = [
                        Math.floor(Math.random() * 6) + 1,
                        Math.floor(Math.random() * 6) + 1,
                    ];
                }
                if (rollCount >= rollMax) {
                    clearInterval(rollInterval);
                    // Mostra resultado final
                    if (game === 'coin') {
                        this.tavernAnim.displayRoll = result.side;
                    } else {
                        this.tavernAnim.displayDice = result.heroDice || [1, 1];
                        this.tavernAnim.npcDisplayDice = result.npcDice || [1, 1];
                    }
                    this.tavernAnim.phase = 'result';

                    // Toca som de resultado
                    if (this.state.audioEnabled) {
                        if (result.won) playTavernWin(this.state.audioVolume);
                        else if (!result.draw) playTavernLose(this.state.audioVolume);
                    }

                    // Atualiza streak
                    if (result.won) {
                        this.tavernStreak = this.tavernStreak > 0 ? this.tavernStreak + 1 : 1;
                        this.tavernLastResult = 'win';
                    } else if (result.draw) {
                        this.tavernStreak = 0;
                        this.tavernLastResult = 'draw';
                    } else {
                        this.tavernStreak = this.tavernStreak < 0 ? this.tavernStreak - 1 : -1;
                        this.tavernLastResult = 'lose';
                    }

                    // Histórico visual (últimos 10)
                    this.tavernHistory.unshift({ won: result.won, draw: result.draw, gained: result.gained });
                    if (this.tavernHistory.length > 10) this.tavernHistory.pop();

                    // Adiciona log e notificação
                    this.addLog(result.msg, result.type || 'narrative');
                    if (result.gained > 0) this.showNotification(`+${result.gained} Ouro!`);

                    // Após 2.5s, reseta animação para permitir nova jogada
                    setTimeout(() => {
                        this.tavernAnim.active = false;
                        this.tavernAnim.phase = 'idle';
                        this.tavernAnim.result = null;
                    }, 2500);
                }
            }, game === 'coin' ? 80 : 100);
        },

        refreshTavernRumor() {
            this.currentRumor = TAVERN_RUMORS[Math.floor(Math.random() * TAVERN_RUMORS.length)];
        },

        // ==========================================
        // ORÁCULO (GDD: Seção 16)
        // ==========================================

        getOracleCost() {
            return 50 * (this.state.hero?.level || 1);
        },

        getOracleRemainingFormatted() {
            if (!this.state.oracleBuff || !this.state.oracleBuff.remaining) return '';
            const mins = Math.floor(this.state.oracleBuff.remaining / 60);
            const secs = Math.floor(this.state.oracleBuff.remaining % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        consultOracle(buffId) {
            const cost = this.getOracleCost();
            if ((this.state.resources.gold || 0) < cost) {
                this.addLog(`Ouro insuficiente para consultar o Oráculo! (${cost} 🪙)`, 'danger');
                this.showNotification(`Necessário ${cost} Ouro!`);
                return;
            }

            const buffDef = ORACLE_BUFFS.find(b => b.id === buffId);
            if (!buffDef) return;

            const prophecies = ORACLE_PROPHECIES[buffId] || [];
            const prophecy = prophecies[Math.floor(Math.random() * prophecies.length)] || "Os ventos sussurram glória ao seu destino.";

            this.state.resources.gold -= cost;
            const durationSec = 900; // 15 minutos

            this.state.oracleBuff = {
                type: buffDef.id,
                name: buffDef.name,
                icon: buffDef.icon,
                color: buffDef.color,
                multiplier: buffDef.mult,
                duration: durationSec,
                remaining: durationSec,
                expiresAt: Date.now() + durationSec * 1000,
                prophecy: prophecy,
            };

            this.addLog(`🔮 O Oráculo profere: "${prophecy}"`, 'prestige');
            this.addLog(`✨ Ativada: ${buffDef.name} (${buffDef.desc})`, 'level');
            this.showNotification(`Bênção recebida: ${buffDef.name}!`);
            this.saveGame();
        },

        // ==========================================
        // MERCADO DINÂMICO, ESCAMBO & MERCADO NEGRO (GDD: Seção 15 & Expansão 4.2)
        // ==========================================

        getMarketPrice(item) {
            return getMarketPrice(this.state, item);
        },

        buyMarketItem(item) {
            const result = buyMarketResource(this.state, item);
            if (result.ok) {
                this.addLog(result.msg, 'loot');
                this.showNotification(result.msg);
                this.saveGame();
            } else {
                this.addLog(result.msg, 'danger');
                this.showNotification(result.msg);
            }
        },

        tradeMarketItem(tradeId) {
            const result = tradeMarketResources(this.state, tradeId);
            if (result.ok) {
                this.addLog(result.msg, 'loot');
                this.showNotification(result.msg);
                this.saveGame();
            } else {
                this.addLog(result.msg, 'danger');
                this.showNotification(result.msg);
            }
        },

        buyBlackMarketItem(offerId) {
            const result = buyBlackMarketOffer(this.state, offerId);
            if (result.ok) {
                this._checkLevelUp();
                this.recalcStats();
                this.addLog(result.msg, 'prestige');
                this.showNotification(result.msg);
                if (this.state.audioEnabled) playItemDrop(this.state.audioVolume);
                this.saveGame();
            } else {
                this.addLog(result.msg, 'danger');
                this.showNotification(result.msg);
            }
        },

        // ==========================================
        // CONQUISTAS DE IDLETON (GDD: Seção 21)
        // ==========================================

        getAchievementProgress(ach) {
            if (!ach) return 0;
            const ls = this.state.lifetimeStats || {};
            switch (ach.stat) {
                case 'kills': return Math.max(this.state.totalKills || 0, ls.kills || 0);
                case 'bosses': return ls.bosses || 0;
                case 'goldEarned': return ls.goldEarned || 0;
                case 'highestTowerFloor': return Math.max(this.state.tower?.maxFloor || 1, ls.highestTowerFloor || 1);
                case 'itemsCrafted': return Math.max(this.state.forgeCount || 0, ls.itemsCrafted || 0);
                case 'petsOwned': return (this.state.pets?.owned || []).length;
                case 'ascensions': return this.state.ascension?.count || 0;
                case 'level': return this.state.hero?.level || 1;
                case 'maxZone': return this.state.maxZone || 1;
                default: return 0;
            }
        },

        isAchievementUnlocked(ach) {
            if (!ach) return false;
            return this.getAchievementProgress(ach) >= ach.target;
        },

        isAchievementClaimed(achId) {
            return !!this.state.achievementsClaimed?.[achId];
        },

        claimAchievement(achId) {
            const ach = ACHIEVEMENTS.find(a => a.id === achId);
            if (!ach) return;
            if (this.isAchievementClaimed(achId)) {
                this.showNotification('Conquista já resgatada!');
                return;
            }
            if (!this.isAchievementUnlocked(ach)) {
                this.showNotification('Conquista ainda não alcançada!');
                return;
            }
            if (!this.state.achievementsClaimed) this.state.achievementsClaimed = {};
            this.state.achievementsClaimed[achId] = true;

            if (ach.rewardDiamonds > 0) {
                this.state.resources.diamond = (this.state.resources.diamond || 0) + ach.rewardDiamonds;
            }
            if (ach.rewardGold > 0) {
                this.state.resources.gold = (this.state.resources.gold || 0) + ach.rewardGold;
                trackQuestProgress(this.state, 'EARN_GOLD', ach.rewardGold);
            }

            const msg = `🏆 Conquista "${ach.name}" resgatada! +${ach.rewardDiamonds} 💎 e +${ach.rewardGold} 🪙!`;
            this.addLog(msg, 'prestige');
            this.showNotification(msg);
            if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
            this.saveGame();
        },

        getUnclaimedAchievementsCount() {
            if (!ACHIEVEMENTS) return 0;
            let count = 0;
            for (const ach of ACHIEVEMENTS) {
                if (this.isAchievementUnlocked(ach) && !this.isAchievementClaimed(ach.id)) {
                    count++;
                }
            }
            return count;
        },

        // ==========================================
        // ASCENSÃO & PRESTÍGIO (GDD Expansão 1.4)
        // ==========================================

        calcAscensionReward() {
            return calcAscensionReward(this.state);
        },

        ascendHero() {
            // Para exploração e torre antes de ascender
            this.state.isExploring = false;
            if (this.state.tower?.inBattle) {
                this.state.tower.inBattle = false;
                this.state.tower.monster = null;
            }

            const result = performAscension(this.state);
            if (!result.ok) {
                this.showNotification(result.msg);
                this.addLog(result.msg, 'danger');
                return;
            }
            this.recalcStats();
            this.showNotification(result.msg);
            this.addLog(result.msg, 'prestige');
            this.saveGame();
        },

        buyAscensionPerk(perkId) {
            const ok = buyAscensionPerk(this.state, perkId);
            if (ok) {
                this.recalcStats();
                const perkDef = ASCENSION_PERKS.find(p => p.id === perkId);
                this.showNotification(`Perk ${perkDef.name} aprimorado!`);
                this.addLog(`✨ Desbloqueou/Aprimorou ${perkDef.name} (Nível ${this.state.ascension.perks[perkId]})`, 'prestige');
                this.saveGame();
            } else {
                this.showNotification('💠 Diamantes Ancestrais insuficientes!');
            }
        },

        // ==========================================
        // ÁUDIO RETRÔ (GDD v1.2: Pilar 4)
        // ==========================================

        toggleAudio() {
            this.state.audioEnabled = !this.state.audioEnabled;
            this.showNotification(this.state.audioEnabled ? '🔊 Efeitos Sonoros Ativados' : '🔇 Áudio Desativado');
            if (this.state.audioEnabled) playCoinClink(this.state.audioVolume);
            this.saveGame();
        },

        // ==========================================
        // UPGRADE DE MOCHILA & AUTO-LOOT (GDD v1.2: Pilar 4)
        // ==========================================

        getNextBagUpgrade() {
            return getNextBagUpgrade(this.state);
        },

        getBagUpgradeCostText() {
            const next = this.getNextBagUpgrade();
            return next ? (next.costText || '') : '';
        },

        upgradeBackpack() {
            const res = upgradeBag(this.state);
            if (res.ok) {
                this.addLog(res.msg, 'level');
                this.showNotification(res.msg);
                if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
                this.saveGame();
            } else {
                this.showNotification(res.msg);
            }
        },

        setAutoLootAction(rarity, action) {
            if (!this.state.autoLootFilter) return;
            this.state.autoLootFilter[rarity] = action;
            this.saveGame();
        },

        getAutoLootSummary() {
            const f = this.state.autoLootFilter;
            if (!f || !f.enabled) return 'Desativado';
            const dismantles = [];
            const sells = [];
            const rarities = [
                { id: 'common', label: 'Comum' },
                { id: 'uncommon', label: 'Incomum' },
                { id: 'rare', label: 'Raro' },
                { id: 'epic', label: 'Épico' },
                { id: 'legendary', label: 'Lendário' },
            ];
            for (const r of rarities) {
                if (f[r.id] === 'dismantle') dismantles.push(r.label);
                else if (f[r.id] === 'sell') sells.push(r.label);
            }
            const parts = [];
            if (dismantles.length) parts.push(`⚙️ ${dismantles.join(', ')}`);
            if (sells.length) parts.push(`🪙 ${sells.join(', ')}`);
            return parts.length ? parts.join(' | ') : 'Guardando tudo na bolsa';
        },

        getItemAssetUrl(item) {
            if (!item) return '';
            // Relíquias míticas usam ID direto como nome de arquivo
            if (item.id && (String(item.id).startsWith('relic_') || item.rarity === 'mythic')) {
                const relicEntry = v(`item.${item.id}`);
                if (relicEntry?.asset) return `/assets/${relicEntry.asset}.png`;
                return `/assets/items/${item.id}.png`;
            }
            // Equipamento padrão: consulta a biblioteca pelo tipo/slot
            const type = item.type || item.slot || 'weapon';
            return getLibraryAssetUrl(`item.${type}`) || `/assets/items/${type}.png`;
        },

        getResourceAssetUrl(resId) {
            if (!resId) return '';
            // Normaliza variações de nome (diamond → diamonds)
            const normalizedId = (resId === 'diamond') ? 'diamonds' : resId;
            return getLibraryAssetUrl(`resource.${normalizedId}`) || `/assets/resources/${normalizedId}.png`;
        },

        getQuestAssetUrl(quest) {
            if (!quest || !quest.type) return '';
            const typeKey = quest.type.toLowerCase();
            return getLibraryAssetUrl(`quest.${typeKey}`) || `/assets/quests/${typeKey}.png`;
        },

        getBuildingIcon(id) {
            return getLibraryIcon(`building.${id}`, 'fa-landmark');
        },

        handleAssetLoad(event) {
            const el = event.target;
            if (!el) return;
            el.style.opacity = '1';
            el.style.display = '';
            const parent = el.parentElement;
            if (parent) {
                // Esconde ícone FontAwesome ou span de emoji fallback quando a imagem real carrega
                const fallbacks = parent.querySelectorAll('i.fas, i.fa-solid, span');
                fallbacks.forEach(fb => {
                    if (fb !== el && fb.id !== 'header-logo-fallback') {
                        fb.style.display = 'none';
                    }
                });
                const fallbackLogo = document.getElementById('header-logo-fallback');
                if (fallbackLogo && parent.contains(fallbackLogo)) {
                    fallbackLogo.style.display = 'none';
                }
            }
        },

        handleAssetError(event) {
            const el = event.target;
            if (!el || !el.src) return;
            const currentSrc = el.getAttribute('src') || el.src;

            // 1. Cascata: Se tentou .png -> tenta .svg
            if (currentSrc.includes('.png')) {
                el.src = currentSrc.replace(/\.png(\?.*)?$/, '.svg$1');
                return;
            }

            // 2. Cascata: Se falhou .svg -> tenta aliases comuns antes do .webp
            if (currentSrc.includes('.svg') && !el.dataset.aliasTried) {
                el.dataset.aliasTried = '1';
                // Aliases de itens
                if (currentSrc.includes('/items/sword.')) {
                    el.src = currentSrc.replace(/\/items\/sword\.[^.]+/, '/items/weapon.png');
                    return;
                }
                if (currentSrc.includes('/items/armor.')) {
                    el.src = currentSrc.replace(/\/items\/armor\.[^.]+/, '/items/chest.png');
                    return;
                }
                if (currentSrc.includes('/items/boot.')) {
                    el.src = currentSrc.replace(/\/items\/boot\.[^.]+/, '/items/boots.png');
                    return;
                }
                // Aliases de recursos (ex: diamonds -> diamond)
                if (currentSrc.includes('/resources/diamonds.')) {
                    el.src = currentSrc.replace(/\/resources\/diamonds\.[^.]+/, '/resources/diamond.png');
                    return;
                }
                // Aliases de ascensão (ancestral_diamond, ancestral diamond, ancient_diamond)
                if (currentSrc.includes('/ascension/ancient_diamond.')) {
                    el.src = currentSrc.replace(/\/ascension\/ancient_diamond\.[^.]+/, '/assets/ascension/ancestral_diamond.svg');
                    return;
                }
                if (currentSrc.includes('/ascension/ancestral_diamond.')) {
                    el.src = '/assets/ascension/ancestral%20diamond.svg';
                    return;
                }
            }

            // 3. Cascata: Tenta .webp
            if (currentSrc.includes('.svg')) {
                el.src = currentSrc.replace(/\.svg(\?.*)?$/, '.webp$1');
                return;
            }

            // 4. Se falharam todos os formatos (.png, .svg, .webp), esconde a imagem
            // para deixar o ícone FontAwesome ou gráfico procedural do fallback 100% visível
            el.style.display = 'none';
            const parent = el.parentElement;
            if (parent) {
                const fallbacks = parent.querySelectorAll('i.fas, i.fa-solid, span');
                fallbacks.forEach(fb => {
                    if (fb !== el && fb.id !== 'header-logo-fallback') {
                        fb.style.display = '';
                    }
                });
                const fallbackLogo = document.getElementById('header-logo-fallback');
                if (fallbackLogo && parent.contains(fallbackLogo)) {
                    fallbackLogo.style.display = 'flex';
                }
            }
        },

        // ==========================================
        // ESPECIALIZAÇÃO DE CLASSE (GDD v1.2: Pilar 1)
        // ==========================================

        chooseHeroSpecialization(specId) {
            const spec = CLASS_SPECIALIZATIONS.find(s => s.id === specId);
            if (!spec) return;
            this.state.hero.specialization = specId;
            this.specializationModalOpen = false;
            this.skillTreeOpen = true; // Abre imediatamente a Árvore para o jogador distribuir pontos
            this.recalcStats();
            this.addLog(`🌟 Especialização Escolhida: ${spec.name} (${spec.role})! Árvore de Habilidades desbloqueada.`, 'level');
            this.showNotification(`Você agora é um ${spec.name}! Árvore Desbloqueada.`);
            if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
            this.saveGame();
        },

        // ==========================================
        // ÁRVORE DE HABILIDADES & TALENTOS (Fase 4A)
        // ==========================================

        buyTreeNode(nodeId) {
            this.selectedSkillNodeId = nodeId;
            const result = buyTreeNode(this.state, nodeId);
            if (result.ok) {
                if (!this.state.hero._treeSkills) this.state.hero._treeSkills = {};
                this.state.hero._treeSkills = this.state.treeSkills;
                this.recalcStats();
                this.addLog(`🌳 ${result.msg}`, 'prestige');
                this.showNotification(result.msg);
                if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
                this.saveGame();
            } else {
                this.showNotification(result.msg);
            }
        },

        respecSkillTree() {
            const result = respecSkillTree(this.state);
            if (result.ok) {
                if (!this.state.hero._treeSkills) this.state.hero._treeSkills = {};
                this.state.hero._treeSkills = this.state.treeSkills;
                this.recalcStats();
                this.addLog(`🔄 ${result.msg}`, 'prestige');
                this.showNotification(result.msg);
                this.saveGame();
            } else {
                this.showNotification(result.msg);
            }
        },

        getTreeNodeLevel(nodeId) {
            return this.state.treeSkills?.[nodeId] || 0;
        },

        isTreeNodeMaxed(nodeId) {
            const spec = this.state.hero?.specialization;
            if (!spec || !SKILL_TREE[spec]) return false;
            const node = SKILL_TREE[spec].nodes.find(n => n.id === nodeId);
            if (!node) return false;
            return this.getTreeNodeLevel(nodeId) >= node.maxLevel;
        },

        getTreeNodeDesc(nodeId) {
            const spec = this.state.hero?.specialization;
            if (!spec || !SKILL_TREE[spec]) return '';
            const node = SKILL_TREE[spec].nodes.find(n => n.id === nodeId);
            if (!node) return '';
            const lvl = this.getTreeNodeLevel(nodeId);
            return node.descFn(lvl > 0 ? lvl : 1);
        },

        getNodeCost(nodeId) {
            const spec = this.state.hero?.specialization;
            if (!spec || !SKILL_TREE[spec]) return 1;
            const node = SKILL_TREE[spec].nodes.find(n => n.id === nodeId);
            if (!node) return 1;
            const currentLvl = this.getTreeNodeLevel(nodeId);
            return getNodeUpgradeCost(node, currentLvl);
        },

        getTreeNodesByTier(tier) {
            const spec = this.state.hero?.specialization;
            if (!spec || !SKILL_TREE[spec]) return [];
            return SKILL_TREE[spec].nodes.filter(n => n.tier === tier);
        },

        getBranchNodes(branch) {
            const spec = this.state.hero?.specialization;
            if (!spec || !SKILL_TREE[spec]) return [];
            return SKILL_TREE[spec].nodes
                .filter(n => n.branch === branch)
                .sort((a, b) => a.tier - b.tier);
        },

        getAllTreeNodes() {
            const spec = this.state.hero?.specialization;
            if (!spec || !SKILL_TREE[spec]) return [];
            return SKILL_TREE[spec].nodes;
        },

        isTreeNodeAvailable(node) {
            if (!node || !node.requires) return true;
            return (this.state.treeSkills?.[node.requires] || 0) >= 1;
        },

        selectSkillNode(nodeId) {
            this.selectedSkillNodeId = nodeId;
        },

        getSelectedNode() {
            const spec = this.state.hero?.specialization;
            if (!spec || !SKILL_TREE[spec]) return null;
            if (this.selectedSkillNodeId) {
                const found = SKILL_TREE[spec].nodes.find(n => n.id === this.selectedSkillNodeId);
                if (found) return found;
            }
            // Retorna o primeiro nó de combate por padrão
            return SKILL_TREE[spec].nodes[0] || null;
        },

        // ==========================================
        // ATIVOS DE CLASSE (Slot 3 Dinâmico)
        // ==========================================

        getClassActiveSkillInfo() {
            const spec = this.state.hero?.specialization;
            if (!spec) return { unlocked: false };
            const isSilenced = this.state.tower?.inBattle && this.state.tower?.modifier?.id === 'silence';
            const silenceMult = isSilenced ? 2 : 1;

            if (spec === 'berserker') {
                const lvl = this.state.treeSkills?.brs_act || 0;
                const costVal = 50 * silenceMult;
                return {
                    unlocked: lvl >= 1,
                    id: 'brs_act',
                    name: 'Golpe Devastador',
                    icon: 'fa-burst',
                    color: '#ef4444',
                    bgClass: 'bg-red-950/70 hover:bg-red-900/80 border-red-800/60 hover:border-red-600 text-red-300',
                    desc: `${4 + lvl}× Dano · -50% Def`,
                    costText: `${costVal} ⚡`,
                    costType: 'energy',
                    costVal,
                    cooldownTimer: this.devastatingStrikeTimer || 0,
                    maxCooldown: 14,
                };
            }
            if (spec === 'paladin') {
                const lvl = this.state.treeSkills?.pal_act || 0;
                const costVal = 40 * silenceMult;
                return {
                    unlocked: lvl >= 1,
                    id: 'pal_act',
                    name: 'Escudo Divino',
                    icon: 'fa-shield-halved',
                    color: '#facc15',
                    bgClass: 'bg-amber-950/70 hover:bg-amber-900/80 border-amber-800/60 hover:border-amber-600 text-amber-300',
                    desc: `Imune por ${4 + lvl}s`,
                    costText: `${costVal} 🧪`,
                    costType: 'mana',
                    costVal,
                    cooldownTimer: this.divineShieldTimer || 0,
                    maxCooldown: 25,
                };
            }
            if (spec === 'arcane_mage') {
                const lvl = this.state.treeSkills?.mag_act || 0;
                const costVal = 80 * silenceMult;
                return {
                    unlocked: lvl >= 1,
                    id: 'mag_act',
                    name: 'Meteoro Arcano',
                    icon: 'fa-meteor',
                    color: '#a855f7',
                    bgClass: 'bg-purple-950/70 hover:bg-purple-900/80 border-purple-800/60 hover:border-purple-600 text-purple-300',
                    desc: `${6 + lvl * 2}× INT Dano Verdadeiro`,
                    costText: `${costVal} 🧪`,
                    costType: 'mana',
                    costVal,
                    cooldownTimer: this.arcaneMeteorTimer || 0,
                    maxCooldown: 18,
                };
            }
            if (spec === 'shadow_thief') {
                const lvl = this.state.treeSkills?.thf_act || 0;
                const costVal = 35 * silenceMult;
                return {
                    unlocked: lvl >= 1,
                    id: 'thf_act',
                    name: 'Emboscada Letal',
                    icon: 'fa-skull',
                    color: '#10b981',
                    bgClass: 'bg-emerald-950/70 hover:bg-emerald-900/80 border-emerald-800/60 hover:border-emerald-600 text-emerald-300',
                    desc: `${4 + lvl}× Dano Crítico + Veneno`,
                    costText: `${costVal} ⚡`,
                    costType: 'energy',
                    costVal,
                    cooldownTimer: this.ambushTimer || 0,
                    maxCooldown: 12,
                };
            }
            return { unlocked: false };
        },

        useClassActiveSkill() {
            const spec = this.state.hero?.specialization;
            if (spec === 'berserker') return this.useDevastatingStrike();
            if (spec === 'paladin') return this.useDivineShield();
            if (spec === 'arcane_mage') return this.useArcaneMeteor();
            if (spec === 'shadow_thief') return this.useAmbush();
        },

        /** Golpe Devastador (Berserker brs_act) */
        useDevastatingStrike() {
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) return;
            const lvl = this.state.treeSkills?.brs_act || 0;
            if (lvl < 1) { this.showNotification('Desbloqueie Golpe Devastador na Árvore!'); return; }
            const isSilenced = this.state.tower?.inBattle && this.state.tower?.modifier?.id === 'silence';
            const cost = 50 * (isSilenced ? 2 : 1);
            if ((this.state.hero.energy || 0) < cost) {
                this.addLog(`Energia insuficiente para Golpe Devastador! (${cost} ⚡)`, 'danger');
                this.showNotification(`Energia insuficiente (${cost} ⚡)!`);
                return;
            }
            if (this.devastatingStrikeTimer > 0) return;

            const crowMult = 1 + 0.15 * getPetBonusMultiplier(this.state, 'corvo_arcano');

            if (this.state.worldBoss?.inBattle) {
                this.state.hero.energy -= cost;
                this.devastatingStrikeTimer = 14;
                this.state.hero.debuffDefenseTimer = 10;
                this.recalcStats();
                const dmg = Math.floor(this.state.derived.str * (4 + lvl) * crowMult * (0.9 + Math.random() * 0.2));
                this.state.worldBoss.damageDealt = (this.state.worldBoss.damageDealt || 0) + dmg;
                this.state.worldBoss.logs.unshift(`💥 Golpe Devastador causou ${dmg.toLocaleString('pt-BR')} de dano ao Chefe Mundial!`);
                if (this.state.worldBoss.logs.length > 35) this.state.worldBoss.logs.pop();
                return;
            }

            const target = this.state.tower?.inBattle && this.state.tower.monster
                ? this.state.tower.monster
                : (this.state.villageSiege?.active && this.state.villageSiege.inBattle && this.state.villageSiege.monster
                    ? this.state.villageSiege.monster
                    : (this.state.isExploring ? this.state.monster : null));

            if (!target) {
                this.showNotification('Nenhum inimigo ao alcance!');
                return;
            }

            this.state.hero.energy -= cost;
            this.devastatingStrikeTimer = 14;
            this.state.hero.debuffDefenseTimer = 10;
            this.recalcStats();

            const dmg = Math.floor(this.state.derived.str * (4 + lvl) * crowMult * (0.9 + Math.random() * 0.2));
            target.hp -= dmg;
            target.isHit = true;
            target.hitTimer = 0.5;

            if (this.canvas) {
                const f = makeSpecialFloat(this.canvas, `💥 GOLPE DEVASTADOR! -${dmg}`, '#ef4444');
                if (f) this.pushCombatFloat(f);
            }

            this.addLog(`💥 Golpe Devastador despedaçou o inimigo causando ${dmg} de dano! (-50% Defesa por 10s)`, 'level');
            this.showNotification(`Golpe Devastador: -${dmg} Dano!`);

            if (target.hp <= 0) {
                if (this.state.tower?.inBattle) { handleTowerMonsterKill(this.state); this._checkLevelUp(); }
                else if (this.state.villageSiege?.inBattle) {
                    target.hp = 0;
                    const vicRes = resolveSiegeVictory(this.state);
                    this.state.villageSiege.inBattle = false;
                    this.state.villageSiege.active = false;
                    this.siegeModalOpen = false;
                    this.addLog(vicRes.msg, 'prestige');
                    this.showNotification('🏆 Invasão da Vila Repelida com Sucesso!');
                } else if (this.state.isExploring) {
                    this._killMonster();
                }
            }
        },

        /** Escudo Divino (Paladino pal_act) */
        useDivineShield() {
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) return;
            const lvl = this.state.treeSkills?.pal_act || 0;
            if (lvl < 1) { this.showNotification('Desbloqueie Escudo Divino na Árvore!'); return; }
            const isSilenced = this.state.tower?.inBattle && this.state.tower?.modifier?.id === 'silence';
            const cost = 40 * (isSilenced ? 2 : 1);
            if ((this.state.hero.mana || 0) < cost) {
                this.addLog(`Mana insuficiente para Escudo Divino! (${cost} 🧪)`, 'danger');
                this.showNotification(`Mana insuficiente (${cost} 🧪)!`);
                return;
            }
            if (this.divineShieldTimer > 0) return;

            this.state.hero.mana -= cost;
            this.divineShieldTimer = 25;
            const duration = 4 + lvl;
            this.state.hero.divineShieldTimer = duration;

            if (this.canvas) {
                const f = makeSpecialFloat(this.canvas, `🛡️ ESCUDO DIVINO (${duration}s)`, '#facc15');
                if (f) this.pushCombatFloat(f);
            }

            if (this.state.worldBoss?.inBattle) {
                this.state.worldBoss.logs.unshift(`🛡️ Escudo Divino ativado! Imune a dano por ${duration}s!`);
            }
            this.addLog(`🛡️ Escudo Divino ativado! Você está 100% IMUNE a todo dano por ${duration}s!`, 'level');
            this.showNotification(`Escudo Divino ativado por ${duration}s!`);
        },

        /** Meteoro Arcano (Mago mag_act) */
        useArcaneMeteor() {
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) return;
            const lvl = this.state.treeSkills?.mag_act || 0;
            if (lvl < 1) { this.showNotification('Desbloqueie Meteoro Arcano na Árvore!'); return; }
            const isSilenced = this.state.tower?.inBattle && this.state.tower?.modifier?.id === 'silence';
            const cost = 80 * (isSilenced ? 2 : 1);
            if ((this.state.hero.mana || 0) < cost) {
                this.addLog(`Mana insuficiente para Meteoro Arcano! (${cost} 🧪)`, 'danger');
                this.showNotification(`Mana insuficiente (${cost} 🧪)!`);
                return;
            }
            if (this.arcaneMeteorTimer > 0) return;

            const crowMult = 1 + 0.15 * getPetBonusMultiplier(this.state, 'corvo_arcano');

            if (this.state.worldBoss?.inBattle) {
                this.state.hero.mana -= cost;
                this.arcaneMeteorTimer = 18;
                const dmg = Math.floor(this.state.derived.int * (6 + lvl * 2) * crowMult * (0.9 + Math.random() * 0.2));
                this.state.worldBoss.damageDealt = (this.state.worldBoss.damageDealt || 0) + dmg;
                this.state.worldBoss.logs.unshift(`☄️ Meteoro Arcano incinerou o Chefe Mundial com ${dmg.toLocaleString('pt-BR')} de dano!`);
                if (this.state.worldBoss.logs.length > 35) this.state.worldBoss.logs.pop();
                return;
            }

            const target = this.state.tower?.inBattle && this.state.tower.monster
                ? this.state.tower.monster
                : (this.state.villageSiege?.active && this.state.villageSiege.inBattle && this.state.villageSiege.monster
                    ? this.state.villageSiege.monster
                    : (this.state.isExploring ? this.state.monster : null));

            if (!target) {
                this.showNotification('Nenhum inimigo ao alcance!');
                return;
            }

            this.state.hero.mana -= cost;
            this.arcaneMeteorTimer = 18;

            const dmg = Math.floor(this.state.derived.int * (6 + lvl * 2) * crowMult * (0.9 + Math.random() * 0.2));
            target.hp -= dmg;
            target.isHit = true;
            target.hitTimer = 0.5;

            if (this.canvas) {
                const f = makeSpecialFloat(this.canvas, `☄️ METEORO ARCANO! -${dmg}`, '#c084fc');
                if (f) this.pushCombatFloat(f);
            }

            this.addLog(`☄️ Meteoro Arcano caiu dos céus incinerando o inimigo com ${dmg} de Dano Verdadeiro!`, 'level');
            this.showNotification(`Meteoro Arcano: -${dmg} Dano!`);

            if (target.hp <= 0) {
                if (this.state.tower?.inBattle) { handleTowerMonsterKill(this.state); this._checkLevelUp(); }
                else if (this.state.villageSiege?.inBattle) {
                    target.hp = 0;
                    const vicRes = resolveSiegeVictory(this.state);
                    this.state.villageSiege.inBattle = false;
                    this.state.villageSiege.active = false;
                    this.siegeModalOpen = false;
                    this.addLog(vicRes.msg, 'prestige');
                    this.showNotification('🏆 Invasão da Vila Repelida com Sucesso!');
                } else if (this.state.isExploring) {
                    this._killMonster();
                }
            }
        },

        /** Emboscada Letal (Ladrão thf_act) */
        useAmbush() {
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) return;
            const lvl = this.state.treeSkills?.thf_act || 0;
            if (lvl < 1) { this.showNotification('Desbloqueie Emboscada Letal na Árvore!'); return; }
            const isSilenced = this.state.tower?.inBattle && this.state.tower?.modifier?.id === 'silence';
            const cost = 35 * (isSilenced ? 2 : 1);
            if ((this.state.hero.energy || 0) < cost) {
                this.addLog(`Energia insuficiente para Emboscada Letal! (${cost} ⚡)`, 'danger');
                this.showNotification(`Energia insuficiente (${cost} ⚡)!`);
                return;
            }
            if (this.ambushTimer > 0) return;

            const crowMult = 1 + 0.15 * getPetBonusMultiplier(this.state, 'corvo_arcano');

            if (this.state.worldBoss?.inBattle) {
                this.state.hero.energy -= cost;
                this.ambushTimer = 12;
                trackQuestProgress(this.state, 'CRITICAL_HITS', 1);
                const dmg = Math.floor(this.state.derived.str * (4 + lvl) * 1.5 * crowMult);
                this.state.worldBoss.damageDealt = (this.state.worldBoss.damageDealt || 0) + dmg;
                this.state.worldBoss.logs.unshift(`🗡️ Emboscada Crítica desferiu ${dmg.toLocaleString('pt-BR')} de dano ao Chefe Mundial!`);
                if (this.state.worldBoss.logs.length > 35) this.state.worldBoss.logs.pop();
                return;
            }

            const target = this.state.tower?.inBattle && this.state.tower.monster
                ? this.state.tower.monster
                : (this.state.villageSiege?.active && this.state.villageSiege.inBattle && this.state.villageSiege.monster
                    ? this.state.villageSiege.monster
                    : (this.state.isExploring ? this.state.monster : null));

            if (!target) {
                this.showNotification('Nenhum inimigo ao alcance!');
                return;
            }

            this.state.hero.energy -= cost;
            this.ambushTimer = 12;

            trackQuestProgress(this.state, 'CRITICAL_HITS', 1);
            if (this.state.lifetimeStats) {
                this.state.lifetimeStats.criticalHits = (this.state.lifetimeStats.criticalHits || 0) + 1;
            }

            const dmg = Math.floor(this.state.derived.str * (4 + lvl) * 1.5 * crowMult);
            target.hp -= dmg;
            target.isHit = true;
            target.hitTimer = 0.5;

            // Aplica veneno
            target.poisoned = true;
            target.poisonTicks = 5;
            target.poisonDmg = Math.max(2, Math.floor(this.state.derived.str * lvl * 0.15));

            if (this.canvas) {
                const f = makeSpecialFloat(this.canvas, `🗡️ EMBOSCADA CRÍTICA! -${dmg}`, '#34d399');
                if (f) this.pushCombatFloat(f);
            }

            this.addLog(`🗡️ Emboscada Crítica desferiu ${dmg} de dano letal e envenenou o inimigo!`, 'level');
            this.showNotification(`Emboscada Crítica: -${dmg} Dano!`);

            if (target.hp <= 0) {
                if (this.state.tower?.inBattle) { handleTowerMonsterKill(this.state); this._checkLevelUp(); }
                else if (this.state.villageSiege?.inBattle) {
                    target.hp = 0;
                    const vicRes = resolveSiegeVictory(this.state);
                    this.state.villageSiege.inBattle = false;
                    this.state.villageSiege.active = false;
                    this.siegeModalOpen = false;
                    this.addLog(vicRes.msg, 'prestige');
                    this.showNotification('🏆 Invasão da Vila Repelida com Sucesso!');
                } else if (this.state.isExploring) {
                    this._killMonster();
                }
            }
        },

        // resetHeroSpecialization() removido na Fase 2 do GDD:
        // Especialização é permanente durante a vida — troca só na próxima Ascensão.

        // ==========================================
        // EXPEDIÇÕES DE MASCOTES (GDD v1.2: Pilar 2)
        // ==========================================

        startExpedition(zoneId, durationMinutes) {
            if (!this.selectedExpeditionPet) {
                this.showNotification('Selecione um mascote disponível para enviar!');
                return;
            }
            const res = startPetExpedition(this.state, this.selectedExpeditionPet, zoneId, durationMinutes);
            if (res.ok) {
                this.addLog(res.msg, 'loot');
                this.showNotification(res.msg);
                this.selectedExpeditionPet = null;
                this.saveGame();
            } else {
                this.showNotification(res.msg);
            }
        },

        claimExpedition(expIndex) {
            const res = claimPetExpedition(this.state, expIndex);
            if (res.ok) {
                this.addLog(res.msg, 'loot');
                this.showNotification(res.msg);
                this._checkLevelUp(); // Verifica level up caso ganhe XP na expedição
                this.recalcStats();
                if (this.state.audioEnabled) playItemDrop(this.state.audioVolume);
                this.saveGame();
            } else {
                this.showNotification(res.msg);
            }
        },

        getExpeditionRemainingFormatted(exp) {
            if (!exp || !exp.expiresAt) return '00:00';
            const diff = Math.max(0, Math.floor((exp.expiresAt - Date.now()) / 1000));
            if (diff <= 0) return 'Concluído! 🎉';
            const m = Math.floor(diff / 60);
            const s = diff % 60;
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        },

        // ==========================================
        // FORJA DE RELÍQUIAS MÍTICAS (GDD v1.2: Pilar 2)
        // ==========================================

        craftBossRelic(relicId) {
            const res = craftRelic(this.state, relicId);
            if (res.ok) {
                this.addLog(res.msg, 'prestige');
                this.showNotification(res.msg);
                if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
                this.saveGame();
            } else {
                this.showNotification(res.msg);
            }
        },



        // ==========================================
        // INVASÃO DA VILA (GDD v1.2: Pilar 3)
        // ==========================================

        triggerVillageSiege() {
            const hp = Math.floor(80 * Math.pow(1.30, this.state.zone || 1));
            const dmg = Math.floor(25 * Math.pow(1.25, this.state.zone || 1));
            this.state.villageSiege = {
                active: true,
                timerSec: 180,
                endsAt: Date.now() + 180000,
                buffExpiresAt: this.state.villageSiege?.buffExpiresAt || 0,
                nextCheckAt: Date.now() + (2 * 3600 * 1000) + Math.random() * (2 * 3600 * 1000),
                monster: {
                    name: `General Invasor [Zona ${this.state.zone}]`,
                    icon: '👹',
                    color: '#ef4444',
                    maxHp: hp,
                    hp: hp,
                    damage: dmg,
                    atkSpeed: 1.8,
                    atkTimer: 0,
                    isBoss: false,    // NÃO conta como boss de exploração
                    isSiege: true,    // Flag exclusiva de cerco
                    isHit: false,
                    hitTimer: 0,
                    gold: 500,
                    xp: 400,
                },
            };
            this.addLog('🚨 ALERTA GERAL: A Vila de Idleton está sob Cerco Invasor! Você tem 3 minutos!', 'danger');
            this.showNotification('🚨 A Vila está sob cerco!');
            if (this.state.audioEnabled) playSiegeAlert(this.state.audioVolume);
        },

        defendVillage() {
            if (!this.state.villageSiege?.active) return;
            // Pausa a exploração sem tocar nem resetar o monstro da exploração (GDD Expansão 1.3)
            this.state.isExploring = false;
            this.state.villageSiege.inBattle = true;
            this.siegeModalOpen = true;
            this.addLog('⚔️ Herói engajou em combate direto contra o General Invasor na muralha!', 'danger');
        },

        retreatFromSiege() {
            if (this.state.villageSiege) {
                this.state.villageSiege.inBattle = false;
            }
            this.siegeModalOpen = false;
            this.addLog('Você recuou para dentro dos muros da vila para se recompor.', 'narrative');
        },

        getSiegeRemainingFormatted() {
            if (!this.state.villageSiege?.active) return '00:00';
            const s = Math.max(0, Math.floor(this.state.villageSiege.timerSec || 0));
            const m = Math.floor(s / 60);
            const sec = s % 60;
            return `${m}:${sec < 10 ? '0' : ''}${sec}`;
        },

        // ==========================================
        // DASHBOARD DE ESTATÍSTICAS (GDD v1.2: Pilar 4)
        // ==========================================

        getActiveSetBonuses() {
            return calcActiveSetBonuses(this.state.equipment || {});
        },

        getSessionDps() {
            const elapsed = Math.max(1, (Date.now() - (this.state.statsSession?.startedAt || Date.now())) / 1000);
            return Math.floor((this.state.statsSession?.damageDealt || 0) / elapsed);
        },

        getSessionGoldPerMin() {
            const elapsedMin = Math.max(0.1, (Date.now() - (this.state.statsSession?.startedAt || Date.now())) / 60000);
            return Math.floor((this.state.statsSession?.goldEarned || 0) / elapsedMin);
        },

        getSessionXpPerHour() {
            const elapsedHours = Math.max(0.01, (Date.now() - (this.state.statsSession?.startedAt || Date.now())) / 3600000);
            return Math.floor((this.state.statsSession?.xpEarned || 0) / elapsedHours);
        },

        // ==========================================
        // INVENTÁRIO & EQUIPAMENTO
        // ==========================================

        selectItem(index) {
            this.selectedItemIndex = index;
            this.itemModalOpen = true;
        },

        selectEquippedSlot(slot) {
            if (!this.state.equipment || !this.state.equipment[slot]) return;
            this.selectedEquippedSlot = slot;
            this.equippedModalOpen = true;
        },

        toggleLockItem(index) {
            const item = this.state.inventory[index];
            if (!item) return;
            item.isLocked = !item.isLocked;
            this.showNotification(item.isLocked ? '🔒 Item protegido/favoritado!' : '🔓 Item destravado!');
            this.saveGame();
        },

        toggleLockEquipped(slot) {
            const item = this.state.equipment?.[slot];
            if (!item) return;
            item.isLocked = !item.isLocked;
            this.showNotification(item.isLocked ? '🔒 Equipamento protegido!' : '🔓 Equipamento destravado!');
            this.saveGame();
        },

        unequipSelectedSlot() {
            if (!this.selectedEquippedSlot) return;
            const res = unequipItem(this.state, this.selectedEquippedSlot);
            if (!res.ok) {
                this.showNotification(res.msg);
                return;
            }
            this.recalcStats();
            this.addLog(`Desequipou ${res.item.name}`, 'narrative');
            this.showNotification(`Desequipou ${res.item.name}!`);
            this.equippedModalOpen = false;
            this.selectedEquippedSlot = null;
            this.saveGame();
        },

        getItemDelta(item) {
            return getItemDelta(item, this.state.equipment);
        },

        getItemComparison(item) {
            if (!item || !item.type) return null;
            const delta = this.getItemDelta(item);
            if (!delta) return null;
            if (delta.diff > 0) {
                return {
                    sign: '+',
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-950/90 border-emerald-500/80',
                    title: `Superior ao equipado (+${delta.diff} poder)`
                };
            }
            if (delta.diff < 0) {
                return {
                    sign: '-',
                    color: 'text-red-400',
                    bg: 'bg-red-950/90 border-red-800/80',
                    title: `Inferior ao equipado (${delta.diff} poder)`
                };
            }
            return {
                sign: '=',
                color: 'text-stone-300',
                bg: 'bg-stone-900/90 border-stone-600/80',
                title: 'Poder idêntico ao equipado (=)'
            };
        },

        equipSelectedItem() {
            if (this.selectedItemIndex === null) return;
            const item = equipItem(this.state, this.selectedItemIndex);
            if (item) {
                this.recalcStats();
                this.addLog(`Equipou ${item.name}`, 'narrative');
            }
            this.itemModalOpen = false;
            this.selectedItemIndex = null;
        },

        sellSelectedItem() {
            if (this.selectedItemIndex === null) return;
            const item = sellItem(this.state, this.selectedItemIndex);
            if (item?.error === 'locked') {
                this.showNotification(item.msg);
                return;
            }
            if (item) {
                trackQuestProgress(this.state, 'EARN_GOLD', item.price);
                this.addLog(`Vendeu ${item.name} por ${item.price} Ouro`, 'loot');
            }
            this.itemModalOpen = false;
            this.selectedItemIndex = null;
        },

        dismantleSelectedItem() {
            if (this.selectedItemIndex === null) return;
            const result = dismantleItem(this.state, this.selectedItemIndex);
            if (result?.error === 'locked') {
                this.showNotification(result.msg);
                return;
            }
            if (result) {
                let msg = `Desmontou ${result.item.name}: +${result.scraps} Sucata`;
                if (result.goldBonus > 0) {
                    msg += ` +${result.goldBonus} Ouro`;
                    trackQuestProgress(this.state, 'EARN_GOLD', result.goldBonus);
                }
                this.addLog(msg, 'loot');
                this.showNotification(`+${result.scraps} Sucata!`);
            }
            this.itemModalOpen = false;
            this.selectedItemIndex = null;
        },

        // ---- CONTROLE DE DERROTA & COMBATE ----

        retreatFromDefeat() {
            this.defeatModalOpen = false;
            this.state.isExploring = false;
            this.switchTab('city');
            this.showNotification('Recuou em segurança para a Cidade. O herói se recuperará com o tempo.');
        },

        reviveAndReturnToBattle() {
            const minHp = (this.state.derived?.hpMax || 100) * 0.5;
            if ((this.state.hero.hp || 0) < minHp) {
                this.showNotification('Aguarde pelo menos 50% de vida para retornar.');
                return;
            }
            this.state.hero.isDead = false;
            this.defeatModalOpen = false;
            if (this.state.monster) {
                this.state.monster.hp = this.state.monster.maxHp;
                this.state.monster.atkTimer = 0;
            }
            this.state.isExploring = true;
            this.addLog('⚔️ O herói recuperou fôlego suficiente e retornou à batalha!', 'narrative');
            this.showNotification('Retornando à batalha!');
        },

        reviveHero() {
            const minHp = (this.state.derived?.hpMax || 100) * 0.5;
            if ((this.state.hero.hp || 0) >= minHp) {
                this.state.hero.isDead = false;
                this.defeatModalOpen = false;
                if (this.state.monster) {
                    this.state.monster.hp = this.state.monster.maxHp;
                    this.state.monster.atkTimer = 0;
                }
                this.showNotification('Herói pronto para novas batalhas!');
            }
        },

        stopExploring() {
            this.state.isExploring = false;
            this.addLog('Exploração pausada.', 'narrative');
            this.showNotification('Exploração pausada.');
        },

        // ---- TORRE DOS DESAFIOS (MECÂNICA ROGUELIKE DEDICADA) ----

        isTowerInCombatOrEvent() {
            if (!this.state.tower) return false;
            if (this.state.tower.isVictory || this.state.tower.isDefeat) return true;
            if (this.state.tower.inBattle && (this.state.tower.monster || this.state.tower.eventRoom)) return true;
            return false;
        },

        getTowerFloorModifier(floor) {
            const f = Number(floor || this.selectedTowerFloor || this.state.tower?.floor || 1);
            if (!TOWER_MODIFIERS || TOWER_MODIFIERS.length === 0) {
                return { name: 'Poder Cósmico', desc: 'Energias ancestrais fluem neste andar.' };
            }
            // Hash determinístico (mesmo do combat.js)
            let h = f * 2654435761;
            h = ((h >>> 16) ^ h) * 0x45d9f3b;
            h = ((h >>> 16) ^ h);
            const idx = Math.abs(h) % TOWER_MODIFIERS.length;
            const mod = TOWER_MODIFIERS[idx] || TOWER_MODIFIERS[0];
            // Calcula intensidade escalada
            const intensity = getTowerModifierIntensity(mod, f);
            return { ...mod, intensity };
        },

        startTowerFloor(floor) {
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) {
                const minHp = (this.state.derived?.hpMax || 100) * 0.5;
                if ((this.state.hero.hp || 0) >= minHp) {
                    this.state.hero.isDead = false;
                    this.defeatModalOpen = false;
                } else {
                    this.showNotification('Herói muito ferido! Aguarde pelo menos 50% de vida.');
                    this.addLog('Herói derrotado. Descanse na cidade para recuperar pelo menos metade da vida antes de desafiar a torre.', 'danger');
                    return;
                }
            }

            // Exclusividade mútua: desliga a exploração normal
            this.state.isExploring = false;

            const target = Number(floor || this.selectedTowerFloor || 1);
            const ok = startTowerRun(this.state, target);
            if (ok) {
                this.addLog(`⚔️ Desafiando o Andar ${target} da Torre dos Desafios!`, 'prestige');
            }
        },

        resolveTowerChoice(choiceIndex) {
            resolveTowerEventChoice(this.state, choiceIndex);
        },

        leaveTower() {
            if (!this.state.tower) return;
            // Guard: não pode recuar durante combate ativo
            if (this.state.tower.inBattle && this.state.tower.roomType === 'monster' && this.state.tower.monster) {
                this.showNotification('Impossível recuar durante combate na Torre!');
                return;
            }
            this.state.tower.inBattle = false;
            this.state.tower.monster = null;
            this.state.tower.eventRoom = null;
            this.state.tower.isVictory = false;
            this.state.tower.isDefeat = false;
            this.addLog('Você saiu da Torre dos Desafios.', 'narrative');
        },

        // ---- CHEFE MUNDIAL DIÁRIO (DPS CHECK 60s) ----

        getDailyWorldBoss() {
            return getDailyWorldBoss();
        },

        getWorldBossTierInfo(dmg) {
            return getWorldBossTierInfo(dmg);
        },

        challengeWorldBoss(useExtraDiamond = false) {
            if (this.state.hero.isDead) {
                this.showNotification('Seu herói precisa estar vivo para enfrentar o Chefe Mundial!');
                return;
            }
            this.state.isExploring = false;
            if (this.state.tower) this.state.tower.inBattle = false;
            const res = startWorldBossBattle(this.state, useExtraDiamond);
            if (res.ok) {
                this.addLog(res.msg, 'prestige');
                this.showNotification(res.msg);
            } else {
                this.showNotification(res.msg);
            }
        },

        leaveWorldBoss() {
            if (!this.state.worldBoss?.inBattle) return;
            const res = finishWorldBossBattle(this.state, 'retreat');
            if (res) {
                this.addLog(res.summary, 'prestige');
                this.showNotification(`Batalha encerrada! ${res.tierName}`);
                this.saveGame();
            }
        },

        // ---- MODAL DE INVENTÁRIO CHEIO (DROP PENDENTE) ----

        replaceItemWithDrop(inventoryIndex) {
            if (!this.state.pendingDropItem) return;
            const oldItem = this.state.inventory[inventoryIndex];
            if (oldItem?.isLocked) {
                this.showNotification('Este item está bloqueado e não pode ser substituído!');
                return;
            }
            const newItem = this.state.pendingDropItem;
            this.state.inventory[inventoryIndex] = newItem;
            this.state.pendingDropItem = null;
            this.pendingDropModalOpen = false;
            this.addLog(`Substituiu ${oldItem.name} por ${newItem.name}!`, 'loot');
            this.showNotification(`Item ${newItem.name} guardado na bolsa!`);
            this.saveGame();
        },

        sellPendingDrop() {
            if (!this.state.pendingDropItem) return;
            const price = this.state.pendingDropItem.price || 5;
            this.state.resources.gold += price;
            trackQuestProgress(this.state, 'EARN_GOLD', price);
            this.addLog(`Vendeu ${this.state.pendingDropItem.name} por ${price} Ouro`, 'loot');
            this.showNotification(`Vendeu por +${price} Ouro!`);
            this.state.pendingDropItem = null;
            this.pendingDropModalOpen = false;
            this.saveGame();
        },

        discardPendingDrop() {
            if (!this.state.pendingDropItem) return;
            this.addLog(`Descartou ${this.state.pendingDropItem.name}.`, 'danger');
            this.showNotification('Item descartado.');
            this.state.pendingDropItem = null;
            this.pendingDropModalOpen = false;
            this.saveGame();
        },

        // ==========================================
        // GAME LOOP
        // ==========================================

        _setupCanvas() {
            this.canvas = document.getElementById('game-canvas');
            if (this.canvas) {
                this.ctx = this.canvas.getContext('2d');
                this.stars = initStars(this.canvas);
            }
        },

        /**
         * Tick de backup que roda via setInterval (não é afetado por aba inativa).
         * Processa apenas produção de construções e regen passiva.
         */
        _backgroundTick() {
            if (document.hidden) {
                const dt = 1.0; // 1 segundo
                processBuildings(this.state, dt);

                // Tempo jogado
                if (this.state.lifetimeStats) {
                    this.state.lifetimeStats.timePlayedSec = (this.state.lifetimeStats.timePlayedSec || 0) + dt;
                }

                // Regen passiva de HP
                if (!this.state.hero.isDead) {
                    if (this.state.hero.hp < (this.state.derived?.hpMax || 100)) {
                        this.state.hero.hp = Math.min(
                            this.state.derived?.hpMax || 100,
                            this.state.hero.hp + (this.state.derived?.regen || 0.5) * dt
                        );
                    }
                    // Energy e Mana regen
                    const eMax = this.state.derived?.energyMax || 100;
                    const eReg = this.state.derived?.energyRegen || 5;
                    this.state.hero.energy = Math.min(eMax, (this.state.hero.energy || 0) + eReg * dt);
                    const mMax = this.state.derived?.manaMax || 100;
                    const mReg = this.state.derived?.manaRegen || 2;
                    this.state.hero.mana = Math.min(mMax, (this.state.hero.mana || 0) + mReg * dt);
                } else {
                    // Respawn regen (com bônus de recuperação pós-derrota do Paladino)
                    const teDead = getTreeEffects(this.state);
                    const deadMult = 1 + (teDead.paladin_utility || 0) * 0.50;
                    this.state.hero.hp += (this.state.derived?.regen || 0.5) * deadMult * dt;
                    if (this.state.hero.hp >= (this.state.derived?.hpMax || 100)) {
                        this.state.hero.hp = this.state.derived?.hpMax || 100;
                        this.state.hero.isDead = false;
                    }
                }

                this.state.lastTickAt = Date.now();
            }
        },

        /**
         * Catch-up massivo quando o jogador volta à aba após ausência.
         * Não simula combate, apenas produção, regen e timers.
         */
        _processOfflineProgress(elapsedSec) {
            // Cap dinâmico: 1 hora base + bônus do nó de utilidade da Árvore + Perk de Ascensão offline_cap (+2h/lvl)
            const te = getTreeEffects(this.state);
            const offlineBonusSec = (te.offline_cap_bonus || 0) * 30 * 60; // 30min por nível de nó
            const ascOfflineSec = (this.state.ascension?.perks?.offline_cap || 0) * 2 * 3600;
            const sec = Math.min(elapsedSec, 3600 + offlineBonusSec + ascOfflineSec);


            // Produção de construções
            processBuildings(this.state, sec);

            // Tempo jogado
            if (this.state.lifetimeStats) {
                this.state.lifetimeStats.timePlayedSec = (this.state.lifetimeStats.timePlayedSec || 0) + sec;
            }

            // Regen de HP, Energy, Mana
            if (!this.state.hero.isDead) {
                const regen = this.state.derived?.regen || 0.5;
                this.state.hero.hp = Math.min(
                    this.state.derived?.hpMax || 100,
                    (this.state.hero.hp || 0) + regen * sec
                );
                this.state.hero.energy = Math.min(
                    this.state.derived?.energyMax || 100,
                    (this.state.hero.energy || 0) + (this.state.derived?.energyRegen || 5) * sec
                );
                this.state.hero.mana = Math.min(
                    this.state.derived?.manaMax || 100,
                    (this.state.hero.mana || 0) + (this.state.derived?.manaRegen || 2) * sec
                );
            } else {
                // Respawn regen (velocidade normal baseada nos atributos + bônus Paladino)
                const deadMult = 1 + (te.paladin_utility || 0) * 0.50;
                const regenRate = (this.state.derived?.regen || 0.5) * deadMult;
                this.state.hero.hp = (this.state.hero.hp || 0) + regenRate * sec;
                if (this.state.hero.hp >= (this.state.derived?.hpMax || 100)) {
                    this.state.hero.hp = this.state.derived?.hpMax || 100;
                    this.state.hero.isDead = false;
                    this.addLog('Herói recuperado enquanto você estava ausente!', 'narrative');
                }
            }

            // Atualiza buff do Oráculo
            if (this.state.oracleBuff?.expiresAt) {
                this.state.oracleBuff.remaining = Math.max(0, Math.floor((this.state.oracleBuff.expiresAt - Date.now()) / 1000));
                if (this.state.oracleBuff.remaining <= 0) {
                    this.state.oracleBuff = null;
                }
            }

            // Atualiza buff da Estalagem da Taverna
            if (this.state.tavernRestBuff?.expiresAt) {
                this.state.tavernRestBuff.remaining = Math.max(0, Math.floor((this.state.tavernRestBuff.expiresAt - Date.now()) / 1000));
                if (this.state.tavernRestBuff.remaining <= 0) {
                    this.state.tavernRestBuff = null;
                    this.recalcStats();
                }
            }

            // Cerco da Vila: verificar se expirou enquanto offline
            if (this.state.villageSiege?.active) {
                this.state.villageSiege.timerSec -= sec;
                if (this.state.villageSiege.timerSec <= 0) {
                    const defRes = resolveSiegeDefeat(this.state);
                    this.addLog(defRes.msg, 'danger');
                    this.showNotification('💀 A Vila foi saqueada enquanto você estava ausente!');
                }
            }

            // Pausa exploração se estava ativa (combate não é simulado offline)
            if (this.state.isExploring) {
                this.state.isExploring = false;
                if (this.state.monster) {
                    this.state.monster.hp = this.state.monster.maxHp;
                    this.state.monster.atkTimer = 0;
                }
            }

            // Pausa torre se estava em combate
            if (this.state.tower?.inBattle) {
                this.state.tower.inBattle = false;
                this.state.tower.monster = null;
                this.state.tower.isDefeat = false;
                this.state.tower.isVictory = false;
            }

            // Cooldowns
            this.activeCooldownTimer = 0;
            this.healCooldownTimer = 0;
            this.devastatingStrikeTimer = 0;
            this.divineShieldTimer = 0;
            this.arcaneMeteorTimer = 0;
            this.ambushTimer = 0;

            const mins = Math.floor(sec / 60);
            const secs = Math.floor(sec % 60);
            if (mins > 0) {
                this.addLog(`⏰ Progresso offline de ${mins}m ${secs}s aplicado!`, 'level');
                this.showNotification(`⏰ ${mins}m ${secs}s de progresso offline!`);
            }

            this.saveGame();
        },


        _gameLoop(timestamp) {
            try {
                const dt = Math.min((timestamp - this.lastTick) / 1000, 0.1); // máx 100ms de dt
                this.lastTick = timestamp;

                // Resize canvas quando na aba explore
                if (this.canvas && this.activeTab === 'explore') {
                    if (resizeCanvas(this.canvas, this.ctx)) {
                        this.stars = initStars(this.canvas);
                    }
                }

                // Produção de construções e tempo jogado
                processBuildings(this.state, dt);
                if (!this.state.lifetimeStats) {
                    this.state.lifetimeStats = { kills: 0, bosses: 0, goldEarned: 0, itemsCrafted: 0, itemsUpgraded: 0, enchantmentsDone: 0, timePlayedSec: 0, highestTowerFloor: 1, criticalHits: 0 };
                }
                this.state.lifetimeStats.timePlayedSec = (this.state.lifetimeStats.timePlayedSec || 0) + dt;

                // Salva timestamp para catch-up offline
                this.state.lastTickAt = Date.now();

                // Cooldown de habilidades ativas (base)
                if (this.activeCooldownTimer > 0) {
                    this.activeCooldownTimer = Math.max(0, this.activeCooldownTimer - dt);
                }
                if (this.healCooldownTimer > 0) {
                    this.healCooldownTimer = Math.max(0, this.healCooldownTimer - dt);
                }
                // Cooldowns de ativos desbloqueados pela Árvore
                if (this.devastatingStrikeTimer > 0) this.devastatingStrikeTimer = Math.max(0, this.devastatingStrikeTimer - dt);
                if (this.divineShieldTimer > 0) this.divineShieldTimer = Math.max(0, this.divineShieldTimer - dt);
                if (this.arcaneMeteorTimer > 0) this.arcaneMeteorTimer = Math.max(0, this.arcaneMeteorTimer - dt);
                if (this.ambushTimer > 0) this.ambushTimer = Math.max(0, this.ambushTimer - dt);

                // Timers de buffs / debuffs ativos no herói
                if (this.state.hero?.debuffDefenseTimer > 0) {
                    this.state.hero.debuffDefenseTimer = Math.max(0, this.state.hero.debuffDefenseTimer - dt);
                }
                if (this.state.hero?.divineShieldTimer > 0) {
                    this.state.hero.divineShieldTimer = Math.max(0, this.state.hero.divineShieldTimer - dt);
                }

                // Recuperação / respawn (regen normal baseada nos atributos + bônus Paladino)
                if (this.state.hero.isDead) {
                    const teDead = getTreeEffects(this.state);
                    const deadMult = 1 + (teDead.paladin_utility || 0) * 0.50;
                    this.state.hero.hp += this.state.derived.regen * deadMult * dt;
                    this.respawnPercent = Math.min(100, Math.floor((this.state.hero.hp / this.state.derived.hpMax) * 100));
                    // Respawn ao atingir X quantidade de HP
                    if (this.state.hero.hp >= this.state.derived.hpMax) {
                        this.state.hero.hp = this.state.derived.hpMax;
                        this.state.hero.isDead = false;
                        this.addLog('Herói recuperado com HP máximo!', 'narrative');
                        // Reseta HP do monstro atual ao voltar
                        if (this.state.monster) {
                            this.state.monster.hp = this.state.monster.maxHp;
                            this.state.monster.atkTimer = 0;
                        }
                    }
                } else {
                    // HP regen natural (bloqueado pelo modificador 'curse' na torre)
                    const isCursed = this.state.tower?.inBattle && this.state.tower?.modifier?.id === 'curse';
                    if (this.state.hero.hp < this.state.derived.hpMax && !isCursed) {
                        this.state.hero.hp = Math.min(
                            this.state.derived.hpMax,
                            this.state.hero.hp + this.state.derived.regen * dt
                        );
                    }
                    // Energy regen (sempre, mesmo sem explorar)
                    const eMax = this.state.derived.energyMax || 100;
                    const eReg = this.state.derived.energyRegen || 5;
                    this.state.hero.energy = Math.min(eMax, (this.state.hero.energy || 0) + eReg * dt);
                    // Mana regen
                    const mMax = this.state.derived.manaMax || 100;
                    const mReg = this.state.derived.manaRegen || 2;
                    this.state.hero.mana = Math.min(mMax, (this.state.hero.mana || 0) + mReg * dt);

                    // Atualiza contagem regressiva do buff do Oráculo
                    if (this.state.oracleBuff) {
                        if (this.state.oracleBuff.expiresAt) {
                            this.state.oracleBuff.remaining = Math.max(0, Math.floor((this.state.oracleBuff.expiresAt - Date.now()) / 1000));
                            if (this.state.oracleBuff.remaining <= 0) {
                                this.state.oracleBuff = null;
                                this.addLog('🔮 A bênção do Oráculo se dissipou.', 'narrative');
                            }
                        }
                    }

                    // Atualiza contagem regressiva do buff da Estalagem da Taverna
                    if (this.state.tavernRestBuff) {
                        if (this.state.tavernRestBuff.expiresAt) {
                            this.state.tavernRestBuff.remaining = Math.max(0, Math.floor((this.state.tavernRestBuff.expiresAt - Date.now()) / 1000));
                            if (this.state.tavernRestBuff.remaining <= 0) {
                                this.state.tavernRestBuff = null;
                                this.recalcStats();
                                this.addLog('🍖 O efeito do Banquete da Estalagem terminou.', 'narrative');
                            }
                        }
                    }

                    // Processa cerco da vila (Contagem regressiva de 3 minutos)
                    if (this.state.villageSiege?.active) {
                        this.state.villageSiege.timerSec -= dt;
                        if (this.state.villageSiege.timerSec <= 0) {
                            const defRes = resolveSiegeDefeat(this.state);
                            this.addLog(defRes.msg, 'danger');
                            this.showNotification('💀 A Vila foi saqueada pelos monstros invasores!');
                            if (this.state.audioEnabled) playDefeatTone(this.state.audioVolume);
                            this.saveGame();
                        }
                    } else if (Date.now() > (this.state.villageSiege?.nextCheckAt || 0) && (this.state.hero?.level || 1) >= 5) {
                        this.state.villageSiege.nextCheckAt = Date.now() + (2 * 3600 * 1000) + Math.random() * (2 * 3600 * 1000);
                        if (Math.random() < 0.35) {
                            this.triggerVillageSiege();
                        }
                    }

                    // Processa Combate da Exploração
                    if (this.state.isExploring && this.state.monster) {
                        // Injeta referências temporárias para a Árvore, Pets e Barreira no objeto hero
                        this.state.hero._treeSkills = this.state.treeSkills;
                        this.state.hero._pets = this.state.pets;
                        this.state.hero._barrierShield = this.holyBarrierShieldHp;

                        const result = processCombatTick(
                            dt,
                            this.state.hero,
                            this.state.monster,
                            this.state.derived,
                            this.state.bestiary,
                            this.state.oracleBuff,
                            this.state.pets?.active,
                            this.state.equipment,
                            this.state.ascension,
                            null
                        );

                        // Sincroniza shield de volta (pode ter sido consumido em combat.js)
                        this.holyBarrierShieldHp = this.state.hero._barrierShield || 0;


                        // Animação de ataque do herói
                        if (result.heroAttacked) {
                            this.heroAttacking = true;
                            this.attackFlashMs = 200;
                            const f = makeHeroDmgFloat(this.canvas, result.dmgToMonster, result.isCritical);
                            if (f) this.pushCombatFloat(f);

                            if (result.isCritical) {
                                trackQuestProgress(this.state, 'CRITICAL_HITS', 1);
                                if (this.state.lifetimeStats) {
                                    this.state.lifetimeStats.criticalHits = (this.state.lifetimeStats.criticalHits || 0) + 1;
                                }
                            }

                            if (this.state.audioEnabled) {
                                if (result.isCritical) playCritSlash(this.state.audioVolume);
                                else playSwordSlash(this.state.audioVolume);
                            }

                            if (!this.state.statsSession) {
                                this.state.statsSession = { startedAt: Date.now(), kills: 0, goldEarned: 0, xpEarned: 0, damageDealt: 0 };
                            }
                            this.state.statsSession.damageDealt += result.dmgToMonster + (result.petDmg || 0) + (result.bleedDmg || 0);

                            let procDelay = 120;
                            // Relíquia: Golpe Duplo
                            if (result.doubleStrike) {
                                const ef = makeMonsterEffectFloat(this.canvas, '⚔️ GOLPE DUPLO!', '#fbbf24');
                                if (ef) this.pushCombatFloat(ef, procDelay);
                                procDelay += 120;
                            }
                            // Relíquia: Sangramento
                            if (result.bleedDmg > 0) {
                                const ef = makeMonsterEffectFloat(this.canvas, `🩸 -${result.bleedDmg} Sangramento`, '#ef4444');
                                if (ef) this.pushCombatFloat(ef, procDelay);
                                procDelay += 120;
                            }
                            // Ataque conjunto do Mascote Ativo
                            if (result.petDmg > 0) {
                                const ef = makeMonsterEffectFloat(this.canvas, `🐾 -${result.petDmg}`, '#38bdf8');
                                if (ef) this.pushCombatFloat(ef, procDelay);
                                procDelay += 120;
                            }
                            if (result.petHeal > 0) {
                                const hf = makeHeroHealFloat(this.canvas, `🐾 +${result.petHeal} HP`, '#4ade80');
                                if (hf) this.pushCombatFloat(hf, procDelay);
                                procDelay += 120;
                            }
                            // Bônus de Conjunto: Descarga Elétrica
                            if (result.chainLightning) {
                                const ef = makeMonsterEffectFloat(this.canvas, '⚡ RAIO DUPLO!', '#fbbf24');
                                if (ef) this.pushCombatFloat(ef, procDelay);
                                procDelay += 120;
                            }

                            // Especialização: Explosão Arcana
                            if (result.arcaneBlast) {
                                const ef = makeMonsterEffectFloat(this.canvas, '🔮 EXPLOSÃO ARCANA!', '#c084fc');
                                if (ef) this.pushCombatFloat(ef, procDelay);
                                procDelay += 120;
                            }

                            // Floats especiais de Encantamento
                            if (result.elementalType === 'fire') {
                                const ef = makeMonsterEffectFloat(this.canvas, '🔥 Queimadura!', '#f97316');
                                if (ef) this.pushCombatFloat(ef, procDelay);
                                procDelay += 120;
                            } else if (result.elementalType === 'ice') {
                                const ef = makeMonsterEffectFloat(this.canvas, '❄️ Gelo!', '#38bdf8');
                                if (ef) this.pushCombatFloat(ef, procDelay);
                                procDelay += 120;
                            } else if (result.elementalType === 'vampiric') {
                                const ef = makeHeroHealFloat(this.canvas, `+${result.vampiricHeal} HP`, '#4ade80');
                                if (ef) this.pushCombatFloat(ef, procDelay);
                                procDelay += 120;
                            }
                        }

                        if (result.monsterAttacked) {
                            if (result.dodged) {
                                const ef = makeHeroHealFloat(this.canvas, '💨 ESQUIVOU!', '#38bdf8');
                                if (ef) this.pushCombatFloat(ef);
                            } else {
                                this.heroIsHit = true;
                                this.heroHitMs = 180;
                                const f = makeMonsterDmgFloat(this.canvas, result.dmgToHero);
                                if (f) this.pushCombatFloat(f);

                                let defDelay = 120;
                                if (result.paladinHeal > 0) {
                                    const hf = makeHeroHealFloat(this.canvas, `+${result.paladinHeal} HP`, '#facc15');
                                    if (hf) this.pushCombatFloat(hf, defDelay);
                                    defDelay += 120;
                                }
                                if (result.reflectedDmg > 0) {
                                    const rf = makeMonsterEffectFloat(this.canvas, `🛡️ ${result.reflectedDmg} Refletido!`, '#facc15');
                                    if (rf) this.pushCombatFloat(rf, defDelay);
                                    defDelay += 120;
                                }
                                if (result.sacredBarrierActivated) {
                                    const bf = makeHeroHealFloat(this.canvas, '🛡️ BARREIRA SAGRADA!', '#3b82f6');
                                    if (bf) this.pushCombatFloat(bf, defDelay);
                                    this.addLog('🛡️ Barreira Sagrada Ativada! Golpe letal absorvido com 30% HP.', 'prestige');
                                }
                            }
                        }

                        if (result.killed) {
                            this._killMonster();
                        }

                        if (result.heroKilled) {
                            this.state.hero.isDead = true;
                            this.state.isExploring = false;
                            this.defeatModalOpen = true;
                            if (this.state.audioEnabled) playDefeatTone(this.state.audioVolume);
                            this.addLog('Você foi derrotado em combate! Retorne à cidade para descansar.', 'danger');
                        }
                    }

                    // Processa Combate Dedicado da Invasão da Vila (GDD Expansão 1.3)
                    if (this.state.villageSiege?.active && this.state.villageSiege?.inBattle && this.state.villageSiege?.monster) {
                        const siegeRes = processSiegeCombatTick(this.state, dt);
                        if (siegeRes?.victory) {
                            const vicRes = resolveSiegeVictory(this.state);
                            this.state.villageSiege.inBattle = false;
                            this.state.villageSiege.active = false;
                            this.siegeModalOpen = false;
                            this.addLog(vicRes.msg, 'prestige');
                            this.showNotification('🏆 Invasão da Vila Repelida com Sucesso!');
                            if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
                        } else if (siegeRes?.defeat) {
                            this.state.hero.isDead = true;
                            this.state.villageSiege.inBattle = false;
                            this.siegeModalOpen = false;
                            this.defeatModalOpen = true;
                            if (this.state.audioEnabled) playDefeatTone(this.state.audioVolume);
                            this.addLog('Você foi derrotado pelo General Invasor! A vila precisa de reforços.', 'danger');
                        }
                    }

                    // Processa Combate Roguelike Dedicado da Torre dos Desafios
                    if (this.state.tower?.inBattle && this.state.tower.roomType === 'monster' && this.state.tower.monster) {
                        processTowerCombatTick(this.state, dt);
                        this._checkLevelUp();
                    }

                    // Processa Combate do Chefe Mundial Diário (60s DPS Check)
                    if (this.state.worldBoss?.inBattle) {
                        const wbRes = processWorldBossCombatTick(this.state, dt);
                        if (wbRes) {
                            this.addLog(wbRes.summary, 'prestige');
                            this.showNotification(`🐉 Chefe Mundial: ${wbRes.tierName}! (${wbRes.damage.toLocaleString('pt-BR')} Dano)`);
                            if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
                            this.saveGame();
                        }
                    }
                }

                // Garante verificação de level-up imediata se houver XP pendente de qualquer fonte
                if (this.state.hero && this.state.hero.xp >= this.state.hero.nextXp) {
                    this._checkLevelUp();
                }

                // Decai flag de ataque do herói
                if (this.attackFlashMs > 0) {
                    this.attackFlashMs -= dt * 1000;
                    if (this.attackFlashMs <= 0) {
                        this.heroAttacking = false;
                        this.attackFlashMs = 0;
                    }
                }

                // Decai flag de hit do herói
                if (this.heroHitMs > 0) {
                    this.heroHitMs -= dt * 1000;
                    if (this.heroHitMs <= 0) {
                        this.heroIsHit = false;
                        this.heroHitMs = 0;
                    }
                }

                // Render apenas se na aba de exploração
                if (this.canvas && this.activeTab === 'explore') {
                    renderCanvas(this.ctx, this.canvas, this.state, this.state.derived, this.floats, this.stars, timestamp, this.heroAttacking, this.heroIsHit);
                }
            } catch (err) {
                console.error('[Idleton GameLoop Error]', err);
            } finally {
                requestAnimationFrame(ts => this._gameLoop(ts));
            }
        },
    };
}
