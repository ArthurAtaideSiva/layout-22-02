cronAdd('notificacoes_diarias', '0 6 * * *', (e) => {
  try {
    const users = $app.findRecordsByFilter('_pb_users_auth_', '', '', 10, 0)
    const clientes = $app.findRecordsByFilter('clientes', '', '', 500, 0)
    const now = new Date()

    for (const cli of clientes) {
      const uContato = cli.getString('ultimo_contato')
      if (uContato) {
        const diffDays = Math.floor(
          (now.getTime() - new Date(uContato).getTime()) / (1000 * 60 * 60 * 24),
        )
        if (diffDays >= 60) {
          const notifCol = $app.findCollectionByNameOrId('notificacoes')
          for (const u of users) {
            const rec = new Record(notifCol)
            rec.set('tipo', 'cliente esquecido')
            rec.set('destinatario', u.id)
            rec.set(
              'mensagem',
              'Atenção: ' + cli.getString('nome') + ' está sem contato há ' + diffDays + ' dias!',
            )
            rec.set('data_disparo', now.toISOString())
            rec.set('status', 'pendente')
            rec.set('cliente', cli.id)
            $app.save(rec)
          }
        }
      }
    }
  } catch (err) {
    $app.logger().error('Erro ao gerar notificações diárias', 'error', String(err))
  }
})
