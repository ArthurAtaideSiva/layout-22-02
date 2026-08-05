migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let adminUser
    try {
      adminUser = app.findAuthRecordByEmail('_pb_users_auth_', 'arthurataidesilva2005@gmail.com')
    } catch (_) {
      adminUser = new Record(users)
      adminUser.setEmail('arthurataidesilva2005@gmail.com')
      adminUser.setPassword('Skip@Pass')
      adminUser.setVerified(true)
      adminUser.set('name', 'Sócio Representante')
      app.save(adminUser)
    }

    const clientesCol = app.findCollectionByNameOrId('clientes')
    let mateusRec, bomPrecoRec, miniBoxRec

    try {
      mateusRec = app.findFirstRecordByData('clientes', 'nome', 'Supermercado Mateus')
    } catch (_) {
      mateusRec = new Record(clientesCol)
      mateusRec.set('nome', 'Supermercado Mateus')
      mateusRec.set('cnpj', '12.345.678/0001-90')
      mateusRec.set('porte', 'Grande rede')
      mateusRec.set('cidade', 'São Luís')
      mateusRec.set('estado', 'MA')
      mateusRec.set('regiao', 'Norte / Nordeste')
      mateusRec.set('status', 'Ativo')
      mateusRec.set('aniversario', '1995-10-15 00:00:00.000Z')
      mateusRec.set('ultima_visita', '2026-07-20 00:00:00.000Z')
      mateusRec.set('ultimo_contato', '2026-08-01 00:00:00.000Z')
      app.save(mateusRec)
    }

    try {
      bomPrecoRec = app.findFirstRecordByData('clientes', 'nome', 'Supermercado Bom Preço')
    } catch (_) {
      bomPrecoRec = new Record(clientesCol)
      bomPrecoRec.set('nome', 'Supermercado Bom Preço')
      bomPrecoRec.set('cnpj', '98.765.432/0001-11')
      bomPrecoRec.set('porte', 'Pequeno')
      bomPrecoRec.set('cidade', 'São Luís')
      bomPrecoRec.set('estado', 'MA')
      bomPrecoRec.set('regiao', 'Norte / Nordeste')
      bomPrecoRec.set('status', 'Ativo')
      bomPrecoRec.set('aniversario', '2008-03-22 00:00:00.000Z')
      bomPrecoRec.set('ultima_visita', '2026-05-10 00:00:00.000Z')
      bomPrecoRec.set('ultimo_contato', '2026-05-12 00:00:00.000Z')
      app.save(bomPrecoRec)
    }

    try {
      miniBoxRec = app.findFirstRecordByData('clientes', 'nome', 'Rede MiniBox')
    } catch (_) {
      miniBoxRec = new Record(clientesCol)
      miniBoxRec.set('nome', 'Rede MiniBox')
      miniBoxRec.set('cnpj', '45.111.222/0001-33')
      miniBoxRec.set('porte', 'Médio')
      miniBoxRec.set('cidade', 'Teresina')
      miniBoxRec.set('estado', 'PI')
      miniBoxRec.set('regiao', 'Meio-Norte')
      miniBoxRec.set('status', 'Prospecção')
      miniBoxRec.set('aniversario', '2015-08-10 00:00:00.000Z')
      miniBoxRec.set('ultima_visita', '2026-07-05 00:00:00.000Z')
      miniBoxRec.set('ultimo_contato', '2026-07-28 00:00:00.000Z')
      app.save(miniBoxRec)
    }

    const contatosCol = app.findCollectionByNameOrId('contatos')
    try {
      app.findFirstRecordByData('contatos', 'nome', 'Fernando Silva')
    } catch (_) {
      const cont = new Record(contatosCol)
      cont.set('cliente', mateusRec.id)
      cont.set('nome', 'Fernando Silva')
      cont.set('cargo', 'proprietário')
      cont.set('telefone', '(98) 98877-6655')
      cont.set('email', 'fernando@supermateus.com.br')
      cont.set('aniversario', '1980-08-12 00:00:00.000Z')
      app.save(cont)
    }

    const opoCol = app.findCollectionByNameOrId('oportunidades')
    try {
      app.findFirstRecordByData('oportunidades', 'equipamento', 'Balança Digital Industrial')
    } catch (_) {
      const op1 = new Record(opoCol)
      op1.set('cliente', mateusRec.id)
      op1.set('equipamento', 'Balança Digital Industrial')
      op1.set('status', 'Em análise')
      op1.set('data_proposta', '2026-07-15 00:00:00.000Z')
      op1.set('prazo_resposta', '2026-07-30 00:00:00.000Z')
      op1.set('valor_estimado', 85000)
      op1.set('comissao_estimada', 6800)
      op1.set('follow_up_pendente', true)
      app.save(op1)

      const op2 = new Record(opoCol)
      op2.set('cliente', miniBoxRec.id)
      op2.set('equipamento', 'Expositor Refrigerado Multideck')
      op2.set('status', 'Cotação enviada')
      op2.set('data_proposta', '2026-08-01 00:00:00.000Z')
      op2.set('prazo_resposta', '2026-08-15 00:00:00.000Z')
      op2.set('valor_estimado', 140000)
      op2.set('comissao_estimada', 11200)
      op2.set('follow_up_pendente', false)
      app.save(op2)
    }

    const eqCol = app.findCollectionByNameOrId('equipamentos')
    try {
      app.findFirstRecordByData('equipamentos', 'modelo', 'Fatiador FPA-350')
    } catch (_) {
      const eq1 = new Record(eqCol)
      eq1.set('cliente', mateusRec.id)
      eq1.set('modelo', 'Fatiador FPA-350')
      eq1.set('marca', 'Filizola/Toledo')
      eq1.set('data_instalacao', '2021-09-01 00:00:00.000Z')
      eq1.set('vida_util_meses', 60)
      eq1.set('data_expiracao', '2026-09-01 00:00:00.000Z')
      eq1.set('status', 'Troca recomendada')
      app.save(eq1)
    }

    const instCol = app.findCollectionByNameOrId('instalacoes')
    try {
      app.findFirstRecordByData('instalacoes', 'equipamento', 'Câmara Frigorífica Modular')
    } catch (_) {
      const inst = new Record(instCol)
      inst.set('cliente', mateusRec.id)
      inst.set('equipamento', 'Câmara Frigorífica Modular')
      inst.set('data_solicitacao', '2026-07-10 00:00:00.000Z')
      inst.set('prazo', '2026-08-01 00:00:00.000Z')
      inst.set('status', 'Atrasada')
      app.save(inst)
    }

    const chamCol = app.findCollectionByNameOrId('chamados')
    try {
      app.findFirstRecordByData('chamados', 'equipamento', 'Ilha de Congelados 3M')
    } catch (_) {
      const cham = new Record(chamCol)
      cham.set('cliente', bomPrecoRec.id)
      cham.set('equipamento', 'Ilha de Congelados 3M')
      cham.set('data_abertura', '2026-08-02 00:00:00.000Z')
      cham.set('problema', 'Ruído excessivo no compressor e oscilação de temperatura')
      cham.set('status', 'Aberto')
      app.save(cham)
    }

    const metaCol = app.findCollectionByNameOrId('metas')
    try {
      app.findFirstRecordByData('metas', 'periodo', 'mensal')
    } catch (_) {
      const meta = new Record(metaCol)
      meta.set('periodo', 'mensal')
      meta.set('valor_meta', 350000)
      meta.set('valor_realizado', 210000)
      meta.set('propostas_enviadas', 8)
      meta.set('vendas_fechadas', 3)
      app.save(meta)
    }

    const notifCol = app.findCollectionByNameOrId('notificacoes')
    try {
      app.findFirstRecordByData(
        'notificacoes',
        'mensagem',
        'Proposta de Balança Digital para Supermercado Mateus expirou o prazo.',
      )
    } catch (_) {
      const not1 = new Record(notifCol)
      not1.set('tipo', 'proposta sem resposta')
      not1.set('destinatario', adminUser.id)
      not1.set(
        'mensagem',
        'Proposta de Balança Digital para Supermercado Mateus expirou o prazo de resposta.',
      )
      not1.set('data_disparo', '2026-08-04 00:00:00.000Z')
      not1.set('status', 'pendente')
      not1.set('cliente', mateusRec.id)
      app.save(not1)

      const not2 = new Record(notifCol)
      not2.set('tipo', 'cliente esquecido')
      not2.set('destinatario', adminUser.id)
      not2.set('mensagem', 'Supermercado Bom Preço está sem contato há mais de 80 dias!')
      not2.set('data_disparo', '2026-08-05 00:00:00.000Z')
      not2.set('status', 'pendente')
      not2.set('cliente', bomPrecoRec.id)
      app.save(not2)
    }
  },
  (app) => {},
)
