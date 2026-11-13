import {
    RARITIES, ITEM_TYPES, ITEM_MATERIALS,
    CRAFTING_RECIPES, ENCHANTMENT_TYPES,
    ASCENSION_PERKS, BAG_UPGRADES,
    RELIC_RECIPES, PET_EXPEDITIONS_CONFIG,
    ITEM_SETS, MARKET_TRADES, BLACK_MARKET_OFFERS,
    TAVERN_CONTRACT_TEMPLATES, getTreeEffects,
    PETS, PET_MAX_LEVEL, PET_TALENTS, getPetXpRequired,
} from './constants.js';
import { trackQuestProgress } from './quests.js';
import {
    calcAscensionAncestralReward, calcXpForLevel,
    calcBuildingCost, calcDomainUpgradeCost,
} from './formulas.js';

// ==========================================
// ECONOMIA — Construções, Loot, Ferreiro
// ==========================================

// ---- CONSTRUÇÕES & EXPANSÃO DO DOMÍNIO ----

export function getBuildingCost(buildings, id) {
    const b = buildings[id];
    if (!b) return 999999;
    return calcBuildingCost(b.baseCost, b.qty || 0);
}

export function buyBuilding(state, id) {
    if (!state.buildings[id] || (state.buildings[id].qty || 0) >= 10) return false;
    const cost = getBuildingCost(state.buildings, id);
    if (cost === Infinity || state.resources.gold < cost) return false;
    state.resources.gold -= cost;
    state.buildings[id].qty++;

    // Rastreia missão de gastar ouro
    trackQuestProgress(state, 'SPEND_GOLD', cost);

    return true;
}

export function getDomainFortificationCost(level = 0) {
    return calcDomainUpgradeCost(level);
}

export function upgradeDomain(state) {
    const lvl = state.domainLevel || 0;
    const cost = getDomainFortificationCost(lvl);
    if ((state.resources.wood || 0) < cost.wood || (state.resources.gold || 0) < cost.gold) {
        return false;
    }
    state.resources.wood = (state.resources.wood || 0) - cost.wood;
    state.resources.gold = (state.resources.gold || 0) - cost.gold;
    state.domainLevel = lvl + 1;
    trackQuestProgress(state, 'SPEND_GOLD', cost.gold);
    return true;
}

/**
 * Calcula a taxa de geração de ouro por segundo com todos os bônus ativos.
 */
export function calcGoldIncomeRate(state) {
    const b = state.buildings || {};
    let basePerSec = 0;
    for (const key in b) {
        basePerSec += (b[key].qty || 0) * (b[key].prod || 0);
    }

    // Fortificação do Domínio (+10% por nível) + Sinergia do Castelo Real (+5% por nível)
    const domainLvl  = state.domainLevel || 0;
    const castleQty  = b.castle?.qty || 0;
    const domainMult = (1 + (domainLvl * 0.10)) * (1 + (castleQty * 0.05));

    // Bônus do Oráculo (+50% se ativo)
    let oracleMult = 1.0;
    if (state.oracleBuff && state.oracleBuff.type === 'GOLD_FROM_BUILDINGS') {
        oracleMult = (state.oracleBuff.multiplier || 1.5);
    }

    // Habilidade Mãos de Ouro (+5% por nível) + Ascensão Cofre Ancestral (+15% por nível)
    const goldenHandsLvl = state.skills?.golden_hands?.level || 0;
    const ascGoldLvl     = state.ascension?.perks?.gold || 0;
    let skillMult = (1 + (goldenHandsLvl * 0.05)) * (1 + (ascGoldLvl * 0.15));

    // Conjunto Ouro do Ganancioso (4 peças: +25% de Ouro em monstros e edifícios)
    let greedyCount = 0;
    Object.values(state.equipment || {}).forEach(eq => {
        if (eq && eq.setId === 'greedy') greedyCount++;
    });
    if (greedyCount >= 4) skillMult *= 1.25;

    // Bônus de Descanso na Estalagem da Taverna (+35% produção se ativo)
    if (state.tavernRestBuff && state.tavernRestBuff.expiresAt > Date.now()) {
        skillMult *= 1.35;
    }

    // Bônus da Invasão da Vila (+50% se defendida nas últimas 24h)
    let siegeMult = 1.0;
    if (state.villageSiege?.buffExpiresAt && state.villageSiege.buffExpiresAt > Date.now()) {
        siegeMult = 1.5;
    }

    const totalPerSec = basePerSec * domainMult * oracleMult * skillMult * siegeMult;

    return {
        basePerSec,
        domainMult,
        domainLvl,
        oracleMult,
        skillMult,
        siegeMult,
        totalPerSec,
        totalPerMin: totalPerSec * 60,
    };
}

// Acumulador interno para recursos passivos do Domínio
let _domainResourceTimers = { wood: 0, scrap: 0, iron: 0, essence: 0 };

export function processBuildings(state, dt) {
    const rate = calcGoldIncomeRate(state);
    const goldGain = rate.totalPerSec * dt;
    state.resources.gold += goldGain;

    const b = state.buildings || {};
    // XP passivo da Biblioteca Arcana (+1.5 XP/s por nível)
    if ((b.library?.qty || 0) > 0 && state.hero && !state.hero.isDead) {
        state.hero.xp = (state.hero.xp || 0) + (b.library.qty * 1.5 * dt);
    }

    // Extração passiva de materiais pelas estruturas do Domínio (GDD Expansão 4.1 & 5.1)
    if ((b.sawmill?.qty || 0) > 0) {
        _domainResourceTimers.wood += dt * b.sawmill.qty;
        if (_domainResourceTimers.wood >= 20) {
            const gained = Math.floor(_domainResourceTimers.wood / 20);
            _domainResourceTimers.wood %= 20;
            state.resources.wood = (state.resources.wood || 0) + gained;
        }
    }
    if ((b.workshop?.qty || 0) > 0) {
        _domainResourceTimers.scrap += dt * b.workshop.qty;
        if (_domainResourceTimers.scrap >= 25) {
            const gained = Math.floor(_domainResourceTimers.scrap / 25);
            _domainResourceTimers.scrap %= 25;
            state.resources.scrap = (state.resources.scrap || 0) + gained;
        }
    }
    if ((b.mine?.qty || 0) > 0) {
        _domainResourceTimers.iron += dt * b.mine.qty;
        if (_domainResourceTimers.iron >= 30) {
            const gained = Math.floor(_domainResourceTimers.iron / 30);
            _domainResourceTimers.iron %= 30;
            state.resources.iron = (state.resources.iron || 0) + gained;
        }
    }
    if ((b.treasury?.qty || 0) > 0) {
        _domainResourceTimers.essence += dt * b.treasury.qty;
        if (_domainResourceTimers.essence >= 45) {
            const gained = Math.floor(_domainResourceTimers.essence / 45);
            _domainResourceTimers.essence %= 45;
            state.resources.essence = (state.resources.essence || 0) + gained;
        }
    }
}

// ---- MERCADO DINÂMICO (GDD: Seção 15) ----

export function checkMarketDailyReset(state) {
    const now = Date.now();
    const lastReset = state.marketLastReset || 0;
    // 24 horas = 86.400.000 ms
    if (now - lastReset >= 86400000) {
        state.marketPurchases = { wood: 0, scrap: 0, iron: 0, essence: 0 };
        state.marketLastReset = now;
        return true;
    }
    return false;
}

export function getMarketPrice(state, item) {
    if (!item) return 0;
    checkMarketDailyReset(state);
    const purchases = state.marketPurchases?.[item.id] || 0;
    // Escassez progressiva: cada compra aumenta a taxa de acréscimo
    // Compra 1: +5% | Compra 2: +12% | Compra 3: +21% | Compra 4: +32% | Compra 5: +45%...
    const scarcityPercent = (purchases * 0.05) + (purchases * (purchases - 1) * 0.01);
    return Math.floor(item.costGold * (1 + scarcityPercent));
}

export function buyMarketResource(state, item) {
    if (!item) return { ok: false, msg: 'Item inválido.' };
    checkMarketDailyReset(state);
    const cost = getMarketPrice(state, item);
    if ((state.resources.gold || 0) < cost) {
        return { ok: false, msg: `Ouro insuficiente! Necessário ${cost} 🪙` };
    }

    state.resources.gold -= cost;
    state.resources[item.id] = (state.resources[item.id] || 0) + item.qty;

    if (!state.marketPurchases) {
        state.marketPurchases = { wood: 0, scrap: 0, iron: 0, essence: 0 };
    }
    state.marketPurchases[item.id] = (state.marketPurchases[item.id] || 0) + 1;

    // Rastreia missões
    trackQuestProgress(state, 'SPEND_GOLD', cost);
    if (item.id === 'scrap') {
        trackQuestProgress(state, 'GATHER_MATERIALS', item.qty);
    }

    return {
        ok: true,
        msg: `Comprou +${item.qty} ${item.name}! (-${cost} Ouro)`,
        item,
    };
}

/**
 * Escambo de Materiais (GDD Expansão 4.2): troca recursos diretamente sem gastar diamantes.
 */
export function tradeMarketResources(state, tradeId) {
    const trade = MARKET_TRADES.find(t => t.id === tradeId);
    if (!trade) return { ok: false, msg: 'Troca inválida.' };

    const currentFrom = state.resources[trade.fromRes] || 0;
    if (currentFrom < trade.fromQty) {
        return { ok: false, msg: `${trade.fromName} insuficiente! Necessário ${trade.fromQty} ${trade.fromIcon}` };
    }

    state.resources[trade.fromRes] = currentFrom - trade.fromQty;
    state.resources[trade.toRes]   = (state.resources[trade.toRes] || 0) + trade.toQty;

    if (trade.toRes === 'scrap') {
        trackQuestProgress(state, 'GATHER_MATERIALS', trade.toQty);
    }

    return {
        ok: true,
        msg: `🤝 Escambo concluído: Trocou ${trade.fromQty} ${trade.fromName} por +${trade.toQty} ${trade.toName} ${trade.toIcon}!`,
    };
}

/**
 * Mercado Negro do Contrabandista (GDD Expansão 4.2): ofertas especiais usando Diamantes comuns.
 */
export function buyBlackMarketOffer(state, offerId) {
    const offer = BLACK_MARKET_OFFERS.find(o => o.id === offerId);
    if (!offer) return { ok: false, msg: 'Oferta inválida do Mercado Negro.' };

    if ((state.resources.diamond || 0) < offer.costDiamonds) {
        return { ok: false, msg: `Diamantes insuficientes! Necessário ${offer.costDiamonds} 💎` };
    }

    const maxSlots = state.inventoryMaxSlots || 20;
    if ((offer.id === 'bm_epic_chest' || offer.id === 'bm_set_reliquary') && (state.inventory || []).length >= maxSlots) {
        return { ok: false, msg: `Mochila cheia (${maxSlots}/${maxSlots})! Libere espaço antes de abrir a arca.` };
    }

    state.resources.diamond -= offer.costDiamonds;

    if (offer.id === 'bm_epic_chest' || offer.id === 'bm_set_reliquary') {
        const typeDef = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
        const isReliquary = offer.id === 'bm_set_reliquary';
        const rarityId = isReliquary
            ? (Math.random() < 0.75 ? 'legendary' : 'mythic')
            : (Math.random() < 0.70 ? 'epic' : 'legendary');
        const rarityDef = RARITIES.find(r => r.id === rarityId) || RARITIES[3];

        const setKeys = Object.keys(ITEM_SETS);
        const setId = (isReliquary || Math.random() < 0.50)
            ? setKeys[Math.floor(Math.random() * setKeys.length)]
            : null;

        const zoneScaled = Math.max(state.zone || 1, Math.floor((state.hero?.level || 1) / 4) + 1);
        const val = Math.max(4, Math.floor(typeDef.baseVal * rarityDef.mult * Math.pow(1.15, zoneScaled)));
        const item = {
            id:       Math.random().toString(36).substring(2, 9),
            name:     generateItemName(typeDef, rarityDef, setId),
            type:     typeDef.id,
            icon:     typeDef.icon,
            rarity:   rarityDef.id,
            color:    rarityDef.color,
            stat:     typeDef.stat,
            val:      val,
            price:    Math.floor(45 * rarityDef.mult * zoneScaled),
            level:    1,
            setId:    setId,
            isLocked: false,
        };
        state.inventory.push(item);
        return {
            ok: true,
            item,
            msg: `🕵️ Contrabando adquirido: [${item.name}] (+${val} ${typeDef.stat.toUpperCase()})!`,
        };
    }

    if (offer.id === 'bm_elixir_stats') {
        state.hero.statPoints = (state.hero.statPoints || 0) + 2;
        const xpGain = Math.floor((state.hero.nextXp || 100) * 0.50);
        state.hero.xp = (state.hero.xp || 0) + xpGain;
        return {
            ok: true,
            msg: `📖 Você absorveu o Tomo Proibido! Ganhou +2 Pontos de Atributo permanentes e +${xpGain} XP!`,
        };
    }

    if (offer.id === 'bm_war_chest') {
        state.resources.wood    = (state.resources.wood || 0) + 100;
        state.resources.iron    = (state.resources.iron || 0) + 50;
        state.resources.scrap   = (state.resources.scrap || 0) + 60;
        state.resources.essence = (state.resources.essence || 0) + 20;
        trackQuestProgress(state, 'GATHER_MATERIALS', 60);
        return {
            ok: true,
            msg: `📦 Carregamento de Guerra entregue: +100🌲 Madeira, +50🧱 Ferro, +60⚙️ Sucata e +20⚡ Essência!`,
        };
    }

    return { ok: false, msg: 'Oferta desconhecida.' };
}

// ---- ESTALAGEM & CONTRATOS DA TAVERNA (GDD Expansão 3.3) ----

export function getTavernRestCost(state) {
    const lvl = state.hero?.level || 1;
    return Math.max(80, Math.floor(lvl * 35));
}

export function restAtTavernInn(state) {
    const cost = getTavernRestCost(state);
    if ((state.resources.gold || 0) < cost) {
        return { ok: false, msg: `Ouro insuficiente para a Estalagem! Necessário ${cost} 🪙` };
    }

    state.resources.gold -= cost;
    trackQuestProgress(state, 'SPEND_GOLD', cost);

    // Cura imediatamente 100% HP, Energia e Mana e aplica buff de 15 minutos
    if (state.derived) {
        state.hero.hp     = state.derived.hpMax || 50;
        state.hero.energy = state.derived.energyMax || 30;
        state.hero.mana   = state.derived.manaMax || 30;
    }
    state.hero.isDead = false;
    state.hero.isRecovering = false;

    state.tavernRestBuff = {
        name: 'Banquete & Descanso do Javali',
        expiresAt: Date.now() + (15 * 60 * 1000), // 15 min
    };

    return {
        ok: true,
        msg: `🍺 Banquete servido! HP/Energia/Mana restaurados em 100% e Buff da Estalagem (+35% Ouro do Domínio, +35% Regen e +20% XP) ativo por 15 min!`,
    };
}

export function generateTavernContracts(state, force = false) {
    if (!force && Array.isArray(state.tavernContracts) && state.tavernContracts.length > 0) {
        return state.tavernContracts;
    }
    const zone = Math.max(1, state.zone || 1);
    const lvl  = Math.max(1, state.hero?.level || 1);
    const pool = [...TAVERN_CONTRACT_TEMPLATES].sort(() => Math.random() - 0.5).slice(0, 3);

    state.tavernContracts = pool.map(tpl => {
        const scale = 1 + (zone - 1) * 0.35;
        const reqQty = Math.max(5, Math.floor(tpl.baseQty * scale));
        const goldReward = Math.floor(reqQty * tpl.goldMult * (1 + lvl * 0.08));
        const xpReward   = Math.floor(reqQty * tpl.xpMult   * (1 + lvl * 0.10));
        return {
            id: Math.random().toString(36).substring(2, 9),
            tplId: tpl.id,
            title: tpl.title,
            npc: tpl.npc,
            icon: tpl.icon,
            color: tpl.color,
            desc: tpl.desc,
            resource: tpl.resource,
            resourceName: tpl.resourceName,
            reqQty,
            rewardGold: goldReward,
            rewardXp: xpReward,
            rewardDiamonds: tpl.diamonds || 1,
            completed: false,
        };
    });

    return state.tavernContracts;
}

export function completeTavernContract(state, contractIndex) {
    const contract = state.tavernContracts?.[contractIndex];
    if (!contract) return { ok: false, msg: 'Contrato não encontrado.' };
    if (contract.completed) return { ok: false, msg: 'Este contrato já foi entregue!' };

    const currentRes = state.resources[contract.resource] || 0;
    if (currentRes < contract.reqQty) {
        return { ok: false, msg: `${contract.resourceName} insuficiente! Necessário ${contract.reqQty} (você tem ${Math.floor(currentRes)}).` };
    }

    state.resources[contract.resource] = currentRes - contract.reqQty;
    state.resources.gold    = (state.resources.gold || 0) + contract.rewardGold;
    state.resources.diamond = (state.resources.diamond || 0) + contract.rewardDiamonds;
    state.hero.xp           = (state.hero.xp || 0) + contract.rewardXp;
    contract.completed      = true;

    trackQuestProgress(state, 'EARN_GOLD', contract.rewardGold);

    // Se todos os 3 contratos foram entregues, gera uma nova leva automaticamente!
    if (state.tavernContracts.every(c => c.completed)) {
        generateTavernContracts(state, true);
    }

    return {
        ok: true,
        msg: `📜 Contrato "${contract.title}" entregue! Recebeu +${contract.rewardGold} 🪙, +${contract.rewardXp} XP e +${contract.rewardDiamonds} 💎!`,
    };
}

// ---- LOOT ----

/**
 * Gera um nome de item procedural.
 * Ex: "Espada de Prata" / "Elmo Celestial" / "Amuleto do Vazio"
 */
function generateItemName(typeDef, rarityDef, setId = null) {
    const materials = ITEM_MATERIALS[rarityDef.id] || ITEM_MATERIALS.common;
    const material  = materials[Math.floor(Math.random() * materials.length)];
    let name = `${typeDef.name} ${material}`;
    if (setId && ITEM_SETS[setId]) {
        name += ` [${ITEM_SETS[setId].name.split(' ')[0]}]`;
    }
    return name;
}

/**
 * Tenta gerar um item de loot para o estado atual.
 * Retorna o item gerado, 'full' (se bolsa cheia) ou null se não dropar.
 */
export function generateLoot(state, monster = null) {
    const te = getTreeEffects(state);
    const ascDropLvl = state.ascension?.perks?.drop || 0;

    // Chance base de drop: 40% + bônus de Sorte + bônus de Bestiário (10 kills = +2%) + Ladrão das Sombras + Árvore + Ascensão
    let dropChance = 40;
    if (state.derived?.lck) {
        dropChance += (state.derived.lck - 1) * 0.5;
    }
    if (monster && (state.bestiary?.[monster.baseType] || 0) >= 10) {
        dropChance += 2;
    }
    if (state.hero?.specialization === 'shadow_thief') {
        dropChance += 10;
    }
    if (te.loot_boost) {
        dropChance += te.loot_boost * 5;
    }
    if (ascDropLvl > 0) {
        dropChance += ascDropLvl * 5;
    }
    if (monster?.affix) {
        dropChance += 25; // Monstros Campeões de Elite têm altíssima chance de equipamento
    }

    if (Math.random() * 100 > dropChance) return null;

    // Determina raridade (com impulso de Sorte, Árvore Ladino, Ascensão e Monstro Campeão)
    const luckShift = Math.min(25, ((state.derived?.lck || 1) - 1) * 0.25 + (te.loot_boost || 0) * 1.5 + ascDropLvl * 1.2 + (monster?.affix ? 5 : 0));
    const roll = Math.max(0, (Math.random() * 100) - luckShift);
    let accumulated = 0;
    let rarity = RARITIES[0];
    for (const r of [...RARITIES].reverse()) {
        accumulated += r.chance;
        if (roll <= accumulated) { rarity = r; break; }
    }

    // Determina tipo de item
    const typeDef = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];

    // Sorteia Conjunto para itens Raro+ (40% de chance)
    let setId = null;
    if (['rare', 'epic', 'legendary', 'mythic'].includes(rarity.id) && Math.random() < 0.40) {
        const setKeys = Object.keys(ITEM_SETS);
        setId = setKeys[Math.floor(Math.random() * setKeys.length)];
    }

    // Calcula valor base escalado pela zona e raridade
    const val = Math.max(1, Math.floor(typeDef.baseVal * rarity.mult * Math.pow(1.1, state.zone || 1)));

    const item = {
        id:       Math.random().toString(36).substring(2, 9),
        name:     generateItemName(typeDef, rarity, setId),
        type:     typeDef.id,
        icon:     typeDef.icon,
        rarity:   rarity.id,
        color:    rarity.color,
        stat:     typeDef.stat,
        val:      val,
        price:    Math.floor(10 * rarity.mult * (state.zone || 1)),
        level:    1,
        setId:    setId,
        isLocked: false,
    };

    const maxSlots = state.inventoryMaxSlots || 20;
    if (state.inventory.length >= maxSlots) {
        return { isOverflow: true, item };
    }

    return item;
}

// ---- FERREIRO / UPGRADE & FORJA (GDD: Seção 11) ----

export function getUpgradeCost(item) {
    if (!item) return { scrap: 0, ouro: 0, iron: 0 };
    const lvl = item.level || 1;
    const ironReq = lvl >= 5 ? Math.floor((lvl - 4) * 2) : 0;
    return {
        scrap: lvl * 2,
        ouro:  lvl * 12,
        iron:  ironReq,
    };
}

export function upgradeItem(state, slot) {
    const item = state.equipment[slot];
    if (!item) return false;
    const cost = getUpgradeCost(item);
    if (state.resources.gold  < cost.ouro)  return false;
    if ((state.resources.scrap || 0) < cost.scrap) return false;
    if ((state.resources.iron || 0) < (cost.iron || 0)) return false;

    state.resources.gold  -= cost.ouro;
    state.resources.scrap  = (state.resources.scrap || 0) - cost.scrap;
    if (cost.iron > 0) {
        state.resources.iron = (state.resources.iron || 0) - cost.iron;
    }

    if (!item.level) item.level = 1;
    item.level++;
    item.val = Math.ceil(item.val * 1.20) + 1;

    // Rastreia missões e estatísticas
    trackQuestProgress(state, 'SPEND_GOLD', cost.ouro);
    trackQuestProgress(state, 'UPGRADE_EQUIPMENT', 1);
    if (state.lifetimeStats) state.lifetimeStats.itemsUpgraded++;

    return true;
}

/**
 * Retorna o custo progressivo da forja (escala +20% por forja realizada)
 */
export function getForgeCost(state, recipe) {
    if (!recipe) return {};
    const forges = state.forgeCount || 0;
    const mult = 1 + (forges * 0.20);
    return {
        iron: Math.floor((recipe.cost.iron || 0) * mult),
        scrap: Math.floor((recipe.cost.scrap || 0) * mult),
        essence: Math.floor((recipe.cost.essence || 0) * mult),
        gold: Math.floor((recipe.cost.gold || 0) * mult),
        diamonds: recipe.cost.diamonds || 0,
        forgeCount: forges,
    };
}

/**
 * Forja Aleatória do Ferreiro (GDD: Seção 11)
 * Gera um equipamento procedural aleatório com qualidade nobre e custos progressivos.
 */
export function craftItem(state, recipeId) {
    const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { ok: false, msg: 'Receita de forja inválida.' };

    const maxSlots = state.inventoryMaxSlots || 20;
    if ((state.inventory || []).length >= maxSlots) {
        return { ok: false, msg: `Bolsa cheia (${maxSlots}/${maxSlots})! Libere espaço para forjar.` };
    }

    const cost = getForgeCost(state, recipe);
    if ((state.resources.iron || 0) < cost.iron) {
        return { ok: false, msg: `Minério de Ferro insuficiente! Necessário ${cost.iron} 🧱` };
    }
    if ((state.resources.scrap || 0) < cost.scrap) {
        return { ok: false, msg: `Sucata insuficiente! Necessário ${cost.scrap} ⚙️` };
    }
    if ((state.resources.essence || 0) < cost.essence) {
        return { ok: false, msg: `Essência Mágica insuficiente! Necessário ${cost.essence} ⚡` };
    }
    if ((state.resources.gold || 0) < cost.gold) {
        return { ok: false, msg: `Ouro insuficiente! Necessário ${cost.gold} 🪙` };
    }
    if (cost.diamonds > 0 && (state.resources.diamond || 0) < cost.diamonds) {
        return { ok: false, msg: `Diamantes insuficientes! Necessário ${cost.diamonds} 💎` };
    }

    // Dedução de custos
    state.resources.iron  = (state.resources.iron || 0) - cost.iron;
    state.resources.scrap = (state.resources.scrap || 0) - cost.scrap;
    state.resources.essence = (state.resources.essence || 0) - cost.essence;
    state.resources.gold  = (state.resources.gold || 0) - cost.gold;
    if (cost.diamonds > 0) {
        state.resources.diamond = (state.resources.diamond || 0) - cost.diamonds;
    }

    // Incrementa contador de forjas para escalonar preços
    state.forgeCount = (state.forgeCount || 0) + 1;

    // Sorteia o Slot de Equipamento aleatoriamente
    const typeDef = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];

    // Sorteia a Raridade dentre as possíveis da receita
    let selectedRarityId = recipe.possibleRarities[0];
    if (recipe.possibleRarities.length > 1) {
        const roll = Math.random();
        if (recipe.id === 'forge_steel') {
            selectedRarityId = roll < 0.70 ? 'rare' : 'epic';
        } else if (recipe.id === 'forge_master') {
            selectedRarityId = roll < 0.75 ? 'epic' : 'legendary';
        } else if (recipe.id === 'forge_mythic') {
            selectedRarityId = roll < 0.60 ? 'legendary' : 'mythic';
        }
    }
    const rarityDef = RARITIES.find(r => r.id === selectedRarityId) || RARITIES[2];

    // Sorteia Conjunto caso elegível
    let setId = null;
    if (recipe.setChance && Math.random() < recipe.setChance) {
        const setKeys = Object.keys(ITEM_SETS);
        setId = setKeys[Math.floor(Math.random() * setKeys.length)];
    }

    // Geração da peça forjada
    const zoneScaled = state.zone || 1;
    const val = Math.max(3, Math.floor(typeDef.baseVal * rarityDef.mult * Math.pow(1.15, zoneScaled)));
    const price = Math.floor(40 * rarityDef.mult * zoneScaled);

    const craftedItem = {
        id:          Math.random().toString(36).substring(2, 9),
        name:        generateItemName(typeDef, rarityDef, setId),
        type:        typeDef.id,
        icon:        typeDef.icon,
        rarity:      rarityDef.id,
        color:       rarityDef.color,
        stat:        typeDef.stat,
        val:         val,
        price:       price,
        level:       1,
        setId:       setId,
        isLocked:    false,
        enchantment: null,
    };

    state.inventory.push(craftedItem);

    // Rastreia missões e estatísticas
    trackQuestProgress(state, 'SPEND_GOLD', cost.gold);
    trackQuestProgress(state, 'FORGE_ITEMS', 1);
    if (state.lifetimeStats) state.lifetimeStats.itemsCrafted++;

    return {
        ok: true,
        item: craftedItem,
        msg: `⚔️ O Ferreiro bateu o martelo e forjou: [${craftedItem.name}] (+${val} ${typeDef.stat.toUpperCase()})!`,
    };
}

/**
 * Altar de Encantamentos (GDD: Seção 16)
 * Aplica uma infusão elemental ao equipamento ativo consumindo Essência Mágica e Ouro.
 */
export function enchantEquipment(state, slot, enchantId) {
    const item = state.equipment?.[slot];
    if (!item) return { ok: false, msg: 'Nenhum equipamento equipado neste slot.' };

    const enchant = ENCHANTMENT_TYPES.find(e => e.id === enchantId);
    if (!enchant) return { ok: false, msg: 'Encantamento inválido.' };

    const { essence = 0, gold = 0 } = enchant.cost;
    if ((state.resources.essence || 0) < essence) {
        return { ok: false, msg: `Essência Mágica insuficiente! Necessário ${essence} ⚡` };
    }
    if ((state.resources.gold || 0) < gold) {
        return { ok: false, msg: `Ouro insuficiente! Necessário ${gold} 🪙` };
    }

    state.resources.essence = (state.resources.essence || 0) - essence;
    state.resources.gold    = (state.resources.gold || 0) - gold;

    item.enchantment = {
        id:    enchant.id,
        name:  enchant.name,
        icon:  enchant.icon,
        color: enchant.color,
        desc:  enchant.desc,
    };

    trackQuestProgress(state, 'SPEND_GOLD', gold);
    trackQuestProgress(state, 'FORGE_ITEMS', 1);
    if (state.lifetimeStats) state.lifetimeStats.enchantmentsDone++;

    return {
        ok: true,
        msg: `✨ ${item.name} foi infundido com ${enchant.name}!`,
    };
}

/**
 * Redistribuição de Pontos de Atributo (GDD v1.2)
 * Custo: 5 Diamantes base + 5 por cada reset anterior.
 */
export function getStatResetCost(state) {
    return ((state.statResets || 0) + 1) * 5;
}

export function resetHeroStats(state) {
    const cost = getStatResetCost(state);
    if ((state.resources.diamond || 0) < cost) {
        return { ok: false, msg: `Diamantes insuficientes! Necessário ${cost} 💎` };
    }

    state.resources.diamond -= cost;
    state.statResets = (state.statResets || 0) + 1;

    // Reseta TODOS os atributos base para 1 (valor padrão do defaultState)
    state.baseStats = {
        hpMax: 50 + ((state.hero.level - 1) * 10), // HP base 50 + 10 por level up
        str: 1,
        def: 1,
        int: 1,
        agi: 1,
        lck: 1,
        per: 1,
        reg: 1,
        ene: 1,
        energyMax: 20,
        energyReg: 0.5,
        manaMax: 20,
        manaReg: 0.5,
    };

    // Devolve todos os pontos de atributo: 2/nível + 2 bônus a cada 10 níveis
    const lvl = state.hero.level;
    const milestoneBonus = Math.floor(lvl / 10) * 2;
    state.hero.statPoints = ((lvl - 1) * 2) + milestoneBonus;

    return {
        ok: true,
        msg: `✨ Atributos redistribuídos com sucesso! Você recebeu ${state.hero.statPoints} Pontos para realocar. (-${cost} 💎)`,
    };
}

// ---- DESMONTAGEM (GDD: Seção 10) ----
export function dismantleItem(state, inventoryIndex) {
    const item = state.inventory[inventoryIndex];
    if (!item) return null;

    if (item.isLocked) {
        return { error: 'locked', msg: 'Item protegido com cadeado! Desbloqueie-o para desmantelar.' };
    }

    let scraps = 0;
    let goldBonus = 0;
    const rarityScrap = {
        common:    [1, 2],
        uncommon:  [2, 4],
        rare:      [3, 6],
        epic:      [5, 10],
        legendary: [8, 15],
        mythic:    [12, 20],
    };
    const range = rarityScrap[item.rarity] || rarityScrap.common;
    scraps = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];

    // Bônus de ouro para raridades Raro+
    if (['rare','epic','legendary','mythic'].includes(item.rarity)) {
        goldBonus = Math.floor(item.price * 0.5);
    }

    state.inventory.splice(inventoryIndex, 1);
    state.resources.scrap  = (state.resources.scrap || 0) + scraps;
    state.resources.gold  += goldBonus;

    // Rastreia missões de coleta de sucata
    trackQuestProgress(state, 'GATHER_MATERIALS', scraps);

    return { item, scraps, goldBonus };
}

// ---- INVENTÁRIO ----

export function equipItem(state, inventoryIndex) {
    const item = state.inventory[inventoryIndex];
    if (!item) return null;
    state.inventory.splice(inventoryIndex, 1);
    const old = state.equipment[item.type];
    if (old) {
        old.isLocked = false;
        state.inventory.push(old);
    }
    item.isLocked = false;
    state.equipment[item.type] = item;
    return item;
}

export function unequipItem(state, slot) {
    if (!state.equipment || !state.equipment[slot]) {
        return { ok: false, msg: 'Nenhum equipamento neste slot.' };
    }
    const maxSlots = state.inventoryMaxSlots || 20;
    if ((state.inventory || []).length >= maxSlots) {
        return { ok: false, msg: `Bolsa cheia (${maxSlots}/${maxSlots})! Libere espaço para desequipar.` };
    }
    const item = state.equipment[slot];
    state.equipment[slot] = null;
    item.isLocked = false;
    state.inventory.push(item);
    return { ok: true, item };
}

export function sellItem(state, inventoryIndex) {
    const item = state.inventory[inventoryIndex];
    if (!item) return null;

    if (item.isLocked) {
        return { error: 'locked', msg: 'Item protegido com cadeado! Desbloqueie-o para vender.' };
    }

    const price = typeof item.price === 'number' ? item.price : 10;
    state.resources.gold = (state.resources.gold || 0) + price;
    state.inventory.splice(inventoryIndex, 1);

    return { ...item, price };
}

// ==========================================
// DROPS DE MATERIAIS EM COMBATE (GDD: Seção 13)
// ==========================================

/**
 * Drops de Materiais Brutos em Monstros
 * Garante que todos os recursos (Madeira, Ferro, Essência, Sucata) possam ser obtidos em combate.
 */
export function calcMonsterMaterialDrops(state, monster) {
    if (!monster) return [];
    const drops = [];
    const zone = state.zone || 1;
    const isBoss = monster.isBoss;
    const isElite = !!monster.affix;
    const te = getTreeEffects(state);
    const ascensionDropBonus = ((state.ascension?.perks?.drop || 0) * 0.10) + ((te.loot_boost || 0) * 0.05) + (isElite ? 0.25 : 0);

    // Multiplicador de Saque Duplo (Ascensão Toque de Midas + Monstro Acumulador)
    const doubleLootChance = ((state.ascension?.perks?.double_loot || 0) * 0.10) + (monster.affix?.id === 'hoarder' ? 0.60 : 0);
    const qtyMult = Math.random() < doubleLootChance ? 2 : 1;

    // 1. Madeira Nobre (Criaturas da floresta / comuns)
    const woodChance = 0.18 + ascensionDropBonus;
    if (Math.random() < woodChance) {
        const qty = (isBoss ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 2) + 1) * qtyMult;
        state.resources.wood = (state.resources.wood || 0) + qty;
        drops.push({ id: 'wood', name: 'Madeira Nobre', qty, icon: 'fa-tree', color: '#10b981' });
    }

    // 2. Minério de Ferro (Monstros rochosos/pesados/golems ou zonas 2+)
    const isRockMob = ['golem', 'orc', 'golem_pedra', 'esqueleto'].includes(monster.baseType);
    const ironChance = (isRockMob ? 0.35 : 0.12) + (zone >= 2 ? 0.05 : 0) + ascensionDropBonus;
    if (Math.random() < ironChance) {
        const qty = (isBoss ? Math.floor(Math.random() * 3) + 2 : (isRockMob ? Math.floor(Math.random() * 2) + 1 : 1)) * qtyMult;
        state.resources.iron = (state.resources.iron || 0) + qty;
        drops.push({ id: 'iron', name: 'Minério de Ferro', qty, icon: 'fa-cube', color: '#93c5fd' });
    }

    // 3. Essência Mágica (Monstros elementais/mágicos ou chefes ou zonas 3+)
    const isMagicMob = ['elemental', 'harpia', 'morcego'].includes(monster.baseType);
    const essenceChance = (isBoss ? 0.60 : (isMagicMob ? 0.25 : 0.08)) + (zone >= 3 ? 0.05 : 0) + ascensionDropBonus;
    if (Math.random() < essenceChance) {
        const qty = (isBoss ? Math.floor(Math.random() * 3) + 1 : 1) * qtyMult;
        state.resources.essence = (state.resources.essence || 0) + qty;
        drops.push({ id: 'essence', name: 'Essência Mágica', qty, icon: 'fa-bolt', color: '#c084fc' });
    }

    // 4. Sucata adicional (Monstros armados, elites ou chefes)
    if (isBoss || isElite || Math.random() < 0.15) {
        const qty = (isBoss ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 2) + 1) * qtyMult;
        state.resources.scrap = (state.resources.scrap || 0) + qty;
        trackQuestProgress(state, 'GATHER_MATERIALS', qty);
        drops.push({ id: 'scrap', name: 'Sucata', qty, icon: 'fa-cogs', color: '#9ca3af' });
    }

    return drops;
}

// ==========================================
// ASCENSÃO & PRESTÍGIO (GDD Expansão 1.4)
// ==========================================

export function calcAscensionReward(state) {
    const lvl = state.hero?.level || 1;
    if (lvl < 50) return 0;
    // GDD 1.5: floor((nível - 45) × 2 + zonaMáxima × 1)
    return calcAscensionAncestralReward(lvl, state.maxZone || 1);
}

export function performAscension(state) {
    const rewardAncestral = calcAscensionReward(state);
    if (rewardAncestral <= 0) return { ok: false, msg: 'Requer Nível 50 ou superior para Ascender!' };

    // Incrementa contagem de ascensão e Diamantes Ancestrais
    if (!state.ascension) {
        state.ascension = { count: 0, totalAncestralEarned: 0, perks: { dmg: 0, gold: 0, xp: 0, drop: 0 } };
    }
    state.ascension.count++;
    state.ascension.totalAncestralEarned = (state.ascension.totalAncestralEarned || 0) + rewardAncestral;
    state.resources.ancestralDiamonds = (state.resources.ancestralDiamonds || 0) + rewardAncestral;

    // ============================================================
    // RESET COMPLETO — "perde tudo, exceto o prestígio" (GDD 1.4)
    // ============================================================

    // 1. Herói: nível, XP, atributos, HP, energia, mana, pontos
    state.hero.level = 1;
    state.hero.xp = 0;
    state.hero.nextXp = calcXpForLevel(1);
    state.hero.hp = 50;
    state.hero.energy = 30;
    state.hero.mana = 30;
    state.hero.isDead = false;
    state.hero.isRecovering = false;
    state.hero.pe = 0;
    state.hero.statPoints = 0;
    state.hero.specialization = null;

    // 2. Atributos base
    state.baseStats = {
        hpMax: 50,
        str: 1, def: 1, int: 1, agi: 1, lck: 1,
        per: 1, reg: 1, ene: 1,
        energyMax: 20, energyReg: 0.5,
        manaMax: 20, manaReg: 0.5,
    };

    // 3. Recursos (todos resetam, exceto ancestralDiamonds)
    state.resources.gold = 0;
    state.resources.diamond = 0;
    state.resources.wood = 0;
    state.resources.scrap = 0;
    state.resources.iron = 0;
    state.resources.essence = 0;
    // state.resources.ancestralDiamonds — preservado!

    // 4. Equipamento e Inventário
    state.inventory = [];
    state.equipment = { weapon: null, shield: null, helmet: null, chest: null, legs: null, boots: null, ring: null, amulet: null };
    state.inventoryMaxSlots = 20;

    // 5. Domínio (fortificação e construções)
    state.domainLevel = 0;
    for (const b in state.buildings) {
        state.buildings[b].qty = 0;
    }

    // 6. Árvore de Habilidades (pontos e nós comprados)
    for (const s in state.skills) {
        state.skills[s].level = 0;
    }
    state.treeSkills = {};
    if (state.hero) {
        state.hero._treeSkills = {};
        state.hero.treePoints = 0;
    }

    // 7. Companheiros / Pets (resetam)
    state.pets = {
        tamerUnlocked: false,
        owned: [],
        active: null,
        levels: {},
        xp: {},
        talents: {},
        talentPoints: 0,
    };
    state.petExpeditions = [];

    // 8. Bestiário e marcos de abate (resetam — concedem bônus de dano/drop)
    state.bestiary = {};

    // 9. Missões em andamento
    state.quests = [];

    // 10. Progresso da Torre (maxFloor volta a 1)
    state.tower = {
        floor: 1, maxFloor: 1, inBattle: false,
        heroHp: 100, heroHpMax: 100, heroAtkTimer: 0,
        monster: null, modifier: null, eventRoom: null, logs: [],
    };

    // 11. Zona de exploração
    state.zone = 1;
    state.maxZone = 1;
    state.killsInZone = 0;
    state.totalKills = 0;
    state.bossSafeMode = false;

    // 12. Oráculo e outros
    state.oracleBuff = null;
    state.isExploring = false;
    state.monster = null;
    state.marketPurchases = { wood: 0, scrap: 0, iron: 0, essence: 0 };
    state.forgeCount = 0;
    state.statResets = 0;

    // 13. Cerco da Vila
    state.villageSiege = {
        active: false, timerSec: 180, endsAt: 0,
        monster: null, buffExpiresAt: 0, nextCheckAt: 0,
    };

    return {
        ok: true,
        ancestralDiamonds: rewardAncestral,
        msg: `✨ Ascensão realizada com glória! Você renasceu e obteve +${rewardAncestral} 💠 Diamantes Ancestrais!`,
    };
}

export function buyAscensionPerk(state, perkId) {
    if (!state.ascension) return false;
    const perkDef = ASCENSION_PERKS.find(p => p.id === perkId);
    if (!perkDef) return false;

    const currentLvl = state.ascension.perks[perkId] || 0;
    const cost = perkDef.cost + currentLvl; // custo escala com nível

    // GDD Expansão 1.4: Perks cobrados em Diamante Ancestral
    if ((state.resources.ancestralDiamonds || 0) < cost) return false;

    state.resources.ancestralDiamonds -= cost;
    state.ascension.perks[perkId] = currentLvl + 1;
    return true;
}

// ==========================================
// UPGRADE DA MOCHILA (GDD v1.2: Pilar 4)
// ==========================================

export function formatBagUpgradeCost(upgrade) {
    if (!upgrade || !upgrade.cost) return '';
    const parts = [];
    const cost = upgrade.cost;
    if (cost.gold) parts.push(`${cost.gold} 🪙`);
    if (cost.wood) parts.push(`${cost.wood} 🌲`);
    if (cost.iron) parts.push(`${cost.iron} 🧱`);
    if (cost.essence) parts.push(`${cost.essence} ⚡`);
    if (cost.diamonds) parts.push(`${cost.diamonds} 💎`);
    return parts.length > 0 ? `Custo: ${parts.join(', ')}` : 'Grátis';
}

export function getNextBagUpgrade(state) {
    const currentSlots = state.inventoryMaxSlots || 20;
    const next = BAG_UPGRADES.find(b => b.slots > currentSlots);
    if (!next) return null;
    return {
        ...next,
        costText: formatBagUpgradeCost(next)
    };
}

export function upgradeBag(state) {
    const next = getNextBagUpgrade(state);
    if (!next) return { ok: false, msg: 'Sua mochila já está na capacidade máxima (50 slots)!' };

    const cost = next.cost || {};
    if (cost.gold && (state.resources.gold || 0) < cost.gold) return { ok: false, msg: `Ouro insuficiente (${cost.gold} 🪙)` };
    if (cost.wood && (state.resources.wood || 0) < cost.wood) return { ok: false, msg: `Madeira Nobre insuficiente (${cost.wood} 🌲)` };
    if (cost.iron && (state.resources.iron || 0) < cost.iron) return { ok: false, msg: `Minério de Ferro insuficiente (${cost.iron} 🧱)` };
    if (cost.essence && (state.resources.essence || 0) < cost.essence) return { ok: false, msg: `Essência Mágica insuficiente (${cost.essence} ⚡)` };
    if (cost.diamonds && (state.resources.diamond || 0) < cost.diamonds) return { ok: false, msg: `Diamantes insuficientes (${cost.diamonds} 💎)` };

    if (cost.gold) state.resources.gold -= cost.gold;
    if (cost.wood) state.resources.wood -= cost.wood;
    if (cost.iron) state.resources.iron -= cost.iron;
    if (cost.essence) state.resources.essence -= cost.essence;
    if (cost.diamonds) state.resources.diamond -= cost.diamonds;

    state.inventoryMaxSlots = next.slots;
    return { ok: true, msg: `✨ Mochila aprimorada para ${next.name} (${next.slots} slots)!` };
}

// ==========================================
// FILTROS DE AUTO-LOOT (GDD v1.2: Pilar 4)
// ==========================================

export function applyAutoLootFilter(state, item) {
    if (!item || item.isLocked || item.isOverflow) return item;
    const f = state.autoLootFilter || {};
    if (!f.enabled) return item;

    // 1. Regra Inteligente: Preservar Upgrades
    if (f.saveUpgrades && state.equipment && item.type) {
        const equipped = state.equipment[item.type];
        const isUpgrade = !equipped || (typeof item.val === 'number' && typeof equipped.val === 'number' && item.val > equipped.val);
        if (isUpgrade) {
            return { ...item, protectedReason: 'upgrade' };
        }
    }

    // 2. Regra Inteligente: Preservar Peças de Conjunto (Sets)
    if (f.saveSets && item.setId) {
        return { ...item, protectedReason: 'set' };
    }

    const action = f[item.rarity];
    if (action === 'dismantle') {
        let scraps = 1;
        if (item.rarity === 'common') scraps = Math.floor(Math.random() * 2) + 1;
        else if (item.rarity === 'uncommon') scraps = Math.floor(Math.random() * 3) + 2;
        else if (item.rarity === 'rare') scraps = Math.floor(Math.random() * 4) + 4;
        else if (item.rarity === 'epic') scraps = Math.floor(Math.random() * 5) + 8;
        else if (item.rarity === 'legendary') scraps = Math.floor(Math.random() * 8) + 15;

        state.resources.scrap = (state.resources.scrap || 0) + scraps;
        return { autoAction: 'dismantled', msg: `Auto-desmontou ${item.name} (+${scraps} Sucata ⚙️)` };
    } else if (action === 'sell') {
        const gold = item.price || 5;
        state.resources.gold = (state.resources.gold || 0) + gold;
        return { autoAction: 'sold', msg: `Auto-vendeu ${item.name} (+${gold} Ouro 🪙)` };
    }

    return item;
}

// ==========================================
// EXPEDIÇÕES DE MASCOTES (GDD v1.2: Pilar 2)
// ==========================================

export function startPetExpedition(state, petId, zoneId, durationMinutes) {
    if (!state.pets?.owned?.includes(petId)) {
        return { ok: false, msg: 'Você não possui este mascote!' };
    }
    if (state.pets?.active === petId) {
        return { ok: false, msg: 'Este mascote está ativo no combate! Desequipe-o para enviar em expedição.' };
    }
    if (!state.petExpeditions) state.petExpeditions = [];

    const isAlreadyOnExpedition = state.petExpeditions.some(e => e.petId === petId);
    if (isAlreadyOnExpedition) {
        return { ok: false, msg: 'Este mascote já está em uma expedição!' };
    }

    const zoneCfg = PET_EXPEDITIONS_CONFIG[zoneId];
    if (!zoneCfg) return { ok: false, msg: 'Zona de expedição inválida!' };
    if ((state.zone || 1) < zoneCfg.zoneReq) {
        return { ok: false, msg: `Requer desbloquear a Zona ${zoneCfg.zoneReq}!` };
    }

    const durationDef = zoneCfg.durations.find(d => d.minutes === durationMinutes) || zoneCfg.durations[0];
    const windLvl = state.pets?.talents?.wind_wings || 0;
    const speedMult = Math.max(0.5, 1 - (windLvl * 0.08));
    const startedAt = Date.now();
    const expiresAt = startedAt + Math.floor(durationDef.minutes * 60 * 1000 * speedMult);

    const expedition = {
        id: Math.random().toString(36).substring(2, 9),
        petId,
        zoneId,
        durationMinutes: durationDef.minutes,
        startedAt,
        expiresAt,
        claimed: false,
    };

    state.petExpeditions.push(expedition);
    return { ok: true, msg: `🐾 Mascote enviado para ${zoneCfg.name} (${durationDef.desc}${windLvl > 0 ? ` · -${windLvl * 8}% tempo` : ''})!`, expedition };
}

export function claimPetExpedition(state, expIndex) {
    const exp = state.petExpeditions?.[expIndex];
    if (!exp) return { ok: false, msg: 'Expedição não encontrada.' };
    if (Date.now() < exp.expiresAt) {
        const remainingMin = Math.ceil((exp.expiresAt - Date.now()) / 60000);
        return { ok: false, msg: `Expedição ainda em andamento! (${remainingMin} min restantes)` };
    }

    const zoneCfg = PET_EXPEDITIONS_CONFIG[exp.zoneId];
    const durationDef = zoneCfg?.durations.find(d => d.minutes === exp.durationMinutes);
    const rewards = [];

    // Bônus da Keystone de Paladino Aura de Luz (+15%/nv) + Talento Faro de Caçador (+15%/nv)
    const te = getTreeEffects(state);
    const scentLvl = state.pets?.talents?.hunter_scent || 0;
    const auraBonus = (1 + ((te.aura_of_light || 0) * 0.15)) * (1 + (scentLvl * 0.15));

    if (durationDef) {
        if (durationDef.wood) {
            const raw = Math.floor(Math.random() * (durationDef.wood[1] - durationDef.wood[0] + 1)) + durationDef.wood[0];
            const qty = Math.max(1, Math.floor(raw * auraBonus));
            state.resources.wood = (state.resources.wood || 0) + qty;
            rewards.push(`+${qty} Madeira Nobre 🌲`);
        }
        if (durationDef.iron) {
            const raw = Math.floor(Math.random() * (durationDef.iron[1] - durationDef.iron[0] + 1)) + durationDef.iron[0];
            const qty = Math.max(1, Math.floor(raw * auraBonus));
            state.resources.iron = (state.resources.iron || 0) + qty;
            rewards.push(`+${qty} Minério de Ferro 🧱`);
        }
        if (durationDef.essence) {
            const raw = Math.floor(Math.random() * (durationDef.essence[1] - durationDef.essence[0] + 1)) + durationDef.essence[0];
            const qty = Math.max(1, Math.floor(raw * auraBonus));
            state.resources.essence = (state.resources.essence || 0) + qty;
            rewards.push(`+${qty} Essência Mágica ⚡`);
        }
        if (durationDef.scrap) {
            const raw = Math.floor(Math.random() * (durationDef.scrap[1] - durationDef.scrap[0] + 1)) + durationDef.scrap[0];
            const qty = Math.max(1, Math.floor(raw * auraBonus));
            state.resources.scrap = (state.resources.scrap || 0) + qty;
            trackQuestProgress(state, 'GATHER_MATERIALS', qty);
            rewards.push(`+${qty} Sucata ⚙️`);
        }
        if (durationDef.gold) {
            const raw = Math.floor(Math.random() * (durationDef.gold[1] - durationDef.gold[0] + 1)) + durationDef.gold[0];
            const qty = Math.max(1, Math.floor(raw * auraBonus));
            state.resources.gold = (state.resources.gold || 0) + qty;
            trackQuestProgress(state, 'EARN_GOLD', qty);
            rewards.push(`+${qty} Ouro 🪙`);
        }
        const dmReward = durationDef.diamonds || durationDef.gems || 0;
        if (dmReward > 0) {
            state.resources.diamond = (state.resources.diamond || 0) + dmReward;
            rewards.push(`+${dmReward} Diamantes 💎`);
        }
        if (durationDef.xp) {
            const xpGain = Math.floor(durationDef.xp * auraBonus);
            state.hero.xp += xpGain;
            rewards.push(`+${xpGain} XP`);
        }
    }

    // Concede +80 XP de Afinidade ao mascote que retornou da expedição
    const petXpRes = grantPetXp(state, exp.petId, 80);
    if (petXpRes?.leveledUp) {
        rewards.push(`🌟 Nv. ${petXpRes.newLevel} de Afinidade (+1 Ponto de Talento Bestial)`);
    } else {
        rewards.push(`+80 XP de Afinidade`);
    }

    state.petExpeditions.splice(expIndex, 1);
    return { ok: true, msg: `🎉 Recompensas da Expedição coletadas: ${rewards.join(', ')}!`, leveledUp: petXpRes?.leveledUp };
}

// ==========================================
// EVOLUÇÃO DE AFINIDADE & ÁRVORE DE TALENTOS DOS PETS
// ==========================================

export function grantPetXp(state, petId, amount = 15) {
    if (!petId || !state.pets?.owned?.includes(petId)) return null;
    if (!state.pets.levels) state.pets.levels = {};
    if (!state.pets.xp) state.pets.xp = {};
    if (typeof state.pets.talentPoints !== 'number') state.pets.talentPoints = 0;

    let lvl = state.pets.levels[petId] || 1;
    if (lvl >= PET_MAX_LEVEL) {
        state.pets.levels[petId] = PET_MAX_LEVEL;
        state.pets.xp[petId] = 0;
        return { leveledUp: false, newLevel: PET_MAX_LEVEL };
    }

    let xp = (state.pets.xp[petId] || 0) + amount;
    let leveledUp = false;

    while (lvl < PET_MAX_LEVEL && xp >= getPetXpRequired(lvl)) {
        xp -= getPetXpRequired(lvl);
        lvl++;
        leveledUp = true;
        state.pets.talentPoints = (state.pets.talentPoints || 0) + 1;
    }

    if (lvl >= PET_MAX_LEVEL) xp = 0;
    state.pets.levels[petId] = lvl;
    state.pets.xp[petId] = xp;

    const petDef = PETS.find(p => p.id === petId);
    return {
        leveledUp,
        newLevel: lvl,
        petName: petDef?.name || petId,
    };
}

export function getPetTrainCost(state, petId) {
    const lvl = state.pets?.levels?.[petId] || 1;
    return {
        gold: 500 * lvl,
        essence: 3 * lvl,
    };
}

export function trainPet(state, petId) {
    if (!state.pets?.owned?.includes(petId)) {
        return { ok: false, msg: 'Você ainda não adotou este mascote!' };
    }
    const lvl = state.pets?.levels?.[petId] || 1;
    if (lvl >= PET_MAX_LEVEL) {
        return { ok: false, msg: 'Este mascote já alcançou o Nível Máximo de Afinidade (Nv. 10)!' };
    }
    const cost = getPetTrainCost(state, petId);
    if ((state.resources.gold || 0) < cost.gold) {
        return { ok: false, msg: `Ouro insuficiente para treinar (${cost.gold} 🪙)!` };
    }
    if ((state.resources.essence || 0) < cost.essence) {
        return { ok: false, msg: `Essência Mágica insuficiente para treinar (${cost.essence} ⚡)!` };
    }

    state.resources.gold -= cost.gold;
    state.resources.essence -= cost.essence;
    trackQuestProgress(state, 'SPEND_GOLD', cost.gold);

    const res = grantPetXp(state, petId, 90);
    if (res?.leveledUp) {
        return {
            ok: true,
            leveledUp: true,
            msg: `🐾🌟 ${res.petName} subiu para o Nível ${res.newLevel} de Afinidade! (+15% eficiência e +1 Ponto de Talento Bestial!)`,
        };
    }
    return {
        ok: true,
        leveledUp: false,
        msg: `🍖 ${res?.petName || 'Mascote'} recebeu treinamento intensivo (+90 XP de Afinidade)!`,
    };
}

export function buyPetTalent(state, talentId) {
    const talentDef = PET_TALENTS.find(t => t.id === talentId);
    if (!talentDef) return { ok: false, msg: 'Talento bestial inválido.' };
    if (!state.pets.talents) state.pets.talents = {};

    const curLvl = state.pets.talents[talentId] || 0;
    if (curLvl >= talentDef.maxLevel) {
        return { ok: false, msg: `${talentDef.name} já está no nível máximo!` };
    }
    if ((state.pets.talentPoints || 0) < 1) {
        return { ok: false, msg: 'Pontos de Talento Bestial insuficientes! Evolua a afinidade dos seus mascotes.' };
    }

    state.pets.talentPoints -= 1;
    state.pets.talents[talentId] = curLvl + 1;

    return {
        ok: true,
        msg: `🧬 Talento Bestial "${talentDef.name}" evoluído para Nível ${curLvl + 1}!`,
    };
}

// ==========================================
// FORJA DE RELÍQUIAS MÍTICAS (GDD v1.2: Pilar 2)
// ==========================================

export function craftRelic(state, relicId) {
    const relic = RELIC_RECIPES.find(r => r.id === relicId);
    if (!relic) return { ok: false, msg: 'Receita de relíquia inválida.' };

    const kills = state.bestiary?.[relic.reqMob] || 0;
    if (kills < relic.reqKills) {
        return { ok: false, msg: `Requer ${relic.reqKills} abates de ${relic.reqMob} no Bestiário! (Atual: ${kills})` };
    }

    const cost = relic.cost;
    if ((state.resources.iron || 0) < cost.iron) return { ok: false, msg: `Minério de Ferro insuficiente (${cost.iron} 🧱)` };
    if ((state.resources.essence || 0) < cost.essence) return { ok: false, msg: `Essência Mágica insuficiente (${cost.essence} ⚡)` };
    if ((state.resources.scrap || 0) < cost.scrap) return { ok: false, msg: `Sucata insuficiente (${cost.scrap} ⚙️)` };
    if ((state.resources.gold || 0) < cost.gold) return { ok: false, msg: `Ouro insuficiente (${cost.gold} 🪙)` };

    const maxSlots = state.inventoryMaxSlots || 20;
    if (state.inventory.length >= maxSlots) {
        return { ok: false, msg: `Mochila cheia (${maxSlots}/${maxSlots})!` };
    }

    state.resources.iron -= cost.iron;
    state.resources.essence -= cost.essence;
    state.resources.scrap -= cost.scrap;
    state.resources.gold -= cost.gold;

    const item = {
        id:       Math.random().toString(36).substring(2, 9),
        relicId:  relic.id,
        name:     relic.name,
        type:     relic.slot,
        icon:     relic.icon,
        rarity:   'mythic',
        color:    relic.color,
        stat:     relic.slot === 'weapon' ? 'str' : (relic.slot === 'shield' ? 'def' : (relic.slot === 'chest' ? 'agi' : 'hpMax')),
        val:      relic.stats.str || relic.stats.def || relic.stats.agi || 50,
        price:    Math.floor(cost.gold * 0.8),
        level:    1,
        isLocked: true,
        desc:     relic.desc,
    };

    state.inventory.push(item);
    trackQuestProgress(state, 'SPEND_GOLD', cost.gold);
    trackQuestProgress(state, 'FORGE_ITEMS', 1);
    if (state.lifetimeStats) state.lifetimeStats.itemsCrafted++;
    return { ok: true, msg: `👑 Forjou com maestria a Relíquia Mítica: ${relic.name}!`, item };
}

// ==========================================
// INVASÃO DA VILA (GDD v1.2: Pilar 3)
// ==========================================

export function resolveSiegeVictory(state) {
    if (!state.villageSiege) state.villageSiege = {};
    state.villageSiege.active = false;
    state.villageSiege.buffExpiresAt = Date.now() + (24 * 3600 * 1000); // 24 Horas

    // Baú de Guerra da Vitória
    state.resources.gold += 500;
    state.resources.iron = (state.resources.iron || 0) + 15;
    state.resources.wood = (state.resources.wood || 0) + 10;

    return {
        ok: true,
        msg: '🏆 Vitória Gloriosa! A invasão foi repelida! O Domínio recebeu +50% de produção de Ouro por 24 horas e um Baú de Guerra (+500🪙, +15🧱, +10🌲)!',
    };
}

export function resolveSiegeDefeat(state) {
    if (!state.villageSiege) state.villageSiege = {};
    state.villageSiege.active = false;

    // Reduz níveis das construções em 50%
    for (const key in state.buildings) {
        if (state.buildings[key].qty > 1) {
            state.buildings[key].qty = Math.max(1, Math.floor(state.buildings[key].qty / 2));
        }
    }

    return {
        ok: false,
        msg: '💀 A Vila foi saqueada pelos monstros invasores! Todas as construções do Domínio tiveram seus níveis reduzidos pela metade!',
    };
}

