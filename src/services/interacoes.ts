import pb from '@/lib/pocketbase/client'

export interface Interacao {
  id: string
  cliente: string
  data: string
  tipo: 'visita' | 'ligação' | 'WhatsApp' | 'email' | 'proposta'
  resultado?: string
  proximo_passo?: string
  avaliacao?: string
  created?: string
}

export const getInteracoesByCliente = (clienteId: string) =>
  pb.collection('interacoes').getFullList<Interacao>({
    filter: `cliente = "${clienteId}"`,
    sort: '-data',
  })

export const createInteracao = async (data: Partial<Interacao>) => {
  const rec = await pb.collection('interacoes').create<Interacao>(data)
  if (data.cliente && data.data) {
    await pb.collection('clientes').update(data.cliente, {
      ultimo_contato: data.data,
      ...(data.tipo === 'visita' ? { ultima_visita: data.data } : {}),
    })
  }
  return rec
}
