import { getMonsterSprite } from './assets.js';

// ==========================================
// VISUALS — MONSTROS E CHEFÕES (SPRITES CANVAS)
// ==========================================

/**
 * Renderiza visuais únicos para os diferentes tipos de monstro.
 */
export function drawMonsterVisual(ctx, x, y, monster, timestamp) {
    if (!monster) return;

    // Bounce ocioso (animação de respirar/flutuar)
    const bounce = -Math.abs(Math.sin(timestamp / 600)) * 5;

    // Tremor de impacto (shake ao levar dano)
    let shakeX = 0;
    if (monster.isHit) {
        shakeX = (Math.random() - 0.5) * 10;
    }

    const mx = x + shakeX;
    const my = y + bounce;
    const color = monster.color || '#84cc16';
    const isBoss = monster.isBoss;

    ctx.save();

    // Sombra no chão
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(mx + (isBoss ? 25 : 20), y + (isBoss ? 72 : 64), isBoss ? 35 : 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. TENTA CARREGAR O SPRITE/SVG CUSTOMIZADO (AUTOMÁTICO)
    const sprite = getMonsterSprite(monster);
    if (sprite) {
        const size = isBoss ? 76 : 52;
        ctx.drawImage(sprite, mx - (isBoss ? 12 : 6), my + (isBoss ? -8 : 6), size, size);
        ctx.restore();
        return;
    }

    // 2. FALLBACK PROCEDURAL
    if (isBoss) {
        _drawBoss(ctx, mx, my, color, timestamp);
    } else {
        switch (monster.id) {
            case 'slime':
                _drawSlime(ctx, mx, my, color, timestamp);
                break;
            case 'esqueleto':
                _drawSkeleton(ctx, mx, my, color);
                break;
            case 'goblin':
                _drawGoblin(ctx, mx, my, color);
                break;
            case 'elemental':
                _drawElemental(ctx, mx, my, color, timestamp);
                break;
            default:
                _drawGenericMonster(ctx, mx, my, color);
                break;
        }
    }

    ctx.restore();
}

function _drawSlime(ctx, mx, my, color, timestamp) {
    const squish = Math.sin(timestamp / 400) * 3;
    ctx.fillStyle = color;

    // Corpo gelatinoso
    ctx.beginPath();
    ctx.ellipse(mx + 20, my + 30, 24 + squish, 18 - squish, 0, 0, Math.PI * 2);
    ctx.fill();

    // Brilho superior
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.ellipse(mx + 14, my + 20, 8, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Olhos curiosos
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(mx + 14, my + 26, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 26, my + 26, 3, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(mx + 15, my + 25, 1, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 27, my + 25, 1, 0, Math.PI * 2); ctx.fill();
}

function _drawSkeleton(ctx, mx, my, color) {
    // Crânio
    ctx.fillStyle = color || '#e5e7eb';
    ctx.beginPath(); ctx.arc(mx + 20, my + 14, 12, 0, Math.PI * 2); ctx.fill();

    // Órbitas escuras
    ctx.fillStyle = '#1c1917';
    ctx.beginPath(); ctx.arc(mx + 15, my + 14, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 25, my + 14, 3.5, 0, Math.PI * 2); ctx.fill();

    // Costelas
    ctx.strokeStyle = color || '#e5e7eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(mx + 20, my + 26); ctx.lineTo(mx + 20, my + 48);
    ctx.moveTo(mx + 12, my + 32); ctx.lineTo(mx + 28, my + 32);
    ctx.moveTo(mx + 14, my + 38); ctx.lineTo(mx + 26, my + 38);
    ctx.stroke();

    // Pernas finas
    ctx.fillRect(mx + 13, my + 48, 4, 16);
    ctx.fillRect(mx + 23, my + 48, 4, 16);
}

function _drawGoblin(ctx, mx, my, color) {
    ctx.fillStyle = color || '#84cc16';

    // Corpo esguio
    ctx.fillRect(mx + 8, my + 22, 24, 32);

    // Cabeça
    ctx.beginPath(); ctx.arc(mx + 20, my + 14, 13, 0, Math.PI * 2); ctx.fill();

    // Orelhas pontudas
    ctx.beginPath();
    ctx.moveTo(mx + 7,  my + 14); ctx.lineTo(mx - 4, my + 6); ctx.lineTo(mx + 8, my + 20);
    ctx.moveTo(mx + 33, my + 14); ctx.lineTo(mx + 44, my + 6); ctx.lineTo(mx + 32, my + 20);
    ctx.fill();

    // Olhos malignos
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(mx + 14, my + 12, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 26, my + 12, 3, 0, Math.PI * 2); ctx.fill();

    // Pernas
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(mx + 10, my + 54, 8, 10);
    ctx.fillRect(mx + 22, my + 54, 8, 10);
}

function _drawElemental(ctx, mx, my, color, timestamp) {
    const flameFlicker = Math.sin(timestamp / 150) * 4;

    ctx.fillStyle = color || '#f97316';
    ctx.beginPath();
    ctx.arc(mx + 20, my + 24, 18 + flameFlicker, 0, Math.PI * 2);
    ctx.fill();

    // Núcleo brilhante
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(mx + 20, my + 24, 10, 0, Math.PI * 2);
    ctx.fill();

    // Chama superior
    ctx.fillStyle = color || '#f97316';
    ctx.beginPath();
    ctx.moveTo(mx + 10, my + 16);
    ctx.lineTo(mx + 20, my - 6 + flameFlicker);
    ctx.lineTo(mx + 30, my + 16);
    ctx.fill();
}

function _drawGenericMonster(ctx, mx, my, color) {
    ctx.fillStyle = color || '#84cc16';
    ctx.fillRect(mx, my + 10, 40, 48);

    ctx.beginPath();
    ctx.arc(mx + 20, my + 6, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(mx + 13, my + 4, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 27, my + 4, 4, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#fca5a5';
    ctx.beginPath(); ctx.arc(mx + 14, my + 4, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 28, my + 4, 2, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = color || '#84cc16';
    ctx.fillRect(mx + 4,  my + 58, 12, 12);
    ctx.fillRect(mx + 24, my + 58, 12, 12);
}

function _drawBoss(ctx, mx, my, color, timestamp) {
    const auraPulse = Math.sin(timestamp / 300) * 6;

    // Aura vermelha assustadora em volta do boss
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.beginPath();
    ctx.arc(mx + 25, my + 30, 45 + auraPulse, 0, Math.PI * 2);
    ctx.fill();

    // Corpo Imponente
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(mx - 5, my, 60, 70);

    // Chifres Dracônicos
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    ctx.moveTo(mx + 5,  my); ctx.lineTo(mx - 8,  my - 22); ctx.lineTo(mx + 15, my - 6); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(mx + 45, my); ctx.lineTo(mx + 58, my - 22); ctx.lineTo(mx + 35, my - 6); ctx.fill();

    // Olhos de Chamas Malévolas
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath(); ctx.arc(mx + 14, my + 18, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 35, my + 18, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(mx + 14, my + 18, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 35, my + 18, 4, 0, Math.PI * 2); ctx.fill();

    // Garras
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(mx - 14, my + 25, 12, 6);
    ctx.fillRect(mx + 55, my + 25, 12, 6);
}
