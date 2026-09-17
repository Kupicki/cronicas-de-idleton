import { QUEST_TYPES } from './constants.js';

// ==========================================
// MISSÕES PROCEDURAIS (GDD: Seção 15)
// ==========================================

/**
 * Gera uma missão individual procedimental com base na zona e nível atual.
 */
export function generateQuest(zone = 1, heroLevel = 1, usedTypes = []) {
    // Escolhe um tipo que preferencialmente ainda não esteja ativo
    let availableTypes = QUEST_TYPES.filter(qt => !usedTypes.includes(qt.type));
    if (availableTypes.length === 0) {
        availableTypes = QUEST_TYPES;
    }
    const template = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    const scale = Math.max(1, Math.floor(zone * 0.8 + heroLevel * 0.4));
    let target = template.baseTarget + (scale - 1) * template.targetMultiplier;

    // Arredonda alvos grandes para múltiplos amigáveis
    if (target > 50) {
        target = Math.round(target / 10) * 10;
    }

    // Calcula recompensas escaladas
    let rewardGold    = 0;
    let rewardDiamond = 0;
    let rewardXp      = 0;
    let rewardScrap   = 0;

    switch (template.type) {
        case 'KILL_MONSTERS':
            rewardGold    = Math.floor(20 * scale * 1.5);
            rewardDiamond = Math.max(1, Math.floor(1 + scale * 0.2));
            rewardXp      = Math.floor(30 * scale);
            break;
        case 'EARN_GOLD':
            rewardDiamond = Math.max(2, Math.floor(2 + scale * 0.3));
            rewardXp      = Math.floor(50 * scale);
            rewardScrap   = Math.floor(2 + scale * 0.5);
            break;
        case 'GATHER_MATERIALS':
            rewardGold    = Math.floor(25 * scale * 1.2);
            rewardDiamond = Math.max(1, Math.floor(1 + scale * 0.2));
            rewardScrap   = Math.floor(target * 0.8);
            break;
        case 'SPEND_GOLD':
            rewardDiamond = Math.max(2, Math.floor(1 + scale * 0.4));
            rewardXp      = Math.floor(40 * scale);
            rewardGold    = Math.floor(target * 0.25); // reembolso parcial
            break;
        case 'UPGRADE_EQUIPMENT':
            rewardGold    = Math.floor(40 * scale * 1.5);
            rewardDiamond = Math.max(2, Math.floor(2 + scale * 0.3));
            rewardScrap   = Math.floor(4 + scale);
            break;
        default:
            rewardGold    = 30 * scale;
            rewardDiamond = 1;
            rewardXp      = 20 * scale;
    }

    return {
        id:          Math.random().toString(36).substring(2, 9),
        type:        template.type,
        title:       template.title,
        icon:        template.icon,
        color:       template.color,
        desc:        template.descTemplate(target),
        current:     0,
        target:      target,
        completed:   false,
        claimed:     false,
        reward: {
            gold:    rewardGold,
            diamond: rewardDiamond,
            xp:      rewardXp,
            scrap:   rewardScrap,
        },
    };
}

/**
 * Garante que o jogador tenha exatamente 4 missões ativas simultâneas.
 */
export function ensureQuests(state) {
    if (!state.quests) state.quests = [];

    while (state.quests.length < 4) {
        const usedTypes = state.quests.map(q => q.type);
        const newQuest = generateQuest(state.zone || 1, state.hero?.level || 1, usedTypes);
        state.quests.push(newQuest);
    }
}

/**
 * Atualiza o progresso das missões de determinado tipo.
 * Retorna array de missões recém-completadas (para emitir avisos/toasts).
 */
export function trackQuestProgress(state, type, amount = 1) {
    if (!state.quests || state.quests.length === 0) return [];
    const completedNow = [];

    state.quests.forEach(quest => {
        if (quest.type === type && !quest.completed) {
            quest.current = Math.min(quest.target, (quest.current || 0) + amount);
            if (quest.current >= quest.target) {
                quest.completed = true;
                completedNow.push(quest);
            }
        }
    });

    return completedNow;
}

/**
 * Resgata a recompensa da missão e gera imediatamente uma substituta.
 */
export function claimQuestReward(state, questId) {
    if (!state.quests) return { ok: false, msg: 'Missões indisponíveis.' };
    const idx = state.quests.findIndex(q => q.id === questId);
    if (idx === -1) return { ok: false, msg: 'Missão não encontrada.' };

    const quest = state.quests[idx];
    if (!quest.completed) return { ok: false, msg: 'Missão ainda em andamento!' };

    // Entrega recompensas
    if (quest.reward.gold)    state.resources.gold    = (state.resources.gold || 0) + quest.reward.gold;
    if (quest.reward.diamond) state.resources.diamond = (state.resources.diamond || 0) + quest.reward.diamond;
    if (quest.reward.scrap)   state.resources.scrap   = (state.resources.scrap || 0) + quest.reward.scrap;
    if (quest.reward.xp) {
        state.hero.xp += quest.reward.xp;
    }

    // Remove a missão completada e gera uma nova
    state.quests.splice(idx, 1);
    const usedTypes = state.quests.map(q => q.type);
    const replacement = generateQuest(state.zone || 1, state.hero?.level || 1, usedTypes);
    state.quests.push(replacement);

    let rewardSummary = [];
    if (quest.reward.gold)    rewardSummary.push(`+${quest.reward.gold} 🪙`);
    if (quest.reward.diamond) rewardSummary.push(`+${quest.reward.diamond} 💎`);
    if (quest.reward.xp)      rewardSummary.push(`+${quest.reward.xp} XP`);
    if (quest.reward.scrap)   rewardSummary.push(`+${quest.reward.scrap} ⚙️`);

    return {
        ok: true,
        quest,
        msg: `Missão concluída: ${quest.title}! (${rewardSummary.join(', ')})`,
        replacement,
    };
}
