// ==========================================
// VISUALS ENGINE — HUB PRINCIPAL
// ==========================================
//
// Ponto de entrada unificado para todo o sistema visual do jogo.
// Exporta a função v() (acesso à biblioteca visual centralizada)
// e todas as funções de renderização do Canvas.
//
// USO BÁSICO:
//   import { v } from './visuals/index.js';
//
//   v('monster.goblin')              → { icon: '👺', color: '#84cc16', asset: 'monsters/goblin', ... }
//   v('monster.goblin', 'color')     → '#84cc16'
//   v('item.weapon', 'icon')         → 'fa-dagger'
//   v('rarity.legendary', 'glow')    → '0 0 16px rgba(251,191,36,0.8)'

import library from './library.js';
import { drawHeroVisual } from './hero.js';
import { drawMonsterVisual } from './monsters.js';
import { getItemVisual, RARITY_VISUALS } from './items.js';
import { drawArenaBackground, drawDamageFloats } from './effects.js';

// =====================================================
// FUNÇÃO PRINCIPAL: v(key, prop?)
// =====================================================

/**
 * Acessa a Biblioteca Visual centralizada.
 *
 * @param {string} key       Chave visual (ex: 'monster.goblin', 'item.weapon')
 * @param {string} [prop]    Propriedade específica (ex: 'icon', 'color', 'asset', 'emoji')
 * @returns {Object|string|null}  Objeto completo ou valor da propriedade. Null se não encontrada.
 *
 * @example
 *   v('monster.goblin')              → { icon: '👺', color: '#84cc16', asset: 'monsters/goblin' }
 *   v('monster.goblin', 'color')     → '#84cc16'
 *   v('item.weapon', 'icon')         → 'fa-dagger'
 *   v('rarity.legendary', 'glow')    → '0 0 16px rgba(251,191,36,0.8)'
 */
export function v(key, prop = null) {
    const entry = library[key];

    if (!entry) {
        if (import.meta.env?.DEV) {
            console.warn(`[visuals] Chave não encontrada: "${key}"`);
        }
        return null;
    }

    if (prop !== null) {
        return entry[prop] !== undefined ? entry[prop] : null;
    }

    return entry;
}

/**
 * Retorna o caminho completo de URL para um asset da biblioteca.
 * Monta o path como /assets/{asset}.png (primeiro formato tentado pelo carregador).
 *
 * @param {string} key   Chave visual (ex: 'item.weapon', 'resource.gold')
 * @returns {string}     URL do asset (ex: '/assets/items/sword.png') ou string vazia
 */
export function getLibraryAssetUrl(key) {
    const entry = library[key];
    if (!entry || !entry.asset) return '';
    return `/assets/${entry.asset}.png`;
}

/**
 * Retorna o ícone FontAwesome da biblioteca para uso como fallback na UI.
 *
 * @param {string} key        Chave visual (ex: 'building.hut')
 * @param {string} [fallback] Ícone padrão caso a chave não exista
 * @returns {string}          Classe FA (ex: 'fa-house')
 */
export function getLibraryIcon(key, fallback = 'fa-box') {
    const entry = library[key];
    return entry?.icon || fallback;
}

// =====================================================
// RE-EXPORTS — Funções de Renderização do Canvas
// =====================================================

export {
    // Desenho de personagens
    drawHeroVisual,
    drawMonsterVisual,

    // Visuais de itens
    getItemVisual,
    RARITY_VISUALS,

    // Efeitos e ambiente
    drawArenaBackground,
    drawDamageFloats,
};
