migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('oportunidades')
    col.addIndex('idx_opo_follow', false, 'follow_up_pendente', '')
    col.addIndex('idx_opo_prazo', false, 'prazo_resposta', '')
    app.save(col)

    var visCol = app.findCollectionByNameOrId('visitas')
    visCol.addIndex('idx_vis_cli', false, 'cliente', '')
    app.save(visCol)

    var eqCol = app.findCollectionByNameOrId('equipamentos')
    eqCol.addIndex('idx_eq_status', false, 'status', '')
    app.save(eqCol)

    var chamCol = app.findCollectionByNameOrId('chamados')
    chamCol.addIndex('idx_cham_cli', false, 'cliente', '')
    chamCol.addIndex('idx_cham_abertura', false, 'data_abertura', '')
    app.save(chamCol)

    var instCol = app.findCollectionByNameOrId('instalacoes')
    instCol.addIndex('idx_inst_cli', false, 'cliente', '')
    instCol.addIndex('idx_inst_prazo', false, 'prazo', '')
    app.save(instCol)

    var convCol = app.findCollectionByNameOrId('conversas_whatsapp')
    convCol.addIndex('idx_conv_tel', false, 'telefone', '')
    convCol.addIndex('idx_conv_data', false, 'data_hora', '')
    app.save(convCol)

    var metaCol = app.findCollectionByNameOrId('metas')
    metaCol.addIndex('idx_meta_periodo', false, 'periodo', '')
    app.save(metaCol)

    var notifCol = app.findCollectionByNameOrId('notificacoes')
    notifCol.addIndex('idx_notif_cli', false, 'cliente', '')
    notifCol.addIndex('idx_notif_dest', false, 'destinatario', '')
    app.save(notifCol)
  },
  (app) => {
    var cols = [
      { name: 'oportunidades', indexes: [] },
      { name: 'visitas', indexes: [] },
      { name: 'equipamentos', indexes: [] },
      { name: 'chamados', indexes: [] },
      { name: 'instalacoes', indexes: [] },
      { name: 'conversas_whatsapp', indexes: [] },
      { name: 'metas', indexes: [] },
      { name: 'notificacoes', indexes: [] },
    ]
    for (var i = 0; i < cols.length; i++) {
      try {
        var col = app.findCollectionByNameOrId(cols[i].name)
        for (var j = 0; j < cols[i].indexes.length; j++) {
          col.removeIndex(cols[i].indexes[j])
        }
        app.save(col)
      } catch (_) {}
    }
  },
)
