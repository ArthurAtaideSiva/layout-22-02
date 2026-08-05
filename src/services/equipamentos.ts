import pb from '@/lib/pocketbase/client'

export interface Equipamento {
  id: string
  cliente: string
  modelo?: string
  marca?: string
  data_instalacao?: string
  vida_util_meses?: number
  data_expiracao?: string
  status?: 'Ativo' | 'Troca recomendada' | 'Trocado'
  expand?: { cliente?: { nome: string } }
}

export const getEquipamentos = () =>
  pb.collection('equipamentos').getFullList<Equipamento>({
    expand: 'cliente',
    sort: 'data_expiracao',
  })

export const getEquipamentosByCliente = (clienteId: string) =>
  pb.collection('equipamentos').getFullList<Equipamento>({
    filter: `cliente = "${clienteId}"`,
    sort: '-data_instalacao',
  })

export const createEquipamento = (data: Partial<Equipamento>) =>
  pb.collection('equipamentos').create<Equipamento>(data)

export const updateEquipamento = (id: string, data: Partial<Equipamento>) =>
  pb.collection('equipamentos').update<Equipamento>(id, data)
