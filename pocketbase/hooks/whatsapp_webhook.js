routerAdd('POST', '/backend/v1/whatsapp/webhook', (e) => {
  try {
    const body = e.requestInfo().body || {}
    const telefoneRaw = (body.telefone || '').replace(/\D/g, '')
    const mensagem = (body.mensagem || '').trim()
    if (!telefoneRaw || !mensagem) {
      return e.badRequestError('telefone e mensagem são obrigatórios')
    }

    let clienteId = ''
    let clienteNome = ''
    let clienteStatus = ''
    let isProspect = false

    try {
      const cli = $app.findFirstRecordByFilter(
        'clientes',
        'telefone_whatsapp = {:tel}',
        telefoneRaw,
      )
      clienteId = cli.id
      clienteNome = cli.getString('nome')
      clienteStatus = cli.getString('status')
    } catch (_) {
      try {
        const cont = $app.findFirstRecordByFilter('contatos', 'telefone = {:tel}', telefoneRaw)
        const cliId = cont.getString('cliente')
        if (cliId) {
          const cli = $app.findRecordById('clientes', cliId)
          clienteId = cli.id
          clienteNome = cli.getString('nome')
          clienteStatus = cli.getString('status')
        }
      } catch (_) {
        isProspect = true
      }
    }

    const manutencaoKW = [
      'quebrado',
      'parou',
      'defeito',
      'nao funciona',
      'manutencao',
      'conserto',
      'reparo',
      'estragou',
      'queimou',
      'vazando',
    ]
    const orcamentoKW = ['preco', 'orcamento', 'cotacao', 'quanto custa', 'valor', 'quanto sai']
    const vendaKW = ['comprar', 'trocar', 'novo', 'aquisicao', 'renovar', 'substituir']
    const instalacaoKW = ['instalar', 'instalacao', 'entrega', 'montagem']
    const socioKW = [
      'socio',
      'dono',
      'proprietario',
      'reclamacao',
      'conflito',
      'gerente',
      'responsavel',
    ]

    const msgLower = mensagem.toLowerCase()
    let intent = ''
    let classificacao = 'outro'

    if (
      manutencaoKW.some(function (k) {
        return msgLower.indexOf(k) >= 0
      })
    ) {
      intent = 'manutencao'
      classificacao = 'manutenção'
    } else if (
      orcamentoKW.some(function (k) {
        return msgLower.indexOf(k) >= 0
      })
    ) {
      intent = 'orcamento'
      classificacao = 'venda'
    } else if (
      vendaKW.some(function (k) {
        return msgLower.indexOf(k) >= 0
      })
    ) {
      intent = 'venda'
      classificacao = 'venda'
    } else if (
      instalacaoKW.some(function (k) {
        return msgLower.indexOf(k) >= 0
      })
    ) {
      intent = 'instalacao'
      classificacao = 'outro'
    } else if (
      socioKW.some(function (k) {
        return msgLower.indexOf(k) >= 0
      })
    ) {
      intent = 'socio'
      classificacao = 'outro'
    } else if (mensagem >= '1' && mensagem <= '5' && mensagem.length === 1) {
      var num = parseInt(mensagem)
      intent = ['manutencao', 'orcamento', 'venda', 'instalacao', 'socio'][num - 1]
      classificacao = num === 1 ? 'manutenção' : num === 2 || num === 3 ? 'venda' : 'outro'
    } else {
      try {
        var reply = $ai.chat({
          model: 'fast',
          messages: [
            {
              role: 'system',
              content:
                'Classifique a intenção em: manutencao, orcamento, venda, instalacao, socio. Responda apenas a categoria.',
            },
            { role: 'user', content: mensagem },
          ],
        })
        var aiIntent = reply.choices[0].message.content.trim().toLowerCase()
        if (aiIntent.indexOf('manuten') >= 0) {
          intent = 'manutencao'
          classificacao = 'manutenção'
        } else if (aiIntent.indexOf('orcam') >= 0) {
          intent = 'orcamento'
          classificacao = 'venda'
        } else if (aiIntent.indexOf('venda') >= 0 || aiIntent.indexOf('troca') >= 0) {
          intent = 'venda'
          classificacao = 'venda'
        } else if (aiIntent.indexOf('instal') >= 0) {
          intent = 'instalacao'
          classificacao = 'outro'
        } else if (aiIntent.indexOf('socio') >= 0) {
          intent = 'socio'
          classificacao = 'outro'
        } else {
          intent = 'menu'
          classificacao = 'outro'
        }
      } catch (_) {
        intent = 'menu'
        classificacao = 'outro'
      }
    }

    var now = new Date().toISOString()
    var convCol = $app.findCollectionByNameOrId('conversas_whatsapp')
    var conv = new Record(convCol)
    if (clienteId) conv.set('cliente', clienteId)
    conv.set('telefone', telefoneRaw)
    conv.set('mensagem', mensagem)
    conv.set('tipo', 'texto')
    conv.set('data_hora', now)
    conv.set('classificacao', classificacao)
    conv.set('atendida', true)
    $app.save(conv)

    if (clienteId) {
      var intCol = $app.findCollectionByNameOrId('interacoes')
      var inter = new Record(intCol)
      inter.set('cliente', clienteId)
      inter.set('data', now)
      inter.set('tipo', 'WhatsApp')
      inter.set('resultado', 'Intenção: ' + intent + ' | Msg: ' + mensagem.substring(0, 200))
      inter.set(
        'proximo_passo',
        intent === 'socio' ? 'Escalar para sócio' : 'Continuar fluxo de ' + intent,
      )
      $app.save(inter)

      var cliRec = $app.findRecordById('clientes', clienteId)
      cliRec.set('ultimo_contato', now)
      $app.save(cliRec)
    }

    if (intent === 'socio' && clienteId) {
      var users = $app.findRecordsByFilter('_pb_users_auth_', '', '', 10, 0)
      var notifCol = $app.findCollectionByNameOrId('notificacoes')
      for (var u = 0; u < users.length; u++) {
        var notif = new Record(notifCol)
        notif.set('tipo', 'chamado pendente')
        notif.set('destinatario', users[u].id)
        notif.set(
          'mensagem',
          'Escalacao: ' + clienteNome + ' solicitou falar com sócio. Verifique chat.',
        )
        notif.set('data_disparo', now)
        notif.set('status', 'pendente')
        notif.set('cliente', clienteId)
        $app.save(notif)
      }
    }

    var resposta = ''
    if (isProspect) {
      resposta =
        'Olá! Bem-vindo à Layout 22, representação de maquinário para supermercados. Para melhor atende-lo, poderia informar seu nome, empresa e cidade?'
    } else if (clienteStatus === 'Inativo') {
      resposta =
        'Ola ' +
        clienteNome +
        '! Faz tempo que nao conversamos. A Layout 22 tem novidades para o seu setor. Como posso ajuda-lo?\n\n1-Manutencao\n2-Orcamento\n3-Nova Venda/Troca\n4-Instalacao\n5-Falar com Socio'
    } else {
      var menuText =
        '\n\n1-Manutencao\n2-Orcamento\n3-Nova Venda/Troca\n4-Instalacao\n5-Falar com Socio'
      if (intent === 'manutencao') {
        resposta =
          'Entendi, ' +
          clienteNome +
          '. Para abrir o chamado de manutencao, descreva o problema, o modelo do equipamento e, se possivel, envie fotos do defeito e da etiqueta.'
      } else if (intent === 'orcamento') {
        resposta =
          'Otimo, ' +
          clienteNome +
          '! Vou preparar uma cotacao. Qual equipamento voce tem interesse?'
      } else if (intent === 'venda') {
        resposta =
          'Excelente, ' +
          clienteNome +
          '! Temos condicoes especiais para renovacao de linha. Qual equipamento voce deseja adquirir ou trocar?'
      } else if (intent === 'instalacao') {
        resposta = 'Vou verificar o status da sua instalacao, ' + clienteNome + '. Um momento...'
      } else if (intent === 'socio') {
        resposta =
          'Entendido, ' +
          clienteNome +
          '. Vou encaminhar voce para um dos socios responsaveis. Eles entrarao em contato em breve.'
      } else {
        resposta = 'Ola ' + clienteNome + '! Como posso ajuda-lo hoje?' + menuText
      }
    }

    return e.json(200, {
      intent: intent,
      cliente_id: clienteId,
      cliente_nome: clienteNome,
      is_prospect: isProspect,
      resposta: resposta,
    })
  } catch (err) {
    return e.json(500, { error: err.message || 'Erro no webhook WhatsApp' })
  }
})
