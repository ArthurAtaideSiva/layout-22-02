migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'assistente-comercial',
      name: 'Assistente Comercial de Maquinário',
      description:
        'Assistente inteligente para sócios de representação comercial de maquinário para supermercados.',
      systemPrompt:
        "Você é o Assistente Comercial proativo de uma representação de maquinário para supermercados no Brasil. Responda em Português do Brasil de forma clara, direta e objetiva. Você tem acesso aos dados da carteira de clientes, oportunidades de vendas, instalações, chamados de manutenção, metas e agenda. Quando o usuário fizer perguntas como 'Quais clientes precisam de troca este trimestre?', 'Quais propostas estão sem resposta?' ou 'Resumo do cliente X', consulte as tabelas relevantes e apresente uma resposta formatada com tópicos, nomes dos supermercados, valores em R$, prazos e próximos passos recomendados.",
      tier: 'fast',
      tools: [
        { collection: 'clientes', perms: { list: true, read: true } },
        { collection: 'contatos', perms: { list: true, read: true } },
        { collection: 'interacoes', perms: { list: true, read: true } },
        { collection: 'oportunidades', perms: { list: true, read: true } },
        { collection: 'equipamentos', perms: { list: true, read: true } },
        { collection: 'instalacoes', perms: { list: true, read: true } },
        { collection: 'chamados', perms: { list: true, read: true } },
        { collection: 'visitas', perms: { list: true, read: true } },
        { collection: 'metas', perms: { list: true, read: true } },
        { collection: 'notificacoes', perms: { list: true, read: true } },
        { collection: 'conversas_whatsapp', perms: { list: true, read: true } },
      ],
      memory: [
        {
          type: 'faq',
          payload: {
            qa: [
              {
                question: 'Como funciona a identificação de oportunidade de troca de equipamento?',
                answer:
                  "Cada equipamento possui uma vida útil estimada em meses. Quando a data de expiração da vida útil está dentro dos próximos 90 dias ou já passou, o sistema indica 'Troca recomendada' para gerar uma nova cotação com comissão.",
              },
              {
                question: 'Qual a regra de cliente sem contato / esquecido?',
                answer:
                  'Clientes sem contato há mais de 30 dias geram alerta leve, mais de 60 dias alerta moderado, e mais de 90 dias alerta urgente para agendamento imediato de visita comercial.',
              },
            ],
          },
        },
      ],
    })
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'assistente-comercial')
    } catch (_) {}
  },
)
