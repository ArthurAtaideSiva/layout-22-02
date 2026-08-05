import pb from '@/lib/pocketbase/client'

export interface Chamado {
  id: string
  cliente: string
  equipamento?: string
  data_abertura?: string
  problema?: string
  status?: 'Aberto' | 'Em andamento' | 'Concluído'
  data_conclusao?: string
  historico?: string
  expand?: { cliente?: { nome: string } }
}

export const getChamados = () =>
  pb.collection('chamados').getFullList<Chamado>({
    expand: 'cliente',
    sort: '-data_abertura',
  })

export const createChamado = (data: Partial<Chamado>) =>
  pb.collection('chamados').create<Chamado>(data)

export const updateChamado = (id: string, data: Partial<Chamado>) =>
  pb.collection('chamados').update<Chamado>(id, data)
