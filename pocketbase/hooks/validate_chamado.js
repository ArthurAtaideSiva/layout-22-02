onRecordCreateRequest((e) => {
  var body = e.requestInfo().body || {}
  if (body.problema !== undefined) {
    var problema = String(body.problema).trim()
    if (problema.length < 3) {
      return e.badRequestError('Descrição do problema muito curta')
    }
    if (problema.length > 2000) {
      return e.badRequestError('Descrição do problema muito longa (máx 2000 caracteres)')
    }
    e.requestInfo().body.problema = problema
  }
  if (body.equipamento !== undefined) {
    var eq = String(body.equipamento).trim()
    if (eq.length > 200) {
      return e.badRequestError('Nome do equipamento muito longo')
    }
    e.requestInfo().body.equipamento = eq
  }
  e.next()
}, 'chamados')
