import pb from '@/lib/pocketbase/client'

export interface Contato {
  id: string
  cliente: string
  nome: string
  cargo?: 'gerente' | 'proprietário' | 'diretor' | 'compras' | 'outro'
  telefone?: string
  email?: string
  aniversario?: string
}

export const getContatosByCliente = (clienteId: string) =>
  pb.collection('contatos').getFullList<Contato>({
    filter: `cliente = "${clienteId}"`,
    sort: 'nome',
  })

export const createContato = (data: Partial<Contato>) =>
  pb.collection('contatos').create<Contato>(data)

export const deleteContato = (id: string) => pb.collection('contatos').delete(id)
