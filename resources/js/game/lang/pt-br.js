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
    'game.subtitle':                'Um RPG Idle de Texto',

    'nav.tab.city':                 'Cidade',
    'nav.tab.inventory':            'Inventário',
    'nav.tab.explore':              'Exploração',
    'nav.tab.domain':               'Domínio',
    'nav.tab.bestiary':             'Bestiário',
    'nav.tab.ascension':            'Ascensão',
    'nav.settings':                 'Configurações',
    'nav.menu':                     'Menu Principal',

    // =====================================================
    // BOTÕES GERAIS
    // =====================================================
    'btn.buy':                      'Comprar',
    'btn.upgrade':                  'Melhorar',
    'btn.equip':                    'Equipar',
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

    // =====================================================
    // RECURSOS
    // =====================================================
    'resource.gold':                'Ouro',
    'resource.scrap':               'Sucata',
    'resource.diamond':             'Diamante',
    'resource.wood':                'Madeira',
    'resource.essence':             'Essência',
    'resource.iron':                'Ferro',

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
    // TIPOS DE EQUIPAMENTO
    // =====================================================
    'item.weapon':                  'Espada',
    'item.shield':                  'Escudo',
    'item.helmet':                  'Elmo',
    'item.chest':                   'Peitoral',
    'item.legs':                    'Perneiras',
    'item.boots':                   'Botas',
    'item.ring':                    'Anel',
    'item.amulet':                  'Amuleto',

    // =====================================================
    // HABILIDADES PASSIVAS
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

    // =====================================================
    // HABILIDADES ATIVAS
    // =====================================================
    'ability.focused_attack':       'Ataque Concentrado',
    'ability.focused_attack.desc':  '3× Dano · 30 ⚡ · 8s CD',
    'ability.focused_attack.ready': 'PRONTO',
    'ability.focused_attack.cd':    '{s}s',
    'ability.no_energy':            'Energia insuficiente para Ataque Concentrado! (30 ⚡)',

    // =====================================================
    // CONSTRUÇÕES (DOMÍNIO)
    // =====================================================
    'building.hut':                 'Cabana',
    'building.farm':                'Fazenda',
    'building.workshop':            'Oficina',
    'building.mine':                'Mina',
    'building.market':              'Mercado',
    'building.library':             'Biblioteca',
    'building.garrison':            'Quartel',
    'building.treasury':            'Tesouro',
    'building.castle':              'Castelo',

    'domain.title':                 'Domínio',
    'domain.subtitle':              'Construa e expanda sua cidade.',
    'domain.level':                 'Nível {qty}',
    'domain.owned':                 'Possuído: {qty}',
    'domain.prod':                  '+{prod}/s',
    'domain.next_cost':             'Próx: {cost} Ouro',
    'domain.buy_success':           'Construiu {name}!',
    'domain.no_gold':               'Ouro insuficiente para construir.',

    // =====================================================
    // MONSTROS — Tipos Base
    // =====================================================
    'monster.goblin':               'Goblin',
    'monster.wolf':                 'Lobo',
    'monster.orc':                  'Orc',
    'monster.spider':               'Aranha',
    'monster.golem':                'Golem',
    'monster.bat':                  'Morcego',
    'monster.skeleton':             'Esqueleto',
    'monster.harpy':                'Harpia',
    'monster.troll':                'Troll',
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

    // =====================================================
    // FERREIRO
    // =====================================================
    'smith.title':                  'Ferreiro',
    'smith.subtitle':               'Melhore seus equipamentos gastando Sucata e Ouro.',
    'smith.upgrade_success':        'Equipamento melhorado para +{level}!',
    'smith.no_resources':           'Recursos insuficientes para forjar.',
    'smith.scrap':                  'Sucata: {qty}',
    'smith.gold':                   'Ouro: {qty}',
    'smith.slot_empty':             '(vazio)',

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
    // BESTIÁRIO
    // =====================================================
    'bestiary.title':               'Bestiário',
    'bestiary.subtitle':            'Registe e estude as criaturas do mundo.',
    'bestiary.kills':               'Abates',
    'bestiary.kills_count':         'Abates: {count}',
    'bestiary.bonus_pending':       'Bônus aos 100 abates',
    'bestiary.bonus_active':        '+15% Dano Contra',
    'bestiary.unknown':             '???',
    'bestiary.locked':              'Bloqueado',

    // =====================================================
    // TAVERNA
    // =====================================================
    'tavern.title':                 'Taverna',
    'tavern.subtitle':              'Arrisque seu Ouro em jogos de azar.',
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
    // ASCENSÃO (futuro)
    // =====================================================
    'ascension.title':              'Ascensão',
    'ascension.subtitle':           'Resete seu progresso por recompensas permanentes.',
    'ascension.coming_soon':        'Em breve...',
    'ascension.prestige_label':     'Estrelas de Prestígio',

    // =====================================================
    // CONFIGURAÇÕES
    // =====================================================
    'settings.title':               'Configurações',
    'settings.language':            'Idioma',
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
    // (para colorização do log — já está em código, mas centralizado aqui)
    'log.type.narrative':           'narrativa',
    'log.type.loot':                'loot',
    'log.type.danger':              'perigo',
    'log.type.level':               'nível',
    'log.type.prestige':            'prestígio',

};
