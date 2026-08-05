import pb from '@/lib/pocketbase/client'

export interface Cliente {
  id: string
  nome: string
  cnpj?: string
  porte?: 'Pequeno' | 'Médio' | 'Grande rede'
  cidade?: string
  estado?: string
  regiao?: string
  status?: 'Prospecção' | 'Ativo' | 'Pós-venda' | 'Inativo'
  aniversario?: string
  ultima_visita?: string
  ultimo_contato?: string
  telefone_whatsapp?: string
  data_ultimo_pedido?: string
  created?: string
  updated?: string
}

export const getClientes = () => pb.collection('clientes').getFullList<Cliente>({ sort: 'nome' })

export const getCliente = (id: string) => pb.collection('clientes').getOne<Cliente>(id)

export const createCliente = (data: Partial<Cliente>) =>
  pb.collection('clientes').create<Cliente>(data)

export const updateCliente = (id: string, data: Partial<Cliente>) =>
  pb.collection('clientes').update<Cliente>(id, data)

export const deleteCliente = (id: string) => pb.collection('clientes').delete(id)
