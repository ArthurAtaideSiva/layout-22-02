routerAdd(
  'POST',
  '/backend/v1/ask-assistant',
  (e) => {
    try {
      const body = e.requestInfo().body || {}
      const userId = e.auth?.id
      if (!userId) return e.unauthorizedError('Autenticação necessária')
      if (!body.message || !body.message.trim()) return e.badRequestError('Mensagem é obrigatória')

      const conv = $ai.agent('assistente-comercial').getOrCreateConversation({
        user_id: userId,
        id: body.conversation_id || null,
      })

      const iter = $ai.agent('assistente-comercial').chat({
        user_id: userId,
        conversation_id: conv.id,
        message: body.message,
        stream: true,
      })

      e.response.header().set('Content-Type', 'text/event-stream')
      e.response.header().set('Cache-Control', 'no-cache')
      e.response.header().set('X-Conversation-Id', conv.id)
      return $response.stream(e, iter)
    } catch (err) {
      return e.json(500, { error: err.message || 'Erro no assistente comercial' })
    }
  },
  $apis.requireAuth(),
)
