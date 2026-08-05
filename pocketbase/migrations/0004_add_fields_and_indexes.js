migrate(
  (app) => {
    const cliCol = app.findCollectionByNameOrId('clientes')
    if (!cliCol.fields.getByName('telefone_whatsapp')) {
      cliCol.fields.add(new TextField({ name: 'telefone_whatsapp' }))
    }
    if (!cliCol.fields.getByName('data_ultimo_pedido')) {
      cliCol.fields.add(new DateField({ name: 'data_ultimo_pedido' }))
    }
    cliCol.addIndex('idx_cli_tel_whatsapp', false, 'telefone_whatsapp', '')
    app.save(cliCol)

    const intCol = app.findCollectionByNameOrId('interacoes')
    if (!intCol.fields.getByName('avaliacao')) {
      intCol.fields.add(new TextField({ name: 'avaliacao' }))
    }
    app.save(intCol)

    const notifCol = app.findCollectionByNameOrId('notificacoes')
    notifCol.fields.removeByName('tipo')
    notifCol.fields.add(
      new SelectField({
        name: 'tipo',
        values: [
          'aniversário',
          'cliente esquecido',
          'instalação atrasada',
          'chamado pendente',
          'proposta sem resposta',
          'troca de equipamento',
          'visita vencida',
          'reativacao_30',
          'reativacao_60',
          'reativacao_90',
          'followup_venda',
        ],
        maxSelect: 1,
      }),
    )
    app.save(notifCol)
  },
  (app) => {
    const cliCol = app.findCollectionByNameOrId('clientes')
    cliCol.fields.removeByName('telefone_whatsapp')
    cliCol.fields.removeByName('data_ultimo_pedido')
    cliCol.removeIndex('idx_cli_tel_whatsapp')
    app.save(cliCol)

    const intCol = app.findCollectionByNameOrId('interacoes')
    intCol.fields.removeByName('avaliacao')
    app.save(intCol)

    const notifCol = app.findCollectionByNameOrId('notificacoes')
    notifCol.fields.removeByName('tipo')
    notifCol.fields.add(
      new SelectField({
        name: 'tipo',
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
      }),
    )
    app.save(notifCol)
  },
)
