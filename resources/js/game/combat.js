import {
    MONSTER_BASE_TYPES,
    MONSTER_ADJECTIVES,
    MONSTER_ELEMENTS,
    MONSTER_AFFIXES,
    BOSS_PREFIXES,
    BOSS_SUFFIXES,
    TOWER_MODIFIERS,
    RARITIES,
    ITEM_TYPES,
    ITEM_MATERIALS,
    ITEM_SETS,
    WORLD_BOSSES,
    WORLD_BOSS_TIERS,
    WORLD_BOSS_DAILY_ATTEMPTS,
    WORLD_BOSS_EXTRA_COST_DIAMONDS,
    WORLD_BOSS_DURATION,
    getTreeEffects,
    getPetBonusMultiplier,
} from './constants.js';
import { trackQuestProgress } from './quests.js';
import {
    calcMonsterHp, calcMonsterDmg, calcBossHp, calcBossDmg,
    calcMonsterGold, calcBossGold, calcMonsterXp, calcBossXp,
    calcTowerRatio, calcTowerMonsterHp, calcTowerMonsterDmg,
    calcTowerGuardianHp, calcTowerGuardianDmg,
    calcTowerGuardianDef, calcTowerGuardianAtkSpeed,
} from './formulas.js';

// ==========================================
// GERAÇÃO DE MONSTROS
// ==========================================

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Retorna tipos de monstro válidos para a zona atual.
 */
function getTypesForZone(zone) {
    const valid = MONSTER_BASE_TYPES.filter(t => t.zones.includes(zone));
    return valid.length > 0 ? valid : MONSTER_BASE_TYPES.slice(0, 3);
}

/**
 * Gera um nome procedural para um monstro normal.
 * Formatos: "[Adjetivo] [Tipo]" ou "[Tipo] [Elemento]"
 */
function generateMonsterName(baseType) {
    const useElement = Math.random() < 0.4;
    if (useElement) {
        return `${baseType.name} ${pick(MONSTER_ELEMENTS)}`;
    }
    return `${pick(MONSTER_ADJECTIVES)} ${baseType.name}`;
}

/**
 * Gera um nome procedural para um boss.
 * Formato: "[Prefixo] [Sufixo]"
 */
function generateBossName() {
    return `${pick(BOSS_PREFIXES)} ${pick(BOSS_SUFFIXES)}`;
}

/**
 * Cria um monstro para a zona e killsInZone atual.
 * Se bossSafeMode estiver ativo, gera monstro comum para permitir farm.
 */
export function createMonster(zone, killsInZone, bossSafeMode = false) {
    const isBoss = killsInZone >= 9 && !bossSafeMode;

    if (isBoss) {
        const hp  = calcBossHp(zone);
        const dmg = calcBossDmg(zone);
        return {
            name:      generateBossName(),
            baseType:  'boss',
            icon:      '💀',
            color:     '#ef4444',
            maxHp:     hp,
            hp:        hp,
            damage:    dmg,
            atkSpeed:  2.0,
            atkTimer:  0,
            isBoss:    true,
            isHit:     false,
            hitTimer:  0,
            gold:      calcBossGold(zone),
            xp:        calcBossXp(zone),
        };
    }

    const baseType = pick(getTypesForZone(zone));
    let hp       = Math.floor(calcMonsterHp(zone) * baseType.hpMult);
    let dmg      = Math.floor(calcMonsterDmg(zone) * baseType.dmgMult);
    let gold     = calcMonsterGold(zone, baseType.hpMult);
    let xp       = calcMonsterXp(zone);
    let atkSpeed = 1.5;
    let affix    = null;
    let name     = generateMonsterName(baseType);

    // Chance de Monstro Campeão / Elite com Afixo a partir da Zona 2 (GDD: Seção 7)
    if (zone >= 2 && Math.random() < 0.18 && MONSTER_AFFIXES?.length > 0) {
        affix = pick(MONSTER_AFFIXES);
        hp    = Math.max(10, Math.floor(hp * affix.hpMult));
        dmg   = Math.max(2,  Math.floor(dmg * affix.dmgMult));
        gold  = Math.max(5,  Math.floor(gold * affix.rewardMult));
        xp    = Math.max(5,  Math.floor(xp * affix.rewardMult));
        if (affix.id === 'frenzy') atkSpeed = 1.05;
        name  = `★ ${name}`;
    }

    return {
        name,
        baseType: baseType.id,
        icon:     baseType.icon,
        color:    affix ? affix.color : baseType.color,
        maxHp:    hp,
        hp:       hp,
        damage:   dmg,
        atkSpeed,
        atkTimer: 0,
        isBoss:   false,
        isElite:  !!affix,
        affix,
        isHit:    false,
        hitTimer: 0,
        gold,
        xp,
    };
}

// ==========================================
// BÔNUS DE CONJUNTOS (GDD v1.2: Pilar 1)
// ==========================================

export function calcActiveSetBonuses(equipment = {}) {
    const setCounts = { protector: 0, storm: 0, greedy: 0 };
    for (const slot in equipment) {
        const item = equipment[slot];
        if (item && item.setId && setCounts[item.setId] !== undefined) {
            setCounts[item.setId]++;
        }
    }

    return {
        counts: setCounts,
        protector4: setCounts.protector >= 4,
        protector8: setCounts.protector >= 8,
        storm4:     setCounts.storm >= 4,
        storm8:     setCounts.storm >= 8,
        greedy4:    setCounts.greedy >= 4,
        greedy8:    setCounts.greedy >= 8,
    };
}

// ==========================================
// COMBATE
// ==========================================

/**
 * Calcula dano do herói (com variação de ±20% e bônus de Oráculo, Bestiário, Pets, Encantamentos, Ascensão, Especializações e Conjuntos).
 */
export function calcHeroDmg(derived, monster, bestiary = {}, oracleBuff = null, activePet = null, equipment = {}, ascension = null, hero = null) {
    let dmg = derived.str;

    // Efeitos da Árvore de Habilidades
    const te = (typeof getTreeEffects === 'function' && hero?._treeSkills)
        ? getTreeEffects({ hero, treeSkills: hero._treeSkills })
        : {};

    // Especialização: Berserker (+1% a +2% de dano a cada 2% de HP perdido)
    if (hero && hero.specialization === 'berserker' && derived.hpMax > 0) {
        const missingHpRatio = Math.max(0, 1 - ((hero.hp || 0) / derived.hpMax));
        const furyScaling = 0.5 * (1 + (te.fury_dmg || 0) * 0.35);
        dmg = Math.floor(dmg * (1 + missingHpRatio * furyScaling));
    }

    // Sede de Sangue (Berserker Keystone): +5% de dano por abate acumulado (máx 10 stacks)
    if (hero && (hero.bloodlustStacks || 0) > 0) {
        dmg = Math.floor(dmg * (1 + hero.bloodlustStacks * 0.05));
    }

    // Bônus de Conjunto: Tempestade Primordial (4 peças: +15% dano crítico / velocidade)
    const setBonuses = calcActiveSetBonuses(equipment);

    // Bônus permanente de Ascensão (Linhagem dos Deuses: +10% dano/nível)
    if (ascension?.perks?.dmg) {
        dmg = Math.floor(dmg * (1 + ascension.perks.dmg * 0.10));
    }

    // Bônus de bestiário progressivo (GDD: Seção 20)
    if (monster) {
        const kills = bestiary[monster.baseType] || 0;
        if (kills >= 100) {
            dmg = Math.floor(dmg * 1.15); // +15% em 100 kills
        } else if (kills >= 50) {
            dmg = Math.floor(dmg * 1.05); // +5% em 50 kills
        }
    }

    // Bônus do Oráculo (Bênção da Guerra: +25% Dano Base)
    if (oracleBuff && oracleBuff.type === 'ATTACK_BONUS') {
        dmg = Math.floor(dmg * (oracleBuff.multiplier || 1.25));
    }

    let baseDmg = Math.max(1, Math.floor(dmg * (0.8 + Math.random() * 0.4)));

    // Chance de Acerto Crítico (Base 5% + Percepção + Sorte + Encantamento Raio + Ascensão + Árvore)
    const weaponEnchant = equipment?.weapon?.enchantment?.id;
    let critChance = 5 + ((derived.per || 1) - 1) * 1.5 + ((derived.lck || 1) - 1) * 0.5;
    if (weaponEnchant === 'lightning') critChance += 20;
    if (ascension?.perks?.crit_master) critChance += ascension.perks.crit_master * 3;
    if (te.master_thief)               critChance += te.master_thief * 6;
    critChance = Math.min(75, critChance);

    let isCritical = false;
    if (Math.random() * 100 < critChance) {
        const critMult = 1.75 + (setBonuses.storm4 ? 0.35 : 0) + ((ascension?.perks?.crit_master || 0) * 0.15);
        baseDmg = Math.floor(baseDmg * critMult);
        isCritical = true;
    }

    // Relíquia Mítica: Manto Eólico da Harpia (10% chance de golpe duplo)
    let doubleStrike = false;
    if (equipment?.chest?.relicId === 'relic_chest' && Math.random() < 0.10) {
        baseDmg *= 2;
        doubleStrike = true;
    }

    return { dmg: baseDmg, isCritical, doubleStrike, setBonuses };
}

/**
 * Calcula as recompensas de XP e Ouro ao derrotar um monstro,
 * aplicando bônus de Oráculo, Pets, Habilidades passivas, Ascensão e Conjuntos.
 */
export function calcKillRewards(monster, state) {
    let gold = monster.gold || 1;
    let xp   = monster.xp   || 1;

    const setBonuses = calcActiveSetBonuses(state.equipment || {});

    // Bônus de Habilidade Passiva (Mãos de Ouro) + Sinergia do Empório Comercial do Domínio
    const goldenHandsLvl = state.skills?.golden_hands?.level || 0;
    const marketBldQty   = state.buildings?.market?.qty || 0;
    if (goldenHandsLvl > 0 || marketBldQty > 0) {
        gold = Math.floor(gold * (1 + goldenHandsLvl * 0.05 + marketBldQty * 0.02));
    }

    // Bônus de Conjunto: Ouro do Ganancioso (4 peças: +25% Ouro)
    if (setBonuses.greedy4) {
        gold = Math.floor(gold * 1.25);
    }

    // Bônus de Companheiro / Pet (Todos os Pets adotados + Nível de Afinidade + Instinto Alfa + Faro de Caçador)
    const ratMult = getPetBonusMultiplier(state, 'rato_ladrao');
    const scentLvl = state.pets?.talents?.hunter_scent || 0;
    if (ratMult > 0 || scentLvl > 0) {
        gold = Math.floor(gold * (1 + (0.20 * ratMult) + (scentLvl * 0.06)));
    }
    const owlMult = getPetBonusMultiplier(state, 'coruja');
    if (owlMult > 0) {
        xp = Math.floor(xp * (1 + 0.15 * owlMult));
    }

    // Bônus permanente de Ascensão (Cofre Ancestral: +15% Ouro / Mente Iluminada: +20% XP)
    if (state.ascension?.perks?.gold) {
        gold = Math.floor(gold * (1 + state.ascension.perks.gold * 0.15));
    }
    if (state.ascension?.perks?.xp) {
        xp = Math.floor(xp * (1 + state.ascension.perks.xp * 0.20));
    }

    // Bônus de Descanso na Estalagem da Taverna (+20% XP em combate)
    if (state.tavernRestBuff && state.tavernRestBuff.expiresAt > Date.now()) {
        xp = Math.floor(xp * 1.20);
    }

    // Bônus do Oráculo (Bênção da Sabedoria: 2x XP)
    if (state.oracleBuff && state.oracleBuff.type === 'XP_FROM_MONSTERS') {
        xp = Math.floor(xp * (state.oracleBuff.multiplier || 2.0));
    }

    // Bônus de Conjunto: 8 peças Ouro do Ganancioso (10% chance de duplicar tudo)
    let isDoubleLoot = false;
    if (setBonuses.greedy8 && Math.random() < 0.10) {
        gold *= 2;
        xp   *= 2;
        isDoubleLoot = true;
    }

    // Bônus da Árvore — Mão Leve & Saqueador (Ladrão thf_p3: +30%/nível ouro)
    const te = getTreeEffects(state);
    if (te.master_thief) {
        gold = Math.floor(gold * (1 + te.master_thief * 0.30));
    } else if (te.loot_boost) {
        gold = Math.floor(gold * (1 + te.loot_boost * 0.15));
    }

    return { gold, xp, isDoubleLoot };
}

/**
 * Processa um tick de combate. Retorna evento com { type, value, killed, heroKilled, elementalEffect, ... }.
 */
export function processCombatTick(dt, hero, monster, derived, bestiary = {}, oracleBuff = null, activePet = null, equipment = {}, ascension = null, towerModifier = null) {
    const result = {
        heroAttacked: false,
        monsterAttacked: false,
        dmgToMonster: 0,
        dmgToHero: 0,
        killed: false,
        heroKilled: false,
        isCritical: false,
        elementalType: null,
        vampiricHeal: 0,
        chainLightning: false,
        arcaneBlast: false,
        reflectedDmg: 0,
        paladinHeal: 0,
        sacredBarrierActivated: false,
        dodged: false,
    };

    const setBonuses = calcActiveSetBonuses(equipment);

    // Efeitos da Árvore de Habilidades (disponíveis para ataque do herói e reação do monstro)
    const te = (typeof getTreeEffects === 'function' && hero._treeSkills)
        ? getTreeEffects({ hero, treeSkills: hero._treeSkills })
        : {};

    // Ajuste de velocidade de ataque do herói (Bônus Tempestade 4 peças: +10% vel)
    let heroAtkSpeed = derived.atkSpeed;
    if (setBonuses.storm4) {
        heroAtkSpeed = Math.max(0.5, heroAtkSpeed * 0.90);
    }

    // Modificador de Torre: Pés Ligeiros (monstro 2x vel)
    let monsterAtkSpeed = monster.atkSpeed;
    if (towerModifier === 'frenzy') {
        monsterAtkSpeed = Math.max(0.4, monsterAtkSpeed * 0.5);
    }
    // War Cry (Berserker): reduz vel de ataque do monstro por tempo limitado
    if (monster.warCryReduction) {
        const reduction = Math.min(0.9, monster.warCryReduction);
        monsterAtkSpeed = monsterAtkSpeed / (1 - reduction);
    }

    // Herói ataca
    if (!hero.atkTimer) hero.atkTimer = 0;
    hero.atkTimer += dt;
    if (hero.atkTimer >= heroAtkSpeed && monster.hp > 0) {
        hero.atkTimer = 0;
        result.heroAttacked = true;
        const heroAttack = calcHeroDmg(derived, monster, bestiary, oracleBuff, activePet, equipment, ascension, hero);
        result.dmgToMonster = heroAttack.dmg;
        result.isCritical   = heroAttack.isCritical;

        // fury_dmg: +8%/nível de dano quando HP < 50%
        if (te.fury_dmg && hero.hp < derived.hpMax * 0.5) {
            result.dmgToMonster = Math.floor(result.dmgToMonster * (1 + te.fury_dmg * 0.08));
        }
        // armor_pierce (Mago): ignora % da armadura já aplicada — aplica bônus de dano extra
        if (te.armor_pierce) {
            result.dmgToMonster = Math.floor(result.dmgToMonster * (1 + te.armor_pierce * 0.10));
        }
        // armor_ignore (Ladrão no Ataque Concentrado) — não se aplica aqui, só no ativo

        // Especialização: Mago Arcano (Explosão Arcana aprimorada pela Árvore)
        if (hero.specialization === 'arcane_mage' && (hero.mana || 0) >= 5) {
            hero.mana -= 5;
            const blastMult = 0.30 + (te.arcane_blast_boost || 0) * 0.15;
            const magicBlast = Math.max(1, Math.floor(result.dmgToMonster * blastMult));
            result.dmgToMonster += magicBlast;
            result.arcaneBlast = true;
        }

        // Sobrecarga de Mana (Mago Arcano): chance de recuperar 15 de mana no ataque
        if (te.mana_overload && Math.random() < te.mana_overload * 0.10) {
            hero.mana = Math.min(derived.manaMax, (hero.mana || 0) + 15);
        }

        // Bônus de Conjunto: 8 peças Tempestade Primordial (25% chance de descarga elétrica instantânea)
        if (setBonuses.storm8 && Math.random() < 0.25) {
            result.chainLightning = true;
            result.dmgToMonster = Math.floor(result.dmgToMonster * 2);
        }

        // Processa encantamentos na arma/armadura
        const weaponEnchant = equipment?.weapon?.enchantment?.id;

        // Modificador de Torre: Vórtice Elemental (Danos elementais 3x)
        const elemMult = (towerModifier === 'elements') ? 3 : 1;

        // Fogo: Dano elemental adicional
        if (weaponEnchant === 'fire') {
            const fireBonus = Math.max(1, Math.floor(result.dmgToMonster * 0.25 * elemMult));
            result.dmgToMonster += fireBonus;
            result.elementalType = 'fire';
        } else if (weaponEnchant === 'lightning' && heroAttack.isCritical) {
            result.elementalType = 'lightning';
        } else if (weaponEnchant === 'ice') {
            result.elementalType = 'ice';
            monster.atkTimer = Math.max(0, monster.atkTimer - (0.3 * elemMult));
        } else if (weaponEnchant === 'vampiric') {
            result.elementalType = 'vampiric';
            result.vampiricHeal  = Math.max(1, Math.floor(result.dmgToMonster * 0.15 * elemMult));
            hero.hp = Math.min(derived.hpMax, (hero.hp || 0) + result.vampiricHeal);
        }

        // Modificador de Torre: Carapaça de Ferro (monstro reduz dano físico em 40%)
        if (towerModifier === 'armored') {
            result.dmgToMonster = Math.max(1, Math.floor(result.dmgToMonster * 0.6));
        }

        // lifesteal (Árvore Berserker): drena % do dano como HP
        if (te.lifesteal) {
            const steal = Math.floor(result.dmgToMonster * te.lifesteal * 0.05);
            if (steal > 0) hero.hp = Math.min(derived.hpMax, (hero.hp || 0) + steal);
        }

        // poison_chance (Árvore Ladrão): chance de envenenar monstro
        if (te.poison_chance && !monster.poisoned && Math.random() < te.poison_chance * 0.15) {
            monster.poisoned = true;
            monster.poisonTicks = 5;
            monster.poisonTimer = 0;
        }

        // Relíquia Mítica: Lâmina Dentada de Kobold (Sangramento constante de 3% HP máx/golpe)
        if (equipment?.weapon?.relicId === 'relic_blade') {
            const bleedDmg = Math.max(2, Math.floor((monster.maxHp || 30) * 0.03));
            result.dmgToMonster += bleedDmg;
            result.bleedDmg = bleedDmg;
        }

        // Mascote Ativo auxilia no Combate de Exploração! (GDD Expansão 3.1 + Afinidade & Talentos Bestiais)
        if (activePet) {
            const auraMult = 1 + ((te.aura_of_light || 0) * 0.20);
            const petLvl = hero._pets?.levels?.[activePet] || 1;
            const petTalents = hero._pets?.talents || {};
            const lvlMult = 1 + (petLvl - 1) * 0.20;
            const fangsMult = 1 + (petTalents.sharp_fangs || 0) * 0.25;
            const roarMult = (monster.isBoss || monster.isElite) ? (1 + (petTalents.primordial_roar || 0) * 0.40) : 1.0;
            const isPetCrit = Math.random() * 100 < ((petTalents.sharp_fangs || 0) * 5);
            const critMult = isPetCrit ? 1.8 : 1.0;
            const petDmg = Math.max(1, Math.floor((derived.str || 5) * 0.22 * auraMult * lvlMult * fangsMult * roarMult * critMult));
            result.petDmg = petDmg;
            result.dmgToMonster += petDmg;

            // Talento Vínculo Vital: cada ataque do Pet restaura 1.5%/nv do HP Máximo do Herói
            if ((petTalents.vital_bond || 0) > 0) {
                const bondHeal = Math.max(1, Math.floor(derived.hpMax * (petTalents.vital_bond * 0.015)));
                hero.hp = Math.min(derived.hpMax, (hero.hp || 0) + bondHeal);
                result.petHeal = bondHeal;
            }
        }

        // Monstro Elite Espinhoso: reflete 8% do dano recebido (não-letal)
        if (monster.affix?.id === 'thorns' && hero.divineShieldTimer <= 0) {
            const thornDmg = Math.max(1, Math.floor(result.dmgToMonster * 0.08));
            hero.hp = Math.max(1, (hero.hp || 1) - thornDmg);
            result.thornDmg = thornDmg;
        }

        monster.hp -= result.dmgToMonster;
        monster.isHit = true;
        monster.hitTimer = 0.2;
        if (monster.hp <= 0) {
            result.killed = true;
            // Sede de Sangue: abate acumula stacks de dano e cura HP
            if (te.bloodlust_kill_stack) {
                hero.bloodlustStacks = Math.min((hero.bloodlustStacks || 0) + 1, 10);
                hero.hp = Math.min(derived.hpMax, (hero.hp || 0) + Math.floor(derived.hpMax * 0.05));
            }
        }
    }

    if (result.killed) return result;

    // Monstro ataca
    monster.atkTimer += dt;
    if (monster.atkTimer >= monsterAtkSpeed && hero.hp > 0) {
        monster.atkTimer = 0;
        result.monsterAttacked = true;

        // Especialização: Ladrão das Sombras (Dobra chance de esquiva - máx 45%)
        const dodgeChance = hero.specialization === 'shadow_thief'
            ? Math.min(0.45, (derived.agi * 0.01) * 2)
            : Math.min(0.25, derived.agi * 0.005);

        // Imunidade do Escudo Divino (Paladino Ativo)
        if (hero.divineShieldTimer > 0) {
            result.dodged = true;
            result.dmgToHero = 0;
            result.divineShieldImmune = true;
        } else if (Math.random() < dodgeChance) {
            result.dodged = true;
            result.dmgToHero = 0;

            // Reflexos Assassinos (Ladrão): contra-ataque instantâneo + 15 de energia!
            if (te.assassin_counter) {
                result.assassinCounter = true;
                result.counterDmg = Math.max(1, Math.floor(derived.str * (0.5 + te.assassin_counter * 0.25)));
                monster.hp -= result.counterDmg;
                monster.isHit = true;
                monster.hitTimer = 0.2;
                hero.energy = Math.min(derived.energyMax, (hero.energy || 0) + 15);
                if (monster.hp <= 0) result.killed = true;
            }
        } else {
            // Cálculo de armadura (Protetor 4 peças: +15% armadura)
            const effectiveDef = setBonuses.protector4 ? derived.def * 1.15 : derived.def;
            result.dmgToHero = Math.max(1, Math.floor(monster.damage - effectiveDef * 0.5));

            // Relíquia Mítica: Escudo de Placas de Golem (reduz dano de chefes em 20%)
            if (monster.isBoss && equipment?.shield?.relicId === 'relic_shield') {
                result.dmgToHero = Math.max(1, Math.floor(result.dmgToHero * 0.80));
            }

            // Monstro Elite Vampírico: regenera HP ao atacar
            if (monster.affix?.id === 'vampiric' && monster.hp > 0) {
                const vampAmt = Math.max(1, Math.floor(result.dmgToHero * 0.25));
                monster.hp = Math.min(monster.maxHp, monster.hp + vampAmt);
            }

            // Barreira Sagrada ativa (absorve dano antes do HP)
            if ((hero._barrierShield || 0) > 0) {
                const absorbed = Math.min(hero._barrierShield, result.dmgToHero);
                hero._barrierShield -= absorbed;
                result.dmgToHero -= absorbed;
                if (result.dmgToHero < 0) result.dmgToHero = 0;
            }

            // Especialização: Paladino (Cura do dano recebido e reflete Dano Verdadeiro)
            if (hero.specialization === 'paladin') {
                const healPct = 0.03 + (te.retaliation_boost || 0) * 0.02;
                const reflectPct = 0.10 + (te.retaliation_boost || 0) * 0.05;
                result.paladinHeal = Math.max(1, Math.floor(result.dmgToHero * healPct));
                hero.hp = Math.min(derived.hpMax, (hero.hp || 0) + result.paladinHeal);

                result.reflectedDmg = Math.max(1, Math.floor(result.dmgToHero * reflectPct));
                monster.hp -= result.reflectedDmg;
                if (monster.hp <= 0) result.killed = true;
            }

            hero.hp -= result.dmgToHero;

            // Bônus de Conjunto: 8 peças Protetor de Idleton (Barreira Sagrada 30% HP ao sofrer dano letal)
            if (hero.hp <= 0 && setBonuses.protector8 && (!hero.barrierCooldown || hero.barrierCooldown <= 0)) {
                hero.hp = Math.floor(derived.hpMax * 0.30);
                hero.barrierCooldown = 120; // 120 segundos de recarga
                result.sacredBarrierActivated = true;
            } else if (hero.hp <= 0) {
                hero.hp = 0;
                hero.bloodlustStacks = 0; // Perde stacks de Sede de Sangue ao morrer
                result.heroKilled = true;
            }
        }
    }

    // Veneno do Ladrão: processa ticks de dano reais (Emboscada Letal / Passiva)
    if (monster.poisoned && monster.poisonTicks > 0 && monster.hp > 0) {
        monster.poisonTimer = (monster.poisonTimer || 0) + dt;
        if (monster.poisonTimer >= 1) {
            monster.poisonTimer -= 1;
            monster.poisonTicks--;
            const pDmg = monster.poisonDmg || Math.max(2, Math.floor((derived.str || 5) * 0.20));
            monster.hp -= pDmg;
            result.dmgToMonster += pDmg;
            result.poisonTickDmg = pDmg;
            if (monster.poisonTicks <= 0) monster.poisoned = false;
            if (monster.hp <= 0) {
                monster.hp = 0;
                result.killed = true;
            }
        }
    }

    // Decai cooldown da barreira sagrada (conjunto Protetor)
    if (hero.barrierCooldown > 0) {
        hero.barrierCooldown -= dt;
    }

    // Decai timer de hit do monstro
    if (monster.hitTimer > 0) {
        monster.hitTimer -= dt;
        if (monster.hitTimer <= 0) {
            monster.isHit = false;
            monster.hitTimer = 0;
        }
    }

    return result;
}

// ==========================================
// MOTOR ROGUELIKE DA TORRE DOS DESAFIOS (GDD v1.2: Pilar 3)
// ==========================================

const TOWER_BOSS_NAMES = [
    'Guardião Abissal', 'Colosso das Sombras', 'Titã de Obsidiana',
    'Esfinge Arcano', 'Arauto do Caos', 'Soberano do Vazio',
    'Dragão do Apocalipse', 'Monarca Espectral', 'Lorde Demoníaco', 'Deus Caído',
];

const TOWER_MINION_NAMES = [
    'Espectro das Sombras', 'Sentinela de Cristal', 'Gárgula de Obsidiana',
    'Autômato Arcano', 'Guerreiro Abissal', 'Lacaio do Caos',
    'Cultista Cósmico', 'Elemental de Éter', 'Horror das Profundezas',
];

const TOWER_ICONS = ['👑', '🐉', '👹', '👿', '💀', '🪐', '⚡', '🗿'];
const TOWER_MINION_ICONS = ['👾', '🦇', '🕷️', '🐺', '🧟', '💀', '🛡️', '🗡️'];

/**
 * Hash simples e determinístico baseado no andar para selecionar modificador.
 * Garante que o mesmo andar sempre terá o mesmo modificador, mas sem ciclo previsível.
 */
function towerFloorHash(floor) {
    let h = floor * 2654435761; // Knuth multiplicative hash
    h = ((h >>> 16) ^ h) * 0x45d9f3b;
    h = ((h >>> 16) ^ h);
    return Math.abs(h);
}

/**
 * Retorna o modificador cósmico para o andar.
 */
export function getTowerFloorModifier(floor) {
    const modIndex = towerFloorHash(floor) % TOWER_MODIFIERS.length;
    return TOWER_MODIFIERS[modIndex];
}

/**
 * Retorna a intensidade de um modificador escalada pelo andar.
 */
export function getTowerModifierIntensity(modifier, floor) {
    if (!modifier) return 0;
    const base = modifier.baseValue || 0;
    const scale = modifier.scalePerFloor || 0;
    const cap = modifier.cap || base;
    return Math.min(cap, base + (floor * scale));
}

/**
 * Gera um monstro da Torre de acordo com o andar e índice (1 a 5).
 * GDD Expansão 1.2: Cada andar possui 5 monstros, sendo o 5º o "Boss" do andar.
 */
export function generateTowerMonster(floor, monsterIndex = 1) {
    const modifier = getTowerFloorModifier(floor);
    const isBoss = monsterIndex >= 5;

    if (!isBoss) {
        // Monstros Comuns da Torre (1 a 4)
        const nameIdx = Math.abs((floor * 3) + monsterIndex) % TOWER_MINION_NAMES.length;
        const name = `${TOWER_MINION_NAMES[nameIdx]} (Andar ${floor} · ${monsterIndex}/5)`;
        const icon = TOWER_MINION_ICONS[(floor + monsterIndex) % TOWER_MINION_ICONS.length];
        const hp = calcTowerMonsterHp(floor);
        const damage = calcTowerMonsterDmg(floor);
        const def = Math.floor(2 + (floor * 1.5));
        const atkSpeed = 1.6;

        return {
            name,
            icon,
            floor,
            monsterIndex,
            isBoss: false,
            hp,
            maxHp: hp,
            damage,
            baseDamage: damage,
            def,
            atkSpeed,
            atkTimer: 0,
            isHit: false,
            hitTimer: 0,
            modifier,
            rewards: {
                gold: Math.floor(60 * floor * 1.2),
                xp: Math.floor(40 * floor * 1.2),
            },
            combatTime: 0,
        };
    }

    // 5º Monstro: Chefe / Guardião do Andar
    const nameIndex = (floor - 1) % TOWER_BOSS_NAMES.length;
    const name = `${TOWER_BOSS_NAMES[nameIndex]} (Chefe · Andar ${floor})`;
    const icon = TOWER_ICONS[(floor - 1) % TOWER_ICONS.length];
    const hp = calcTowerGuardianHp(floor);
    const damage = calcTowerGuardianDmg(floor);
    const def = calcTowerGuardianDef(floor);
    const atkSpeed = calcTowerGuardianAtkSpeed(floor);

    const rewards = {
        gold: Math.floor(350 * floor * 1.25),
        diamonds: floor % 5 === 0 ? 5 : 1,
        essence: Math.floor(floor / 3) + 1,
        xp: Math.floor(150 * floor * 1.5),
    };

    return {
        name,
        icon,
        floor,
        monsterIndex: 5,
        isBoss: true,
        hp,
        maxHp: hp,
        damage,
        baseDamage: damage,
        def,
        atkSpeed,
        atkTimer: 0,
        isHit: false,
        hitTimer: 0,
        modifier,
        rewards,
        combatTime: 0,
    };
}

export function generateTowerGuardian(floor) {
    return generateTowerMonster(floor, 5);
}

export function generateTowerEventRoom(floor) {
    const types = ['puzzle', 'chest', 'curse'];
    const type = types[(floor - 1) % types.length];

    if (type === 'puzzle') {
        return {
            type: 'puzzle',
            title: '🧩 O Enigma da Esfinge Astral',
            desc: 'Uma esfinge de cristal surge diante de você exigindo um teste de sabedoria ou determinação para conceder passagens e bênçãos.',
            choices: [
                {
                    text: 'Canalizar Conhecimento Arcano (Requer Sabedoria)',
                    icon: 'fa-brain',
                    tip: 'Concede +40% de Ataque para a luta do Guardião.',
                    action: 'buff_atk',
                },
                {
                    text: 'Meditar e Focar Energias Cósmicas',
                    icon: 'fa-heart',
                    tip: 'Restaura 100% da Vida na Torre.',
                    action: 'heal_full',
                },
                {
                    text: 'Ignorar o Enigma e avançar direto',
                    icon: 'fa-forward',
                    tip: 'Segue diretamente para o combate sem bônus.',
                    action: 'skip',
                },
            ],
        };
    } else if (type === 'chest') {
        return {
            type: 'chest',
            title: '📦 O Baú Misterioso do Abismo',
            desc: 'Um baú ornamental com runas pulsantes repousa no centro da câmara. Ele pode conter tesouros ou uma armadilha!',
            choices: [
                {
                    text: 'Abrir o Baú com Audácia',
                    icon: 'fa-gem',
                    tip: '75% de chance de tesouro de Ouro e Diamantes, ou emboscada.',
                    action: 'open_chest',
                },
                {
                    text: 'Desarmar Feitiços com Cautela',
                    icon: 'fa-hand',
                    tip: 'Recebe +1 Essência Mágica com segurança.',
                    action: 'safe_essence',
                },
                {
                    text: 'Não arriscar e seguir em frente',
                    icon: 'fa-shield-halved',
                    tip: 'Avança diretamente para a luta.',
                    action: 'skip',
                },
            ],
        };
    } else {
        return {
            type: 'curse',
            title: '🩸 O Altar do Sacrifício Cósmico',
            desc: 'Um altar sombrio sussurra promessas de poder em troca de vitalidade terrena.',
            choices: [
                {
                    text: 'Pacto de Sangue (-30% HP atual)',
                    icon: 'fa-skull',
                    tip: 'Sacrifica 30% do HP para dobrar seu dano (+100% ATK)!',
                    action: 'blood_pact',
                },
                {
                    text: 'Purificar o Altar (Gasta 1 Essência)',
                    icon: 'fa-wand-magic-sparkles',
                    tip: 'Purifica as trevas e recebe uma bênção protetora.',
                    action: 'purify',
                },
                {
                    text: 'Recusar o Pacto Profano',
                    icon: 'fa-ban',
                    tip: 'Segue seu caminho inalterado.',
                    action: 'skip',
                },
            ],
        };
    }
}

export function startTowerRun(state, floor = 1) {
    if (!state.tower) {
        state.tower = { floor: 1, maxFloor: 1, inBattle: false, logs: [] };
    }

    // Herói pode desafiar a torre a partir de 50% de HP se estiver em recuperação
    const minHp = (state.derived?.hpMax || 100) * 0.5;
    if (state.hero.isDead) {
        if ((state.hero.hp || 0) >= minHp) {
            state.hero.isDead = false;
        } else {
            return false;
        }
    } else if ((state.hero.hp || 0) <= 0) {
        return false;
    }

    // Exclusividade mútua: pausa a exploração
    state.isExploring = false;

    const currentFloor = Math.max(1, Math.min(state.tower.maxFloor || 1, floor));
    state.tower.floor = currentFloor;
    state.tower.inBattle = true;
    state.tower.isVictory = false;
    state.tower.isDefeat = false;
    state.tower.heroAtkTimer = 0;
    state.tower.heroDmgMult = 1.0;
    state.tower.logs = [];
    state.tower.monsterIndex = 1;

    // Andares especiais com salas de evento a cada 3 andares (exceto no andar 1)
    if (currentFloor > 1 && currentFloor % 3 === 2) {
        state.tower.roomType = 'event';
        state.tower.eventRoom = generateTowerEventRoom(currentFloor);
        state.tower.monster = null;
        state.tower.logs.push(`🏛️ Você adentrou o Andar ${currentFloor}. Um evento misterioso se revela!`);
    } else {
        state.tower.roomType = 'monster';
        state.tower.eventRoom = null;
        state.tower.monster = generateTowerMonster(currentFloor, 1);
        state.tower.modifier = state.tower.monster.modifier;
        state.tower.logs.push(`🗼 Entrou no Andar ${currentFloor} da Torre! Modificador: ${state.tower.modifier?.name || 'Nenhum'}`);
        state.tower.logs.push(`⚔️ Monstro 1/5 (${state.tower.monster.name}) bloqueia sua passagem!`);
    }
    return true;
}

export function resolveTowerEventChoice(state, choiceIndex) {
    if (!state.tower || !state.tower.eventRoom) return;
    const choice = state.tower.eventRoom.choices?.[choiceIndex];
    if (!choice) return;

    if (choice.action === 'buff_atk') {
        state.tower.heroDmgMult = (state.tower.heroDmgMult || 1.0) * 1.40;
        state.tower.logs.push('✨ Sabedoria canalizada! Você ganhou +40% de dano para este andar.');
    } else if (choice.action === 'heal_full') {
        state.hero.hp = state.derived?.hpMax || 100;
        state.tower.logs.push('💚 Você meditou profundamente e restaurou todo o seu HP!');
    } else if (choice.action === 'open_chest') {
        if (Math.random() < 0.75) {
            const gold = state.tower.floor * 500;
            const dia = 2;
            state.resources.gold = (state.resources.gold || 0) + gold;
            state.resources.diamond = (state.resources.diamond || 0) + dia;
            state.tower.logs.push(`🎉 Baú aberto com sucesso! Você encontrou +${gold} 🪙 e +${dia} 💎!`);
        } else {
            state.hero.hp = Math.max(1, Math.floor((state.hero.hp || 1) * 0.75));
            state.tower.logs.push('⚠️ Uma armadilha mágica explodiu ao abrir o baú! Você perdeu 25% de vida.');
        }
    } else if (choice.action === 'safe_essence') {
        state.resources.essence = (state.resources.essence || 0) + 1;
        state.tower.logs.push('⚡ Você desarmou o feitiço com segurança e extraiu +1 Essência Mágica!');
    } else if (choice.action === 'blood_pact') {
        state.hero.hp = Math.max(1, Math.floor((state.hero.hp || 1) * 0.70));
        state.tower.heroDmgMult = (state.tower.heroDmgMult || 1.0) * 2.0;
        state.tower.logs.push('🩸 Pacto de sangue selado! Você perdeu 30% do HP, mas seu dano dobrou (+100%)!');
    } else if (choice.action === 'purify') {
        if ((state.resources.essence || 0) >= 1) {
            state.resources.essence -= 1;
            state.hero.hp = state.derived?.hpMax || 100;
            state.tower.heroDmgMult = (state.tower.heroDmgMult || 1.0) * 1.25;
            state.tower.logs.push('✨ Altar purificado com 1 Essência! HP restaurado e +25% de dano concedido.');
        } else {
            state.tower.logs.push('Você não possuía essência suficiente para purificar o altar.');
        }
    } else {
        state.tower.logs.push('Você ignorou o altar e marchou para a sala do Guardião.');
    }

    // Transiciona para a batalha com o monstro 1 do andar
    state.tower.roomType = 'monster';
    state.tower.eventRoom = null;
    state.tower.monsterIndex = 1;
    state.tower.monster = generateTowerMonster(state.tower.floor, 1);
    state.tower.modifier = state.tower.monster.modifier;
    state.tower.logs.push(`⚔️ Monstro 1/5 (${state.tower.monster.name}) bloqueia a saída!`);
}

/**
 * Processa a derrota de um monstro na Torre dos Desafios.
 * GDD Expansão 1.2: Cada andar possui 5 monstros, sendo o 5º o "Boss" do andar.
 * Derrotar monstros 1 a 4 avança para o próximo. Derrotar o 5º conquista o andar.
 */
export function handleTowerMonsterKill(state) {
    const t = state.tower;
    if (!t || !t.monster) return { finished: false };

    const m = t.monster;
    m.hp = 0;

    const r = m.rewards || {};
    state.resources.gold = (state.resources.gold || 0) + (r.gold || 0);
    if (r.xp) {
        state.hero.xp = (state.hero.xp || 0) + r.xp;
    }

    // Se for monstro comum (1 a 4), avança para o próximo monstro da torre
    if (!m.isBoss && (t.monsterIndex || 1) < 5) {
        t.logs.unshift(`💀 ${m.name} derrotado! (+${r.gold || 0} 🪙, +${r.xp || 0} XP)`);
        t.monsterIndex = (t.monsterIndex || 1) + 1;
        t.monster = generateTowerMonster(t.floor, t.monsterIndex);
        t.monster.modifier = t.modifier;

        if (t.monsterIndex === 5) {
            t.logs.unshift(`👑 ALERTA: O Guardião do Andar ${t.floor} (${t.monster.name}) despertou!`);
        } else {
            t.logs.unshift(`⚔️ Monstro ${t.monsterIndex}/5 (${t.monster.name}) avança para o combate!`);
        }
        return { finished: false, advanced: true, monster: t.monster };
    }

    // Se for o 5º monstro (Chefe), VITÓRIA COMPLETA DO ANDAR!
    t.inBattle = false;
    t.isVictory = true;

    state.resources.diamond = (state.resources.diamond || 0) + (r.diamonds || 0);
    state.resources.essence = (state.resources.essence || 0) + (r.essence || 0);

    if (t.floor >= (t.maxFloor || 1)) {
        t.maxFloor = Math.min(100, t.floor + 1);
    }
    if (!state.lifetimeStats) state.lifetimeStats = {};
    state.lifetimeStats.highestTowerFloor = Math.max(state.lifetimeStats.highestTowerFloor || 1, t.floor);
    state.lifetimeStats.bosses = (state.lifetimeStats.bosses || 0) + 1;
    trackQuestProgress(state, 'CLEAR_TOWER', 1);

    t.logs.unshift(`🏆 VITÓRIA! Você conquistou o Andar ${t.floor}! Recompensas: +${r.gold || 0} 🪙, +${r.diamonds || 0} 💎, +${r.essence || 0} ⚡!`);
    return { finished: true, victory: true };
}

export function processTowerCombatTick(state, dt) {
    if (!state.tower || !state.tower.inBattle || state.tower.roomType !== 'monster' || !state.tower.monster) {
        return;
    }

    const t = state.tower;
    const m = t.monster;
    const hero = state.hero;
    const derived = state.derived || {};
    const modId = t.modifier?.id;
    const floor = t.floor || 1;
    const modIntensity = getTowerModifierIntensity(t.modifier, floor);

    // Rastreia tempo de combate (para Fúria Crescente)
    m.combatTime = (m.combatTime || 0) + dt;

    // Se o herói estiver morto ou sem HP, encerra combate e define derrota
    if (hero.isDead || (hero.hp || 0) <= 0) {
        hero.hp = 0;
        hero.isDead = true;
        t.inBattle = false;
        t.monster = null;
        t.isDefeat = true;
        t.logs.unshift(`💀 Você foi derrotado no Andar ${t.floor}!`);
        return;
    }

    const setBonuses = calcActiveSetBonuses(state.equipment || {});

    // ==== MODIFICADORES PASSIVOS (tick-based) ====

    // Modificador: Regeneração Sombria (guardião regenera HP/s)
    if (modId === 'regen' && m.hp > 0 && m.hp < m.maxHp) {
        const regenAmt = Math.max(1, Math.floor(m.maxHp * modIntensity * dt));
        m.hp = Math.min(m.maxHp, m.hp + regenAmt);
    }

    // Modificador: Decomposição (herói perde HP/s passivamente)
    if (modId === 'wither' && (hero.hp || 0) > 0) {
        const witherDmg = Math.max(1, Math.floor((derived.hpMax || 100) * modIntensity * dt));
        hero.hp = Math.max(1, (hero.hp || 0) - witherDmg);
    }

    // ==== VELOCIDADES ====

    let heroAtkSpeed = derived.atkSpeed || 1.5;
    if (setBonuses.storm4) {
        heroAtkSpeed = Math.max(0.4, heroAtkSpeed * 0.90);
    }
    // Modificador: Gravidade Cósmica (herói ataca mais lento)
    if (modId === 'gravity') {
        heroAtkSpeed = Math.max(0.5, heroAtkSpeed * (1 + modIntensity));
    }

    let monsterAtkSpeed = m.atkSpeed || 2.0;
    // Modificador: Pés Ligeiros (inimigo mais rápido)
    if (modId === 'frenzy') {
        monsterAtkSpeed = Math.max(0.4, monsterAtkSpeed * (1 - modIntensity));
    }

    let monsterDmg = m.baseDamage || m.damage || 20;
    // Modificador: Fúria Crescente (guardião ganha dano por segundo vivo)
    if (modId === 'berserk') {
        monsterDmg = Math.floor(monsterDmg * (1 + modIntensity * m.combatTime));
    }
    // Modificador: Amplificação Cósmica (guardião causa mais dano base)
    if (modId === 'amplify') {
        monsterDmg = Math.floor(monsterDmg * (1 + modIntensity));
    }

    // ATAQUE DO HERÓI
    t.heroAtkTimer = (t.heroAtkTimer || 0) + dt;
    if (t.heroAtkTimer >= heroAtkSpeed && m.hp > 0 && (hero.hp || 0) > 0) {
        t.heroAtkTimer = 0;

        const heroAttack = calcHeroDmg(derived, m, state.bestiary || {}, state.oracleBuff, state.pets?.active, state.equipment || {}, state.ascension, hero);
        let dmg = heroAttack.dmg;

        // Amplificador do andar / evento
        dmg = Math.floor(dmg * (t.heroDmgMult || 1.0));

        // Mago Arcano
        if (hero.specialization === 'arcane_mage' && (hero.mana || 0) >= 5) {
            hero.mana -= 5;
            const magicBlast = Math.max(1, Math.floor(dmg * 0.40));
            dmg += magicBlast;
            t.logs.unshift(`🔮 Explosão Arcana causou +${magicBlast} de dano mágico!`);
        }

        // Tempestade Primordial 8 peças
        if (setBonuses.storm8 && Math.random() < 0.25) {
            dmg = Math.floor(dmg * 2);
            t.logs.unshift('⚡ Descarga Elétrica Primordial duplicou seu ataque!');
        }

        // Encantamento Vampírico
        const weaponEnchant = state.equipment?.weapon?.enchantment?.id;
        const elemMult = (modId === 'elements') ? modIntensity : 1;
        if (weaponEnchant === 'vampiric') {
            const vHeal = Math.max(1, Math.floor(dmg * 0.15 * elemMult));
            hero.hp = Math.min(derived.hpMax, (hero.hp || 0) + vHeal);
            t.logs.unshift(`🩸 Drenagem Vampírica restaurou +${vHeal} HP!`);
        } else if (weaponEnchant === 'fire') {
            dmg += Math.max(1, Math.floor(dmg * 0.25 * elemMult));
        }

        // Modificador: Carapaça de Ferro (reduz dano do herói)
        if (modId === 'armored') {
            dmg = Math.max(1, Math.floor(dmg * (1 - modIntensity)));
        }

        m.hp -= dmg;
        m.isHit = true;
        m.hitTimer = 0.2;

        if (heroAttack.isCritical) {
            t.logs.unshift(`💥 Golpe Crítico! Você causou ${dmg} de dano no ${m.name}!`);
        } else {
            t.logs.unshift(`⚔️ Você atingiu ${m.name} por ${dmg} de dano.`);
        }

        // Modificador: Espinhos Profanos (guardião reflete dano de volta)
        if (modId === 'thorns') {
            const reflectDmg = Math.max(1, Math.floor(dmg * modIntensity));
            hero.hp = Math.max(1, (hero.hp || 0) - reflectDmg);
            t.logs.unshift(`🌿 Espinhos Profanos refletiram ${reflectDmg} de dano em você!`);
        }

        // Mascote Ativo (com bônus da Keystone de Paladino Aura de Luz + Afinidade & Talentos Bestiais)
        if (state.pets?.active) {
            const activePet = state.pets.active;
            const te = getTreeEffects(state);
            const auraMult = 1 + ((te.aura_of_light || 0) * 0.20);
            const petLvl = state.pets?.levels?.[activePet] || 1;
            const petTalents = state.pets?.talents || {};
            const lvlMult = 1 + (petLvl - 1) * 0.20;
            const fangsMult = 1 + (petTalents.sharp_fangs || 0) * 0.25;
            const roarMult = (t.monsterIndex === 5 || m.isBoss) ? (1 + (petTalents.primordial_roar || 0) * 0.40) : 1.0;
            const isPetCrit = Math.random() * 100 < ((petTalents.sharp_fangs || 0) * 5);
            const petDmg = Math.max(1, Math.floor((derived.str || 10) * 0.25 * auraMult * lvlMult * fangsMult * roarMult * (isPetCrit ? 1.8 : 1.0)));
            m.hp -= petDmg;

            if ((petTalents.vital_bond || 0) > 0 && modId !== 'curse') {
                const bondHeal = Math.max(1, Math.floor(derived.hpMax * (petTalents.vital_bond * 0.015)));
                hero.hp = Math.min(derived.hpMax, (hero.hp || 0) + bondHeal);
            }
        }

        // Derrota do monstro (comum avança wave, chefe ganha andar)
        if (m.hp <= 0) {
            handleTowerMonsterKill(state);
            return;
        }
    }

    // ATAQUE DO GUARDIÃO
    m.atkTimer = (m.atkTimer || 0) + dt;
    if (m.atkTimer >= monsterAtkSpeed && (hero.hp || 0) > 0 && m.hp > 0) {
        m.atkTimer = 0;

        const dodgeChance = hero.specialization === 'shadow_thief'
            ? Math.min(0.45, (derived.agi * 0.01) * 2)
            : Math.min(0.25, (derived.agi || 5) * 0.005);

        if (hero.divineShieldTimer > 0) {
            t.logs.unshift(`✨ Escudo Divino repeliu todo o dano de ${m.name}!`);
        } else if (Math.random() < dodgeChance) {
            t.logs.unshift(`💨 Você esquivou com maestria do golpe de ${m.name}!`);
        } else {
            const effectiveDef = setBonuses.protector4 ? (derived.def || 5) * 1.15 : (derived.def || 5);
            let dmgToHero = Math.max(1, Math.floor(monsterDmg - (effectiveDef * 0.5)));

            // Paladino
            if (hero.specialization === 'paladin') {
                const pHeal = Math.max(1, Math.floor(dmgToHero * 0.05));
                hero.hp = Math.min(derived.hpMax, (hero.hp || 0) + pHeal);
                const rDmg = Math.max(1, Math.floor(dmgToHero * 0.15));
                m.hp -= rDmg;
                t.logs.unshift(`🛡️ Postura do Paladino: refletiu ${rDmg} de dano no guardião!`);
                if (m.hp <= 0) {
                    handleTowerMonsterKill(state);
                    return;
                }
            }

            hero.hp -= dmgToHero;
            t.logs.unshift(`🩸 ${m.name} atingiu você causando ${dmgToHero} de dano!`);

            // Modificador: Dreno Vital (guardião rouba vida ao atacar)
            if (modId === 'drain') {
                const drainAmt = Math.max(1, Math.floor(dmgToHero * modIntensity));
                m.hp = Math.min(m.maxHp, m.hp + drainAmt);
                t.logs.unshift(`💧 Dreno Vital: guardião absorveu +${drainAmt} HP!`);
            }

            // Barreira Sagrada (Protetor 8 peças)
            if (hero.hp <= 0 && setBonuses.protector8 && (!hero.barrierCooldown || hero.barrierCooldown <= 0)) {
                hero.hp = Math.floor(derived.hpMax * 0.30);
                hero.barrierCooldown = 120;
                t.logs.unshift('🛡️ Barreira Sagrada ativada! Golpe letal repelido.');
            } else if (hero.hp <= 0) {
                hero.hp = 0;
                hero.isDead = true;
                t.inBattle = false;
                t.monster = null;
                t.isDefeat = true;
                t.logs.unshift(`💀 DERROTA! Você sucumbiu no Andar ${t.floor}. O herói precisa se recuperar.`);
                return;
            }
        }
    }

    // Decai timers
    if (m.hitTimer > 0) {
        m.hitTimer -= dt;
        if (m.hitTimer <= 0) {
            m.isHit = false;
            m.hitTimer = 0;
        }
    }

    if (t.logs.length > 25) {
        t.logs.length = 25;
    }
}

// ==========================================
// INVASÃO DA VILA — COMBATE DEDICADO (GDD Expansão 1.3)
// ==========================================

/**
 * Processa um tick de combate no slot dedicado da Invasão da Vila.
 * Não interfere nem sobrescreve o monstro ou progresso de kills da Exploração.
 */
export function processSiegeCombatTick(state, dt) {
    if (!state.villageSiege?.active || !state.villageSiege?.inBattle || !state.villageSiege?.monster) {
        return null;
    }

    const siege = state.villageSiege;
    const m = siege.monster;
    const hero = state.hero;
    const derived = state.derived || {};

    if (hero.isDead || (hero.hp || 0) <= 0) {
        hero.hp = 0;
        hero.isDead = true;
        siege.inBattle = false;
        return { defeat: true };
    }

    // ATAQUE DO HERÓI
    m.heroAtkTimer = (m.heroAtkTimer || 0) + dt;
    const heroAtkSpeed = derived.atkSpeed || 1.5;

    if (m.heroAtkTimer >= heroAtkSpeed && m.hp > 0 && (hero.hp || 0) > 0) {
        m.heroAtkTimer = 0;
        const attack = calcHeroDmg(derived, m, state.bestiary || {}, state.oracleBuff, state.pets?.active, state.equipment || {}, state.ascension, hero);
        m.hp -= attack.dmg;
        m.isHit = true;
        m.hitTimer = 0.2;

        if (m.hp <= 0) {
            m.hp = 0;
            return { victory: true };
        }
    }

    // ATAQUE DO GENERAL INVASOR
    m.atkTimer = (m.atkTimer || 0) + dt;
    const monsterAtkSpeed = m.atkSpeed || 1.8;

    if (m.atkTimer >= monsterAtkSpeed && m.hp > 0 && (hero.hp || 0) > 0) {
        m.atkTimer = 0;
        const effectiveDef = derived.def || 5;
        const dmgToHero = Math.max(1, Math.floor(m.damage - (effectiveDef * 0.5)));
        hero.hp = Math.max(0, hero.hp - dmgToHero);

        if (hero.hp <= 0) {
            hero.hp = 0;
            hero.isDead = true;
            siege.inBattle = false;
            return { defeat: true };
        }
    }

    // Decai hitTimer do monstro
    if (m.hitTimer > 0) {
        m.hitTimer -= dt;
        if (m.hitTimer <= 0) {
            m.isHit = false;
            m.hitTimer = 0;
        }
    }

    return null;
}

// ==========================================
// MASMORRA DIÁRIA DE CHEFE MUNDIAL (WORLD BOSS — 60s DPS CHECK)
// ==========================================

export function getDailyWorldBoss() {
    const dayIndex = Math.floor(Date.now() / 86400000) % WORLD_BOSSES.length;
    return WORLD_BOSSES[dayIndex] || WORLD_BOSSES[0];
}

export function syncWorldBossDailyReset(state) {
    if (!state.worldBoss) {
        state.worldBoss = {
            inBattle: false,
            timer: WORLD_BOSS_DURATION,
            damageDealt: 0,
            bossAtkTimer: 0,
            bestDamage: 0,
            dailyAttemptsLeft: WORLD_BOSS_DAILY_ATTEMPTS,
            lastResetDate: '',
            lastResult: null,
            logs: [],
        };
    }
    const today = new Date().toISOString().slice(0, 10);
    if (state.worldBoss.lastResetDate !== today) {
        state.worldBoss.dailyAttemptsLeft = WORLD_BOSS_DAILY_ATTEMPTS;
        state.worldBoss.lastResetDate = today;
    }
}

export function getWorldBossTierInfo(damage = 0) {
    let currentTier = null;
    let nextTier = WORLD_BOSS_TIERS[0];

    for (let i = 0; i < WORLD_BOSS_TIERS.length; i++) {
        if (damage >= WORLD_BOSS_TIERS[i].minDamage) {
            currentTier = WORLD_BOSS_TIERS[i];
            nextTier = WORLD_BOSS_TIERS[i + 1] || null;
        } else {
            nextTier = WORLD_BOSS_TIERS[i];
            break;
        }
    }

    let progressPct = 100;
    if (nextTier) {
        const prevMin = currentTier ? currentTier.minDamage : 0;
        const span = Math.max(1, nextTier.minDamage - prevMin);
        progressPct = Math.min(100, Math.max(0, ((damage - prevMin) / span) * 100));
    }

    return { currentTier, nextTier, current: currentTier, next: nextTier, progressPct };
}

export function startWorldBossBattle(state, useExtraDiamond = false) {
    syncWorldBossDailyReset(state);
    const wb = state.worldBoss;

    if (wb.inBattle) {
        return { ok: false, msg: 'Você já está enfrentando o Chefe Mundial!' };
    }
    if (state.hero.isDead || (state.hero.hp || 0) <= 0) {
        return { ok: false, msg: 'Recupere a vida do seu herói antes de desafiar o Chefe Mundial!' };
    }

    if ((wb.dailyAttemptsLeft || 0) <= 0) {
        if (!useExtraDiamond) {
            return { ok: false, msg: `Suas ${WORLD_BOSS_DAILY_ATTEMPTS} entradas diárias gratuitas acabaram! Use ${WORLD_BOSS_EXTRA_COST_DIAMONDS} 💎 para uma entrada extra.` };
        }
        if ((state.resources.diamond || 0) < WORLD_BOSS_EXTRA_COST_DIAMONDS) {
            return { ok: false, msg: `Diamantes insuficientes para entrada extra (${WORLD_BOSS_EXTRA_COST_DIAMONDS} 💎)!` };
        }
        state.resources.diamond -= WORLD_BOSS_EXTRA_COST_DIAMONDS;
    } else {
        wb.dailyAttemptsLeft -= 1;
    }

    // Pausa exploração e torre para focar no confronto titânico
    state.isExploring = false;
    if (state.tower) state.tower.inBattle = false;

    const bossDef = getDailyWorldBoss();
    wb.inBattle = true;
    wb.timer = WORLD_BOSS_DURATION;
    wb.damageDealt = 0;
    wb.heroAtkTimer = 0;
    wb.bossAtkTimer = 0;
    wb.petAtkTimer = 0;
    wb.lastResult = null;
    wb.logs = [
        `🐉 Você adentrou a Fenda Titânica para enfrentar ${bossDef.name}! Cause o máximo de dano em ${WORLD_BOSS_DURATION} segundos!`,
    ];

    return { ok: true, msg: `⚔️ Confronto iniciado contra ${bossDef.name}!` };
}

export function finishWorldBossBattle(state, reason = 'time_up') {
    const wb = state.worldBoss;
    if (!wb) return null;

    wb.inBattle = false;
    const dmg = Math.floor(wb.damageDealt || 0);
    const isNewRecord = dmg > (wb.bestDamage || 0);
    if (isNewRecord) {
        wb.bestDamage = dmg;
    }

    const bossDef = getDailyWorldBoss();
    const { currentTier } = getWorldBossTierInfo(dmg);

    // Se o herói caiu durante o teste de DPS, restaura 50% de HP sem penalidade de morte fora da arena
    if ((state.hero.hp || 0) <= 0 || state.hero.isDead) {
        state.hero.isDead = false;
        state.hero.isRecovering = false;
        state.hero.hp = Math.max(1, Math.floor((state.derived?.hpMax || 100) * 0.50));
    }

    if (!currentTier) {
        wb.lastResult = {
            damage: dmg,
            isNewRecord,
            reason,
            tierIcon: '⚔️',
            tierName: 'Sem Classificação (< 500 Dano)',
            badgeClass: 'bg-stone-900 border-stone-700 text-stone-400',
            rewardsText: ['+200 🪙 Ouro de Consolação'],
            summary: '+200 🪙 Ouro de Consolação',
        };
        state.resources.gold = (state.resources.gold || 0) + 200;
        return wb.lastResult;
    }

    const r = currentTier.rewards;
    const goldMult = bossDef.bonusResource === 'gold' ? bossDef.bonusMult : 1.0;
    const diamondMult = bossDef.bonusResource === 'diamond' ? bossDef.bonusMult : 1.0;
    const essenceMult = bossDef.bonusResource === 'essence' ? bossDef.bonusMult : 1.0;
    const ironMult = bossDef.bonusResource === 'iron' ? bossDef.bonusMult : 1.0;

    const goldGain = Math.floor(r.gold * goldMult);
    const diamondGain = Math.floor(r.diamond * diamondMult);
    const essenceGain = Math.floor(r.essence * essenceMult);
    const scrapGain = Math.floor(r.scrap * ironMult);
    const ironGain = Math.floor(r.iron * ironMult);

    state.resources.gold = (state.resources.gold || 0) + goldGain;
    state.resources.diamond = (state.resources.diamond || 0) + diamondGain;
    state.resources.essence = (state.resources.essence || 0) + essenceGain;
    state.resources.scrap = (state.resources.scrap || 0) + scrapGain;
    state.resources.iron = (state.resources.iron || 0) + ironGain;

    trackQuestProgress(state, 'EARN_GOLD', goldGain);
    trackQuestProgress(state, 'GATHER_MATERIALS', scrapGain);
    trackQuestProgress(state, 'KILL_BOSS', 1);
    if (state.lifetimeStats) {
        state.lifetimeStats.bosses = (state.lifetimeStats.bosses || 0) + 1;
        state.lifetimeStats.goldEarned = (state.lifetimeStats.goldEarned || 0) + goldGain;
    }

    const rewardsText = [
        `+${goldGain.toLocaleString('pt-BR')} 🪙 Ouro`,
        `+${diamondGain} 💎 Diamantes`,
        `+${essenceGain} ⚡ Essência`,
        `+${ironGain} 🧱 Ferro`,
        `+${scrapGain} ⚙️ Sucata`,
    ];

    if (r.ancestralDiamonds > 0) {
        state.resources.ancestralDiamonds = (state.resources.ancestralDiamonds || 0) + r.ancestralDiamonds;
        rewardsText.push(`+${r.ancestralDiamonds} 💠 Diamante Ancestral!`);
    }

    // Gera equipamento garantido da raridade do Tier
    if (r.itemRarity) {
        const rarityDef = RARITIES.find(rar => rar.id === r.itemRarity) || RARITIES[2];
        const typeDef = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
        const setKeys = Object.keys(ITEM_SETS);
        const setId = setKeys[Math.floor(Math.random() * setKeys.length)];
        const mats = ITEM_MATERIALS[rarityDef.id] || ITEM_MATERIALS.rare;
        const mat = mats[Math.floor(Math.random() * mats.length)];
        const zoneScale = Math.max(state.maxZone || 1, Math.floor((state.hero?.level || 1) / 4) + 1);
        const val = Math.max(3, Math.floor(typeDef.baseVal * rarityDef.mult * Math.pow(1.12, zoneScale)));

        const item = {
            id: Math.random().toString(36).substring(2, 9),
            name: `${typeDef.name} ${mat} [${ITEM_SETS[setId].name.split(' ')[0]}]`,
            type: typeDef.id,
            icon: typeDef.icon,
            rarity: rarityDef.id,
            color: rarityDef.color,
            stat: typeDef.stat,
            val,
            price: Math.floor(25 * rarityDef.mult * zoneScale),
            level: 1,
            setId,
            isLocked: ['legendary', 'mythic'].includes(rarityDef.id),
        };

        const maxSlots = state.inventoryMaxSlots || 20;
        if ((state.inventory || []).length < maxSlots) {
            state.inventory.push(item);
            rewardsText.push(`⚔️ ${item.name} (${rarityDef.name})`);
        } else {
            state.pendingDropItem = item;
            rewardsText.push(`⚔️ ${item.name} (Aguardando vaga na bolsa!)`);
        }
    }

    wb.lastResult = {
        damage: dmg,
        isNewRecord,
        reason,
        tierIcon: currentTier.icon || '🏆',
        tierName: currentTier.name,
        badgeClass: currentTier.badgeClass,
        rewardsText,
        summary: rewardsText.join(' · '),
    };

    return wb.lastResult;
}

export function processWorldBossCombatTick(state, dt) {
    const wb = state.worldBoss;
    if (!wb || !wb.inBattle) return null;

    const bossDef = getDailyWorldBoss();
    const hero = state.hero;
    const derived = state.derived || {};
    const te = getTreeEffects(state);

    wb.timer = Math.max(0, (wb.timer || 0) - dt);
    if (wb.timer <= 0) {
        return finishWorldBossBattle(state, 'time_up');
    }

    // 1. Ataque do Herói contra o Chefe Mundial
    wb.heroAtkTimer = (wb.heroAtkTimer || 0) + dt;
    const heroAtkSpeed = Math.max(0.25, derived.atkSpeed || 1.5);
    if (wb.heroAtkTimer >= heroAtkSpeed) {
        wb.heroAtkTimer = 0;
        const dummyBoss = { isBoss: true, baseType: 'boss', maxHp: 500000 };
        const atk = calcHeroDmg(derived, dummyBoss, state.bestiary || {}, state.oracleBuff, state.pets?.active, state.equipment || {}, state.ascension, hero);
        let finalDmg = atk.dmg;

        // Passiva do Colosso de Obsidiana: -15% dano físico direto
        if (bossDef.id === 'obsidian_colossus') {
            finalDmg = Math.max(1, Math.floor(finalDmg * 0.85));
        }

        // Lâmina de Kobold: +15% dano de sangramento contra o Titã
        if (state.equipment?.weapon?.relicId === 'relic_blade') {
            finalDmg = Math.floor(finalDmg * 1.15);
        }

        wb.damageDealt = (wb.damageDealt || 0) + finalDmg;
        if (state.statsSession) state.statsSession.damageDealt = (state.statsSession.damageDealt || 0) + finalDmg;
        if (atk.isCritical) {
            if (state.lifetimeStats) state.lifetimeStats.criticalHits = (state.lifetimeStats.criticalHits || 0) + 1;
            trackQuestProgress(state, 'CRITICAL_HITS', 1);
            wb.logs.unshift(`💥 CRÍTICO! Você causou ${finalDmg.toLocaleString('pt-BR')} de dano em ${bossDef.name}!`);
        } else {
            wb.logs.unshift(`⚔️ Seu golpe causou ${finalDmg.toLocaleString('pt-BR')} de dano!`);
        }

        // Mascote Ativo ataca junto com o Herói (com Rugido Primordial contra Chefes!)
        if (state.pets?.active) {
            const activePet = state.pets.active;
            const petLvl = state.pets?.levels?.[activePet] || 1;
            const petTalents = state.pets?.talents || {};
            const auraMult = 1 + ((te.aura_of_light || 0) * 0.20);
            const lvlMult = 1 + (petLvl - 1) * 0.20;
            const fangsMult = 1 + (petTalents.sharp_fangs || 0) * 0.25;
            const roarMult = 1 + (petTalents.primordial_roar || 0) * 0.40;
            const isPetCrit = Math.random() * 100 < ((petTalents.sharp_fangs || 0) * 5);
            const petDmg = Math.max(1, Math.floor((derived.str || 5) * 0.25 * auraMult * lvlMult * fangsMult * roarMult * (isPetCrit ? 1.8 : 1.0)));

            wb.damageDealt += petDmg;
            wb.logs.unshift(`🐾 Seu mascote causou +${petDmg.toLocaleString('pt-BR')} de dano feroz!`);

            if ((petTalents.vital_bond || 0) > 0) {
                const bondHeal = Math.max(1, Math.floor(derived.hpMax * (petTalents.vital_bond * 0.015)));
                hero.hp = Math.min(derived.hpMax, (hero.hp || 0) + bondHeal);
            }
        }
    }

    // 2. Contra-Ataque do Chefe Mundial
    wb.bossAtkTimer = (wb.bossAtkTimer || 0) + dt;
    if (wb.bossAtkTimer >= (bossDef.atkSpeed || 2.2)) {
        wb.bossAtkTimer = 0;

        if (hero.divineShieldTimer > 0) {
            wb.logs.unshift(`🛡️ Escudo Divino bloqueou completamente a fúria de ${bossDef.name}!`);
        } else {
            const elapsedSec = WORLD_BOSS_DURATION - wb.timer;
            // Fúria do Titã escala com o tempo decorrido e com o nível do herói
            const timeScale = 1 + Math.floor(elapsedSec / 10) * (bossDef.id === 'ignis_dragon' ? 0.16 : 0.10);
            const rawBossAtk = Math.floor((bossDef.baseAtk + (hero.level || 1) * 4.5) * timeScale);
            const effectiveDef = derived.def || 5;
            let dmgToHero = Math.max(5, Math.floor(rawBossAtk - effectiveDef * 0.45));

            if (state.equipment?.shield?.relicId === 'relic_shield') {
                dmgToHero = Math.max(1, Math.floor(dmgToHero * 0.80));
            }

            hero.hp = Math.max(0, (hero.hp || 0) - dmgToHero);
            wb.logs.unshift(`🔥 ${bossDef.name} contra-atacou causando ${dmgToHero} de dano!`);

            if (bossDef.id === 'abyssal_leviathan') {
                hero.energy = Math.max(0, (hero.energy || 0) - 4);
                hero.mana = Math.max(0, (hero.mana || 0) - 4);
            }

            if (hero.hp <= 0) {
                wb.logs.unshift(`💀 Você tombou diante do poder colossal de ${bossDef.name}! Calculando seu Dano Total...`);
                return finishWorldBossBattle(state, 'hero_fell');
            }
        }
    }

    if (wb.logs.length > 20) wb.logs.length = 20;
    return null;
}



