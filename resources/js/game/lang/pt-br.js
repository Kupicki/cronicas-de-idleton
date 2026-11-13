/**
 * Dicionário PT-BR — Crônicas de Idleton
 * Idioma padrão / base language
 *
 * Convenções de chave:
 *   categoria.subcategoria.nome
 *   {param} para interpolação de variáveis
 */

export default {

    // =====================================================
    // NAVEGAÇÃO & ESTRUTURA
    // =====================================================
    'game.title':                   'Crônicas de Idleton',
    'game.subtitle':                'Um RPG Idle Medieval de Ação & Estratégia',

    'nav.tab.city':                 'Cidade',
    'nav.tab.inventory':            'Inventário',
    'nav.tab.explore':              'Exploração',
    'nav.tab.tower':                'Torre',
    'nav.tab.domain':               'Domínio',
    'nav.tab.companions':           'Companheiros',
    'nav.tab.bestiary':             'Bestiário',
    'nav.tab.stats':                'Estatísticas',
    'nav.tab.ascension':            'Ascensão',
    'nav.settings':                 'Configurações',
    'nav.menu':                     'Menu Principal',
    'nav.guide':                    'Guia do Aventureiro',
    'nav.chronicles':               'Pergaminho de Crônicas',

    // =====================================================
    // BOTÕES GERAIS
    // =====================================================
    'btn.buy':                      'Comprar',
    'btn.upgrade':                  'Melhorar',
    'btn.equip':                    'Equipar',
    'btn.unequip':                  'Desequipar',
    'btn.sell':                     'Vender',
    'btn.dismantle':                'Desmantelar',
    'btn.dismantle.hint':           '(Gera Sucata)',
    'btn.save':                     'Salvar Agora',
    'btn.reset':                    'Resetar Progresso',
    'btn.close':                    'Fechar',
    'btn.rename':                   'Renomear',
    'btn.allocate':                 'ALOCAR',
    'btn.explore':                  'EXPLORAR',
    'btn.stop':                     'PARAR',
    'btn.confirm':                  'Confirmar',
    'btn.cancel':                   'Cancelar',
    'btn.build':                    'Construir',
    'btn.learn':                    'Aprender',
    'btn.claim':                    'Resgatar',
    'btn.trade':                    'Trocar',
    'btn.train':                    'Treinar',
    'btn.retreat':                  'Recuar',

    // =====================================================
    // RECURSOS
    // =====================================================
    'resource.gold':                'Ouro',
    'resource.scrap':               'Sucata',
    'resource.diamond':             'Diamante',
    'resource.diamonds':            'Diamantes',
    'resource.wood':                'Madeira',
    'resource.essence':             'Essência',
    'resource.iron':                'Ferro',
    'resource.ancestral_diamonds':  'Diamantes Ancestrais',

    // =====================================================
    // ATRIBUTOS BASE (BASE STATS)
    // =====================================================
    'stat.str':                     'Força',
    'stat.def':                     'Defesa',
    'stat.int':                     'Inteligência',
    'stat.agi':                     'Agilidade',
    'stat.lck':                     'Sorte',
    'stat.per':                     'Percepção',
    'stat.reg':                     'Regeneração',
    'stat.hp':                      'HP',
    'stat.energy':                  'Energia',
    'stat.mana':                    'Mana',
    'stat.atkSpeed':                'Vel. Ataque',
    'stat.hpMax':                   'HP Máximo',
    'stat.critChance':              'Chance Crítica',
    'stat.critMult':                'Dano Crítico',
    'stat.dodge':                   'Esquiva',

    // Dicas de atributo
    'stat.tip.str':                 '+1 Ataque',
    'stat.tip.def':                 '+3 Defesa, +3 HP',
    'stat.tip.int':                 '+Mana Regen',
    'stat.tip.agi':                 '+Vel. Atk / Energia',
    'stat.tip.lck':                 '+Drop Rate',
    'stat.tip.per':                 '+Qualidade Loot',
    'stat.tip.reg':                 '+HP Regen/s',

    // Seção de alocação
    'stat.points.title':            'Pontos de Atributo',
    'stat.points.available':        'Disponíveis',
    'stat.points.tip':              '+2 pontos por nível (+2 bônus a cada 10 níveis)',
    'stat.points.none':             'Nenhum ponto de atributo disponível.',

    // =====================================================
    // RARIDADES
    // =====================================================
    'rarity.common':                'Comum',
    'rarity.uncommon':              'Incomum',
    'rarity.rare':                  'Raro',
    'rarity.epic':                  'Épico',
    'rarity.legendary':             'Lendário',
    'rarity.mythic':                'Mítico',

    // =====================================================
    // TIPOS DE EQUIPAMENTO & RELÍQUIAS
    // =====================================================
    'item.weapon':                  'Espada',
    'item.shield':                  'Escudo',
    'item.helmet':                  'Elmo',
    'item.chest':                   'Peitoral',
    'item.legs':                    'Perneiras',
    'item.boots':                   'Botas',
    'item.ring':                    'Anel',
    'item.amulet':                  'Amuleto',
    'item.relic_blade':             'Lâmina Dentada de Kobold',
    'item.relic_shield':            'Escudo de Placas de Golem',
    'item.relic_chest':             'Manto Eólico da Harpia',

    // Conjuntos (Sets)
    'set.protector':                'Protetor de Idleton',
    'set.storm':                    'Tempestade Primordial',
    'set.greedy':                   'Ouro do Ganancioso',

    // =====================================================
    // HABILIDADES & ESPECIALIZAÇÕES DE CLASSE
    // =====================================================
    'skill.flat_strength':          'Força Bruta',
    'skill.flat_strength.desc':     '+5 Ataque/nível',
    'skill.flat_resilience':        'Vigor de Touro',
    'skill.flat_resilience.desc':   '+20 HP Máx/nível',
    'skill.percent_strength':       'Fúria Contida',
    'skill.percent_strength.desc':  '+2% Ataque/nível',
    'skill.thick_hide':             'Casca Grossa',
    'skill.thick_hide.desc':        '+5 Defesa/nível',
    'skill.golden_hands':           'Mãos de Ouro',
    'skill.golden_hands.desc':      '+5% Ouro/nível',

    'skill.title':                  'Habilidades',
    'skill.cost':                   'Custo: {cost} PE',
    'skill.max_level':              'Nível Máximo',
    'skill.buy_success':            'Aprendeu {name} (Nv. {level})',
    'skill.no_pe':                  'PE insuficiente.',
    'skill.invalid':                'Habilidade inválida.',

    'class.berserker':              'Berserker',
    'class.paladin':                'Paladino',
    'class.arcane_mage':            'Mago Arcano',
    'class.shadow_thief':           'Ladrão das Sombras',
    'class.constellation':          'Constelação de Talentos',

    // =====================================================
    // HABILIDADES ATIVAS
    // =====================================================
    'ability.focused_attack':       'Ataque Concentrado',
    'ability.focused_attack.desc':  '3× Dano · 30 ⚡ · 8s CD',
    'ability.focused_attack.ready': 'PRONTO',
    'ability.focused_attack.cd':    '{s}s',
    'ability.no_energy':            'Energia insuficiente para Ataque Concentrado! (30 ⚡)',
    'ability.spontaneous_heal':     'Cura Espontânea',
    'ability.devastating_strike':   'Golpe Devastador',
    'ability.divine_shield':        'Escudo Divino',
    'ability.arcane_meteor':        'Meteoro Arcano',
    'ability.lethal_ambush':        'Emboscada Letal',

    // =====================================================
    // CONSTRUÇÕES (DOMÍNIO REAL)
    // =====================================================
    'building.hut':                 'Cabana',
    'building.sawmill':             'Serraria Real',
    'building.farm':                'Fazenda',
    'building.workshop':            'Oficina',
    'building.mine':                'Mina',
    'building.market':              'Mercado',
    'building.library':             'Biblioteca',
    'building.garrison':            'Quartel',
    'building.treasury':            'Tesouraria',
    'building.castle':              'Castelo',

    'domain.title':                 'Domínio Real',
    'domain.subtitle':              'Construa seu feudo para gerar recursos passivos e bônus de sinergia.',
    'domain.fortification':         'Fortificação da Vila',
    'domain.level':                 'Nível {qty}',
    'domain.owned':                 'Possuído: {qty}',
    'domain.prod':                  '+{prod}/s',
    'domain.next_cost':             'Próx: {cost} Ouro',
    'domain.buy_success':           'Construiu {name}!',
    'domain.no_gold':               'Ouro insuficiente para construir.',

    // =====================================================
    // COMPANHEIROS, AFINIDADE & TALENTOS BESTIAIS
    // =====================================================
    'companions.title':             'Companheiros & Mascotes',
    'companions.subtitle':          'Adote mascotes leais, evolua sua Afinidade e desbloqueie Talentos Bestiais.',
    'companions.tab.list':          'Meus Mascotes',
    'companions.tab.talents':       'Talentos Bestiais',
    'companions.tab.expeditions':   'Expedições',
    'companions.active_synergy':    'Sinergia 1.5× + Ataque Conjunto',
    'companions.affinity':          'Afinidade',
    'companions.talent_points':     'Pontos Bestiais',

    'pet.coruja':                   'Coruja Sábia',
    'pet.pantera':                  'Pantera Noturna',
    'pet.rato_ladrao':              'Rato Ladrão',
    'pet.raposa':                   'Raposa Astuta',
    'pet.corvo_arcano':             'Corvo Arcano',
    'pet.lobo_alfa':                'Lobo Alfa',
    'pet.salamandra':               'Salamandra Ígnea',
    'pet.golem_mini':               'Golem Guardião',

    'pet_talent.sharp_fangs':       'Presas Afiadas',
    'pet_talent.alpha_instinct':    'Instinto Alfa',
    'pet_talent.vital_bond':        'Vínculo Vital',
    'pet_talent.wind_wings':        'Asas do Vento',
    'pet_talent.hunter_scent':      'Faro de Caçador',
    'pet_talent.primordial_roar':   'Rugido Primordial',

    // =====================================================
    // TORRE DOS DESAFIOS & CHEFE MUNDIAL DIÁRIO
    // =====================================================
    'tower.title':                  'Torre dos Desafios',
    'tower.subtitle':               'Escale 100 andares abissais com modificadores cósmicos e bênçãos roguelike.',
    'tower.tab.climb':              'Torre do Abismo',
    'tower.tab.world_boss':         'Chefe Mundial Diário',
    'tower.floor':                  'Andar {floor}',

    'world_boss.title':             'Chefe Mundial Diário (60s DPS Check)',
    'world_boss.subtitle':          'Cause o máximo de dano em 60 segundos para alcançar os 6 Patamares de Recompensa!',
    'world_boss.attempts':          'Tentativas Hoje',
    'world_boss.best_damage':       'Melhor Dano Causado',
    'world_boss.challenge':         'Desafiar Chefe Mundial (60s DPS Check)',
    'world_boss.extra_attempt':     'Tentativa Extra',

    // =====================================================
    // BIOMAS DE EXPLORAÇÃO
    // =====================================================
    'biome.dark_forest':            'Floresta Sombria',
    'biome.khaz_mines':             'Minas de Khaz',
    'biome.black_swamp':            'Pântano Negro',
    'biome.eldor_ruins':            'Ruínas de Eldor',
    'biome.storm_peak':             'Pico da Tempestade',
    'biome.iron_citadel':           'Cidadela de Ferro',
    'biome.void_abyss':             'Abismo do Vácuo',

    // =====================================================
    // MONSTROS — Tipos Base
    // =====================================================
    'monster.goblin':               'Goblin',
    'monster.slime':                'Slime',
    'monster.wolf':                 'Lobo',
    'monster.lobo':                 'Lobo',
    'monster.orc':                  'Orc',
    'monster.spider':               'Aranha',
    'monster.aranha':               'Aranha',
    'monster.golem':                'Golem',
    'monster.bat':                  'Morcego',
    'monster.morcego':              'Morcego',
    'monster.skeleton':             'Esqueleto',
    'monster.esqueleto':            'Esqueleto',
    'monster.zumbi':                'Zumbi',
    'monster.bandido':              'Bandido',
    'monster.kobold':               'Kobold',
    'monster.harpy':                'Harpia',
    'monster.harpia':               'Harpia',
    'monster.troll':                'Troll',
    'monster.troll_gelo':           'Troll de Gelo',
    'monster.espectro_gelo':        'Espectro Ártico',
    'monster.salamandra_fogo':      'Salamandra Vulcânica',
    'monster.cavaleiro_cinzas':     'Cavaleiro das Cinzas',
    'monster.arauto_vazio':         'Arauto do Vazio',
    'monster.demon':                'Demônio',
    'monster.dragon':               'Dragão',
    'monster.lich':                 'Lich',
    'monster.elemental':            'Elemental',

    // Adjetivos de nome procedural
    'adj.gelido':                   'Gélido',
    'adj.feral':                    'Feral',
    'adj.sombrio':                  'Sombrio',
    'adj.corrupto':                 'Corrupto',
    'adj.anciao':                   'Ancião',
    'adj.maldito':                  'Maldito',
    'adj.feroz':                    'Feroz',
    'adj.maligno':                  'Maligno',
    'adj.voraz':                    'Voraz',
    'adj.colossal':                 'Colossal',
    'adj.fantasmal':                'Fantasmal',
    'adj.eterno':                   'Eterno',
    'adj.pestilento':               'Pestilento',
    'adj.cavernicola':              'Cavernícola',

    // Elementos de nome procedural
    'elem.fire':                    'do Fogo',
    'elem.ice':                     'do Gelo',
    'elem.shadow':                  'das Sombras',
    'elem.lightning':               'do Relâmpago',
    'elem.earth':                   'da Terra',
    'elem.void':                    'do Vazio',
    'elem.blood':                   'do Sangue',
    'elem.plague':                  'da Praga',
    'elem.storm':                   'da Tempestade',
    'elem.abyss':                   'do Abismo',

    // =====================================================
    // COMBATE & EXPLORAÇÃO
    // =====================================================
    'combat.kill':                  'Derrotou {name} (+{gold} Ouro, +{xp} XP)',
    'combat.loot_drop':             'Drop: {name}!',
    'combat.loot_full':             'Inventário cheio! Loot perdido.',
    'combat.level_up':              'LEVEL UP! Nível {level} ✨',
    'combat.level_up_float':        'LEVEL UP!',
    'combat.zone_advance':          '⚔️ Avançou para Zona {zone}!',
    'combat.zone_unlock':           'Zona {zone} desbloqueada!',
    'combat.defeated':              'Você foi derrotado! Recuperando HP...',
    'combat.revived':               'Herói recuperado! Voltando ao combate...',
    'combat.start':                 'Aventura iniciada!',
    'combat.focused_attack_hit':    '⚡ Ataque Concentrado em {name}: -{dmg} HP!',
    'combat.boss_label':            'BOSS!',
    'combat.elite_label':           'CAMPEÃO ELITE',
    'combat.zone_progress':         '{kills}/10',
    'combat.zone_label':            'Zona',

    'explore.overlay.defeated':     'DERROTADO',
    'explore.recovering':           'Recuperando... {pct}%',

    // =====================================================
    // INVENTÁRIO & ITEM
    // =====================================================
    'inventory.title':              'Inventário',
    'inventory.empty_slot':         'Vazio',
    'inventory.sell_success':       'Vendeu {name} por {price} Ouro',
    'inventory.equip_success':      'Equipou {name}',
    'inventory.dismantle_success':  'Desmontou {name}: +{scraps} Sucata',
    'inventory.dismantle_gold':     ' +{gold} Ouro',
    'inventory.autoloot':           'Filtro de Auto-Loot',

    // =====================================================
    // FERREIRO, ORÁCULO & MERCADO
    // =====================================================
    'smith.title':                  'Ferreiro',
    'smith.subtitle':               'Melhore seus equipamentos, forje encomendas e crie Relíquias Míticas.',
    'smith.tab.upgrade':            'Aprimorar',
    'smith.tab.craft':              'Forja',
    'smith.tab.relics':             'Relíquias Ancestrais',
    'smith.upgrade_success':        'Equipamento melhorado para +{level}!',
    'smith.no_resources':           'Recursos insuficientes para forjar.',
    'smith.scrap':                  'Sucata: {qty}',
    'smith.gold':                   'Ouro: {qty}',
    'smith.slot_empty':             '(vazio)',

    'oracle.title':                 'O Oráculo de Idleton',
    'oracle.tab.blessings':         'Bênçãos Divinas',
    'oracle.tab.enchant':           'Altar de Encantamentos',
    'enchant.fire':                 'Chama Solar',
    'enchant.lightning':            'Trovão Celestial',
    'enchant.ice':                  'Gelo Eterno',
    'enchant.vampiric':             'Sede Vampírica',

    'market.title':                 'Mercado Central',
    'market.tab.gold':              'Ouro',
    'market.tab.barter':            'Escambo',
    'market.tab.black_market':      'Mercado Negro',

    // =====================================================
    // HERÓI & PERFIL
    // =====================================================
    'hero.level':                   'Nível',
    'hero.xp':                      'XP',
    'hero.pe':                      'PE',
    'hero.name_placeholder':        'Nome do herói...',
    'hero.rename_success':          'Nome alterado com sucesso!',
    'hero.rename_invalid':          'Nome inválido.',
    'hero.rename_cost':             'Diamantes insuficientes! (Custo: {cost} 💎)',
    'hero.first_rename_free':       '1ª vez: grátis',
    'hero.rename_cost_label':       'Custo: {cost} 💎',

    // =====================================================
    // BESTIÁRIO & ESTATÍSTICAS
    // =====================================================
    'bestiary.title':               'Bestiário & Conhecimento',
    'bestiary.subtitle':            'Derrote espécies de monstros para desvendar seus atributos e conquistar bônus cumulativos.',
    'bestiary.kills':               'Abates',
    'bestiary.kills_count':         'Abates: {count}',
    'bestiary.bonus_pending':       'Bônus aos 100 abates',
    'bestiary.bonus_active':        '+15% Dano Contra',
    'bestiary.unknown':             '???',
    'bestiary.locked':              'Bloqueado',

    'stats.title':                  'Estatísticas & Conquistas',
    'stats.achievements':           'Conquistas de Idleton',

    // =====================================================
    // TAVERNA
    // =====================================================
    'tavern.title':                 'Taverna do Javali Risonho',
    'tavern.subtitle':              'Arrisque seu Ouro em jogos, descanse na Estalagem ou entregue Contratos.',
    'tavern.tab.games':             'Jogos & Domador',
    'tavern.tab.inn':               'Estalagem',
    'tavern.tab.contracts':         'Contratos',
    'tavern.game.coin':             'Cara ou Coroa',
    'tavern.game.dice':             'Dados',
    'tavern.bet_label':             'Aposta (Ouro)',
    'tavern.coin.win':              '🪙 Cara ou Coroa: VITÓRIA! +{gold} Ouro!',
    'tavern.coin.lose':             '🪙 Cara ou Coroa: DERROTA! -{bet} Ouro.',
    'tavern.dice.win':              '🎲 Dados: {hero} vs {npc}. VITÓRIA! +{gold} Ouro!',
    'tavern.dice.draw':             '🎲 Dados: Empate ({roll}). Aposta devolvida.',
    'tavern.dice.lose':             '🎲 Dados: {hero} vs {npc}. DERROTA! -{bet} Ouro.',
    'tavern.no_gold':               'Ouro insuficiente para apostar.',
    'tavern.invalid_bet':           'Defina uma aposta válida!',
    'tavern.unknown_game':          'Jogo desconhecido.',

    // =====================================================
    // ASCENSÃO
    // =====================================================
    'ascension.title':              'Ascensão da Linhagem',
    'ascension.subtitle':           'Renasça com Diamantes Ancestrais para desbloquear Bênçãos eternas.',
    'ascension.coming_soon':        'Disponível no Nível 50 (Zona 10+)',
    'ascension.prestige_label':     'Diamantes Ancestrais',

    // =====================================================
    // CONFIGURAÇÕES
    // =====================================================
    'settings.title':               'Configurações',
    'settings.language':            'Idioma',
    'settings.language_changed':    'Idioma alterado para Português (BR)! 🇧🇷',
    'settings.autobattle':          'Auto-batalha',
    'settings.autobattle.on':       'Ligada',
    'settings.autobattle.off':      'Desligada',
    'settings.save':                'Salvar Agora',
    'settings.reset':               'Resetar Progresso',
    'settings.reset_confirm':       'Progresso resetado com sucesso!',
    'settings.reset_warning':       'Isso apagará todo o progresso. Tem certeza?',

    // =====================================================
    // NOTIFICAÇÕES GERAIS
    // =====================================================
    'notify.level_up':              'LEVEL UP! Você alcançou o Nível {level}!',
    'notify.zone_unlock':           'Zona {zone} desbloqueada!',
    'notify.item_drop':             '+{name}!',
    'notify.scrap_gained':          '+{qty} Sucata!',
    'notify.build_success':         '{name} construído!',

    // =====================================================
    // LOG — TIPOS DE ENTRADA
    // =====================================================
    'log.type.narrative':           'narrativa',
    'log.type.loot':                'loot',
    'log.type.danger':              'perigo',
    'log.type.level':               'nível',
    'log.type.prestige':            'prestígio',

};
