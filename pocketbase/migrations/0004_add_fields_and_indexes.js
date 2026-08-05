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
    const oldTipo = notifCol.fields.getByName('tipo')
    if (oldTipo) {
      notifCol.fields.remove(oldTipo)
    }
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
    const tw = cliCol.fields.getByName('telefone_whatsapp')
    if (tw) cliCol.fields.remove(tw)
    const dup = cliCol.fields.getByName('data_ultimo_pedido')
    if (dup) cliCol.fields.remove(dup)
    cliCol.removeIndex('idx_cli_tel_whatsapp')
    app.save(cliCol)

    const intCol = app.findCollectionByNameOrId('interacoes')
    const av = intCol.fields.getByName('avaliacao')
    if (av) intCol.fields.remove(av)
    app.save(intCol)

    const notifCol = app.findCollectionByNameOrId('notificacoes')
    const currTipo = notifCol.fields.getByName('tipo')
    if (currTipo) notifCol.fields.remove(currTipo)
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
