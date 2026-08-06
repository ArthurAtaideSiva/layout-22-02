onRecordCreateRequest((e) => {
  var body = e.requestInfo().body || {}
  if (body.nome !== undefined) {
    var nome = String(body.nome).trim()
    if (nome.length < 2) {
      return e.badRequestError('Nome deve ter ao menos 2 caracteres')
    }
    e.requestInfo().body.nome = nome
  }
  if (body.cnpj !== undefined && body.cnpj !== '') {
    var cnpj = String(body.cnpj).trim()
    if (cnpj.length > 20) {
      return e.badRequestError('CNPJ muito longo')
    }
    e.requestInfo().body.cnpj = cnpj
  }
  if (body.telefone_whatsapp !== undefined && body.telefone_whatsapp !== '') {
    var tel = String(body.telefone_whatsapp).trim()
    if (tel.length > 20) {
      return e.badRequestError('Telefone muito longo')
    }
    e.requestInfo().body.telefone_whatsapp = tel
  }
  e.next()
}, 'clientes')

onRecordUpdateRequest((e) => {
  var body = e.requestInfo().body || {}
  if (body.nome !== undefined) {
    var nome = String(body.nome).trim()
    if (nome.length < 2) {
      return e.badRequestError('Nome deve ter ao menos 2 caracteres')
    }
    e.requestInfo().body.nome = nome
  }
  e.next()
}, 'clientes')
