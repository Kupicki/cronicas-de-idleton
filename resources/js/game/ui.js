// ==========================================
// UI — Helpers de interface e stats
// ==========================================

import { trackQuestProgress } from './quests.js';

// ---- LOG ----

export function createLogEntry(text, type = 'narrative') {
    const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });
    const colorMap = {
        loot:      '#fbbf24',
        level:     '#4ade80',
        danger:    '#ef4444',
        prestige:  '#c084fc',
        narrative: '#e5e5e5',
    };
    return { time, text, color: colorMap[type] || '#e5e5e5', type };
}

// ---- STATS ----

export function recalcDerived(state) {
    const { baseStats, skills, equipment } = state;

    let str   = baseStats.str;
    // Defesa: cada ponto alocado vale +3 de defesa efetiva (GDD Expansão 1.4)
    let def   = baseStats.def * 3;
    let int   = baseStats.int;
    let agi   = baseStats.agi;
    let lck   = baseStats.lck || 1;
    let per   = baseStats.per || 1;
    let reg   = baseStats.reg || 1;
    let ene   = baseStats.ene || 1;

    // HP Máximo: base 47 + 10 por nível além do 1º + (pontos em Defesa × 3 HP cada)
    const heroLevel = state.hero?.level || 1;
    let hpMax = 47 + ((heroLevel - 1) * 10) + (baseStats.def * 3);

    // Regeneração de HP: 0.5 HP/s por ponto alocado em Regeneração
    let regen = reg * 0.5;

    // Habilidades passivas
    if (skills?.flat_resilience)  hpMax += skills.flat_resilience.level  * 20;
    if (skills?.flat_strength)    str   += skills.flat_strength.level    * 5;
    if (skills?.thick_hide)       def   += skills.thick_hide.level       * 5;
    if (skills?.percent_strength) str    = Math.floor(str * (1 + skills.percent_strength.level * 0.02));

    // Equipamentos
    Object.values(equipment || {}).forEach(eq => {
        if (!eq) return;
        if (eq.stat === 'hpMax') hpMax += eq.val;
        if (eq.stat === 'str')   str   += eq.val;
        if (eq.stat === 'def')   def   += eq.val;
        if (eq.stat === 'int')   int   += eq.val;
        if (eq.stat === 'agi')   agi   += eq.val;
    });

    // Bônus de Pets / Companheiros (GDD: Seção 18)
    const activePet = state.pets?.active;
    if (activePet === 'lobo_alfa')  str   = Math.floor(str * 1.12);
    if (activePet === 'golem_mini') def   = Math.floor(def * 1.15);
    if (activePet === 'salamandra') regen += 0.5;
    if (activePet === 'raposa')     lck   += 2;

    // Velocidade de ataque (GDD: base 2.0s - AGI * 0.05s)
    let atkSpeed = Math.max(0.2, 2.0 - (agi * 0.05));
    if (activePet === 'pantera') {
        atkSpeed = Math.max(0.2, atkSpeed * 0.90); // +10% velocidade de ataque
    }

    // Energia e Mana balanceadas
    const energyMax   = 25 + (ene * 5);
    const energyRegen = 0.5 + (ene * 0.5);
    const manaMax     = 25 + (int * 5);
    const manaRegen   = 0.2 + (int * 0.1);

    return { hpMax, str, def, int, agi, lck, per, regen, atkSpeed, energyMax, manaMax, energyRegen, manaRegen };
}

/**
 * Calcula a diferença (delta) de atributo entre um item do inventário
 * e o item atualmente equipado no mesmo slot.
 */
export function getItemDelta(item, equipment) {
    if (!item || !equipment || !item.type) return null;
    const equipped = equipment[item.type];
    const itemVal = typeof item.val === 'number' ? item.val : 0;
    if (!equipped) {
        return {
            diff: itemVal,
            isBetter: itemVal > 0,
            isSame: itemVal === 0,
            equippedName: 'Vazio',
            equippedVal: 0,
            stat: item.stat,
        };
    }

    const equippedVal = typeof equipped.val === 'number' ? equipped.val : 0;
    const diff = itemVal - equippedVal;
    return {
        diff,
        isBetter: diff > 0,
        isSame: diff === 0,
        equippedName: equipped.name,
        equippedVal,
        stat: item.stat,
    };
}

// ---- NOME DO HERÓI ----

export function changeHeroName(state, resources, newName) {
    if (!newName || newName.trim().length === 0) return { ok: false, msg: 'Nome inválido.' };
    const changes = state.hero.nameChanges || 0;
    if (changes === 0) {
        state.hero.name      = newName.trim();
        state.hero.nameChanges = 1;
        localStorage.setItem('idleton_hero_name', state.hero.name);
        return { ok: true, msg: 'Nome alterado com sucesso!' };
    }
    const cost = changes * 50;
    if (resources.diamond < cost) {
        return { ok: false, msg: `Diamantes insuficientes! (Custo: ${cost} 💎)` };
    }
    resources.diamond         -= cost;
    state.hero.name            = newName.trim();
    state.hero.nameChanges     = changes + 1;
    localStorage.setItem('idleton_hero_name', state.hero.name);
    return { ok: true, msg: 'Nome alterado com sucesso!' };
}

// ---- HABILIDADES ----

export function buySkill(state, skillId) {
    const skill = state.skills[skillId];
    if (!skill) return { ok: false, msg: 'Habilidade inválida.' };
    const cost = skill.level + 1;
    const pe   = state.hero.pe || 0;
    if (pe < cost) return { ok: false, msg: 'PE insuficiente.' };
    state.hero.pe = pe - cost;
    skill.level++;
    return { ok: true, msg: `Aprendeu ${skill.name} (Nv. ${skill.level})` };
}

// ---- ATRIBUTOS (Stat Points) ----

export function allocateStat(state, statKey) {
    const valid = ['str', 'def', 'int', 'agi', 'lck', 'per', 'reg', 'ene'];
    if (!valid.includes(statKey)) return false;
    if ((state.hero.statPoints || 0) <= 0) return false;
    state.hero.statPoints--;
    state.baseStats[statKey] = (state.baseStats[statKey] || 0) + 1;
    return true;
}

// ---- TAVERNA ----

export function playTavernGame(state, game, bet) {
    const resources = state.resources;
    if (!bet || bet <= 0) return { ok: false, msg: 'Defina uma aposta válida!' };
    if (resources.gold < bet) return { ok: false, msg: 'Ouro insuficiente para apostar.' };

    resources.gold -= bet;
    trackQuestProgress(state, 'SPEND_GOLD', bet);


    if (game === 'coin') {
        const side = Math.random() > 0.5 ? 'cara' : 'coroa';
        const win = side === 'cara';
        if (win) {
            resources.gold += bet * 2;
            trackQuestProgress(state, 'EARN_GOLD', bet * 2);
            return { ok: true, type: 'loot', msg: `🪙 Cara ou Coroa: VITÓRIA! +${bet * 2} Ouro!`, gained: bet * 2, game: 'coin', won: true, side };
        }
        return { ok: true, type: 'danger', msg: `🪙 Cara ou Coroa: DERROTA! -${bet} Ouro.`, gained: 0, game: 'coin', won: false, side };
    }

    if (game === 'dice') {
        const heroDie1 = Math.floor(Math.random() * 6) + 1;
        const heroDie2 = Math.floor(Math.random() * 6) + 1;
        const npcDie1  = Math.floor(Math.random() * 6) + 1;
        const npcDie2  = Math.floor(Math.random() * 6) + 1;
        const heroRoll = heroDie1 + heroDie2;
        const npcRoll  = npcDie1 + npcDie2;
        if (heroRoll > npcRoll) {
            resources.gold += bet * 2;
            trackQuestProgress(state, 'EARN_GOLD', bet * 2);
            return { ok: true, type: 'loot', msg: `🎲 Dados: ${heroRoll} vs ${npcRoll}. VITÓRIA! +${bet * 2} Ouro!`, gained: bet * 2, game: 'dice', won: true, draw: false, heroRoll, npcRoll, heroDice: [heroDie1, heroDie2], npcDice: [npcDie1, npcDie2] };
        } else if (heroRoll === npcRoll) {
            resources.gold += bet;
            return { ok: true, type: 'narrative', msg: `🎲 Dados: Empate (${heroRoll}). Aposta devolvida.`, gained: bet, game: 'dice', won: false, draw: true, heroRoll, npcRoll, heroDice: [heroDie1, heroDie2], npcDice: [npcDie1, npcDie2] };
        }
        return { ok: true, type: 'danger', msg: `🎲 Dados: ${heroRoll} vs ${npcRoll}. DERROTA! -${bet} Ouro.`, gained: 0, game: 'dice', won: false, draw: false, heroRoll, npcRoll, heroDice: [heroDie1, heroDie2], npcDice: [npcDie1, npcDie2] };
    }

    return { ok: false, msg: 'Jogo desconhecido.' };
}


// ---- SAVE / LOAD ----
// Tenta usar a API Laravel (quando rodando localmente).
// Caso a API não esteja disponível (GitHub Pages), usa localStorage como fallback.

const STORAGE_PREFIX = 'idleton_save_';

export async function loadGame(heroName) {
    try {
        const res  = await fetch(`/api/load?hero_name=${encodeURIComponent(heroName)}`);
        if (res.ok) {
            const data = await res.json();
            if (data.success && data.data) return data.data;
        }
    } catch (_) { /* API indisponível — usar fallback */ }

    // Fallback: localStorage
    const raw = localStorage.getItem(STORAGE_PREFIX + heroName);
    return raw ? JSON.parse(raw) : null;
}

export async function saveGame(heroName, gameState) {
    // Sempre salva em localStorage (backup instantâneo)
    try {
        localStorage.setItem(STORAGE_PREFIX + heroName, JSON.stringify(gameState));
    } catch (_) { /* quota exceeded — silencia */ }

    // Tenta persistir na API (silencia se indisponível)
    try {
        const token = document.head.querySelector('meta[name="csrf-token"]')?.content;
        await fetch('/api/save', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token || '' },
            body:    JSON.stringify({ hero_name: heroName, game_state: gameState }),
        });
    } catch (_) { /* API indisponível — save já feito em localStorage */ }
}
