import { useEffect, useState, useCallback } from 'react'
import {
  getOportunidades,
  updateOportunidade,
  createOportunidade,
  Oportunidade,
} from '@/services/oportunidades'
import { getMetaAtual, Meta } from '@/services/metas'
import { getClientes, Cliente } from '@/services/clientes'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, BadgeDollarSign } from 'lucide-react'
import { LoadingCards } from '@/components/LoadingState'
import { EmptyState } from '@/components/EmptyState'
import { validateAndSanitize, oportunidadeSchema } from '@/lib/validation'
import { toast } from 'sonner'

export default function Vendas() {
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    cliente: '',
    equipamento: '',
    status: 'Cotação enviada',
    valor_estimado: 50000,
    comissao_estimada: 4000,
    prazo_resposta: '',
  })

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [o, m, c] = await Promise.all([getOportunidades(), getMetaAtual(), getClientes()])
      setOportunidades(o)
      setMeta(m)
      setClientes(c)
    } catch {
      /* intentionally ignored */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = validateAndSanitize(oportunidadeSchema, {
      ...form,
      data_proposta: new Date().toISOString(),
      prazo_resposta: form.prazo_resposta || new Date(Date.now() + 14 * 86400000).toISOString(),
    })
    if (!result.success) {
      setFormErrors(result.errors)
      return
    }
    setFormErrors({})
    setCreating(true)
    try {
      await createOportunidade(result.data as Partial<Oportunidade>)
      toast.success('Proposta criada com sucesso!')
      setOpenModal(false)
      loadAll()
    } catch {
      toast.error('Erro ao criar proposta.')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    try {
      await updateOportunidade(id, { status: newStatus })
      loadAll()
    } catch {
      toast.error('Erro ao atualizar status.')
    }
  }

  const stages = ['Prospecção', 'Cotação enviada', 'Em análise', 'Fechado', 'Perdido']
  const percentMeta = meta
    ? Math.min(100, Math.round((meta.valor_realizado / meta.valor_meta) * 100))
    : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Pipeline de Vendas</h1>
          <p className="text-xs text-slate-500">Acompanhamento de propostas e metas</p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="bg-[#1e3a8a] hover:bg-[#172a63] gap-1 text-xs">
              <Plus className="h-4 w-4" /> Nova Cotação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Oportunidade de Venda</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs">Cliente / Supermercado</Label>
                <select
                  required
                  value={form.cliente}
                  onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                  className="w-full h-9 rounded-md border border-slate-200 text-xs px-2"
                >
                  <option value="">Selecione o cliente...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Maquinário / Equipamento</Label>
                <Input
                  required
                  value={form.equipamento}
                  onChange={(e) => setForm({ ...form, equipamento: e.target.value })}
                  placeholder="Ex: Fatiador / Câmara Frigorífica"
                  aria-invalid={!!formErrors.equipamento}
                />
                {formErrors.equipamento && (
                  <p className="text-xs text-red-500">{formErrors.equipamento}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Valor Estimado (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.valor_estimado}
                    onChange={(e) => setForm({ ...form, valor_estimado: Number(e.target.value) })}
                    aria-invalid={!!formErrors.valor_estimado}
                  />
                  {formErrors.valor_estimado && (
                    <p className="text-xs text-red-500">{formErrors.valor_estimado}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Comissão Estimada (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.comissao_estimada}
                    onChange={(e) =>
                      setForm({ ...form, comissao_estimada: Number(e.target.value) })
                    }
                    aria-invalid={!!formErrors.comissao_estimada}
                  />
                  {formErrors.comissao_estimada && (
                    <p className="text-xs text-red-500">{formErrors.comissao_estimada}</p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={creating} className="w-full bg-[#1e3a8a]">
                {creating ? 'Salvando...' : 'Salvar Proposta'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meta Card */}
      {meta && (
        <Card className="bg-white border-blue-100 shadow-sm">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase text-[#1e3a8a]">
                Meta de Vendas ({meta.periodo})
              </span>
              <span className="text-xs font-bold text-slate-700">{percentMeta}% Atingido</span>
            </div>
            <Progress value={percentMeta} className="h-2 bg-slate-100" />
            <div className="flex justify-between text-xs text-slate-600 font-medium pt-1">
              <span>
                Realizado: <strong>R$ {meta.valor_realizado.toLocaleString('pt-BR')}</strong>
              </span>
              <span>Meta: R$ {meta.valor_meta.toLocaleString('pt-BR')}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pipeline Stages View */}
      <div className="space-y-4">
        {stages.map((stage) => {
          const items = oportunidades.filter((o) => o.status === stage)
          return (
            <div key={stage} className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                <h2 className="text-xs font-bold uppercase text-slate-600 flex items-center gap-1.5">
                  <BadgeDollarSign className="h-3.5 w-3.5 text-[#1e3a8a]" /> {stage} ({items.length}
                  )
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {loading ? (
                  <LoadingCards count={2} />
                ) : items.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">Nenhuma oportunidade neste estágio.</p>
                ) : (
                  items.map((op) => (
                    <Card key={op.id} className="bg-white shadow-sm hover:border-slate-300">
                      <CardContent className="p-3 text-xs space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-slate-900">
                              {op.expand?.cliente?.nome || 'Cliente'}
                            </p>
                            <p className="text-slate-600">{op.equipamento}</p>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            R$ {(op.valor_estimado || 0).toLocaleString('pt-BR')}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                          <span>
                            Comissão:{' '}
                            <strong>
                              R$ {(op.comissao_estimada || 0).toLocaleString('pt-BR')}
                            </strong>
                          </span>
                          <select
                            value={op.status}
                            onChange={(e) => handleUpdateStatus(op.id, e.target.value)}
                            className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5"
                          >
                            {stages.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
