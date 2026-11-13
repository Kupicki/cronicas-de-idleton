/**
 * Dicionário EN (English) — Chronicles of Idleton
 * Complete English dictionary matching pt-br.js
 *
 * Status: TRANSLATION READY & ACTIVE
 * To activate: setLang('en') in the game settings
 */

export default {

    // =====================================================
    // NAVIGATION & STRUCTURE
    // =====================================================
    'game.title':                   'Chronicles of Idleton',
    'game.subtitle':                'A Medieval Action & Strategy Idle RPG',

    'nav.tab.city':                 'City',
    'nav.tab.inventory':            'Inventory',
    'nav.tab.explore':              'Exploration',
    'nav.tab.tower':                'Tower',
    'nav.tab.domain':               'Domain',
    'nav.tab.companions':           'Companions',
    'nav.tab.bestiary':             'Bestiary',
    'nav.tab.stats':                'Statistics',
    'nav.tab.ascension':            'Ascension',
    'nav.settings':                 'Settings',
    'nav.menu':                     'Main Menu',
    'nav.guide':                    "Adventurer's Guide",
    'nav.chronicles':               'Chronicles Scroll',

    // =====================================================
    // GENERAL BUTTONS
    // =====================================================
    'btn.buy':                      'Buy',
    'btn.upgrade':                  'Upgrade',
    'btn.equip':                    'Equip',
    'btn.unequip':                  'Unequip',
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
    'btn.claim':                    'Claim',
    'btn.trade':                    'Trade',
    'btn.train':                    'Train',
    'btn.retreat':                  'Retreat',

    // =====================================================
    // RESOURCES
    // =====================================================
    'resource.gold':                'Gold',
    'resource.scrap':               'Scrap',
    'resource.diamond':             'Diamond',
    'resource.diamonds':            'Diamonds',
    'resource.wood':                'Wood',
    'resource.essence':             'Essence',
    'resource.iron':                'Iron',
    'resource.ancestral_diamonds':  'Ancestral Diamonds',

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
    'stat.critChance':              'Crit Chance',
    'stat.critMult':                'Crit Damage',
    'stat.dodge':                   'Dodge',

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
    // EQUIPMENT TYPES & RELICS
    // =====================================================
    'item.weapon':                  'Sword',
    'item.shield':                  'Shield',
    'item.helmet':                  'Helmet',
    'item.chest':                   'Chestplate',
    'item.legs':                    'Greaves',
    'item.boots':                   'Boots',
    'item.ring':                    'Ring',
    'item.amulet':                  'Amulet',
    'item.relic_blade':             'Jagged Kobold Blade',
    'item.relic_shield':            'Golem Plate Shield',
    'item.relic_chest':             'Aeolian Harpy Mantle',

    // Item Sets
    'set.protector':                'Protector of Idleton',
    'set.storm':                    'Primordial Storm',
    'set.greedy':                   "Greed's Gold",

    // =====================================================
    // SKILLS & CLASS SPECIALIZATIONS
    // =====================================================
    'skill.flat_strength':          'Brute Force',
    'skill.flat_strength.desc':     '+5 Attack/level',
    'skill.flat_resilience':        'Ironhide',
    'skill.flat_resilience.desc':   '+20 Max HP/level',
    'skill.percent_strength':       'Restrained Fury',
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

    'class.berserker':              'Berserker',
    'class.paladin':                'Paladin',
    'class.arcane_mage':            'Arcane Mage',
    'class.shadow_thief':           'Shadow Thief',
    'class.constellation':          'Talent Constellation',

    // =====================================================
    // ACTIVE ABILITIES
    // =====================================================
    'ability.focused_attack':       'Focused Strike',
    'ability.focused_attack.desc':  '3× Damage · 30 ⚡ · 8s CD',
    'ability.focused_attack.ready': 'READY',
    'ability.focused_attack.cd':    '{s}s',
    'ability.no_energy':            'Not enough Energy for Focused Strike! (30 ⚡)',
    'ability.spontaneous_heal':     'Spontaneous Heal',
    'ability.devastating_strike':   'Devastating Strike',
    'ability.divine_shield':        'Divine Shield',
    'ability.arcane_meteor':        'Arcane Meteor',
    'ability.lethal_ambush':        'Lethal Ambush',

    // =====================================================
    // DOMAIN BUILDINGS
    // =====================================================
    'building.hut':                 'Hut',
    'building.sawmill':             'Royal Sawmill',
    'building.farm':                'Farm',
    'building.workshop':            'Workshop',
    'building.mine':                'Mine',
    'building.market':              'Market',
    'building.library':             'Library',
    'building.garrison':            'Garrison',
    'building.treasury':            'Treasury',
    'building.castle':              'Castle',

    'domain.title':                 'Royal Domain',
    'domain.subtitle':              'Expand your fiefdom for passive resources and combat synergies.',
    'domain.fortification':         'Village Fortification',
    'domain.level':                 'Level {qty}',
    'domain.owned':                 'Owned: {qty}',
    'domain.prod':                  '+{prod}/s',
    'domain.next_cost':             'Next: {cost} Gold',
    'domain.buy_success':           'Built {name}!',
    'domain.no_gold':               'Not enough Gold to build.',

    // =====================================================
    // COMPANIONS, AFFINITY & BEAST TALENTS
    // =====================================================
    'companions.title':             'Companions & Pets',
    'companions.subtitle':          'Adopt loyal pets, raise their Affinity, and unlock Beast Talents.',
    'companions.tab.list':          'My Pets',
    'companions.tab.talents':       'Beast Talents',
    'companions.tab.expeditions':   'Expeditions',
    'companions.active_synergy':    '1.5× Synergy + Joint Attack',
    'companions.affinity':          'Affinity',
    'companions.talent_points':     'Beast Points',

    'pet.coruja':                   'Wise Owl',
    'pet.pantera':                  'Night Panther',
    'pet.rato_ladrao':              'Thief Rat',
    'pet.raposa':                   'Cunning Fox',
    'pet.corvo_arcano':             'Arcane Raven',
    'pet.lobo_alfa':                'Alpha Wolf',
    'pet.salamandra':               'Igneous Salamander',
    'pet.golem_mini':               'Guardian Golem',

    'pet_talent.sharp_fangs':       'Sharp Fangs',
    'pet_talent.alpha_instinct':    'Alpha Instinct',
    'pet_talent.vital_bond':        'Vital Bond',
    'pet_talent.wind_wings':        'Wings of the Wind',
    'pet_talent.hunter_scent':      "Hunter's Scent",
    'pet_talent.primordial_roar':   'Primordial Roar',

    // =====================================================
    // TOWER OF CHALLENGES & DAILY WORLD BOSS
    // =====================================================
    'tower.title':                  'Tower of Challenges',
    'tower.subtitle':               'Climb 100 abyssal floors with cosmic modifiers and roguelike blessings.',
    'tower.tab.climb':              'Abyssal Tower',
    'tower.tab.world_boss':         'Daily World Boss',
    'tower.floor':                  'Floor {floor}',

    'world_boss.title':             'Daily World Boss (60s DPS Check)',
    'world_boss.subtitle':          'Deal maximum damage in 60 seconds to reach all 6 Reward Tiers!',
    'world_boss.attempts':          'Attempts Today',
    'world_boss.best_damage':       'Best Damage Dealt',
    'world_boss.challenge':         'Challenge World Boss (60s DPS Check)',
    'world_boss.extra_attempt':     'Extra Attempt',

    // =====================================================
    // EXPLORATION BIOMES
    // =====================================================
    'biome.dark_forest':            'Dark Forest',
    'biome.khaz_mines':             'Mines of Khaz',
    'biome.black_swamp':            'Black Swamp',
    'biome.eldor_ruins':            'Ruins of Eldor',
    'biome.storm_peak':             'Storm Peak',
    'biome.iron_citadel':           'Iron Citadel',
    'biome.void_abyss':             'Void Abyss',

    // =====================================================
    // MONSTERS — Base Types
    // =====================================================
    'monster.goblin':               'Goblin',
    'monster.slime':                'Slime',
    'monster.wolf':                 'Wolf',
    'monster.lobo':                 'Wolf',
    'monster.orc':                  'Orc',
    'monster.spider':               'Spider',
    'monster.aranha':               'Spider',
    'monster.golem':                'Golem',
    'monster.bat':                  'Bat',
    'monster.morcego':              'Bat',
    'monster.skeleton':             'Skeleton',
    'monster.esqueleto':            'Skeleton',
    'monster.zumbi':                'Zombie',
    'monster.bandido':              'Bandit',
    'monster.kobold':               'Kobold',
    'monster.harpy':                'Harpy',
    'monster.harpia':               'Harpy',
    'monster.troll':                'Troll',
    'monster.troll_gelo':           'Frost Troll',
    'monster.espectro_gelo':        'Arctic Wraith',
    'monster.salamandra_fogo':      'Volcanic Salamander',
    'monster.cavaleiro_cinzas':     'Ash Knight',
    'monster.arauto_vazio':         'Void Harbinger',
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
    'combat.elite_label':           'ELITE CHAMPION',
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
    'inventory.autoloot':           'Auto-Loot Filter',

    // =====================================================
    // BLACKSMITH, ORACLE & MARKET
    // =====================================================
    'smith.title':                  'Blacksmith',
    'smith.subtitle':               'Upgrade your equipment, forge custom orders, and craft Mythic Relics.',
    'smith.tab.upgrade':            'Upgrade',
    'smith.tab.craft':              'Forge',
    'smith.tab.relics':             'Ancestral Relics',
    'smith.upgrade_success':        'Equipment upgraded to +{level}!',
    'smith.no_resources':           'Insufficient resources to forge.',
    'smith.scrap':                  'Scrap: {qty}',
    'smith.gold':                   'Gold: {qty}',
    'smith.slot_empty':             '(empty)',

    'oracle.title':                 'The Oracle of Idleton',
    'oracle.tab.blessings':         'Divine Blessings',
    'oracle.tab.enchant':           'Enchantment Altar',
    'enchant.fire':                 'Solar Flame',
    'enchant.lightning':            'Celestial Thunder',
    'enchant.ice':                  'Eternal Frost',
    'enchant.vampiric':             'Vampiric Thirst',

    'market.title':                 'Central Market',
    'market.tab.gold':              'Gold',
    'market.tab.barter':            'Barter',
    'market.tab.black_market':      'Black Market',

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
    // BESTIARY & STATISTICS
    // =====================================================
    'bestiary.title':               'Bestiary & Lore',
    'bestiary.subtitle':            'Defeat monster species to uncover their stats and earn cumulative bonuses.',
    'bestiary.kills':               'Kills',
    'bestiary.kills_count':         'Kills: {count}',
    'bestiary.bonus_pending':       'Bonus at 100 kills',
    'bestiary.bonus_active':        '+15% Damage Against',
    'bestiary.unknown':             '???',
    'bestiary.locked':              'Locked',

    'stats.title':                  'Statistics & Achievements',
    'stats.achievements':           'Achievements of Idleton',

    // =====================================================
    // TAVERN
    // =====================================================
    'tavern.title':                 'Laughing Boar Tavern',
    'tavern.subtitle':              'Risk your Gold in games, rest at the Inn, or deliver Supply Contracts.',
    'tavern.tab.games':             'Games & Tamer',
    'tavern.tab.inn':               'Inn',
    'tavern.tab.contracts':         'Contracts',
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
    // ASCENSION
    // =====================================================
    'ascension.title':              'Lineage Ascension',
    'ascension.subtitle':           'Rebirth with Ancestral Diamonds to unlock eternal Blessings.',
    'ascension.coming_soon':        'Available at Level 50 (Zone 10+)',
    'ascension.prestige_label':     'Ancestral Diamonds',

    // =====================================================
    // SETTINGS
    // =====================================================
    'settings.title':               'Settings',
    'settings.language':            'Language',
    'settings.language_changed':    'Language switched to English! 🇺🇸',
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
