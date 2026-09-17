// ==========================================
// VISUALS — GERENCIADOR AUTOMÁTICO DE ASSETS (SPRITES & SVGs)
// ==========================================

const imageCache = new Map();
const failedUrls = new Set();
const loadingUrls = new Set();

const SUPPORTED_EXTS = ['.png', '.svg', '.webp'];

/**
 * Tenta obter uma imagem do cache ou inicia o carregamento assíncrono.
 * Se a URL já tiver falhado (404), retorna null imediatamente para usar o fallback procedural.
 */
function getOrLoadImage(url) {
    if (!url || failedUrls.has(url)) return null;

    if (imageCache.has(url)) {
        const img = imageCache.get(url);
        return (img.complete && img.naturalWidth > 0) ? img : null;
    }

    if (!loadingUrls.has(url)) {
        loadingUrls.add(url);
        const img = new Image();
        img.onload = () => {
            loadingUrls.delete(url);
            imageCache.set(url, img);
        };
        img.onerror = () => {
            loadingUrls.delete(url);
            failedUrls.add(url);
        };
        img.src = url;
    }

    return null;
}

/**
 * Procura um asset com extensões em cascata (.png, .svg, .webp).
 * Se algum formato já estiver em cache, retorna ele.
 * Se não, tenta carregar o primeiro formato que ainda não falhou.
 */
function getAssetWithExtensions(basePath) {
    // 1. Verifica se algum formato já carregou no cache
    for (const ext of SUPPORTED_EXTS) {
        const url = `${basePath}${ext}`;
        if (imageCache.has(url)) {
            const img = imageCache.get(url);
            if (img.complete && img.naturalWidth > 0) return img;
        }
    }

    // 2. Dispara carregamento do primeiro formato que ainda não deu 404
    for (const ext of SUPPORTED_EXTS) {
        const url = `${basePath}${ext}`;
        if (!failedUrls.has(url)) {
            getOrLoadImage(url);
            break;
        }
    }

    return null;
}

/**
 * Retorna o sprite de monstro para renderização no Canvas.
 * Tenta buscar em:
 * 1. /assets/monsters/{monsterId}.(png|svg|webp)
 * 2. /assets/monsters/{baseType}.(png|svg|webp)
 * 3. /assets/monsters/boss_{id}.(png|svg|webp) (se for chefe)
 */
export function getMonsterSprite(monster) {
    if (!monster) return null;

    // Se for Boss
    if (monster.isBoss) {
        const bossSpecial = getAssetWithExtensions(`/assets/monsters/boss_${monster.id}`) ||
                            getAssetWithExtensions(`/assets/monsters/${monster.id}`) ||
                            getAssetWithExtensions('/assets/monsters/boss_dragon') ||
                            getAssetWithExtensions('/assets/monsters/boss_generic');
        if (bossSpecial) return bossSpecial;
    }

    // Monstro por ID exato ou tipo base
    const byId = getAssetWithExtensions(`/assets/monsters/${monster.id}`);
    if (byId) return byId;

    if (monster.baseType) {
        const byBase = getAssetWithExtensions(`/assets/monsters/${monster.baseType}`);
        if (byBase) return byBase;
    }

    return null;
}

/**
 * Retorna o sprite do Herói para renderização no Canvas.
 * Tenta buscar em /assets/hero/hero_{specialization}.(png|svg|webp) ou hero_base.(png|svg|webp)
 */
export function getHeroSprite(specialization = null) {
    if (specialization) {
        const specImg = getAssetWithExtensions(`/assets/hero/hero_${specialization}`);
        if (specImg) return specImg;
    }

    return getAssetWithExtensions('/assets/hero/hero_base');
}

/**
 * Retorna o sprite do Mascote ativo.
 */
export function getPetSprite(petId) {
    if (!petId) return null;
    return getAssetWithExtensions(`/assets/pets/${petId}`);
}
