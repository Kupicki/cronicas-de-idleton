import {
    MONSTER_BASE_TYPES,
    MONSTER_ADJECTIVES,
    MONSTER_ELEMENTS,
    BOSS_PREFIXES,
    BOSS_SUFFIXES,
    TOWER_MODIFIERS,
} from './constants.js';
import {
    calcMonsterHp, calcMonsterDmg, calcBossHp, calcBossDmg,
    calcMonsterGold, calcBossGold, calcMonsterXp, calcBossXp,
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
    const hp  = Math.floor(calcMonsterHp(zone) * baseType.hpMult);
    const dmg = Math.floor(calcMonsterDmg(zone) * baseType.dmgMult);

    return {
        name:     generateMonsterName(baseType),
        baseType: baseType.id,
        icon:     baseType.icon,
        color:    baseType.color,
        maxHp:    hp,
        hp:       hp,
        damage:   dmg,
        atkSpeed: 1.5,
        atkTimer: 0,
        isBoss:   false,
        isHit:    false,
        hitTimer: 0,
        gold:     calcMonsterGold(zone, baseType.hpMult),
        xp:       calcMonsterXp(zone),
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

    // Bônus do Lobo Alfa (+12% de Ataque Base)
    if (activePet === 'lobo_alfa') {
        dmg = Math.floor(dmg * 1.12);
    }

    // Especialização: Berserker (+1% de dano a cada 2% de HP perdido)
    if (hero && hero.specialization === 'berserker' && derived.hpMax > 0) {
        const missingHpRatio = Math.max(0, 1 - (hero.hp / derived.hpMax));
        const berserkBonus = missingHpRatio * 0.5; // Até +50% de dano adicional
        dmg = Math.floor(dmg * (1 + berserkBonus));
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

    // Encantamento: Fúria Tempestuosa (Raio: 20% chance de acerto crítico duplo)
    const weaponEnchant = equipment?.weapon?.enchantment?.id;
    let isCritical = false;
    if (weaponEnchant === 'lightning' && Math.random() < 0.20) {
        const critMult = setBonuses.storm4 ? 2.3 : 2.0;
        baseDmg = Math.floor(baseDmg * critMult);
        isCritical = true;
    }

    return { dmg: baseDmg, isCritical, setBonuses };
}

/**
 * Calcula as recompensas de XP e Ouro ao derrotar um monstro,
 * aplicando bônus de Oráculo, Pets, Habilidades passivas, Ascensão e Conjuntos.
 */
export function calcKillRewards(monster, state) {
    let gold = monster.gold || 1;
    let xp   = monster.xp   || 1;

    const setBonuses = calcActiveSetBonuses(state.equipment || {});

    // Bônus de Habilidade Passiva (Mãos de Ouro)
    const goldenHandsLvl = state.skills?.golden_hands?.level || 0;
    if (goldenHandsLvl > 0) {
        gold = Math.floor(gold * (1 + goldenHandsLvl * 0.05));
    }

    // Bônus de Conjunto: Ouro do Ganancioso (4 peças: +25% Ouro)
    if (setBonuses.greedy4) {
        gold = Math.floor(gold * 1.25);
    }

    // Bônus de Companheiro / Pet
    const activePet = state.pets?.active;
    if (activePet === 'rato_ladrao') {
        gold = Math.floor(gold * 1.20); // +20% de Ouro
    }
    if (activePet === 'coruja') {
        xp = Math.floor(xp * 1.15); // +15% de XP
    }

    // Bônus permanente de Ascensão (Cofre Ancestral: +15% Ouro / Mente Iluminada: +20% XP)
    if (state.ascension?.perks?.gold) {
        gold = Math.floor(gold * (1 + state.ascension.perks.gold * 0.15));
    }
    if (state.ascension?.perks?.xp) {
        xp = Math.floor(xp * (1 + state.ascension.perks.xp * 0.20));
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

    // Herói ataca
    if (!hero.atkTimer) hero.atkTimer = 0;
    hero.atkTimer += dt;
    if (hero.atkTimer >= heroAtkSpeed && monster.hp > 0) {
        hero.atkTimer = 0;
        result.heroAttacked = true;
        const heroAttack = calcHeroDmg(derived, monster, bestiary, oracleBuff, activePet, equipment, ascension, hero);
        result.dmgToMonster = heroAttack.dmg;
        result.isCritical   = heroAttack.isCritical;

        // Especialização: Mago Arcano (Consome 5 de mana por explosão mágica de 40%)
        if (hero.specialization === 'arcane_mage' && (hero.mana || 0) >= 5) {
            hero.mana -= 5;
            const magicBlast = Math.max(1, Math.floor(result.dmgToMonster * 0.40));
            result.dmgToMonster += magicBlast;
            result.arcaneBlast = true;
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

        monster.hp -= result.dmgToMonster;
        monster.isHit = true;
        monster.hitTimer = 0.2;
        if (monster.hp <= 0) {
            result.killed = true;
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

        if (Math.random() < dodgeChance) {
            result.dodged = true;
            result.dmgToHero = 0;
        } else {
            // Cálculo de armadura (Protetor 4 peças: +15% armadura)
            const effectiveDef = setBonuses.protector4 ? derived.def * 1.15 : derived.def;
            result.dmgToHero = Math.max(1, Math.floor(monster.damage - effectiveDef * 0.5));

            // Especialização: Paladino (Cura 5% do dano recebido e reflete 15% de volta)
            if (hero.specialization === 'paladin') {
                result.paladinHeal = Math.max(1, Math.floor(result.dmgToHero * 0.05));
                hero.hp = Math.min(derived.hpMax, (hero.hp || 0) + result.paladinHeal);

                result.reflectedDmg = Math.max(1, Math.floor(result.dmgToHero * 0.15));
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
                result.heroKilled = true;
            }
        }
    }

    // Decai cooldown da barreira sagrada
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

const TOWER_ICONS = ['👑', '🐉', '👹', '👿', '💀', '🪐', '⚡', '🗿'];

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
 * Retorna a intensidade de um modificador escalada pelo andar.
 */
export function getTowerModifierIntensity(modifier, floor) {
    if (!modifier) return 0;
    const base = modifier.baseValue || 0;
    const scale = modifier.scalePerFloor || 0;
    const cap = modifier.cap || base;
    return Math.min(cap, base + (floor * scale));
}

export function generateTowerGuardian(floor) {
    const nameIndex = (floor - 1) % TOWER_BOSS_NAMES.length;
    const name = `${TOWER_BOSS_NAMES[nameIndex]} (Andar ${floor})`;
    const icon = TOWER_ICONS[(floor - 1) % TOWER_ICONS.length];

    // GDD Expansão 1.2: Base exponencial da Exploração × ratio do andar
    // ratio(andar) = min(4.0, 2.5 + andar × 0.03)
    const hp = calcTowerGuardianHp(floor);
    const damage = calcTowerGuardianDmg(floor);
    const def = calcTowerGuardianDef(floor);
    const atkSpeed = calcTowerGuardianAtkSpeed(floor);

    // Seleção de modificador por hash (determinístico mas não cíclico)
    const modIndex = towerFloorHash(floor) % TOWER_MODIFIERS.length;
    const modifier = TOWER_MODIFIERS[modIndex];

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
                    icon: 'fa-sparkles',
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

    // Herói não pode desafiar a torre se estiver morto ou com 0 HP
    if (state.hero.isDead || (state.hero.hp || 0) <= 0) {
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

    // Andares especiais com salas de evento a cada 3 andares (exceto no andar 1)
    if (currentFloor > 1 && currentFloor % 3 === 2) {
        state.tower.roomType = 'event';
        state.tower.eventRoom = generateTowerEventRoom(currentFloor);
        state.tower.monster = null;
        state.tower.logs.push(`🏛️ Você adentrou o Andar ${currentFloor}. Um evento misterioso se revela!`);
    } else {
        state.tower.roomType = 'monster';
        state.tower.eventRoom = null;
        state.tower.monster = generateTowerGuardian(currentFloor);
        state.tower.modifier = state.tower.monster.modifier;
        state.tower.logs.push(`⚔️ Guardião do Andar ${currentFloor} surge diante de você! Modificador: ${state.tower.modifier?.name || 'Nenhum'}`);
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
            state.resources.diamonds = (state.resources.diamonds || 0) + dia;
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

    // Transiciona para a batalha com o guardião
    state.tower.roomType = 'monster';
    state.tower.eventRoom = null;
    state.tower.monster = generateTowerGuardian(state.tower.floor);
    state.tower.modifier = state.tower.monster.modifier;
    state.tower.logs.push(`⚔️ O Guardião do Andar ${state.tower.floor} bloqueia a saída!`);
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

    // Modificador: Maldição da Praga (herói não regenera — handled in game loop by checking modifier)
    // (Já é tratado no game loop: regen zerada)

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

        // Mascote Ativo
        if (state.pets?.active) {
            const petDmg = Math.max(1, Math.floor((derived.str || 10) * 0.25));
            m.hp -= petDmg;
        }

        // VITÓRIA DO ANDAR
        if (m.hp <= 0) {
            m.hp = 0;
            t.inBattle = false;
            t.isVictory = true;

            const r = m.rewards;
            state.resources.gold = (state.resources.gold || 0) + r.gold;
            state.resources.diamonds = (state.resources.diamonds || 0) + r.diamonds;
            state.resources.essence = (state.resources.essence || 0) + r.essence;

            if (t.floor >= (t.maxFloor || 1)) {
                t.maxFloor = Math.min(100, t.floor + 1);
            }
            if (!state.lifetimeStats) state.lifetimeStats = {};
            state.lifetimeStats.highestTowerFloor = Math.max(state.lifetimeStats.highestTowerFloor || 1, t.floor);
            state.lifetimeStats.bosses = (state.lifetimeStats.bosses || 0) + 1;

            t.logs.unshift(`🏆 VITÓRIA! Você conquistou o Andar ${t.floor}! Recompensas: +${r.gold} 🪙, +${r.diamonds} 💎, +${r.essence} ⚡!`);
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

        if (Math.random() < dodgeChance) {
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
                    m.hp = 0;
                    t.inBattle = false;
                    t.isVictory = true;
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


