import pb from '@/lib/pocketbase/client'

export interface Notificacao {
  id: string
  tipo?:
    | 'aniversário'
    | 'cliente esquecido'
    | 'instalação atrasada'
    | 'chamado pendente'
    | 'proposta sem resposta'
    | 'troca de equipamento'
    | 'visita vencida'
    | 'reativacao_30'
    | 'reativacao_60'
    | 'reativacao_90'
    | 'followup_venda'
  destinatario?: string
  mensagem?: string
  data_disparo?: string
  status?: 'pendente' | 'enviada' | 'lida'
  cliente?: string
  expand?: { cliente?: { id: string; nome: string } }
}

export const getNotificacoes = () =>
  pb.collection('notificacoes').getFullList<Notificacao>({
    expand: 'cliente',
    sort: '-created',
  })

export const marcarComoLida = (id: string) =>
  pb.collection('notificacoes').update(id, { status: 'lida' })

export const marcarTodasLidas = async (items: Notificacao[]) => {
  for (const item of items.filter((n) => n.status !== 'lida')) {
    await pb.collection('notificacoes').update(item.id, { status: 'lida' })
  }
}
