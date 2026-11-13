/**
 * Diccionario ES (Español) — Crónicas de Idleton
 * Diccionario completo en español basado en las claves de pt-br.js
 *
 * Estado: TRANSLATION READY & ACTIVE
 * Para activar: setLang('es') en los ajustes del juego
 */

export default {

    // =====================================================
    // NAVEGACIÓN Y ESTRUCTURA
    // =====================================================
    'game.title':                   'Crónicas de Idleton',
    'game.subtitle':                'Un RPG Idle Medieval de Acción y Estrategia',

    'nav.tab.city':                 'Ciudad',
    'nav.tab.inventory':            'Inventario',
    'nav.tab.explore':              'Exploración',
    'nav.tab.tower':                'Torre',
    'nav.tab.domain':               'Dominio',
    'nav.tab.companions':           'Compañeros',
    'nav.tab.bestiary':             'Bestiario',
    'nav.tab.stats':                'Estadísticas',
    'nav.tab.ascension':            'Ascensión',
    'nav.settings':                 'Ajustes',
    'nav.menu':                     'Menú Principal',
    'nav.guide':                    'Guía del Aventurero',
    'nav.chronicles':               'Pergamino de Crónicas',

    // =====================================================
    // BOTONES GENERALES
    // =====================================================
    'btn.buy':                      'Comprar',
    'btn.upgrade':                  'Mejorar',
    'btn.equip':                    'Equipar',
    'btn.unequip':                  'Desequipar',
    'btn.sell':                     'Vender',
    'btn.dismantle':                'Desmantelar',
    'btn.dismantle.hint':           '(Genera Chatarra)',
    'btn.save':                     'Guardar Ahora',
    'btn.reset':                    'Reiniciar Progreso',
    'btn.close':                    'Cerrar',
    'btn.rename':                   'Renombrar',
    'btn.allocate':                 'ASIGNAR',
    'btn.explore':                  'EXPLORAR',
    'btn.stop':                     'DETENER',
    'btn.confirm':                  'Confirmar',
    'btn.cancel':                   'Cancelar',
    'btn.build':                    'Construir',
    'btn.learn':                    'Aprender',
    'btn.claim':                    'Reclamar',
    'btn.trade':                    'Intercambiar',
    'btn.train':                    'Entrenar',
    'btn.retreat':                  'Retirarse',

    // =====================================================
    // RECURSOS
    // =====================================================
    'resource.gold':                'Oro',
    'resource.scrap':               'Chatarra',
    'resource.diamond':             'Diamante',
    'resource.diamonds':            'Diamantes',
    'resource.wood':                'Madera',
    'resource.essence':             'Esencia',
    'resource.iron':                'Hierro',
    'resource.ancestral_diamonds':  'Diamantes Ancestrales',

    // =====================================================
    // ATRIBUTOS BASE (BASE STATS)
    // =====================================================
    'stat.str':                     'Fuerza',
    'stat.def':                     'Defensa',
    'stat.int':                     'Inteligencia',
    'stat.agi':                     'Agilidad',
    'stat.lck':                     'Suerte',
    'stat.per':                     'Percepción',
    'stat.reg':                     'Regeneración',
    'stat.hp':                      'HP',
    'stat.energy':                  'Energía',
    'stat.mana':                    'Maná',
    'stat.atkSpeed':                'Vel. Ataque',
    'stat.hpMax':                   'HP Máximo',
    'stat.critChance':              'Prob. Crítica',
    'stat.critMult':                'Daño Crítico',
    'stat.dodge':                   'Esquiva',

    'stat.tip.str':                 '+1 Ataque',
    'stat.tip.def':                 '+3 Defensa, +3 HP',
    'stat.tip.int':                 '+Regen. de Maná',
    'stat.tip.agi':                 '+Vel. Ataque / Energía',
    'stat.tip.lck':                 '+Tasa de Botín',
    'stat.tip.per':                 '+Calidad de Botín',
    'stat.tip.reg':                 '+Regen. HP/s',

    'stat.points.title':            'Puntos de Atributo',
    'stat.points.available':        'Disponibles',
    'stat.points.tip':              '+2 puntos por nivel (+2 extra cada 10 niveles)',
    'stat.points.none':             'No hay puntos de atributo disponibles.',

    // =====================================================
    // RAREZAS
    // =====================================================
    'rarity.common':                'Común',
    'rarity.uncommon':              'Poco Común',
    'rarity.rare':                  'Raro',
    'rarity.epic':                  'Épico',
    'rarity.legendary':             'Legendario',
    'rarity.mythic':                'Mítico',

    // =====================================================
    // TIPOS DE EQUIPAMIENTO Y RELIQUIAS
    // =====================================================
    'item.weapon':                  'Espada',
    'item.shield':                  'Escudo',
    'item.helmet':                  'Yelmo',
    'item.chest':                   'Coraza',
    'item.legs':                    'Grebas',
    'item.boots':                   'Botas',
    'item.ring':                    'Anillo',
    'item.amulet':                  'Amuleto',
    'item.relic_blade':             'Hoja Dentada de Kobold',
    'item.relic_shield':            'Escudo de Placas de Gólem',
    'item.relic_chest':             'Manto Eólico de Arpía',

    // Conjuntos (Sets)
    'set.protector':                'Protector de Idleton',
    'set.storm':                    'Tormenta Primordial',
    'set.greedy':                   'Oro del Codicioso',

    // =====================================================
    // HABILIDADES Y ESPECIALIZACIONES DE CLASE
    // =====================================================
    'skill.flat_strength':          'Fuerza Bruta',
    'skill.flat_strength.desc':     '+5 Ataque/nivel',
    'skill.flat_resilience':        'Vigor de Toro',
    'skill.flat_resilience.desc':   '+20 HP Máx/nivel',
    'skill.percent_strength':       'Furia Contenida',
    'skill.percent_strength.desc':  '+2% Ataque/nivel',
    'skill.thick_hide':             'Piel Gruesa',
    'skill.thick_hide.desc':        '+5 Defensa/nivel',
    'skill.golden_hands':           'Manos de Oro',
    'skill.golden_hands.desc':      '+5% Oro/nivel',

    'skill.title':                  'Habilidades',
    'skill.cost':                   'Costo: {cost} PE',
    'skill.max_level':              'Nivel Máximo',
    'skill.buy_success':            'Aprendiste {name} (Nv. {level})',
    'skill.no_pe':                  'PE insuficiente.',
    'skill.invalid':                'Habilidad inválida.',

    'class.berserker':              'Berserker',
    'class.paladin':                'Paladín',
    'class.arcane_mage':            'Mago Arcano',
    'class.shadow_thief':           'Ladrón de las Sombras',
    'class.constellation':          'Constelación de Talentos',

    // =====================================================
    // HABILIDADES ACTIVAS
    // =====================================================
    'ability.focused_attack':       'Ataque Concentrado',
    'ability.focused_attack.desc':  '3× Daño · 30 ⚡ · 8s CD',
    'ability.focused_attack.ready': 'LISTO',
    'ability.focused_attack.cd':    '{s}s',
    'ability.no_energy':            '¡Energía insuficiente para Ataque Concentrado! (30 ⚡)',
    'ability.spontaneous_heal':     'Curación Espontánea',
    'ability.devastating_strike':   'Golpe Devastador',
    'ability.divine_shield':        'Escudo Divino',
    'ability.arcane_meteor':        'Meteoro Arcano',
    'ability.lethal_ambush':        'Emboscada Letal',

    // =====================================================
    // CONSTRUCCIONES (DOMINIO REAL)
    // =====================================================
    'building.hut':                 'Cabaña',
    'building.sawmill':             'Aserradero Real',
    'building.farm':                'Granja',
    'building.workshop':            'Taller',
    'building.mine':                'Mina',
    'building.market':              'Mercado',
    'building.library':             'Biblioteca',
    'building.garrison':            'Cuartel',
    'building.treasury':            'Tesorería',
    'building.castle':              'Castillo',

    'domain.title':                 'Dominio Real',
    'domain.subtitle':              'Construye tu feudo para generar recursos pasivos y sinergias de combate.',
    'domain.fortification':         'Fortificación de la Aldea',
    'domain.level':                 'Nivel {qty}',
    'domain.owned':                 'Poseído: {qty}',
    'domain.prod':                  '+{prod}/s',
    'domain.next_cost':             'Sig.: {cost} Oro',
    'domain.buy_success':           '¡Construiste {name}!',
    'domain.no_gold':               'Oro insuficiente para construir.',

    // =====================================================
    // COMPAÑEROS, AFINIDAD Y TALENTOS BESTIALES
    // =====================================================
    'companions.title':             'Compañeros y Mascotas',
    'companions.subtitle':          'Adopta mascotas leales, sube su Afinidad y desbloquea Talentos Bestiales.',
    'companions.tab.list':          'Mis Mascotas',
    'companions.tab.talents':       'Talentos Bestiales',
    'companions.tab.expeditions':   'Expediciones',
    'companions.active_synergy':    'Sinergia 1.5× + Ataque Conjunto',
    'companions.affinity':          'Afinidad',
    'companions.talent_points':     'Puntos Bestiales',

    'pet.coruja':                   'Búho Sabio',
    'pet.pantera':                  'Pantera Nocturna',
    'pet.rato_ladrao':              'Rata Ladrona',
    'pet.raposa':                   'Zorro Astuto',
    'pet.corvo_arcano':             'Cuervo Arcano',
    'pet.lobo_alfa':                'Lobo Alfa',
    'pet.salamandra':               'Salamandra Ígnea',
    'pet.golem_mini':               'Gólem Guardián',

    'pet_talent.sharp_fangs':       'Colmillos Afilados',
    'pet_talent.alpha_instinct':    'Instinto Alfa',
    'pet_talent.vital_bond':        'Vínculo Vital',
    'pet_talent.wind_wings':        'Alas del Viento',
    'pet_talent.hunter_scent':      'Olfato de Cazador',
    'pet_talent.primordial_roar':   'Rugido Primordial',

    // =====================================================
    // TORRE DE LOS DESAFÍOS Y JEFE MUNDIAL DIARIO
    // =====================================================
    'tower.title':                  'Torre de los Desafíos',
    'tower.subtitle':               'Escala 100 pisos abisales con modificadores cósmicos y bendiciones roguelike.',
    'tower.tab.climb':              'Torre del Abismo',
    'tower.tab.world_boss':         'Jefe Mundial Diario',
    'tower.floor':                  'Piso {floor}',

    'world_boss.title':             'Jefe Mundial Diario (60s DPS Check)',
    'world_boss.subtitle':          '¡Causa el máximo daño en 60 segundos para alcanzar los 6 Niveles de Recompensa!',
    'world_boss.attempts':          'Intentos Hoy',
    'world_boss.best_damage':       'Mejor Daño Causado',
    'world_boss.challenge':         'Desafiar Jefe Mundial (60s DPS Check)',
    'world_boss.extra_attempt':     'Intento Extra',

    // =====================================================
    // BIOMAS DE EXPLORACIÓN
    // =====================================================
    'biome.dark_forest':            'Bosque Sombrío',
    'biome.khaz_mines':             'Minas de Khaz',
    'biome.black_swamp':            'Pantano Negro',
    'biome.eldor_ruins':            'Ruinas de Eldor',
    'biome.storm_peak':             'Pico de la Tormenta',
    'biome.iron_citadel':           'Ciudadela de Hierro',
    'biome.void_abyss':             'Abismo del Vacío',

    // =====================================================
    // MONSTRUOS — Tipos Base
    // =====================================================
    'monster.goblin':               'Goblin',
    'monster.slime':                'Slime',
    'monster.wolf':                 'Lobo',
    'monster.lobo':                 'Lobo',
    'monster.orc':                  'Orco',
    'monster.spider':               'Araña',
    'monster.aranha':               'Araña',
    'monster.golem':                'Gólem',
    'monster.bat':                  'Murciélago',
    'monster.morcego':              'Murciélago',
    'monster.skeleton':             'Esqueleto',
    'monster.esqueleto':            'Esqueleto',
    'monster.zumbi':                'Zombi',
    'monster.bandido':              'Bandido',
    'monster.kobold':               'Kóbold',
    'monster.harpy':                'Arpía',
    'monster.harpia':               'Arpía',
    'monster.troll':                'Trol',
    'monster.troll_gelo':           'Trol de Hielo',
    'monster.espectro_gelo':        'Espectro Ártico',
    'monster.salamandra_fogo':      'Salamandra Volcánica',
    'monster.cavaleiro_cinzas':     'Caballero de las Cenizas',
    'monster.arauto_vazio':         'Heraldo del Vacío',
    'monster.demon':                'Demonio',
    'monster.dragon':               'Dragón',
    'monster.lich':                 'Liche',
    'monster.elemental':            'Elemental',

    // Adjetivos de nombre procedural
    'adj.gelido':                   'Gélido',
    'adj.feral':                    'Salvaje',
    'adj.sombrio':                  'Sombrío',
    'adj.corrupto':                 'Corrupto',
    'adj.anciao':                   'Anciano',
    'adj.maldito':                  'Maldito',
    'adj.feroz':                    'Feroz',
    'adj.maligno':                  'Maligno',
    'adj.voraz':                    'Voraz',
    'adj.colossal':                 'Colosal',
    'adj.fantasmal':                'Fantasmal',
    'adj.eterno':                   'Eterno',
    'adj.pestilento':               'Pestilente',
    'adj.cavernicola':              'Cavernícola',

    // Elementos de nombre procedural
    'elem.fire':                    'del Fuego',
    'elem.ice':                     'del Hielo',
    'elem.shadow':                  'de las Sombras',
    'elem.lightning':               'del Relámpago',
    'elem.earth':                   'de la Tierra',
    'elem.void':                    'del Vacío',
    'elem.blood':                   'de la Sangre',
    'elem.plague':                  'de la Plaga',
    'elem.storm':                   'de la Tormenta',
    'elem.abyss':                   'del Abismo',

    // =====================================================
    // COMBATE Y EXPLORACIÓN
    // =====================================================
    'combat.kill':                  'Derrotaste a {name} (+{gold} Oro, +{xp} XP)',
    'combat.loot_drop':             '¡Botín: {name}!',
    'combat.loot_full':             '¡Inventario lleno! Botín perdido.',
    'combat.level_up':              '¡SUBISTE DE NIVEL! Nivel {level} ✨',
    'combat.level_up_float':        '¡NIVEL +1!',
    'combat.zone_advance':          '⚔️ ¡Avanzaste a la Zona {zone}!',
    'combat.zone_unlock':           '¡Zona {zone} desbloqueada!',
    'combat.defeated':              '¡Fuiste derrotado! Recuperando HP...',
    'combat.revived':               '¡Héroe recuperado! Volviendo al combate...',
    'combat.start':                 '¡Aventura iniciada!',
    'combat.focused_attack_hit':    '⚡ Ataque Concentrado en {name}: -{dmg} HP!',
    'combat.boss_label':            '¡JEFE!',
    'combat.elite_label':           'CAMPEÓN ÉLITE',
    'combat.zone_progress':         '{kills}/10',
    'combat.zone_label':            'Zona',

    'explore.overlay.defeated':     'DERROTADO',
    'explore.recovering':           'Recuperando... {pct}%',

    // =====================================================
    // INVENTARIO Y OBJETOS
    // =====================================================
    'inventory.title':              'Inventario',
    'inventory.empty_slot':         'Vacío',
    'inventory.sell_success':       'Vendiste {name} por {price} Oro',
    'inventory.equip_success':      'Equipaste {name}',
    'inventory.dismantle_success':  'Desmantelaste {name}: +{scraps} Chatarra',
    'inventory.dismantle_gold':     ' +{gold} Oro',
    'inventory.autoloot':           'Filtro de Auto-Botín',

    // =====================================================
    // HERRERO, ORÁCULO Y MERCADO
    // =====================================================
    'smith.title':                  'Herrero',
    'smith.subtitle':               'Mejora tus equipos, forja encargos y crea Reliquias Míticas.',
    'smith.tab.upgrade':            'Mejorar',
    'smith.tab.craft':              'Forja',
    'smith.tab.relics':             'Reliquias Ancestrales',
    'smith.upgrade_success':        '¡Equipo mejorado a +{level}!',
    'smith.no_resources':           'Recursos insuficientes para forjar.',
    'smith.scrap':                  'Chatarra: {qty}',
    'smith.gold':                   'Oro: {qty}',
    'smith.slot_empty':             '(vacío)',

    'oracle.title':                 'El Oráculo de Idleton',
    'oracle.tab.blessings':         'Bendiciones Divinas',
    'oracle.tab.enchant':           'Altar de Encantamientos',
    'enchant.fire':                 'Llama Solar',
    'enchant.lightning':            'Trueno Celestial',
    'enchant.ice':                  'Hielo Eterno',
    'enchant.vampiric':             'Sed Vampírica',

    'market.title':                 'Mercado Central',
    'market.tab.gold':              'Oro',
    'market.tab.barter':            'Trueque',
    'market.tab.black_market':      'Mercado Negro',

    // =====================================================
    // HÉROE Y PERFIL
    // =====================================================
    'hero.level':                   'Nivel',
    'hero.xp':                      'XP',
    'hero.pe':                      'PE',
    'hero.name_placeholder':        'Nombre del héroe...',
    'hero.rename_success':          '¡Nombre cambiado con éxito!',
    'hero.rename_invalid':          'Nombre inválido.',
    'hero.rename_cost':             '¡Diamantes insuficientes! (Costo: {cost} 💎)',
    'hero.first_rename_free':       '1ª vez: gratis',
    'hero.rename_cost_label':       'Costo: {cost} 💎',

    // =====================================================
    // BESTIARIO Y ESTADÍSTICAS
    // =====================================================
    'bestiary.title':               'Bestiario y Conocimiento',
    'bestiary.subtitle':            'Derrota especies de monstruos para revelar sus atributos y ganar bonos acumulativos.',
    'bestiary.kills':               'Bajas',
    'bestiary.kills_count':         'Bajas: {count}',
    'bestiary.bonus_pending':       'Bono a las 100 bajas',
    'bestiary.bonus_active':        '+15% Daño Contra',
    'bestiary.unknown':             '???',
    'bestiary.locked':              'Bloqueado',

    'stats.title':                  'Estadísticas y Logros',
    'stats.achievements':           'Logros de Idleton',

    // =====================================================
    // TABERNA
    // =====================================================
    'tavern.title':                 'Taberna del Jabalí Risueño',
    'tavern.subtitle':              'Arriesga tu Oro en juegos, descansa en la Posada o entrega Contratos.',
    'tavern.tab.games':             'Juegos y Domador',
    'tavern.tab.inn':               'Posada',
    'tavern.tab.contracts':         'Contratos',
    'tavern.game.coin':             'Cara o Cruz',
    'tavern.game.dice':             'Dados',
    'tavern.bet_label':             'Apuesta (Oro)',
    'tavern.coin.win':              '🪙 Cara o Cruz: ¡VICTORIA! +{gold} Oro!',
    'tavern.coin.lose':             '🪙 Cara o Cruz: ¡DERROTA! -{bet} Oro.',
    'tavern.dice.win':              '🎲 Dados: {hero} vs {npc}. ¡VICTORIA! +{gold} Oro!',
    'tavern.dice.draw':             '🎲 Dados: Empate ({roll}). Apuesta devuelta.',
    'tavern.dice.lose':             '🎲 Dados: {hero} vs {npc}. ¡DERROTA! -{bet} Oro.',
    'tavern.no_gold':               'Oro insuficiente para apostar.',
    'tavern.invalid_bet':           '¡Define una apuesta válida!',
    'tavern.unknown_game':          'Juego desconocido.',

    // =====================================================
    // ASCENSIÓN
    // =====================================================
    'ascension.title':              'Ascensión del Linaje',
    'ascension.subtitle':           'Renace con Diamantes Ancestrales para desbloquear Bendiciones eternas.',
    'ascension.coming_soon':        'Disponible en el Nivel 50 (Zona 10+)',
    'ascension.prestige_label':     'Diamantes Ancestrales',

    // =====================================================
    // AJUSTES
    // =====================================================
    'settings.title':               'Ajustes',
    'settings.language':            'Idioma',
    'settings.language_changed':    '¡Idioma cambiado a Español! 🇪🇸',
    'settings.autobattle':          'Auto-batalla',
    'settings.autobattle.on':       'Activada',
    'settings.autobattle.off':      'Desactivada',
    'settings.save':                'Guardar Ahora',
    'settings.reset':               'Reiniciar Progreso',
    'settings.reset_confirm':       '¡Progreso reiniciado con éxito!',
    'settings.reset_warning':       'Esto borrará todo tu progreso. ¿Estás seguro?',

    // =====================================================
    // NOTIFICACIONES GENERALES
    // =====================================================
    'notify.level_up':              '¡SUBISTE DE NIVEL! ¡Alcanzaste el Nivel {level}!',
    'notify.zone_unlock':           '¡Zona {zone} desbloqueada!',
    'notify.item_drop':             '+{name}!',
    'notify.scrap_gained':          '+{qty} Chatarra!',
    'notify.build_success':         '¡{name} construido!',

    // =====================================================
    // LOG — TIPOS DE ENTRADA
    // =====================================================
    'log.type.narrative':           'narrativa',
    'log.type.loot':                'botín',
    'log.type.danger':              'peligro',
    'log.type.level':               'nivel',
    'log.type.prestige':            'prestigio',

};
