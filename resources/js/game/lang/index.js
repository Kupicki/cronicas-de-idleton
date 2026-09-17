/**
 * i18n Engine — Crônicas de Idleton
 * =====================================
 *
 * USO BÁSICO:
 *   import { t, setLang, registerLang } from './lang/index.js';
 *
 *   t('stat.str')                           → "Força"
 *   t('combat.kill', { name: 'Goblin', gold: 50, xp: 10 })
 *                                           → "Derrotou Goblin (+50 Ouro, +10 XP)"
 *
 * ADICIONANDO NOVO IDIOMA:
 *   1. Crie o arquivo: resources/js/game/lang/es.js
 *      (copie pt-br.js como base e traduza os valores)
 *   2. Importe e registre aqui:
 *      import esDict from './es.js';
 *      registerLang('es', esDict);
 *   3. No jogo, chame: setLang('es')
 */

import ptBr from './pt-br.js';
import en   from './en.js';

// ---- Repositório de idiomas ----
const _langs = {
    'pt-br': ptBr,
    'en':    en,
};

let _current = 'pt-br';

// =====================================================
// FUNÇÕES PÚBLICAS
// =====================================================

/**
 * Define o idioma ativo.
 * @param {string} lang  Código do idioma (ex: 'pt-br', 'en', 'es')
 */
export function setLang(lang) {
    if (_langs[lang]) {
        _current = lang;
    } else {
        console.warn(`[i18n] Idioma "${lang}" não registrado.`);
    }
}

/**
 * Retorna o código do idioma atual.
 * @returns {string}
 */
export function getLang() {
    return _current;
}

/**
 * Lista todos os idiomas disponíveis.
 * @returns {string[]}
 */
export function getAvailableLangs() {
    return Object.keys(_langs);
}

/**
 * Registra um novo idioma em tempo de execução.
 * Útil para carregar idiomas de forma lazy ou em DLCs.
 *
 * @param {string} code   Código do idioma (ex: 'es')
 * @param {Object} dict   Objeto com as strings { 'chave': 'valor' }
 */
export function registerLang(code, dict) {
    _langs[code] = { ...(dict) };
}

/**
 * Função principal de tradução.
 *
 * @param {string} key       Chave da string (ex: 'stat.str')
 * @param {Object} [params]  Variáveis para interpolação (ex: { name: 'Goblin', gold: 50 })
 * @returns {string}         String traduzida. Se não encontrada: retorna a própria chave.
 *
 * @example
 *   t('stat.str')                           → "Força"
 *   t('combat.kill', { name:'Goblin', gold:50, xp:10 })
 *                                           → "Derrotou Goblin (+50 Ouro, +10 XP)"
 */
export function t(key, params = {}) {
    const dict = _langs[_current] ?? _langs['pt-br'];
    let str    = dict[key];

    // Fallback 1: tenta o PT-BR se o idioma atual não tiver a chave
    if (str === undefined) {
        str = _langs['pt-br']?.[key];
    }

    // Fallback 2: retorna a própria chave (facilita detectar strings não traduzidas)
    if (str === undefined) {
        if (import.meta.env?.DEV) {
            console.warn(`[i18n] Chave não encontrada: "${key}"`);
        }
        return key;
    }

    // Interpolação de variáveis: {param} → valor
    if (params && typeof params === 'object') {
        str = str.replace(/\{(\w+)\}/g, (match, k) => {
            return Object.prototype.hasOwnProperty.call(params, k)
                ? String(params[k])
                : match; // mantém {param} se não fornecido
        });
    }

    return str;
}

// =====================================================
// METADADOS DE IDIOMAS (para UI de seleção)
// =====================================================

export const LANG_META = {
    'pt-br': { label: 'Português (BR)', flag: '🇧🇷', native: 'Português' },
    'en':    { label: 'English (US)',   flag: '🇺🇸', native: 'English'    },
    // Adicione aqui ao registrar novos idiomas:
    // 'es':  { label: 'Español',        flag: '🇪🇸', native: 'Español'    },
};
