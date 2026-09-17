import { getHeroSprite } from './assets.js';

// ==========================================
// VISUALS — HERÓI E COSMÉTICOS DE EQUIPAMENTO
// ==========================================

const BASE_HERO_PALETTE = {
    body:       '#9ca3af',
    helm:       '#fbbf24',
    blade:      '#e5e7eb',
    shield:     '#60a5fa',
    legs:       '#57534e',
    visor:      '#1c1917',
};

/**
 * Desenha o Herói na arena Canvas com cosméticos baseados no equipamento ativo.
 */
export function drawHeroVisual(ctx, x, y, isAttacking, isDead, isHit, equipment = {}, specialization = null) {
    if (isDead) return;

    const ox = isAttacking ? 12 : 0; // avanço de ataque
    let shakeX = 0;
    if (isHit) {
        shakeX = (Math.random() - 0.5) * 8;
    }

    const hx = x + ox + shakeX;

    ctx.save();

    // Sombra no chão
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(hx + 14, y + 62, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. TENTA CARREGAR O SPRITE/SVG CUSTOMIZADO DO HERÓI (AUTOMÁTICO)
    const sprite = getHeroSprite(specialization);
    if (sprite) {
        ctx.drawImage(sprite, hx - 6, y + 6, 52, 52);
        ctx.restore();
        return;
    }

    // 2. FALLBACK PROCEDURAL BASEADO EM EQUIPAMENTOS
    const chestColor  = equipment.chest?.color  || BASE_HERO_PALETTE.body;
    const helmColor   = equipment.helmet?.color || BASE_HERO_PALETTE.helm;
    const weaponColor = equipment.weapon?.color || BASE_HERO_PALETTE.blade;
    const shieldColor = equipment.shield?.color || BASE_HERO_PALETTE.shield;
    const legsColor   = equipment.legs?.color   || BASE_HERO_PALETTE.legs;

    // Pernas (com botas se equipadas)
    ctx.fillStyle = legsColor;
    ctx.fillRect(hx + 2,  y + 48, 10, 14);
    ctx.fillRect(hx + 16, y + 48, 10, 14);

    if (equipment.boots) {
        ctx.fillStyle = equipment.boots.color || '#4b5563';
        ctx.fillRect(hx,      y + 58, 12, 5);
        ctx.fillRect(hx + 16, y + 58, 12, 5);
    }

    // Peitoral / Corpo
    ctx.fillStyle = chestColor;
    ctx.fillRect(hx, y + 10, 28, 38);

    // Detalhe de placa da armadura
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(hx + 4, y + 14, 20, 12);

    // Cabeça (Elmo)
    ctx.fillStyle = helmColor;
    ctx.beginPath();
    ctx.arc(hx + 14, y + 6, 11, 0, Math.PI * 2);
    ctx.fill();

    // Viseira do elmo
    ctx.fillStyle = BASE_HERO_PALETTE.visor;
    ctx.fillRect(hx + 7, y + 5, 14, 4);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(hx + 16, y + 6, 3, 2); // Fenda nos olhos brilho

    // Pluma / Crista do Elmo
    ctx.fillStyle = helmColor === BASE_HERO_PALETTE.helm ? '#dc2626' : helmColor;
    ctx.beginPath();
    ctx.moveTo(hx + 14, y - 5);
    ctx.lineTo(hx + 8,  y + 2);
    ctx.lineTo(hx + 20, y + 2);
    ctx.fill();

    // Escudo (Slot: shield)
    ctx.fillStyle = shieldColor;
    ctx.fillRect(hx - 8, y + 14, 9, 22);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(hx - 6, y + 16, 5, 18);

    // Espada / Lâmina (Slot: weapon)
    ctx.fillStyle = weaponColor;
    if (isAttacking) {
        // Ataque: espada estendida na horizontal com rastro de brilho
        ctx.fillRect(hx + 28, y + 14, 26, 5);
        // Guarda da espada
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(hx + 26, y + 10, 4, 13);
        // Rastro de corte
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(hx + 40, y + 16, 18, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
    } else {
        // Guarda baixa: espada inclinada pronta
        ctx.fillRect(hx + 26, y + 16, 16, 4);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(hx + 24, y + 12, 3, 12);
    }

    ctx.restore();
}
