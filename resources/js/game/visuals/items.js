// ==========================================
// VISUALS — ITENS E COSMÉTICOS
// ==========================================

import library from './library.js';

// ---- Raridades (gerado automaticamente da biblioteca) ----
const _rarityIds = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

export const RARITY_VISUALS = Object.fromEntries(
    _rarityIds.map(id => {
        const data = library[`rarity.${id}`];
        return [id, {
            color:     data?.color     ?? '#9ca3af',
            border:    data?.border    ?? '#4b5563',
            glow:      data?.glow      ?? 'none',
            auraColor: data?.auraColor ?? null,
        }];
    })
);

/**
 * Retorna os metadados visuais de um item com base no tipo e raridade.
 * Consulta a Biblioteca Visual para obter ícones de slot.
 */
export function getItemVisual(item) {
    if (!item) return null;
    const rarityStyle = RARITY_VISUALS[item.rarity] || RARITY_VISUALS.common;

    // Ícone: prioriza o definido no próprio item, depois consulta a biblioteca, depois fallback
    const slotEntry = library[`item.${item.type}`];
    const icon = item.icon || slotEntry?.icon || 'fa-box';

    return {
        icon,
        color: item.color || rarityStyle.color,
        border: rarityStyle.border,
        glow: rarityStyle.glow,
        auraColor: rarityStyle.auraColor,
    };
}
