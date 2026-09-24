// ==========================================
// FÓRMULAS CENTRALIZADAS (GDD: Expansão 1.3)
// ==========================================
// Módulo único de cálculo para manter consistência
// entre Exploração, Torre e Domínio.
// ==========================================

// ---- CURVA DE XP / NÍVEIS ----

/**
 * Calcula o custo de XP para subir do nível informado para o próximo.
 * Base: 100 XP, razão: 1.19× por nível (GDD Expansão 1.1).
 *
 * Referência de calibragem (nova curva, base 100 XP):
 *   Nv 10 → ~460 XP   | acumulado ~1.900
 *   Nv 20 → ~2.600 XP | acumulado ~11.400
 *   Nv 30 → ~14.900 XP| acumulado ~65.300
 *   Nv 40 → ~85.400 XP| acumulado ~375.500
 *   Nv 50 → ~490.000 XP (Prestígio) | acumulado ~3.080.000
 */
export const XP_BASE = 100;
export const XP_RATIO = 1.19;

export function calcXpForLevel(level) {
    if (level < 1) return XP_BASE;
    return Math.floor(XP_BASE * Math.pow(XP_RATIO, level - 1));
}

/**
 * Retorna o XP acumulado total necessário para chegar ao nível alvo.
 */
export function calcTotalXpToLevel(targetLevel) {
    let total = 0;
    for (let lvl = 1; lvl < targetLevel; lvl++) {
        total += calcXpForLevel(lvl);
    }
    return total;
}

// ---- MONSTROS DE EXPLORAÇÃO ----

/**
 * HP base de um monstro comum numa zona.
 * Fórmula: 5 × 1.35^(zona - 1)
 */
export function calcMonsterHp(zone) {
    return Math.floor(5 * Math.pow(1.35, zone - 1));
}

/**
 * Dano base de um monstro comum numa zona.
 * Fórmula: 6 × 1.30^zona
 */
export function calcMonsterDmg(zone) {
    return Math.floor(6 * Math.pow(1.30, zone));
}

/**
 * HP de um boss de exploração numa zona.
 * Fórmula: 25 × 1.35^(zona - 1)
 */
export function calcBossHp(zone) {
    return Math.floor(25 * Math.pow(1.35, zone - 1));
}

/**
 * Dano de um boss de exploração numa zona.
 * Fórmula: 10 × 1.30^zona
 */
export function calcBossDmg(zone) {
    return Math.floor(10 * Math.pow(1.30, zone));
}

/**
 * Ouro de monstro comum.
 * Fórmula: 7 × 1.2^zona × hpMult
 */
export function calcMonsterGold(zone, hpMult = 1.0) {
    return Math.floor(7 * Math.pow(1.2, zone) * hpMult);
}

/**
 * Ouro de boss.
 * Fórmula: 25 × 1.2^zona
 */
export function calcBossGold(zone) {
    return Math.floor(25 * Math.pow(1.2, zone));
}

/**
 * XP de monstro.
 * Fórmula: 15 × 1.15^zona (comum) / 50 × 1.15^zona (boss)
 */
export function calcMonsterXp(zone) {
    return Math.floor(15 * Math.pow(1.15, zone));
}

export function calcBossXp(zone) {
    return Math.floor(50 * Math.pow(1.15, zone));
}

// ---- TORRE DOS DESAFIOS (GDD Expansão 1.2) ----

/**
 * Ratio de dificuldade da Torre em relação à Exploração.
 * Fórmula: min(4.0, 2.5 + andar × 0.03)
 * Mantém a Torre entre 2.5× e 4× mais forte que a Exploração.
 */
export function calcTowerRatio(floor) {
    return Math.min(4.0, 2.5 + floor * 0.03);
}

/**
 * HP dos Monstros Comuns da Torre (Monstros 1 a 4 do andar).
 * Mesma base da Exploração multiplicada pelo ratio da Torre.
 */
export function calcTowerMonsterHp(floor) {
    const commonHp = calcMonsterHp(floor);
    const ratio = calcTowerRatio(floor);
    return Math.floor(commonHp * ratio * 1.2);
}

/**
 * Dano dos Monstros Comuns da Torre (Monstros 1 a 4 do andar).
 */
export function calcTowerMonsterDmg(floor) {
    const commonDmg = calcMonsterDmg(floor);
    const ratio = calcTowerRatio(floor);
    return Math.floor(commonDmg * ratio * 0.5);
}

/**
 * HP do Guardião da Torre (5º Monstro / Boss do Andar).
 * Fórmula GDD 1.2: HP_boss(zona=andar) × ratio(andar)
 */
export function calcTowerGuardianHp(floor) {
    const bossHp = calcBossHp(floor);
    const ratio = calcTowerRatio(floor);
    return Math.floor(bossHp * ratio);
}

/**
 * Dano do Guardião da Torre (5º Monstro / Boss do Andar).
 * Fórmula: DMG_boss(zona=andar) × ratio(andar) × 0.6
 */
export function calcTowerGuardianDmg(floor) {
    const bossDmg = calcBossDmg(floor);
    const ratio = calcTowerRatio(floor);
    return Math.floor(bossDmg * ratio * 0.6);
}

/**
 * Defesa do Guardião da Torre.
 */
export function calcTowerGuardianDef(floor) {
    return Math.floor(6 + (floor * 2.8));
}

/**
 * Velocidade de ataque do Guardião da Torre.
 */
export function calcTowerGuardianAtkSpeed(floor) {
    return Math.max(0.85, 2.2 - (floor * 0.012));
}

// ---- DOMÍNIO / CONSTRUÇÕES (GDD Expansão 1.3) ----

/**
 * Custo de compra/evolução de construção do Domínio.
 * Fórmula GDD: baseCost × 1.18^nivel_atual
 */
export function calcBuildingCost(baseCost, currentQty) {
    if (currentQty >= 10) return Infinity;
    return Math.floor(baseCost * Math.pow(1.18, currentQty));
}

/**
 * Custo de Fortificação do Domínio.
 */
export function calcDomainUpgradeCost(level = 0) {
    return {
        wood: Math.floor(50 * Math.pow(1.35, level)),
        gold: Math.floor(200 * Math.pow(1.30, level)),
    };
}

// ---- ASCENSÃO (GDD Expansão 1.5) ----

/**
 * Calcula a recompensa de Diamantes Ancestrais ao ascender.
 * Fórmula GDD 1.5: floor((nível - 45) × 2 + zonaMáxima × 1)
 * Nível mínimo: 50.
 */
export function calcAscensionAncestralReward(level, maxZone) {
    if (level < 50) return 0;
    return Math.floor((level - 45) * 2 + maxZone * 1);
}

// ---- FORMATAÇÃO DE NÚMEROS ----

/**
 * Formata um número grande com notação abreviada (K/M/B/T).
 * Exemplos: 1500 → "1.5K", 3200000 → "3.2M"
 * Para números < 1000, retorna sem abreviação.
 * @param {number} n - Número a formatar
 * @param {number} [decimals=1] - Casas decimais
 * @returns {string}
 */
export function formatNumber(n) {
    if (n === null || n === undefined) return '0';
    if (typeof n !== 'number' || isNaN(n)) return '0';

    const absN = Math.abs(n);
    const sign = n < 0 ? '-' : '';

    if (absN < 1000) {
        return sign + (Number.isInteger(n) ? absN.toString() : absN.toFixed(1));
    }

    const tiers = [
        { threshold: 1e15, suffix: 'Q' },
        { threshold: 1e12, suffix: 'T' },
        { threshold: 1e9,  suffix: 'B' },
        { threshold: 1e6,  suffix: 'M' },
        { threshold: 1e3,  suffix: 'K' },
    ];

    for (const tier of tiers) {
        if (absN >= tier.threshold) {
            const val = absN / tier.threshold;
            // Usa 1 casa decimal, remove ".0" desnecessário
            const formatted = val < 10 ? val.toFixed(1) : val < 100 ? val.toFixed(1) : Math.floor(val).toString();
            return sign + formatted.replace(/\.0$/, '') + tier.suffix;
        }
    }

    return sign + absN.toString();
}

/**
 * Formata número para uso específico na UI (sempre inteiro se < 1000).
 */
export function formatInt(n) {
    if (typeof n !== 'number' || isNaN(n)) return '0';
    if (Math.abs(n) < 1000) return Math.floor(n).toString();
    return formatNumber(n);
}
