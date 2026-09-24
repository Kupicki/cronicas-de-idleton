import {
    MONSTER_TYPES,
    ORACLE_BUFFS,
    ORACLE_PROPHECIES,
    TAVERN_RUMORS,
    MARKET_ITEMS,
    PETS,
    TAMER_COST,
    BESTIARY_MILESTONES,
    BESTIARY_TITLES,
    QUEST_TYPES,
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
}                                                                 from './constants.js';
import { defaultState }                                           from './state.js';
import {
    createMonster, processCombatTick, calcHeroDmg, calcKillRewards,
    calcActiveSetBonuses, startTowerRun, resolveTowerEventChoice, processTowerCombatTick,
    getTowerModifierIntensity,
} from './combat.js';
import {
    renderCanvas, makeHeroDmgFloat, makeMonsterDmgFloat,
    makeSpecialFloat, makeHeroHealFloat, makeMonsterEffectFloat,
    setupCanvas as initStars, resizeCanvas,
}                                                                 from './canvas.js';
import {
    getBuildingCost, buyBuilding, processBuildings,
    generateLoot, getUpgradeCost, upgradeItem,
    equipItem, unequipItem, sellItem, dismantleItem,
    getMarketPrice, buyMarketResource, getDomainFortificationCost,
    upgradeDomain, calcGoldIncomeRate, craftItem,
    enchantEquipment, calcMonsterMaterialDrops,
    calcAscensionReward, performAscension, buyAscensionPerk,
    getNextBagUpgrade, upgradeBag, applyAutoLootFilter,
    startPetExpedition, claimPetExpedition, craftRelic,
    resolveSiegeVictory, resolveSiegeDefeat,
    getForgeCost, resetHeroStats, getStatResetCost,
}                                                                 from './economy.js';
import {
    createLogEntry, recalcDerived, getItemDelta,
    changeHeroName, buySkill, allocateStat,
    playTavernGame, loadGame, saveGame,
}                                                                 from './ui.js';
import {
    playSwordSlash, playCritSlash, playCoinClink,
    playItemDrop, playLevelUpFanfare, playDefeatTone,
    playSiegeAlert, playCoinFlip, playDiceRoll,
    playTavernWin, playTavernLose,
}                                                                 from './audio.js';
import {
    ensureQuests, trackQuestProgress, claimQuestReward,
}                                                                 from './quests.js';
import { t, setLang, getLang, getAvailableLangs, LANG_META }     from './lang/index.js';
import { v, getLibraryAssetUrl, getLibraryIcon }                  from './visuals/index.js';
import { calcXpForLevel, formatNumber, formatInt }                from './formulas.js';

// ==========================================
// ALPINE COMPONENT — gameData()
// ==========================================

export function gameData() {
    return {
        // --- Constantes expostas no template ---
        MONSTER_TYPES,
        ORACLE_BUFFS,
        MARKET_ITEMS,
        TAVERN_RUMORS,
        PETS,
        TAMER_COST,
        BESTIARY_MILESTONES,
        BESTIARY_TITLES,
        QUEST_TYPES,
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
        v,                         // Biblioteca Visual: v('chave', 'prop?')
        getLibraryAssetUrl,        // Atalho: v('chave') → '/assets/path.png'
        getLibraryIcon,            // Atalho: v('chave') → 'fa-icon'
        formatNumber,              // Notação abreviada K/M/B/T
        formatInt,                 // Notação inteira abreviada
        currentRumor: TAVERN_RUMORS[Math.floor(Math.random() * TAVERN_RUMORS.length)],
        // --- Estado & UI ---
        state:                JSON.parse(JSON.stringify(defaultState)),
        menuOpen:             false,
        settingsOpen:         false,
        language:             getLang(),   // idioma ativo (sincronizado com o módulo i18n)
        LANG_META,                         // metadados p/ UI de seleção de idioma
        activeTab:            'city',
        cityPanel:            null,
        blacksmithTab:        'upgrade',   // 'upgrade' | 'craft' | 'relics'
        petTab:               'list',      // 'list' | 'expeditions'
        selectedExpeditionZone: 'forest',
        selectedExpeditionPet: null,
        selectedExpeditionMinutes: 30,
        selectedRelicId:      'relic_blade',
        craftRecipeId:        'iron_basic',
        craftSlot:            'weapon',
        enchantSlot:          'weapon',
        selectedEnchantId:    'fire',
        specializationModalOpen: false,
        selectedSpecializationId: 'berserker',
        towerModalOpen:       false,
        selectedTowerFloor:   1,
        siegeModalOpen:       false,
        statsExpanded:        false,
        respawnPercent:       0,
        globalNotification:   null,
        selectedItemIndex:    null,
        itemModalOpen:        false,
        selectedEquippedSlot: null,
        equippedModalOpen:    false,
        defeatModalOpen:      false,
        pendingDropModalOpen: false,
        selectedBestiaryMob:  null,
        upgradeSlot:          null,

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
        skillsExpanded:   false,
        combatLogOpen:    false,
        combatLogFilter:  'all', // 'all' | 'combat' | 'loot' | 'level'

        // --- Canvas ---
        canvas:              null,
        ctx:                 null,
        stars:               [],
        floats:              [],
        lastTick:            performance.now(),
        heroAttacking:       false,
        attackFlashMs:       0,
        heroIsHit:           false,
        heroHitMs:           0,
        activeCooldownTimer: 0,  // cooldown do Ataque Concentrado
        healCooldownTimer:   0,  // cooldown da Cura Espontânea

        // --- Config de stats visível no template ---
        statConfig: [
            { key: 'str', name: 'Força',        icon: 'fa-dumbbell',       color: 'text-red-400',    tip: '+1 Dano Base' },
            { key: 'def', name: 'Defesa',       icon: 'fa-shield',         color: 'text-blue-400',   tip: '+1 Defesa & +5 HP' },
            { key: 'ene', name: 'Energia',      icon: 'fa-bolt',           color: 'text-amber-400',  tip: '+5 Máx & +0.5 Rec/s' },
            { key: 'int', name: 'Inteligência',  icon: 'fa-brain',          color: 'text-purple-400', tip: '+5 Mana & +0.1 Rec/s' },
            { key: 'agi', name: 'Agilidade',     icon: 'fa-person-running', color: 'text-yellow-400', tip: '+Velocidade Ataque' },
            { key: 'lck', name: 'Sorte',         icon: 'fa-star',           color: 'text-green-400',  tip: '+Drop Rate' },
            { key: 'per', name: 'Percepção',     icon: 'fa-eye',            color: 'text-cyan-400',   tip: '+Qualidade Loot' },
            { key: 'reg', name: 'Regeneração',   icon: 'fa-heart',          color: 'text-pink-400',   tip: '+0.5 HP Regen/s' },
        ],

        // --- Habilidades Ativas do GDD (para visualização no Grimório/Painel) ---
        activeSkills: [
            { id: 'focused_attack', name: 'Ataque Concentrado', icon: 'fa-bolt', cost: '30 ⚡ Energia', cd: 8, desc: 'Desfere um golpe devastador causando 3× do seu Dano Base.', unlocked: true },
            { id: 'quick_heal',     name: 'Cura Espontânea',   icon: 'fa-hand-holding-medical', cost: '30 🧪 Mana', cd: 12, desc: 'Restaura 25% do seu HP Máximo instantaneamente.', unlocked: true },
            { id: 'war_cry',        name: 'Grito de Guerra',   icon: 'fa-bullhorn', cost: '40 ⚡ Energia', cd: 25, desc: 'Aumenta seu Dano Base em +30% por 10s.', unlocked: false, reqLv: 5 },
            { id: 'shield_barrier', name: 'Barreira Sagrada',  icon: 'fa-shield-halved', cost: '35 🧪 Mana', cd: 20, desc: 'Reduz todo o dano recebido em 50% por 6s.', unlocked: false, reqLv: 10 },
        ],

        // --- Dados constantes acessíveis no template ---
        MONSTER_TYPES,
        tabs: [
            { id: 'city',        name: 'Cidade',             icon: 'fa-city'           },
            { id: 'inventory',   name: 'Inventário',         icon: 'fa-briefcase'      },
            { id: 'explore',     name: 'Exploração',         icon: 'fa-map-marked-alt' },
            { id: 'tower',       name: 'Torre dos Desafios', icon: 'fa-monument'       },
            { id: 'domain',      name: 'Domínio',            icon: 'fa-chess-rook'     },
            { id: 'companions',  name: 'Companheiros',       icon: 'fa-paw'            },
            { id: 'bestiary',    name: 'Bestiário',          icon: 'fa-dragon'         },
            { id: 'stats',       name: 'Estatísticas',       icon: 'fa-chart-pie'      },
            { id: 'ascension',   name: 'Ascensão',           icon: 'fa-star'           },
        ],

        // ==========================================
        // INIT
        // ==========================================

        async initGame() {
            // Restaura idioma salvo
            const savedLang = localStorage.getItem('idleton_lang') || 'pt-br';
            setLang(savedLang);
            this.language = getLang();

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
                        const elapsedSec = Math.min(elapsedMs / 1000, 3600); // Cap de 1h
                        this._processOfflineProgress(elapsedSec);
                    }
                    this.state.lastTickAt = now;
                    this.lastTick = performance.now();
                }
            });

            this.addLog('Aventura iniciada!', 'narrative');
        },

        /** Migrações de save antigo para novo schema. */
        _migrateState(s) {
            if (!s.logs)      s.logs      = [];
            if (!s.equipment) s.equipment = JSON.parse(JSON.stringify(defaultState.equipment));
            if (!s.inventory) s.inventory = [];
            if (!s.bestiary)  s.bestiary  = {};
            if (!s.skills)    s.skills    = JSON.parse(JSON.stringify(defaultState.skills));

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
                s.hero.pe = (s.hero.skillPoints || 0) + (s.hero.statPoints || 0);
            }
            delete s.hero.skillPoints;
            delete s.hero.statPoints;

            if (typeof s.hero.nameChanges === 'undefined') s.hero.nameChanges = 0;

            // Migra buildings antigos (hut/farm/mine) para novo schema
            if (!s.buildings || !s.buildings.hut) {
                s.buildings = JSON.parse(JSON.stringify(defaultState.buildings));
            }
            // Garante que novas construções existam
            for (const key in defaultState.buildings) {
                if (!s.buildings[key]) s.buildings[key] = { ...defaultState.buildings[key] };
            }
            // Atualiza prod/baseCost para valores atuais (rebalancamentos)
            for (const key in defaultState.buildings) {
                s.buildings[key].prod    = defaultState.buildings[key].prod;
                s.buildings[key].baseCost = defaultState.buildings[key].baseCost;
            }

            if (!s.resources.diamond && s.resources.diamond !== 0) s.resources.diamond = 0;
            if (typeof s.maxZone === 'undefined')    s.maxZone    = s.zone || 1;
            if (typeof s.totalKills === 'undefined') s.totalKills = 0;
            if (typeof s.hero.statPoints === 'undefined') s.hero.statPoints = 0;
            if (typeof s.hero.energy === 'undefined' || s.hero.energy < 30) s.hero.energy = Math.max(s.hero.energy || 0, 30);
            if (typeof s.hero.mana === 'undefined' || s.hero.mana < 30)     s.hero.mana   = Math.max(s.hero.mana || 0, 30);
            if (typeof s.bossSafeMode === 'undefined') s.bossSafeMode = false;
            if (typeof s.oracleBuff === 'undefined')   s.oracleBuff   = null;
            if (s.oracleBuff && s.oracleBuff.expiresAt && s.oracleBuff.expiresAt <= Date.now()) {
                s.oracleBuff = null;
            }

            if (!s.marketPurchases) {
                s.marketPurchases = { wood: 0, scrap: 0, iron: 0, essence: 0 };
            }
            if (!s.ascension) {
                s.ascension = { count: 0, totalAncestralEarned: 0, perks: { dmg: 0, gold: 0, xp: 0, drop: 0 } };
            }
            if (!s.ascension.perks) {
                s.ascension.perks = { dmg: 0, gold: 0, xp: 0, drop: 0 };
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
            // Recalcula nextXp para a nova curva 1.28× (migração de saves com curva 1.5×)
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
                };
            }
            if (!s.statsSession) {
                s.statsSession = { startedAt: Date.now(), kills: 0, goldEarned: 0, xpEarned: 0, damageDealt: 0 };
            }

            // Garante que se um monstro da zona 1 estiver ativo com HP antigo, ele seja recriado com 5 HP
            if (s.monster && s.zone === 1 && s.monster.maxHp > 10) {
                s.monster = createMonster(s.zone, s.killsInZone || 0, s.bossSafeMode);
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

        toggleMenu()   { this.menuOpen = !this.menuOpen; },
        switchTab(id)  {
            this.activeTab = id;
            if (window.innerWidth < 1024) this.menuOpen = false;
            if (id === 'explore' && !this.canvas) {
                this.$nextTick(() => this._setupCanvas());
            }
        },

        // Troca idioma e persiste a preferência
        switchLang(lang) {
            setLang(lang);
            this.language = getLang();
            localStorage.setItem('idleton_lang', lang);
        },

        // Função de tradução exposta no template Alpine
        t(key, params) { return t(key, params); },

        // ==========================================
        // HERÓI
        // ==========================================

        changeHeroName(newName) {
            const result = changeHeroName(this.state, this.state.resources, newName);
            this.showNotification(result.msg);
            if (result.ok) this.saveGame();
        },

        resetProgress() {
            this.state         = JSON.parse(JSON.stringify(defaultState));
            localStorage.setItem('idleton_hero_name', this.state.hero.name);
            this.recalcStats();
            this.saveGame();
            this.showNotification('Progresso resetado com sucesso!');
            this.activeTab    = 'city';
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
                if (this.state.hero.mana   > this.state.derived.manaMax)   this.state.hero.mana   = this.state.derived.manaMax;
            } else if ((this.state.hero.statPoints || 0) <= 0) {
                this.addLog('Nenhum ponto de atributo disponível.', 'danger');
            }
        },

        // ==========================================
        // HABILIDADE ATIVA — Ataque Concentrado
        // ==========================================

        useFocusedAttack() {
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) return;
            if ((this.state.hero.energy || 0) < 30) {
                this.addLog('Energia insuficiente para Ataque Concentrado! (30 ⚡)', 'danger');
                this.showNotification('Energia insuficiente (30 ⚡)!');
                return;
            }
            if (this.activeCooldownTimer > 0) return;

            // Se estiver na Torre em combate com Guardião:
            if (this.state.tower?.inBattle && this.state.tower.roomType === 'monster' && this.state.tower.monster) {
                const tm = this.state.tower.monster;
                this.state.hero.energy -= 30;
                this.activeCooldownTimer = 8;

                const mult = (this.state.tower.heroDmgMult || 1.0);
                const dmg = Math.floor(this.state.derived.str * 3 * mult * (0.9 + Math.random() * 0.2));
                tm.hp -= dmg;
                tm.isHit = true;
                tm.hitTimer = 0.5;

                this.state.tower.logs.unshift(`⚡ Ataque Concentrado devastou ${tm.name} causando ${dmg} de dano!`);
                this.addLog(`⚡ Ataque Concentrado na Torre: -${dmg} HP no ${tm.name}!`, 'level');

                if (tm.hp <= 0) {
                    tm.hp = 0;
                    this.state.tower.inBattle = false;
                    this.state.tower.isVictory = true;

                    const r = tm.rewards;
                    this.state.resources.gold = (this.state.resources.gold || 0) + r.gold;
                    this.state.resources.diamonds = (this.state.resources.diamonds || 0) + r.diamonds;
                    this.state.resources.essence = (this.state.resources.essence || 0) + r.essence;

                    if (this.state.tower.floor >= (this.state.tower.maxFloor || 1)) {
                        this.state.tower.maxFloor = Math.min(100, this.state.tower.floor + 1);
                    }
                    if (!this.state.lifetimeStats) this.state.lifetimeStats = {};
                    this.state.lifetimeStats.highestTowerFloor = Math.max(this.state.lifetimeStats.highestTowerFloor || 1, this.state.tower.floor);
                    this.state.lifetimeStats.bosses = (this.state.lifetimeStats.bosses || 0) + 1;

                    this.state.tower.logs.unshift(`🏆 VITÓRIA! Você conquistou o Andar ${this.state.tower.floor}! Recompensas: +${r.gold} 🪙, +${r.diamonds} 💎, +${r.essence} ⚡!`);
                }
                return;
            }

            // Se estiver em Exploração:
            if (this.state.isExploring && this.state.monster) {
                this.state.hero.energy -= 30;
                this.activeCooldownTimer = 8;

                const dmg = Math.floor(this.state.derived.str * 3 * (0.9 + Math.random() * 0.2));
                this.state.monster.hp -= dmg;
                this.state.monster.isHit = true;
                this.state.monster.hitTimer = 0.5;

                const f = makeHeroDmgFloat(this.canvas, dmg, true);
                if (f) this.pushCombatFloat(f);

                this.addLog(`⚡ Ataque Concentrado em ${this.state.monster.name}: -${dmg} HP!`, 'level');

                if (this.state.monster.hp <= 0) {
                    this._killMonster();
                }
            }
        },

        // ==========================================
        // HABILIDADE ATIVA — Cura Espontânea
        // ==========================================

        useQuickHeal() {
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) return;
            if ((this.state.hero.mana || 0) < 30) {
                this.addLog('Mana insuficiente para Cura Espontânea! (30 🧪)', 'danger');
                this.showNotification('Mana insuficiente (30 🧪)!');
                return;
            }
            if (this.healCooldownTimer > 0) return;

            this.state.hero.mana -= 30;
            this.healCooldownTimer = 12;

            const healAmt = Math.floor(this.state.derived.hpMax * 0.25);
            this.state.hero.hp = Math.min(this.state.derived.hpMax, (this.state.hero.hp || 0) + healAmt);

            if (this.canvas) {
                const f = makeSpecialFloat(this.canvas, `+${healAmt} HP`, '#4ade80');
                if (f) this.pushCombatFloat(f);
            }

            if (this.state.tower?.inBattle) {
                this.state.tower.logs.unshift(`🧪 Cura Espontânea restaurou +${healAmt} HP!`);
            }
            this.addLog(`🧪 Cura Espontânea restaurou +${healAmt} HP!`, 'level');
        },

        // ==========================================
        // EXPLORAÇÃO & COMBATE
        // ==========================================

        toggleExploration() {
            // Se o herói estiver morto, não pode iniciar exploração
            if (this.state.hero.isDead || (this.state.hero.hp || 0) <= 0) {
                this.showNotification('Herói abatido! Aguarde a recuperação da vida.');
                return;
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
                this.state.monster.hp       = this.state.monster.maxHp;
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
            this.state.killsInZone  = 9;
            this.state.monster      = createMonster(this.state.zone, 9, false);
            this.addLog(`⚔️ Desafiando o Chefe da Zona ${this.state.zone}!`, 'danger');
            this.showNotification('O Chefe da Zona apareceu!');
            this.saveGame();
        },

        changeZone(delta) {
            const nextZone = (this.state.zone || 1) + delta;
            const maxZ = this.state.maxZone || 1;
            if (nextZone < 1 || nextZone > maxZ) return;
            this.state.zone        = nextZone;
            this.state.killsInZone = 0;
            this.state.monster     = createMonster(this.state.zone, 0, this.state.bossSafeMode);
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
            this.state.hero.xp        += xp;
            this.state.killsInZone++;

            // Rastreia missão de ganho de ouro
            trackQuestProgress(this.state, 'EARN_GOLD', gold);

            // Estatísticas da Sessão e Históricas (Lifetime)
            if (!this.state.statsSession) {
                this.state.statsSession = { startedAt: Date.now(), kills: 0, goldEarned: 0, xpEarned: 0, damageDealt: 0 };
            }
            if (!this.state.lifetimeStats) {
                this.state.lifetimeStats = { kills: 0, bosses: 0, goldEarned: 0, itemsCrafted: 0, itemsUpgraded: 0, enchantmentsDone: 0, timePlayedSec: 0, highestTowerFloor: 1 };
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
                    this.pendingDropModalOpen  = true;
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

            // Level Up fiel ao GDD Expansão: +3 Pontos de Atributo, HP Max Base +10, razão 1.28×
            while (this.state.hero.xp >= this.state.hero.nextXp) {
                this.state.hero.level++;
                this.state.hero.xp      -= this.state.hero.nextXp;
                this.state.hero.nextXp   = calcXpForLevel(this.state.hero.level);
                this.state.hero.statPoints = (this.state.hero.statPoints || 0) + 3;
                this.state.baseStats.hpMax += 10;

                // GDD Expansão 1.1: Bônus de marco a cada 10 níveis (+1 ponto de atributo extra)
                if (this.state.hero.level % 10 === 0) {
                    this.state.hero.statPoints += 1;
                    this.addLog(`🌟 MARCO! Nível ${this.state.hero.level} — +1 Ponto de Atributo Bônus!`, 'prestige');
                }

                this.recalcStats();
                this.state.hero.hp = this.state.derived.hpMax;

                const f = makeSpecialFloat(this.canvas, 'LEVEL UP!', '#fbbf24');
                if (f) this.pushCombatFloat(f, rewardDelay);

                if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);

                this.addLog(`LEVEL UP! Nível ${this.state.hero.level} (+3 Pontos de Atributo) ✨`, 'level');
                this.showNotification(`LEVEL UP! Você alcançou o Nível ${this.state.hero.level}!`);

                // Nível 30: Desbloqueio da Especialização
                if (this.state.hero.level === 30 && !this.state.hero.specialization) {
                    this.specializationModalOpen = true;
                    this.addLog('🔮 Você alcançou o Nível 30! Escolha sua Especialização de Maestria.', 'prestige');
                    this.showNotification('Especialização de Classe Desbloqueada!');
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

            // Spawn próximo monstro
            this.state.monster = createMonster(this.state.zone, this.state.killsInZone, this.state.bossSafeMode);
        },

        // ==========================================
        // MISSÕES PROCEDURAIS (GDD: Seção 15)
        // ==========================================

        claimQuest(questId) {
            const result = claimQuestReward(this.state, questId);
            if (result.ok) {
                this.addLog(result.msg, 'level');
                this.showNotification(result.msg);
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
                this.state.pets = { tamerUnlocked: true, owned: [], active: null };
            } else {
                this.state.pets.tamerUnlocked = true;
            }
            trackQuestProgress(this.state, 'SPEND_GOLD', TAMER_COST);
            this.addLog('🐾 Você contratou o Domador de Feras! A aba de Companheiros foi desbloqueada.', 'level');
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
            if (!this.state.pets.active) {
                this.state.pets.active = petId;
            }
            trackQuestProgress(this.state, 'SPEND_GOLD', pet.cost);
            this.recalcStats();
            this.addLog(`🐾 Você adotou ${pet.name}! (${pet.effectDesc})`, 'loot');
            this.showNotification(`${pet.name} agora é seu companheiro!`);
            this.saveGame();
        },

        equipPet(petId) {
            if (!this.state.pets?.owned?.includes(petId)) return;
            this.state.pets.active = petId;
            this.recalcStats();
            const pet = PETS.find(p => p.id === petId);
            this.showNotification(`Companheiro ativo: ${pet?.name || 'Pet'}`);
            this.saveGame();
        },

        unequipPet() {
            if (!this.state.pets) return;
            this.state.pets.active = null;
            this.recalcStats();
            this.showNotification('Companheiro desequipado.');
            this.saveGame();
        },

        // ==========================================
        // DOMÍNIO & FORTIFICAÇÃO
        // ==========================================

        getBuildingCost(id) {
            return getBuildingCost(this.state.buildings, id);
        },

        buyBuilding(id) {
            const ok = buyBuilding(this.state, id);
            if (ok) {
                this.showNotification(`Construiu ${this.state.buildings[id].name}!`);
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
        // TAVERNA
        // ==========================================

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
            const prophecy   = prophecies[Math.floor(Math.random() * prophecies.length)] || "Os ventos sussurram glória ao seu destino.";

            this.state.resources.gold -= cost;
            const durationSec = 900; // 15 minutos

            this.state.oracleBuff = {
                type:        buffDef.id,
                name:        buffDef.name,
                icon:        buffDef.icon,
                color:       buffDef.color,
                multiplier:  buffDef.mult,
                duration:    durationSec,
                remaining:   durationSec,
                expiresAt:   Date.now() + durationSec * 1000,
                prophecy:    prophecy,
            };

            this.addLog(`🔮 O Oráculo profere: "${prophecy}"`, 'prestige');
            this.addLog(`✨ Ativada: ${buffDef.name} (${buffDef.desc})`, 'level');
            this.showNotification(`Bênção recebida: ${buffDef.name}!`);
            this.saveGame();
        },

        // ==========================================
        // MERCADO DINÂMICO (GDD: Seção 15)
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
                // Se houver um ícone FontAwesome ou texto de fallback específico
                const icon = parent.querySelector('i.fas, i.fa-solid');
                if (icon && icon !== el) {
                    icon.style.display = 'none';
                }
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
                const icon = parent.querySelector('i.fas, i.fa-solid');
                if (icon && icon !== el) {
                    icon.style.display = '';
                }
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
            this.recalcStats();
            this.addLog(`🌟 Especialização Escolhida: ${spec.name} (${spec.role})!`, 'level');
            this.showNotification(`Você agora é um ${spec.name}!`);
            if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
            this.saveGame();
        },

        resetHeroSpecialization() {
            if ((this.state.resources.diamonds || 0) < 5) {
                this.showNotification('Necessário 5 Diamantes 💎 para redefinir a Especialização!');
                return;
            }
            if (!confirm('Deseja redefinir sua Especialização de Classe por 5 Diamantes 💎?')) return;
            this.state.resources.diamonds -= 5;
            this.state.hero.specialization = null;
            this.specializationModalOpen = true;
            this.recalcStats();
            this.showNotification('Especialização redefinida! Escolha seu novo caminho.');
            this.saveGame();
        },

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
        // TORRE DOS DESAFIOS (GDD v1.2: Pilar 3)
        // ==========================================

        startTowerFloor(floor) {
            const targetFloor = floor || this.state.tower?.floor || 1;
            const modifier = TOWER_MODIFIERS[(targetFloor - 1) % TOWER_MODIFIERS.length];
            const hp = Math.floor(40 * Math.pow(1.25, targetFloor));
            const dmg = Math.floor(15 * Math.pow(1.20, targetFloor));

            this.state.tower = {
                floor: targetFloor,
                maxFloor: Math.max(this.state.tower?.maxFloor || 1, targetFloor),
                inBattle: true,
                modifier: modifier.id,
                monster: {
                    name: `Guardião do Andar ${targetFloor}`,
                    icon: '🗿',
                    color: '#c084fc',
                    maxHp: hp,
                    hp: hp,
                    damage: dmg,
                    atkSpeed: 1.6,
                    atkTimer: 0,
                    isBoss: true,
                    isHit: false,
                    hitTimer: 0,
                    gold: Math.floor(50 * Math.pow(1.15, targetFloor)),
                    xp: Math.floor(100 * Math.pow(1.15, targetFloor)),
                },
            };

            this.state.monster = this.state.tower.monster;
            this.towerModalOpen = false;
            this.state.isExploring = true;
            this.switchTab('explore');
            this.addLog(`🗼 Entrou no Andar ${targetFloor} da Torre! Modificador: ${modifier.name}`, 'danger');
            this.showNotification(`Andar ${targetFloor}: ${modifier.name}`);
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
                    isBoss: true,
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
            this.state.monster = this.state.villageSiege.monster;
            this.state.isExploring = true;
            this.siegeModalOpen = false;
            this.switchTab('explore');
            this.addLog('⚔️ Herói engajou em combate direto contra o General Invasor!', 'danger');
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
            this.itemModalOpen     = true;
        },

        selectEquippedSlot(slot) {
            if (!this.state.equipment || !this.state.equipment[slot]) return;
            this.selectedEquippedSlot = slot;
            this.equippedModalOpen    = true;
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
            this.equippedModalOpen    = false;
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
            this.itemModalOpen     = false;
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
            this.itemModalOpen     = false;
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
            this.itemModalOpen     = false;
            this.selectedItemIndex = null;
        },

        // ---- CONTROLE DE DERROTA & COMBATE ----

        retreatFromDefeat() {
            this.defeatModalOpen   = false;
            this.state.isExploring = false;
            this.switchTab('city');
            this.showNotification('Recuou em segurança para a Cidade. O herói se recuperará com o tempo.');
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
                this.showNotification('Herói abatido! Aguarde a recuperação da vida.');
                this.addLog('Herói derrotado. Descanse na cidade para se recuperar antes de desafiar a torre.', 'danger');
                return;
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
                this.ctx   = this.canvas.getContext('2d');
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
                    // Respawn regen (5x mais rápida)
                    this.state.hero.hp += ((this.state.derived?.regen || 0.5) * 5) * dt;
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
            const sec = Math.min(elapsedSec, 3600); // Cap de 1 hora

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
                // Respawn regen
                const regenRate = ((this.state.derived?.regen || 0.5) * 5);
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

            const mins = Math.floor(sec / 60);
            const secs = Math.floor(sec % 60);
            if (mins > 0) {
                this.addLog(`⏰ Progresso offline de ${mins}m ${secs}s aplicado!`, 'level');
                this.showNotification(`⏰ ${mins}m ${secs}s de progresso offline!`);
            }

            this.saveGame();
        },


        _gameLoop(timestamp) {
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
                this.state.lifetimeStats = { kills: 0, bosses: 0, goldEarned: 0, itemsCrafted: 0, itemsUpgraded: 0, enchantmentsDone: 0, timePlayedSec: 0, highestTowerFloor: 1 };
            }
            this.state.lifetimeStats.timePlayedSec = (this.state.lifetimeStats.timePlayedSec || 0) + dt;

            // Salva timestamp para catch-up offline
            this.state.lastTickAt = Date.now();

            // Cooldown de habilidades ativas
            if (this.activeCooldownTimer > 0) {
                this.activeCooldownTimer = Math.max(0, this.activeCooldownTimer - dt);
            }
            if (this.healCooldownTimer > 0) {
                this.healCooldownTimer = Math.max(0, this.healCooldownTimer - dt);
            }

            // Recuperação / respawn
            if (this.state.hero.isDead) {
                this.state.hero.hp += (this.state.derived.regen * 5) * dt;
                this.respawnPercent = Math.min(100, Math.floor((this.state.hero.hp / this.state.derived.hpMax) * 100));
                // Respawn ao atingir HP cheio (100%)
                if (this.state.hero.hp >= this.state.derived.hpMax) {
                    this.state.hero.hp     = this.state.derived.hpMax;
                    this.state.hero.isDead = false;
                    this.addLog('Herói recuperado com HP máximo!', 'narrative');
                    // Reseta HP do monstro atual ao voltar
                    if (this.state.monster) {
                        this.state.monster.hp       = this.state.monster.maxHp;
                        this.state.monster.atkTimer  = 0;
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

                    // Animação de ataque do herói
                    if (result.heroAttacked) {
                        this.heroAttacking = true;
                        this.attackFlashMs = 200;
                        const f = makeHeroDmgFloat(this.canvas, result.dmgToMonster, result.isCritical);
                        if (f) this.pushCombatFloat(f);

                        if (this.state.audioEnabled) {
                            if (result.isCritical) playCritSlash(this.state.audioVolume);
                            else playSwordSlash(this.state.audioVolume);
                        }

                        if (!this.state.statsSession) {
                            this.state.statsSession = { startedAt: Date.now(), kills: 0, goldEarned: 0, xpEarned: 0, damageDealt: 0 };
                        }
                        this.state.statsSession.damageDealt += result.dmgToMonster;

                        let procDelay = 120;
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
                            this.heroIsHit  = true;
                            this.heroHitMs  = 180;
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
                        // Vitória de Cerco da Vila
                        if (this.state.villageSiege?.active && this.state.monster === this.state.villageSiege.monster) {
                            const vicRes = resolveSiegeVictory(this.state);
                            this.addLog(vicRes.msg, 'prestige');
                            this.showNotification('🏆 Invasão da Vila Repelida com Sucesso!');
                            if (this.state.audioEnabled) playLevelUpFanfare(this.state.audioVolume);
                        }

                        this._killMonster();
                    }

                    if (result.heroKilled) {
                        this.state.hero.isDead  = true;
                        this.state.isExploring  = false;
                        this.defeatModalOpen    = true;
                        if (this.state.audioEnabled) playDefeatTone(this.state.audioVolume);
                        this.addLog('Você foi derrotado em combate! Retorne à cidade para descansar.', 'danger');
                    }
                }

                // Processa Combate Roguelike Dedicado da Torre dos Desafios
                if (this.state.tower?.inBattle && this.state.tower.roomType === 'monster' && this.state.tower.monster) {
                    processTowerCombatTick(this.state, dt);
                }
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

            // Render
            renderCanvas(this.ctx, this.canvas, this.state, this.state.derived, this.floats, this.stars, timestamp, this.heroAttacking, this.heroIsHit);

            requestAnimationFrame(ts => this._gameLoop(ts));
        },
    };
}
