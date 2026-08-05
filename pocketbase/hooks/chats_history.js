routerAdd(
  'GET',
  '/backend/v1/assistant/conversations',
  (e) => {
    const userId = e.auth?.id
    if (!userId) return e.unauthorizedError('Autenticação necessária')
    const limit = parseInt(e.requestInfo().query?.limit || '20', 10) || 20
    return e.json(
      200,
      $ai.agent('assistente-comercial').listConversations({ user_id: userId, limit }),
    )
  },
  $apis.requireAuth(),
)

routerAdd(
  'GET',
  '/backend/v1/assistant/conversations/{id}/messages',
  (e) => {
    const userId = e.auth?.id
    if (!userId) return e.unauthorizedError('Autenticação necessária')
    const convId = e.request.pathValue('id')
    return e.json(
      200,
      $ai.agent('assistente-comercial').listMessages({ conversation_id: convId, user_id: userId }),
    )
  },
  $apis.requireAuth(),
)
