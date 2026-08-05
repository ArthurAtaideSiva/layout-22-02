import pb from '@/lib/pocketbase/client'

export interface Meta {
  id: string
  periodo: 'mensal' | 'trimestral'
  valor_meta: number
  valor_realizado: number
  propostas_enviadas: number
  vendas_fechadas: number
}

export const getMetaAtual = async () => {
  const list = await pb.collection('metas').getFullList<Meta>({ sort: '-created', limit: 1 })
  return list[0] || null
}

export const getMetas = () => pb.collection('metas').getFullList<Meta>({ sort: '-created' })

export const updateMeta = (id: string, data: Partial<Meta>) =>
  pb.collection('metas').update<Meta>(id, data)
