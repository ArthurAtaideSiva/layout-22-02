import pb from '@/lib/pocketbase/client'

export interface Instalacao {
  id: string
  cliente: string
  equipamento?: string
  data_solicitacao?: string
  prazo?: string
  status?: 'Solicitada' | 'Agendada' | 'Concluída' | 'Atrasada'
  data_conclusao?: string
  expand?: { cliente?: { nome: string } }
}

export const getInstalacoes = () =>
  pb.collection('instalacoes').getFullList<Instalacao>({
    expand: 'cliente',
    sort: 'prazo',
  })

export const createInstalacao = (data: Partial<Instalacao>) =>
  pb.collection('instalacoes').create<Instalacao>(data)

export const updateInstalacao = (id: string, data: Partial<Instalacao>) =>
  pb.collection('instalacoes').update<Instalacao>(id, data)
