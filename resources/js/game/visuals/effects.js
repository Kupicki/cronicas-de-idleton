// ==========================================
// VISUALS — EFEITOS E PARTÍCULAS
// ==========================================

/**
 * Desenha o fundo da arena com estrelas cintilantes e gradientes.
 */
export function drawArenaBackground(ctx, w, h, stars, timestamp) {
    // Fundo escuro profundo
    ctx.fillStyle = '#0f0c0a';
    ctx.fillRect(0, 0, w, h);

    // Estrelas cintilantes
    stars.forEach(s => {
        ctx.globalAlpha = 0.2 + Math.abs(Math.sin(timestamp / 700 + s.x)) * 0.4;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Chão da Arena
    const groundY = h - 60;
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, groundY, w, 60);

    // Linha divisória
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();
}

/**
 * Desenha os textos flutuantes de dano (floats).
 */
export function drawDamageFloats(ctx, floats, dt) {
    ctx.save();
    ctx.textAlign = 'center';

    for (let i = floats.length - 1; i >= 0; i--) {
        const f = floats[i];
        f.y  -= (f.vy || 40) * dt;
        f.l  -= (f.fadeSpeed || 1.0) * dt;

        if (f.l <= 0) {
            floats.splice(i, 1);
            continue;
        }

        ctx.globalAlpha = Math.max(0, f.l);
        ctx.font        = `bold ${f.size || 18}px "MedievalSharp", cursive`;

        // Contorno escuro para máxima legibilidade e separação visual
        ctx.lineWidth   = 3;
        ctx.strokeStyle = 'rgba(12, 10, 9, 0.92)';
        ctx.strokeText(f.t, f.x, f.y);

        // Preenchimento com sombra
        ctx.fillStyle     = f.c || '#ffffff';
        ctx.shadowColor   = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur    = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.fillText(f.t, f.x, f.y);
    }

    ctx.globalAlpha   = 1;
    ctx.shadowBlur    = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.restore();
}
