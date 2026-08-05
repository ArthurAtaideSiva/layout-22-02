import pb from '@/lib/pocketbase/client'

export interface Visita {
  id: string
  cliente: string
  data?: string
  motivo?: 'comercial' | 'técnica' | 'follow-up'
  resultado?: string
  proximos_passos?: string
  regiao?: string
  expand?: { cliente?: { nome: string } }
}

export const getVisitas = () =>
  pb.collection('visitas').getFullList<Visita>({
    expand: 'cliente',
    sort: '-data',
  })

export const createVisita = async (data: Partial<Visita>) => {
  const res = await pb.collection('visitas').create<Visita>(data)
  if (data.cliente && data.data) {
    await pb.collection('clientes').update(data.cliente, {
      ultima_visita: data.data,
      ultimo_contato: data.data,
    })
  }
  return res
}
