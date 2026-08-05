cronAdd('reativacao_diaria', '0 7 * * *', (e) => {
  try {
    var users = $app.findRecordsByFilter('_pb_users_auth_', '', '', 10, 0)
    var clientes = $app.findRecordsByFilter('clientes', '', '', 500, 0)
    var now = new Date()
    var notifCol = $app.findCollectionByNameOrId('notificacoes')

    for (var i = 0; i < clientes.length; i++) {
      var cli = clientes[i]
      var uContato = cli.getString('ultimo_contato')
      if (!uContato) continue

      var diffDays = Math.floor(
        (now.getTime() - new Date(uContato).getTime()) / (1000 * 60 * 60 * 24),
      )
      var tipoNotif = ''
      var msgTemplate = ''

      if (diffDays === 30 || (diffDays > 30 && diffDays < 60)) {
        tipoNotif = 'reativacao_30'
        msgTemplate =
          'Olá ' +
          cli.getString('nome') +
          '! Faz tempo que não conversamos. A Layout 22 tem novidades para o seu setor. Podemos agendar uma breve visita?'
      } else if (diffDays === 60 || (diffDays > 60 && diffDays < 90)) {
        tipoNotif = 'reativacao_60'
        msgTemplate =
          'Olá ' +
          cli.getString('nome') +
          '! Notamos que você está sem contato há 60 dias. Temos condições especiais para renovação. Podemos conversar?'
      } else if (diffDays >= 90) {
        tipoNotif = 'reativacao_90'
        msgTemplate =
          'URGENTE: ' +
          cli.getString('nome') +
          ' está há ' +
          diffDays +
          ' dias sem contato. Risco de churn! Agende visita imediatamente.'
      }

      if (!tipoNotif) continue

      var existing = $app.findRecordsByFilter(
        'notificacoes',
        "cliente = '" + cli.id + "' && tipo = '" + tipoNotif + "' && status = 'pendente'",
        '',
        1,
        0,
      )
      if (existing.length > 0) continue

      for (var u = 0; u < users.length; u++) {
        var rec = new Record(notifCol)
        rec.set('tipo', tipoNotif)
        rec.set('destinatario', users[u].id)
        rec.set('mensagem', msgTemplate)
        rec.set('data_disparo', now.toISOString())
        rec.set('status', 'pendente')
        rec.set('cliente', cli.id)
        $app.save(rec)
      }
    }

    var opsFollow = $app.findRecordsByFilter(
      'oportunidades',
      'follow_up_pendente = true',
      '-prazo_resposta',
      100,
      0,
    )
    for (var j = 0; j < opsFollow.length; j++) {
      var op = opsFollow[j]
      var prazo = op.getString('prazo_resposta')
      if (!prazo) continue
      if (new Date(prazo).getTime() < now.getTime()) {
        var cliId = op.getString('cliente')
        var cliName = ''
        try {
          cliName = $app.findRecordById('clientes', cliId).getString('nome')
        } catch (_) {}

        var existingFollow = $app.findRecordsByFilter(
          'notificacoes',
          "cliente = '" + cliId + "' && tipo = 'proposta sem resposta' && status = 'pendente'",
          '',
          1,
          0,
        )
        if (existingFollow.length > 0) continue

        for (var u2 = 0; u2 < users.length; u2++) {
          var nRec = new Record(notifCol)
          nRec.set('tipo', 'proposta sem resposta')
          nRec.set('destinatario', users[u2].id)
          nRec.set(
            'mensagem',
            'Proposta de ' +
              op.getString('equipamento') +
              ' para ' +
              cliName +
              ' está sem resposta. Prazo vencido.',
          )
          nRec.set('data_disparo', now.toISOString())
          nRec.set('status', 'pendente')
          if (cliId) nRec.set('cliente', cliId)
          $app.save(nRec)
        }
      }
    }

    var opsFechadas = $app.findRecordsByFilter(
      'oportunidades',
      "status = 'Fechado'",
      '-data_proposta',
      100,
      0,
    )
    for (var k = 0; k < opsFechadas.length; k++) {
      var opF = opsFechadas[k]
      var dataProp = opF.getString('data_proposta')
      if (!dataProp) continue
      var diffHours = (now.getTime() - new Date(dataProp).getTime()) / (1000 * 60 * 60)
      if (diffHours < 48) continue

      var cliIdF = opF.getString('cliente')
      var existingFollowup = $app.findRecordsByFilter(
        'notificacoes',
        "cliente = '" + cliIdF + "' && tipo = 'followup_venda'",
        '',
        1,
        0,
      )
      if (existingFollowup.length > 0) continue

      for (var u3 = 0; u3 < users.length; u3++) {
        var fRec = new Record(notifCol)
        fRec.set('tipo', 'followup_venda')
        fRec.set('destinatario', users[u3].id)
        fRec.set(
          'mensagem',
          'Follow-up de venda: Verificar satisfação do cliente com a proposta fechada de ' +
            opF.getString('equipamento') +
            '.',
        )
        fRec.set('data_disparo', now.toISOString())
        fRec.set('status', 'pendente')
        if (cliIdF) fRec.set('cliente', cliIdF)
        $app.save(fRec)
      }
    }

    $app.logger().info('Cron de reativacao executado com sucesso')
  } catch (err) {
    $app.logger().error('Erro no cron de reativacao', 'error', String(err))
  }
})
