import { useEffect, useState, useCallback } from 'react'
import { getVisitas, createVisita, Visita } from '@/services/visitas'
import { getClientes, Cliente } from '@/services/clientes'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarIcon, MapPin, Plus, Route } from 'lucide-react'
import { LoadingCards } from '@/components/LoadingState'
import { EmptyState } from '@/components/EmptyState'
import { validateAndSanitize, visitaSchema } from '@/lib/validation'
import { toast } from 'sonner'

export default function Agenda() {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [viewMode, setViewMode] = useState<'lista' | 'rota'>('lista')

  const [form, setForm] = useState({
    cliente: '',
    motivo: 'comercial',
    resultado: '',
    proximos_passos: '',
    regiao: 'Norte / Nordeste',
  })

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [v, c] = await Promise.all([getVisitas(), getClientes()])
      setVisitas(v)
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
    const result = validateAndSanitize(visitaSchema, {
      ...form,
      data: new Date().toISOString(),
    })
    if (!result.success) {
      setFormErrors(result.errors)
      return
    }
    setFormErrors({})
    setCreating(true)
    try {
      await createVisita(result.data as Partial<Visita>)
      toast.success('Visita registrada com sucesso!')
      setOpenModal(false)
      loadAll()
    } catch {
      toast.error('Erro ao registrar visita.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Agenda & Roteiro</h1>
          <p className="text-xs text-slate-500">Visitas comerciais e acompanhamento regional</p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="bg-[#1e3a8a] hover:bg-[#172a63] gap-1 text-xs">
              <Plus className="h-4 w-4" /> Registrar Visita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Visita Comercial</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs">Cliente</Label>
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
                <Label className="text-xs">Resultado da Visita</Label>
                <Textarea
                  required
                  value={form.resultado}
                  onChange={(e) => setForm({ ...form, resultado: e.target.value })}
                  aria-invalid={!!formErrors.resultado}
                />
                {formErrors.resultado && (
                  <p className="text-xs text-red-500">{formErrors.resultado}</p>
                )}
              </div>

              <Button type="submit" disabled={creating} className="w-full bg-[#1e3a8a]">
                {creating ? 'Salvando...' : 'Salvar Registro'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant={viewMode === 'lista' ? 'default' : 'outline'}
          onClick={() => setViewMode('lista')}
          className="text-xs h-8"
        >
          <CalendarIcon className="h-3.5 w-3.5 mr-1" /> Lista de Visitas
        </Button>
        <Button
          size="sm"
          variant={viewMode === 'rota' ? 'default' : 'outline'}
          onClick={() => setViewMode('rota')}
          className="text-xs h-8"
        >
          <Route className="h-3.5 w-3.5 mr-1" /> Roteiro por Região
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <LoadingCards count={3} />
        ) : visitas.length === 0 ? (
          <EmptyState
            icon={<CalendarIcon className="h-10 w-10" />}
            title="Nenhuma visita registrada"
            description="Registre sua primeira visita comercial."
          />
        ) : (
          visitas.map((v) => (
            <Card key={v.id} className="bg-white shadow-sm">
              <CardContent className="p-3 text-xs space-y-1.5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900">
                      {v.expand?.cliente?.nome || 'Supermercado'}
                    </p>
                    <p className="text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Região: {v.regiao || 'Norte / Nordeste'}
                    </p>
                  </div>
                  <Badge className="text-[10px] uppercase">{v.motivo || 'comercial'}</Badge>
                </div>
                <p className="text-slate-700 bg-slate-50 p-2 rounded">{v.resultado}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
