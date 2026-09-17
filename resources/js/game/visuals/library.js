// ==========================================
// VISUALS — BIBLIOTECA VISUAL CENTRALIZADA
// ==========================================
//
// Dicionário único de todos os dados visuais do jogo.
// Espelha a arquitetura do sistema de termos (lang/pt-br.js),
// servindo como Single Source of Truth para ícones, cores,
// emojis e caminhos de asset.
//
// USO:
//   import { v } from './visuals/index.js';
//
//   v('monster.goblin')              → { icon: '👺', color: '#84cc16', asset: 'monsters/goblin', ... }
//   v('monster.goblin', 'color')     → '#84cc16'
//   v('item.weapon', 'icon')         → 'fa-dagger'
//   v('resource.gold', 'asset')      → 'resources/gold'
//   v('rarity.legendary', 'glow')    → '0 0 16px rgba(251,191,36,0.8)'
//
// CONVENÇÕES:
//   - Chave: 'categoria.identificador' (ex: 'monster.goblin', 'item.weapon')
//   - icon:    Classe FontAwesome (para fallback na UI HTML)
//   - emoji:   Emoji Unicode (para logs, badges e fallback textual)
//   - color:   Cor HEX primária do elemento
//   - asset:   Caminho relativo a /assets/ SEM extensão (o carregador resolve .png/.svg/.webp)
//   - aliases: Nomes alternativos de arquivo para fallback em cascata
//   - Campos extras variam por categoria (ex: border, glow, auraColor para raridades)

export default {

    // =====================================================
    // 👑 LOGOTIPO
    // =====================================================
    'logo':                          { asset: 'logo' },

    // =====================================================
    // 📜 MENU LATERAL (ABAS DE NAVEGAÇÃO)
    // =====================================================
    'menu.city':                     { icon: 'fa-city',               emoji: '🏛️', asset: 'menu/city' },
    'menu.inventory':                { icon: 'fa-suitcase',           emoji: '🎒', asset: 'menu/inventory' },
    'menu.explore':                  { icon: 'fa-compass',            emoji: '⚔️', asset: 'menu/explore' },
    'menu.tower':                    { icon: 'fa-chess-rook',         emoji: '🗼', asset: 'menu/tower' },
    'menu.domain':                   { icon: 'fa-fort-awesome',       emoji: '🏰', asset: 'menu/domain' },
    'menu.companions':               { icon: 'fa-paw',               emoji: '🐾', asset: 'menu/companions' },
    'menu.bestiary':                 { icon: 'fa-book-skull',         emoji: '📖', asset: 'menu/bestiary' },
    'menu.stats':                    { icon: 'fa-chart-line',         emoji: '📊', asset: 'menu/stats' },
    'menu.ascension':                { icon: 'fa-star',               emoji: '🌌', asset: 'menu/ascension' },

    // =====================================================
    // 🛡️ EQUIPAMENTOS & MOCHILA
    // =====================================================
    'item.weapon':                   { icon: 'fa-dagger',             emoji: '⚔️', asset: 'items/sword',  aliases: ['items/weapon'] },
    'item.shield':                   { icon: 'fa-shield-halved',      emoji: '🛡️', asset: 'items/shield' },
    'item.helmet':                   { icon: 'fa-crown',              emoji: '👑', asset: 'items/helmet' },
    'item.chest':                    { icon: 'fa-shirt',              emoji: '🦺', asset: 'items/armor',  aliases: ['items/chest'] },
    'item.legs':                     { icon: 'fa-socks',              emoji: '👖', asset: 'items/legs' },
    'item.boots':                    { icon: 'fa-shoe-prints',        emoji: '👢', asset: 'items/boot',   aliases: ['items/boots'] },
    'item.ring':                     { icon: 'fa-ring',               emoji: '💍', asset: 'items/ring' },
    'item.amulet':                   { icon: 'fa-gem',                emoji: '📿', asset: 'items/amulet' },

    // Relíquias Míticas de Chefes
    'item.relic_blade':              { icon: 'fa-khanda',             emoji: '🗡️', color: '#ef4444', asset: 'items/relic_blade' },
    'item.relic_shield':             { icon: 'fa-shield',             emoji: '🛡️', color: '#38bdf8', asset: 'items/relic_shield' },
    'item.relic_chest':              { icon: 'fa-feather',            emoji: '🪶', color: '#a855f7', asset: 'items/relic_chest' },

    // =====================================================
    // 🪙 MOEDAS & RECURSOS
    // =====================================================
    'resource.gold':                 { icon: 'fa-coins',              emoji: '🪙', color: '#fbbf24', asset: 'resources/gold' },
    'resource.diamonds':             { icon: 'fa-gem',                emoji: '💎', color: '#38bdf8', asset: 'resources/diamonds', aliases: ['resources/diamond'] },
    'resource.wood':                 { icon: 'fa-tree',               emoji: '🌲', color: '#22c55e', asset: 'resources/wood' },
    'resource.iron':                 { icon: 'fa-cubes-stacked',      emoji: '⛏️', color: '#94a3b8', asset: 'resources/iron' },
    'resource.essence':              { icon: 'fa-bolt',               emoji: '✨', color: '#a855f7', asset: 'resources/essence' },
    'resource.scrap':                { icon: 'fa-cogs',               emoji: '⚙️', color: '#9ca3af', asset: 'resources/scrap' },

    // =====================================================
    // 🎨 RARIDADES
    // =====================================================
    'rarity.common':                 { color: '#9ca3af', border: '#4b5563', glow: 'none',                                    auraColor: null },
    'rarity.uncommon':               { color: '#4ade80', border: '#15803d', glow: '0 0 6px rgba(74,222,128,0.4)',             auraColor: '#4ade80' },
    'rarity.rare':                   { color: '#60a5fa', border: '#1d4ed8', glow: '0 0 8px rgba(96,165,250,0.5)',             auraColor: '#60a5fa' },
    'rarity.epic':                   { color: '#c084fc', border: '#7e22ce', glow: '0 0 12px rgba(192,132,252,0.6)',           auraColor: '#c084fc' },
    'rarity.legendary':              { color: '#fbbf24', border: '#b45309', glow: '0 0 16px rgba(251,191,36,0.8)',            auraColor: '#fbbf24' },
    'rarity.mythic':                 { color: '#dc2626', border: '#991b1b', glow: '0 0 20px rgba(220,38,38,0.9)',             auraColor: '#dc2626' },

    // =====================================================
    // 🏛️ VILA DE IDLETON (CIDADE)
    // =====================================================
    'city.blacksmith':               { icon: 'fa-hammer',             emoji: '⚒️', asset: 'city/blacksmith' },
    'city.tavern':                   { icon: 'fa-beer-mug-empty',     emoji: '🍺', asset: 'city/tavern' },
    'city.oracle':                   { icon: 'fa-eye',                emoji: '🔮', asset: 'city/oracle' },
    'city.market':                   { icon: 'fa-store',              emoji: '🏪', asset: 'city/market' },
    'city.quests_board':             { icon: 'fa-scroll',             emoji: '📜', asset: 'city/quests_board' },

    // =====================================================
    // 🏰 DOMÍNIO REAL (CONSTRUÇÕES)
    // =====================================================
    'building.fortification':        { icon: 'fa-chess-rook',         emoji: '🏰', color: '#78716c', asset: 'domain/fortification' },
    'building.hut':                  { icon: 'fa-house',              emoji: '🛖', color: '#a16207', asset: 'domain/hut' },
    'building.farm':                 { icon: 'fa-wheat-awn',          emoji: '🌾', color: '#eab308', asset: 'domain/farm' },
    'building.workshop':             { icon: 'fa-hammer',             emoji: '🔨', color: '#f97316', asset: 'domain/workshop' },
    'building.mine':                 { icon: 'fa-gem',                emoji: '⛏️', color: '#94a3b8', asset: 'domain/mine' },
    'building.market':               { icon: 'fa-store',              emoji: '🏪', color: '#22c55e', asset: 'domain/market' },
    'building.library':              { icon: 'fa-book-bookmark',      emoji: '📚', color: '#a855f7', asset: 'domain/library' },
    'building.garrison':             { icon: 'fa-shield-halved',      emoji: '⚔️', color: '#ef4444', asset: 'domain/garrison' },
    'building.treasury':             { icon: 'fa-coins',              emoji: '💰', color: '#fbbf24', asset: 'domain/treasury' },
    'building.castle':               { icon: 'fa-chess-rook',         emoji: '🏰', color: '#60a5fa', asset: 'domain/castle' },

    // =====================================================
    // 🌌 ASCENSÃO CÓSMICA & BÊNÇÃOS
    // =====================================================
    'ascension.ancestral_diamond':   { icon: 'fa-gem',                emoji: '💎', color: '#e0f2fe', asset: 'ascension/ancestral_diamond', aliases: ['ascension/ancestral diamond', 'ascension/ancient_diamond'] },
    'ascension.perk_dmg':            { icon: 'fa-khanda',             emoji: '⚔️', color: '#f87171' },
    'ascension.perk_gold':           { icon: 'fa-coins',              emoji: '🪙', color: '#fbbf24' },
    'ascension.perk_xp':             { icon: 'fa-brain',              emoji: '🧠', color: '#c084fc' },
    'ascension.perk_drop':           { icon: 'fa-magnet',             emoji: '🧲', color: '#38bdf8' },
    // Bênçãos do GUIA (futuras)
    'ascension.eternal_str':         { icon: 'fa-fist-raised',        emoji: '✊', color: '#ef4444', asset: 'ascension/eternal_str' },
    'ascension.eternal_def':         { icon: 'fa-shield',             emoji: '🛡️', color: '#fbbf24', asset: 'ascension/eternal_def' },
    'ascension.eternal_hp':          { icon: 'fa-heart',              emoji: '❤️', color: '#dc2626', asset: 'ascension/eternal_hp' },
    'ascension.resource_master':     { icon: 'fa-suitcase',           emoji: '🎒', color: '#22c55e', asset: 'ascension/resource_master' },
    'ascension.golden_touch':        { icon: 'fa-hand-sparkles',      emoji: '✋', color: '#fbbf24', asset: 'ascension/golden_touch' },
    'ascension.double_loot':         { icon: 'fa-eye',                emoji: '👁️', color: '#a855f7', asset: 'ascension/double_loot' },
    'ascension.fast_hunter':         { icon: 'fa-feather',            emoji: '🏹', color: '#38bdf8', asset: 'ascension/fast_hunter' },
    'ascension.crit_master':         { icon: 'fa-burst',              emoji: '💥', color: '#ef4444', asset: 'ascension/crit_master' },

    // =====================================================
    // 🐾 COMPANHEIROS & MASCOTES (PETS)
    // =====================================================
    'pet.coruja':                    { icon: 'fa-feather-pointed',    emoji: '🦉', color: '#fbbf24', asset: 'pets/coruja' },
    'pet.pantera':                   { icon: 'fa-paw',                emoji: '🐆', color: '#a855f7', asset: 'pets/pantera' },
    'pet.rato_ladrao':               { icon: 'fa-coins',              emoji: '🐀', color: '#f59e0b', asset: 'pets/rato_ladrao' },
    'pet.raposa':                    { icon: 'fa-clover',             emoji: '🦊', color: '#ea580c', asset: 'pets/raposa' },
    'pet.corvo_arcano':              { icon: 'fa-dove',               emoji: '🦅', color: '#38bdf8', asset: 'pets/corvo_arcano' },
    'pet.lobo_alfa':                 { icon: 'fa-shield-dog',         emoji: '🐺', color: '#ef4444', asset: 'pets/lobo_alfa' },
    'pet.salamandra':                { icon: 'fa-fire-flame-curved',  emoji: '🦎', color: '#f97316', asset: 'pets/salamandra' },
    'pet.golem_mini':                { icon: 'fa-cubes',              emoji: '🗿', color: '#78716c', asset: 'pets/golem_mini' },

    // =====================================================
    // 👹 MONSTROS & CHEFÕES
    // =====================================================
    'monster.goblin':                { icon: 'fa-skull',              emoji: '👺', color: '#84cc16', asset: 'monsters/goblin' },
    'monster.slime':                 { icon: 'fa-droplet',            emoji: '🟢', color: '#22c55e', asset: 'monsters/slime' },
    'monster.lobo':                  { icon: 'fa-dog',                emoji: '🐺', color: '#9ca3af', asset: 'monsters/lobo' },
    'monster.esqueleto':             { icon: 'fa-skull-crossbones',   emoji: '💀', color: '#e5e7eb', asset: 'monsters/esqueleto' },
    'monster.orc':                   { icon: 'fa-skull',              emoji: '👹', color: '#16a34a', asset: 'monsters/orc' },
    'monster.zumbi':                 { icon: 'fa-skull',              emoji: '🧟', color: '#65a30d', asset: 'monsters/zumbi' },
    'monster.bandido':               { icon: 'fa-mask',               emoji: '🗡️', color: '#78716c', asset: 'monsters/bandido' },
    'monster.kobold':                { icon: 'fa-skull',              emoji: '🦎', color: '#f59e0b', asset: 'monsters/kobold' },
    'monster.morcego':               { icon: 'fa-skull',              emoji: '🦇', color: '#7c3aed', asset: 'monsters/morcego' },
    'monster.harpia':                { icon: 'fa-feather',            emoji: '🦅', color: '#0ea5e9', asset: 'monsters/harpia' },
    'monster.aranha':                { icon: 'fa-spider',             emoji: '🕷️', color: '#dc2626', asset: 'monsters/aranha' },
    'monster.golem':                 { icon: 'fa-mountain',           emoji: '🗿', color: '#57534e', asset: 'monsters/golem' },
    'monster.elemental':             { icon: 'fa-fire',               emoji: '🔥', color: '#f97316', asset: 'monsters/elemental' },
    'monster.boss_dragon':           { icon: 'fa-dragon',             emoji: '🐉', color: '#dc2626', asset: 'monsters/boss_dragon' },
    'monster.boss_generic':          { icon: 'fa-crown',              emoji: '👑', color: '#7f1d1d', asset: 'monsters/boss_generic' },

    // =====================================================
    // 🗡️ HERÓI & ESPECIALIZAÇÕES
    // =====================================================
    'hero.base':                     { icon: 'fa-user',               emoji: '⚔️', color: '#9ca3af', asset: 'hero/hero_base' },
    'hero.berserker':                { icon: 'fa-fire-flame-curved',  emoji: '🔥', color: '#ef4444', asset: 'hero/hero_berserker' },
    'hero.paladin':                  { icon: 'fa-cross',              emoji: '✝️', color: '#facc15', asset: 'hero/hero_paladin' },
    'hero.arcane_mage':              { icon: 'fa-wand-magic-sparkles', emoji: '🔮', color: '#a855f7', asset: 'hero/hero_archmage' },
    'hero.shadow_thief':             { icon: 'fa-mask',               emoji: '🥷', color: '#10b981', asset: 'hero/hero_shadow_thief' },

    // =====================================================
    // 📜 QUADRO DE MISSÕES DA VILA
    // =====================================================
    'quest.kill_monsters':           { icon: 'fa-skull-crossbones',   emoji: '💀', color: '#f87171', asset: 'quests/kill_monsters' },
    'quest.earn_gold':               { icon: 'fa-coins',              emoji: '🪙', color: '#fbbf24', asset: 'quests/earn_gold' },
    'quest.gather_materials':        { icon: 'fa-cogs',               emoji: '⚙️', color: '#9ca3af', asset: 'quests/gather_materials' },
    'quest.spend_gold':              { icon: 'fa-shop',               emoji: '🏪', color: '#34d399', asset: 'quests/spend_gold' },
    'quest.upgrade_equipment':       { icon: 'fa-hammer',             emoji: '🔨', color: '#fb923c', asset: 'quests/upgrade_equipment' },

    // =====================================================
    // 🎲 TAVERNA — JOGOS DE APOSTA
    // =====================================================
    'tavern.coin_heads':             { icon: 'fa-crown',              emoji: '👑', color: '#fbbf24', asset: 'tavern/coin_heads' },
    'tavern.coin_tails':             { icon: 'fa-shield',             emoji: '🛡️', color: '#9ca3af', asset: 'tavern/coin_tails' },
    'tavern.dice_hero':              { icon: 'fa-dice',               emoji: '🎲', color: '#4ade80', asset: 'tavern/dice_hero' },
    'tavern.dice_npc':               { icon: 'fa-dice',               emoji: '🎲', color: '#ef4444', asset: 'tavern/dice_npc' },
    'tavern.streak_fire':            { icon: 'fa-fire',               emoji: '🔥', color: '#f97316', asset: 'tavern/streak_fire' },

    // =====================================================
    // 🗼 TORRE DOS DESAFIOS & MODIFICADORES CÓSMICOS
    // =====================================================
    'tower.portal':                  { icon: 'fa-dungeon',            emoji: '🌀', color: '#7c3aed', asset: 'tower/tower_portal' },
    'tower.frenzy':                  { icon: 'fa-bolt',               emoji: '⚡', color: '#fbbf24', asset: 'tower/mod_frenzy' },
    'tower.curse':                   { icon: 'fa-skull-crossbones',   emoji: '☠️', color: '#ef4444', asset: 'tower/mod_curse' },
    'tower.elements':                { icon: 'fa-fire',               emoji: '🌪️', color: '#f97316', asset: 'tower/mod_elements' },
    'tower.armored':                 { icon: 'fa-shield',             emoji: '🛡️', color: '#94a3b8', asset: 'tower/mod_armored' },
    'tower.berserk':                 { icon: 'fa-fire-flame-curved',  emoji: '🔥', color: '#dc2626', asset: 'tower/mod_berserk' },
    'tower.regen':                   { icon: 'fa-heart-pulse',        emoji: '💚', color: '#22c55e', asset: 'tower/mod_regen' },
    'tower.silence':                 { icon: 'fa-volume-xmark',       emoji: '🤐', color: '#7c3aed', asset: 'tower/mod_silence' },
    'tower.thorns':                  { icon: 'fa-burst',              emoji: '🌿', color: '#a855f7', asset: 'tower/mod_thorns' },
    'tower.gravity':                 { icon: 'fa-weight-hanging',     emoji: '⬇️', color: '#64748b', asset: 'tower/mod_gravity' },
    'tower.drain':                   { icon: 'fa-droplet',            emoji: '🩸', color: '#06b6d4', asset: 'tower/mod_drain' },
    'tower.amplify':                 { icon: 'fa-arrows-up-down',     emoji: '📈', color: '#e11d48', asset: 'tower/mod_amplify' },
    'tower.wither':                  { icon: 'fa-biohazard',          emoji: '☣️', color: '#84cc16', asset: 'tower/mod_wither' },

    // =====================================================
    // ⚡ ORÁCULO — BÊNÇÃOS
    // =====================================================
    'oracle.gold_from_buildings':    { icon: 'fa-coins',              emoji: '🪙', color: '#fbbf24' },
    'oracle.attack_bonus':           { icon: 'fa-khanda',             emoji: '⚔️', color: '#ef4444' },
    'oracle.xp_from_monsters':       { icon: 'fa-scroll',             emoji: '📜', color: '#a855f7' },

    // =====================================================
    // ✨ ENCANTAMENTOS ELEMENTAIS
    // =====================================================
    'enchant.fire':                  { icon: 'fa-fire',               emoji: '🔥', color: '#f97316' },
    'enchant.lightning':             { icon: 'fa-bolt',               emoji: '⚡', color: '#fbbf24' },
    'enchant.ice':                   { icon: 'fa-snowflake',          emoji: '❄️', color: '#38bdf8' },
    'enchant.vampiric':              { icon: 'fa-droplet',            emoji: '🩸', color: '#ef4444' },

    // =====================================================
    // 🔗 BÔNUS DE CONJUNTO (ITEM SETS)
    // =====================================================
    'set.protector':                 { icon: 'fa-shield-halved',      emoji: '🛡️', color: '#3b82f6' },
    'set.storm':                     { icon: 'fa-bolt',               emoji: '⚡', color: '#fbbf24' },
    'set.greedy':                    { icon: 'fa-coins',              emoji: '💰', color: '#eab308' },

    // =====================================================
    // 🐾 EXPEDIÇÕES DE MASCOTES
    // =====================================================
    'expedition.forest':             { icon: 'fa-tree',               emoji: '🌲', color: '#10b981' },
    'expedition.mines':              { icon: 'fa-mountain',           emoji: '⛰️', color: '#94a3b8' },
    'expedition.volcano':            { icon: 'fa-volcano',            emoji: '🌋', color: '#f97316' },
    'expedition.ruins':              { icon: 'fa-monument',           emoji: '🏛️', color: '#eab308' },

    // =====================================================
    // 🎒 AÇÕES DE AUTO-LOOT
    // =====================================================
    'autoloot.none':                 { icon: 'fa-box-archive',        emoji: '📦' },
    'autoloot.sell':                 { icon: 'fa-coins',              emoji: '🪙' },
    'autoloot.dismantle':            { icon: 'fa-cogs',               emoji: '⚙️' },

    // =====================================================
    // ⚒️ FORJA SOB ENCOMENDA
    // =====================================================
    'craft.forge_steel':             { icon: 'fa-hammer',             emoji: '⚒️', color: '#60a5fa' },
    'craft.forge_master':            { icon: 'fa-hammer',             emoji: '⚒️', color: '#c084fc' },
    'craft.forge_mythic':            { icon: 'fa-hammer',             emoji: '⚒️', color: '#f43f5e' },

    // =====================================================
    // 🏪 MERCADO — ITENS À VENDA
    // =====================================================
    'market.wood':                   { icon: 'fa-tree',               emoji: '🌲', color: '#10b981' },
    'market.scrap':                  { icon: 'fa-cogs',               emoji: '⚙️', color: '#9ca3af' },
    'market.iron':                   { icon: 'fa-cubes-stacked',      emoji: '⛏️', color: '#cbd5e1' },
    'market.essence':                { icon: 'fa-bolt',               emoji: '✨', color: '#a855f7' },
};
