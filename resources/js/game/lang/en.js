/**
 * Dicionário EN (English) — Crônicas de Idleton
 * For future internationalization — based on the same keys as pt-br.js
 *
 * Status: TRANSLATION READY
 * To activate: setLang('en') in the game settings
 */

export default {

    // =====================================================
    // NAVIGATION & STRUCTURE
    // =====================================================
    'game.title':                   'Chronicles of Idleton',
    'game.subtitle':                'An Idle Text RPG',

    'nav.tab.city':                 'City',
    'nav.tab.inventory':            'Inventory',
    'nav.tab.explore':              'Exploration',
    'nav.tab.domain':               'Domain',
    'nav.tab.bestiary':             'Bestiary',
    'nav.tab.ascension':            'Ascension',
    'nav.settings':                 'Settings',
    'nav.menu':                     'Main Menu',

    // =====================================================
    // GENERAL BUTTONS
    // =====================================================
    'btn.buy':                      'Buy',
    'btn.upgrade':                  'Upgrade',
    'btn.equip':                    'Equip',
    'btn.sell':                     'Sell',
    'btn.dismantle':                'Dismantle',
    'btn.dismantle.hint':           '(Yields Scrap)',
    'btn.save':                     'Save Now',
    'btn.reset':                    'Reset Progress',
    'btn.close':                    'Close',
    'btn.rename':                   'Rename',
    'btn.allocate':                 'ALLOCATE',
    'btn.explore':                  'EXPLORE',
    'btn.stop':                     'STOP',
    'btn.confirm':                  'Confirm',
    'btn.cancel':                   'Cancel',
    'btn.build':                    'Build',
    'btn.learn':                    'Learn',

    // =====================================================
    // RESOURCES
    // =====================================================
    'resource.gold':                'Gold',
    'resource.scrap':               'Scrap',
    'resource.diamond':             'Diamond',
    'resource.wood':                'Wood',
    'resource.essence':             'Essence',
    'resource.iron':                'Iron',

    // =====================================================
    // BASE STATS
    // =====================================================
    'stat.str':                     'Strength',
    'stat.def':                     'Defense',
    'stat.int':                     'Intelligence',
    'stat.agi':                     'Agility',
    'stat.lck':                     'Luck',
    'stat.per':                     'Perception',
    'stat.reg':                     'Regeneration',
    'stat.hp':                      'HP',
    'stat.energy':                  'Energy',
    'stat.mana':                    'Mana',
    'stat.atkSpeed':                'Atk. Speed',
    'stat.hpMax':                   'Max HP',

    'stat.tip.str':                 '+1 Attack',
    'stat.tip.def':                 '+3 Defense, +3 HP',
    'stat.tip.int':                 '+Mana Regen',
    'stat.tip.agi':                 '+Atk. Speed / Energy',
    'stat.tip.lck':                 '+Drop Rate',
    'stat.tip.per':                 '+Loot Quality',
    'stat.tip.reg':                 '+HP Regen/s',

    'stat.points.title':            'Attribute Points',
    'stat.points.available':        'Available',
    'stat.points.tip':              '+2 points per level (+2 bonus every 10 levels)',
    'stat.points.none':             'No attribute points available.',

    // =====================================================
    // RARITIES
    // =====================================================
    'rarity.common':                'Common',
    'rarity.uncommon':              'Uncommon',
    'rarity.rare':                  'Rare',
    'rarity.epic':                  'Epic',
    'rarity.legendary':             'Legendary',
    'rarity.mythic':                'Mythic',

    // =====================================================
    // EQUIPMENT TYPES
    // =====================================================
    'item.weapon':                  'Sword',
    'item.shield':                  'Shield',
    'item.helmet':                  'Helmet',
    'item.chest':                   'Chestplate',
    'item.legs':                    'Greaves',
    'item.boots':                   'Boots',
    'item.ring':                    'Ring',
    'item.amulet':                  'Amulet',

    // =====================================================
    // PASSIVE SKILLS
    // =====================================================
    'skill.flat_strength':          'Brute Force',
    'skill.flat_strength.desc':     '+5 Attack/level',
    'skill.flat_resilience':        'Ironhide',
    'skill.flat_resilience.desc':   '+20 Max HP/level',
    'skill.percent_strength':       'Berserker',
    'skill.percent_strength.desc':  '+2% Attack/level',
    'skill.thick_hide':             'Tough Skin',
    'skill.thick_hide.desc':        '+5 Defense/level',
    'skill.golden_hands':           'Golden Touch',
    'skill.golden_hands.desc':      '+5% Gold/level',

    'skill.title':                  'Skills',
    'skill.cost':                   'Cost: {cost} SP',
    'skill.max_level':              'Max Level',
    'skill.buy_success':            'Learned {name} (Lv. {level})',
    'skill.no_pe':                  'Not enough skill points.',
    'skill.invalid':                'Invalid skill.',

    // =====================================================
    // ACTIVE ABILITIES
    // =====================================================
    'ability.focused_attack':       'Focused Strike',
    'ability.focused_attack.desc':  '3× Damage · 30 ⚡ · 8s CD',
    'ability.focused_attack.ready': 'READY',
    'ability.focused_attack.cd':    '{s}s',
    'ability.no_energy':            'Not enough Energy for Focused Strike! (30 ⚡)',

    // =====================================================
    // DOMAIN BUILDINGS
    // =====================================================
    'building.hut':                 'Hut',
    'building.farm':                'Farm',
    'building.workshop':            'Workshop',
    'building.mine':                'Mine',
    'building.market':              'Market',
    'building.library':             'Library',
    'building.garrison':            'Garrison',
    'building.treasury':            'Treasury',
    'building.castle':              'Castle',

    'domain.title':                 'Domain',
    'domain.subtitle':              'Build and expand your city.',
    'domain.level':                 'Level {qty}',
    'domain.owned':                 'Owned: {qty}',
    'domain.prod':                  '+{prod}/s',
    'domain.next_cost':             'Next: {cost} Gold',
    'domain.buy_success':           'Built {name}!',
    'domain.no_gold':               'Not enough Gold to build.',

    // =====================================================
    // MONSTERS — Base Types
    // =====================================================
    'monster.goblin':               'Goblin',
    'monster.wolf':                 'Wolf',
    'monster.orc':                  'Orc',
    'monster.spider':               'Spider',
    'monster.golem':                'Golem',
    'monster.bat':                  'Bat',
    'monster.skeleton':             'Skeleton',
    'monster.harpy':                'Harpy',
    'monster.troll':                'Troll',
    'monster.demon':                'Demon',
    'monster.dragon':               'Dragon',
    'monster.lich':                 'Lich',
    'monster.elemental':            'Elemental',

    // Adjectives for procedural naming
    'adj.gelido':                   'Frozen',
    'adj.feral':                    'Feral',
    'adj.sombrio':                  'Grim',
    'adj.corrupto':                 'Corrupted',
    'adj.anciao':                   'Ancient',
    'adj.maldito':                  'Cursed',
    'adj.feroz':                    'Fierce',
    'adj.maligno':                  'Malevolent',
    'adj.voraz':                    'Voracious',
    'adj.colossal':                 'Colossal',
    'adj.fantasmal':                'Spectral',
    'adj.eterno':                   'Eternal',
    'adj.pestilento':               'Pestilent',
    'adj.cavernicola':              'Cave-Dweller',

    // Elements for procedural naming
    'elem.fire':                    'of Fire',
    'elem.ice':                     'of Ice',
    'elem.shadow':                  'of Shadows',
    'elem.lightning':               'of Lightning',
    'elem.earth':                   'of Earth',
    'elem.void':                    'of the Void',
    'elem.blood':                   'of Blood',
    'elem.plague':                  'of Plague',
    'elem.storm':                   'of the Storm',
    'elem.abyss':                   'of the Abyss',

    // =====================================================
    // COMBAT & EXPLORATION
    // =====================================================
    'combat.kill':                  'Defeated {name} (+{gold} Gold, +{xp} XP)',
    'combat.loot_drop':             'Drop: {name}!',
    'combat.loot_full':             'Inventory full! Loot lost.',
    'combat.level_up':              'LEVEL UP! Level {level} ✨',
    'combat.level_up_float':        'LEVEL UP!',
    'combat.zone_advance':          '⚔️ Advanced to Zone {zone}!',
    'combat.zone_unlock':           'Zone {zone} unlocked!',
    'combat.defeated':              'You were defeated! Recovering HP...',
    'combat.revived':               'Hero recovered! Returning to battle...',
    'combat.start':                 'Adventure started!',
    'combat.focused_attack_hit':    '⚡ Focused Strike on {name}: -{dmg} HP!',
    'combat.boss_label':            'BOSS!',
    'combat.zone_progress':         '{kills}/10',
    'combat.zone_label':            'Zone',

    'explore.overlay.defeated':     'DEFEATED',
    'explore.recovering':           'Recovering... {pct}%',

    // =====================================================
    // INVENTORY & ITEMS
    // =====================================================
    'inventory.title':              'Inventory',
    'inventory.empty_slot':         'Empty',
    'inventory.sell_success':       'Sold {name} for {price} Gold',
    'inventory.equip_success':      'Equipped {name}',
    'inventory.dismantle_success':  'Dismantled {name}: +{scraps} Scrap',
    'inventory.dismantle_gold':     ' +{gold} Gold',

    // =====================================================
    // BLACKSMITH
    // =====================================================
    'smith.title':                  'Blacksmith',
    'smith.subtitle':               'Upgrade your equipment using Scrap and Gold.',
    'smith.upgrade_success':        'Equipment upgraded to +{level}!',
    'smith.no_resources':           'Insufficient resources to forge.',
    'smith.scrap':                  'Scrap: {qty}',
    'smith.gold':                   'Gold: {qty}',
    'smith.slot_empty':             '(empty)',

    // =====================================================
    // HERO & PROFILE
    // =====================================================
    'hero.level':                   'Level',
    'hero.xp':                      'XP',
    'hero.pe':                      'SP',
    'hero.name_placeholder':        'Hero name...',
    'hero.rename_success':          'Name changed successfully!',
    'hero.rename_invalid':          'Invalid name.',
    'hero.rename_cost':             'Not enough Diamonds! (Cost: {cost} 💎)',
    'hero.first_rename_free':       '1st time: free',
    'hero.rename_cost_label':       'Cost: {cost} 💎',

    // =====================================================
    // BESTIARY
    // =====================================================
    'bestiary.title':               'Bestiary',
    'bestiary.subtitle':            'Record and study the creatures of the world.',
    'bestiary.kills':               'Kills',
    'bestiary.kills_count':         'Kills: {count}',
    'bestiary.bonus_pending':       'Bonus at 100 kills',
    'bestiary.bonus_active':        '+15% Damage Against',
    'bestiary.unknown':             '???',
    'bestiary.locked':              'Locked',

    // =====================================================
    // TAVERN
    // =====================================================
    'tavern.title':                 'Tavern',
    'tavern.subtitle':              'Risk your Gold in games of chance.',
    'tavern.game.coin':             'Coin Flip',
    'tavern.game.dice':             'Dice',
    'tavern.bet_label':             'Bet (Gold)',
    'tavern.coin.win':              '🪙 Coin Flip: WIN! +{gold} Gold!',
    'tavern.coin.lose':             '🪙 Coin Flip: LOSS! -{bet} Gold.',
    'tavern.dice.win':              '🎲 Dice: {hero} vs {npc}. WIN! +{gold} Gold!',
    'tavern.dice.draw':             '🎲 Dice: Draw ({roll}). Bet returned.',
    'tavern.dice.lose':             '🎲 Dice: {hero} vs {npc}. LOSS! -{bet} Gold.',
    'tavern.no_gold':               'Not enough Gold to bet.',
    'tavern.invalid_bet':           'Set a valid bet!',
    'tavern.unknown_game':          'Unknown game.',

    // =====================================================
    // ASCENSION (future)
    // =====================================================
    'ascension.title':              'Ascension',
    'ascension.subtitle':           'Reset your progress for permanent rewards.',
    'ascension.coming_soon':        'Coming soon...',
    'ascension.prestige_label':     'Prestige Stars',

    // =====================================================
    // SETTINGS
    // =====================================================
    'settings.title':               'Settings',
    'settings.language':            'Language',
    'settings.autobattle':          'Auto-battle',
    'settings.autobattle.on':       'On',
    'settings.autobattle.off':      'Off',
    'settings.save':                'Save Now',
    'settings.reset':               'Reset Progress',
    'settings.reset_confirm':       'Progress reset successfully!',
    'settings.reset_warning':       'This will erase all progress. Are you sure?',

    // =====================================================
    // GENERAL NOTIFICATIONS
    // =====================================================
    'notify.level_up':              'LEVEL UP! You reached Level {level}!',
    'notify.zone_unlock':           'Zone {zone} unlocked!',
    'notify.item_drop':             '+{name}!',
    'notify.scrap_gained':          '+{qty} Scrap!',
    'notify.build_success':         '{name} built!',

    // =====================================================
    // LOG ENTRY TYPES
    // =====================================================
    'log.type.narrative':           'narrative',
    'log.type.loot':                'loot',
    'log.type.danger':              'danger',
    'log.type.level':               'level',
    'log.type.prestige':            'prestige',

};
