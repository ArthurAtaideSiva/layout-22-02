migrate(
  (app) => {
    const authId = '_pb_users_auth_'
    const authRule = "@request.auth.id != ''"

    const clientes = new Collection({
      name: 'clientes',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        { name: 'nome', type: 'text', required: true },
        { name: 'cnpj', type: 'text' },
        {
          name: 'porte',
          type: 'select',
          values: ['Pequeno', 'Médio', 'Grande rede'],
          maxSelect: 1,
        },
        { name: 'cidade', type: 'text' },
        { name: 'estado', type: 'text' },
        { name: 'regiao', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: ['Prospecção', 'Ativo', 'Pós-venda', 'Inativo'],
          maxSelect: 1,
        },
        { name: 'aniversario', type: 'date' },
        { name: 'ultima_visita', type: 'date' },
        { name: 'ultimo_contato', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_cli_status ON clientes (status)',
        'CREATE INDEX idx_cli_porte ON clientes (porte)',
        'CREATE INDEX idx_cli_regiao ON clientes (regiao)',
        'CREATE INDEX idx_cli_contato ON clientes (ultimo_contato)',
      ],
    })
    app.save(clientes)
    const cliId = clientes.id

    const contatos = new Collection({
      name: 'contatos',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: 'cliente',
          type: 'relation',
          collectionId: cliId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'nome', type: 'text', required: true },
        {
          name: 'cargo',
          type: 'select',
          values: ['gerente', 'proprietário', 'diretor', 'compras', 'outro'],
          maxSelect: 1,
        },
        { name: 'telefone', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'aniversario', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_cont_cli ON contatos (cliente)'],
    })
    app.save(contatos)

    const interacoes = new Collection({
      name: 'interacoes',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: 'cliente',
          type: 'relation',
          collectionId: cliId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'data', type: 'date', required: true },
        {
          name: 'tipo',
          type: 'select',
          values: ['visita', 'ligação', 'WhatsApp', 'email', 'proposta'],
          maxSelect: 1,
        },
        { name: 'resultado', type: 'text' },
        { name: 'proximo_passo', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_int_cli ON interacoes (cliente)',
        'CREATE INDEX idx_int_data ON interacoes (data)',
      ],
    })
    app.save(interacoes)

    const oportunidades = new Collection({
      name: 'oportunidades',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: 'cliente',
          type: 'relation',
          collectionId: cliId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'equipamento', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: ['Prospecção', 'Cotação enviada', 'Em análise', 'Fechado', 'Perdido'],
          maxSelect: 1,
        },
        { name: 'data_proposta', type: 'date' },
        { name: 'prazo_resposta', type: 'date' },
        { name: 'valor_estimado', type: 'number' },
        { name: 'comissao_estimada', type: 'number' },
        { name: 'follow_up_pendente', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_opo_cli ON oportunidades (cliente)',
        'CREATE INDEX idx_opo_status ON oportunidades (status)',
      ],
    })
    app.save(oportunidades)

    const equipamentos = new Collection({
      name: 'equipamentos',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: 'cliente',
          type: 'relation',
          collectionId: cliId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'modelo', type: 'text' },
        { name: 'marca', type: 'text' },
        { name: 'data_instalacao', type: 'date' },
        { name: 'vida_util_meses', type: 'number' },
        { name: 'data_expiracao', type: 'date' },
        {
          name: 'status',
          type: 'select',
          values: ['Ativo', 'Troca recomendada', 'Trocado'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_eq_cli ON equipamentos (cliente)',
        'CREATE INDEX idx_eq_exp ON equipamentos (data_expiracao)',
      ],
    })
    app.save(equipamentos)

    const instalacoes = new Collection({
      name: 'instalacoes',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: 'cliente',
          type: 'relation',
          collectionId: cliId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'equipamento', type: 'text' },
        { name: 'data_solicitacao', type: 'date' },
        { name: 'prazo', type: 'date' },
        {
          name: 'status',
          type: 'select',
          values: ['Solicitada', 'Agendada', 'Concluída', 'Atrasada'],
          maxSelect: 1,
        },
        { name: 'data_conclusao', type: 'date' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_inst_status ON instalacoes (status)'],
    })
    app.save(instalacoes)

    const chamados = new Collection({
      name: 'chamados',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: 'cliente',
          type: 'relation',
          collectionId: cliId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'equipamento', type: 'text' },
        { name: 'data_abertura', type: 'date' },
        { name: 'problema', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: ['Aberto', 'Em andamento', 'Concluído'],
          maxSelect: 1,
        },
        { name: 'data_conclusao', type: 'date' },
        { name: 'historico', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_cham_status ON chamados (status)'],
    })
    app.save(chamados)

    const visitas = new Collection({
      name: 'visitas',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: 'cliente',
          type: 'relation',
          collectionId: cliId,
          maxSelect: 1,
          cascadeDelete: true,
        },
        { name: 'data', type: 'date' },
        {
          name: 'motivo',
          type: 'select',
          values: ['comercial', 'técnica', 'follow-up'],
          maxSelect: 1,
        },
        { name: 'resultado', type: 'text' },
        { name: 'proximos_passos', type: 'text' },
        { name: 'regiao', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_vis_data ON visitas (data)',
        'CREATE INDEX idx_vis_reg ON visitas (regiao)',
      ],
    })
    app.save(visitas)

    const notificacoes = new Collection({
      name: 'notificacoes',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        {
          name: 'tipo',
          type: 'select',
          values: [
            'aniversário',
            'cliente esquecido',
            'instalação atrasada',
            'chamado pendente',
            'proposta sem resposta',
            'troca de equipamento',
            'visita vencida',
          ],
          maxSelect: 1,
        },
        { name: 'destinatario', type: 'relation', collectionId: authId, maxSelect: 1 },
        { name: 'mensagem', type: 'text' },
        { name: 'data_disparo', type: 'date' },
        { name: 'status', type: 'select', values: ['pendente', 'enviada', 'lida'], maxSelect: 1 },
        { name: 'cliente', type: 'relation', collectionId: cliId, maxSelect: 1 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_notif_st ON notificacoes (status)'],
    })
    app.save(notificacoes)

    const metas = new Collection({
      name: 'metas',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        { name: 'periodo', type: 'select', values: ['mensal', 'trimestral'], maxSelect: 1 },
        { name: 'valor_meta', type: 'number' },
        { name: 'valor_realizado', type: 'number' },
        { name: 'propostas_enviadas', type: 'number' },
        { name: 'vendas_fechadas', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(metas)

    const conversas_whatsapp = new Collection({
      name: 'conversas_whatsapp',
      type: 'base',
      listRule: authRule,
      viewRule: authRule,
      createRule: authRule,
      updateRule: authRule,
      deleteRule: authRule,
      fields: [
        { name: 'cliente', type: 'relation', collectionId: cliId, maxSelect: 1 },
        { name: 'telefone', type: 'text' },
        { name: 'mensagem', type: 'text' },
        { name: 'tipo', type: 'select', values: ['texto', 'áudio'], maxSelect: 1 },
        { name: 'data_hora', type: 'date' },
        {
          name: 'classificacao',
          type: 'select',
          values: ['manutenção', 'dúvida', 'venda', 'outro'],
          maxSelect: 1,
        },
        { name: 'atendida', type: 'bool' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(conversas_whatsapp)
  },
  (app) => {
    const cols = [
      'conversas_whatsapp',
      'metas',
      'notificacoes',
      'visitas',
      'chamados',
      'instalacoes',
      'equipamentos',
      'oportunidades',
      'interacoes',
      'contatos',
      'clientes',
    ]
    for (const name of cols) {
      try {
        const c = app.findCollectionByNameOrId(name)
        app.delete(c)
      } catch (_) {}
    }
  },
)
