import pb from '@/lib/pocketbase/client'

export interface Oportunidade {
  id: string
  cliente: string
  equipamento?: string
  status?: 'Prospecção' | 'Cotação enviada' | 'Em análise' | 'Fechado' | 'Perdido'
  data_proposta?: string
  prazo_resposta?: string
  valor_estimado?: number
  comissao_estimada?: number
  follow_up_pendente?: boolean
  expand?: {
    cliente?: { nome: string; cidade?: string; estado?: string }
  }
}

export const getOportunidades = () =>
  pb.collection('oportunidades').getFullList<Oportunidade>({
    expand: 'cliente',
    sort: '-created',
  })

export const createOportunidade = (data: Partial<Oportunidade>) =>
  pb.collection('oportunidades').create<Oportunidade>(data)

export const updateOportunidade = (id: string, data: Partial<Oportunidade>) =>
  pb.collection('oportunidades').update<Oportunidade>(id, data)
