// ==========================================
// CANVAS — RENDERIZAÇÃO DO COMBATE
// ==========================================

import {
    drawHeroVisual,
    drawMonsterVisual,
    drawArenaBackground,
    drawDamageFloats,
} from './visuals/index.js';
import { PETS, ZONE_BIOMES } from './constants.js';

// Paleta de cores para mensagens flutuantes
const C = {
    dmgNormal:  '#ffffff',
    dmgCrit:    '#fbbf24',
    dmgMonster: '#ef4444',
    levelUp:    '#fbbf24',
    healFloat:  '#4ade80',
};

/**
 * Desenha o herói chamando o motor da Biblioteca de Visuais.
 */
function drawHero(ctx, x, y, isAttacking, isDead, isHit, equipment = {}, specialization = null) {
    drawHeroVisual(ctx, x, y, isAttacking, isDead, isHit, equipment, specialization);
}

/**
 * Desenha o monstro chamando o motor da Biblioteca de Visuais.
 */
function drawMonster(ctx, x, y, monster, timestamp) {
    drawMonsterVisual(ctx, x, y, monster, timestamp);
}

/**
 * Função principal de render do canvas.
 * Chamada pelo game loop a cada frame.
 */
export function renderCanvas(ctx, canvas, state, derived, floats, stars, timestamp, heroAttacking, heroIsHit) {
    if (!ctx || !canvas || !canvas.width || !canvas.height) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = canvas.logicalWidth || (canvas.width / dpr);
    const h = canvas.logicalHeight || (canvas.height / dpr);

    // Desenha Fundo Arena via Biblioteca Visual
    drawArenaBackground(ctx, w, h, stars, timestamp);

    // Atmosfera cromática sutil do Bioma atual (GDD: Seção 8)
    const zone = state.zone || 1;
    const biome = ZONE_BIOMES.find(b => zone >= b.minZone && zone <= b.maxZone) || ZONE_BIOMES[0];
    if (biome) {
        ctx.save();
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, biome.bgTop + '55');
        grad.addColorStop(1, biome.bgBot + '77');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
    }

    // Posições base
    const heroBaseX = w * 0.18;
    const heroBaseY = h - 82;
    const monsterBaseX = w * 0.62;
    const monsterBaseY = h - (state.monster?.isBoss ? 92 : 80);

    // Desenha Herói com cosméticos de equipamentos ou sprite customizado
    drawHero(ctx, heroBaseX, heroBaseY, heroAttacking, state.hero.isDead, heroIsHit, state.equipment || {}, state.hero?.specialization);

    // Desenha Mascote Ativo acompanhando o Herói na Arena (GDD Expansão 3.1)
    if (state.pets?.active && !state.hero.isDead) {
        const petDef = PETS.find(p => p.id === state.pets.active);
        if (petDef) {
            const bobY = Math.sin((timestamp || 0) / 280) * 4;
            const petX = Math.max(18, heroBaseX - 28 + (heroAttacking ? 8 : 0));
            const petY = heroBaseY - 8 + bobY;
            ctx.save();
            ctx.beginPath();
            ctx.arc(petX, petY, 13, 0, Math.PI * 2);
            ctx.fillStyle = (petDef.color || '#fbbf24') + '28';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = (petDef.color || '#fbbf24') + 'aa';
            ctx.stroke();
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(petDef.emoji || '🐾', petX, petY + 1);
            ctx.restore();
        }
    }

    // Desenha Monstro com rotinas visuais específicas + Aura de Campeão de Elite
    if (state.monster && state.isExploring && !state.hero.isDead) {
        if (state.monster.isElite && state.monster.affix) {
            ctx.save();
            const pulse = 1 + Math.sin((timestamp || 0) / 180) * 0.12;
            ctx.beginPath();
            ctx.ellipse(monsterBaseX + 22, monsterBaseY + 28, 28 * pulse, 12 * pulse, 0, 0, Math.PI * 2);
            ctx.fillStyle = (state.monster.affix.color || '#fbbf24') + '33';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = state.monster.affix.color || '#fbbf24';
            ctx.stroke();
            ctx.restore();
        }
        drawMonster(ctx, monsterBaseX, monsterBaseY, state.monster, timestamp);
    }

    // Desenha Floats de Dano
    drawDamageFloats(ctx, floats, (timestamp - (canvas._lastTs || timestamp)) / 1000);
    canvas._lastTs = timestamp;
}

/**
 * Cria um float de dano do herói.
 */
export function makeHeroDmgFloat(canvas, dmg, isCrit = false) {
    if (!canvas) return null;
    const w = canvas.logicalWidth || canvas.width;
    const h = canvas.logicalHeight || canvas.height;
    return {
        t:         isCrit ? `CRÍTICO! ${dmg}` : String(dmg),
        x:         w * 0.62 + 20 + (Math.random() * 30 - 15),
        y:         h - 80 + (Math.random() * 20 - 10),
        c:         isCrit ? C.dmgCrit : C.dmgNormal,
        l:         1,
        size:      isCrit ? 26 : 20,
        vy:        isCrit ? 55 : 40,
        fadeSpeed: isCrit ? 0.8 : 1.0,
    };
}

/**
 * Cria um float de dano recebido pelo herói.
 */
export function makeMonsterDmgFloat(canvas, dmg) {
    if (!canvas) return null;
    const w = canvas.logicalWidth || canvas.width;
    const h = canvas.logicalHeight || canvas.height;
    return {
        t:         String(dmg),
        x:         w * 0.18 + 20 + (Math.random() * 20 - 10),
        y:         h - 75 + (Math.random() * 20 - 10),
        c:         C.dmgMonster,
        l:         1,
        size:      18,
        vy:        35,
        fadeSpeed: 1.1,
    };
}

/**
 * Cria um float de cura ou bônus positivo que surge diretamente em cima do herói.
 */
export function makeHeroHealFloat(canvas, text, color = '#4ade80') {
    if (!canvas) return null;
    const w = canvas.logicalWidth || canvas.width;
    const h = canvas.logicalHeight || canvas.height;
    return {
        t:         text,
        x:         w * 0.18 + 15 + (Math.random() * 16 - 8),
        y:         h - 90 + (Math.random() * 10 - 5),
        c:         color,
        l:         1,
        size:      15,
        vy:        30,
        fadeSpeed: 0.9,
    };
}

/**
 * Cria um float de efeito negativo/status que surge diretamente em cima do monstro.
 */
export function makeMonsterEffectFloat(canvas, text, color = '#f97316') {
    if (!canvas) return null;
    const w = canvas.logicalWidth || canvas.width;
    const h = canvas.logicalHeight || canvas.height;
    return {
        t:         text,
        x:         w * 0.62 + 20 + (Math.random() * 20 - 10),
        y:         h - 95 + (Math.random() * 10 - 5),
        c:         color,
        l:         1,
        size:      14,
        vy:        35,
        fadeSpeed: 0.95,
    };
}

/**
 * Cria um float especial centralizado (Level Up, etc.).
 */
export function makeSpecialFloat(canvas, text, color = C.levelUp) {
    if (!canvas) return null;
    const w = canvas.logicalWidth || canvas.width;
    const h = canvas.logicalHeight || canvas.height;
    return {
        t:         text,
        x:         w / 2,
        y:         h / 2,
        c:         color,
        l:         1,
        size:      24,
        vy:        25,
        fadeSpeed: 0.7,
    };
}

/**
 * Inicializa o canvas e retorna as estrelas geradas.
 */
export function setupCanvas(canvasEl) {
    if (!canvasEl) return [];
    const stars = [];
    const w = canvasEl.parentElement?.getBoundingClientRect().width || 300;
    const h = canvasEl.parentElement?.getBoundingClientRect().height || 200;
    for (let i = 0; i < 50; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * (h * 0.6),
            s: Math.random() * 1.5 + 0.3,
        });
    }
    return stars;
}

/**
 * Atualiza dimensões do canvas quando o container muda.
 * Retorna true se redimensionou.
 */
export function resizeCanvas(canvas, ctx) {
    if (!canvas) return false;
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return false;

    const dpr = window.devicePixelRatio || 1;
    const newWidth = Math.round(rect.width * dpr);
    const newHeight = Math.round(rect.height * dpr);

    if (canvas.logicalWidth !== rect.width || canvas.logicalHeight !== rect.height || canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.logicalWidth  = rect.width;
        canvas.logicalHeight = rect.height;
        canvas.width  = newWidth;
        canvas.height = newHeight;
        if (ctx) {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        return true;
    }
    return false;
}
