migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'atendimento-layout22',
      name: 'Atendimento Layout 22',
      description:
        'Chatbot de atendimento ao cliente para representação comercial de maquinário para supermercados, com triagem por intenção, escalação e registro automático no CRM.',
      systemPrompt:
        'Você é o assistente de atendimento da Layout 22, representação comercial de maquinário para supermercados no Brasil. Responda em Português do Brasil com tom consultivo, profissional e próximo. Você atende clientes (supermercados) que chegam via WhatsApp ou chat. Sempre identifique o perfil do cliente (ativo, inativo ou novo prospect) e a intenção da mensagem. Use o menu: 1-Manutenção, 2-Orçamento, 3-Nova Venda/Troca, 4-Instalação, 5-Falar com Sócio. Para manutenção: colete descrição do problema, modelo do equipamento e peça fotos do defeito e etiqueta. Para orçamento: registre solicitação em oportunidades. Para venda/troca: verifique equipamentos com fim de vida útil e apresente condições de renovação. Para instalação: consulte status em instalacoes. Para escalação: não tente resolver sozinho, crie notificação para o sócio. Ao final de cada fluxo, solicite avaliação. Toda interação deve ser registrada. Mantenha o tom da Layout 22: consultivo, próximo e objetivo.',
      tier: 'fast',
      tools: [
        { collection: 'clientes', perms: { list: true, read: true, create: true, update: true } },
        { collection: 'contatos', perms: { list: true, read: true, create: true, update: true } },
        { collection: 'interacoes', perms: { list: true, read: true, create: true } },
        { collection: 'conversas_whatsapp', perms: { list: true, read: true, create: true } },
        { collection: 'chamados', perms: { list: true, read: true, create: true, update: true } },
        {
          collection: 'oportunidades',
          perms: { list: true, read: true, create: true, update: true },
        },
        { collection: 'instalacoes', perms: { list: true, read: true, update: true } },
        { collection: 'equipamentos', perms: { list: true, read: true } },
        { collection: 'visitas', perms: { list: true, read: true, create: true } },
        { collection: 'notificacoes', perms: { list: true, read: true, create: true } },
        { collection: 'metas', perms: { list: true, read: true } },
      ],
      memory: [
        {
          type: 'faq',
          payload: {
            qa: [
              {
                question: 'Quais são as opções do menu de atendimento?',
                answer:
                  '1-Manutenção, 2-Orçamento, 3-Nova Venda/Troca, 4-Instalação, 5-Falar com Sócio',
              },
              {
                question: 'Como funciona a triagem por intenção?',
                answer:
                  'O bot identifica a intenção por palavras-chave (quebrado, parou, defeito = manutenção; preço, orçamento = cotação; comprar, trocar = venda; instalar = instalação; sócio, reclamação = escalção) e por IA quando necessário.',
              },
              {
                question: 'Qual a régua de reativação?',
                answer:
                  'Aos 30 dias: mensagem leve de novidades. Aos 60 dias: alerta moderado com proposta de visita. Aos 90 dias: alerta urgente para agendamento imediato.',
              },
            ],
          },
        },
      ],
    })
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'atendimento-layout22')
    } catch (_) {}
  },
)
