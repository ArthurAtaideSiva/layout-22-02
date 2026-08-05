import { useEffect, useState } from 'react'
import { getInstalacoes, updateInstalacao, Instalacao } from '@/services/instalacoes'
import { getChamados, updateChamado, createChamado, Chamado } from '@/services/chamados'
import { getEquipamentos, Equipamento } from '@/services/equipamentos'
import { getClientes, Cliente } from '@/services/clientes'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Wrench, Clock, AlertTriangle, Plus } from 'lucide-react'

export default function Manutencao() {
  const [instalacoes, setInstalacoes] = useState<Instalacao[]>([])
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [openChamadoModal, setOpenChamadoModal] = useState(false)

  const [chamadoForm, setChamadoForm] = useState({
    cliente: '',
    equipamento: '',
    problema: '',
  })

  const loadAll = () => {
    getInstalacoes().then(setInstalacoes)
    getChamados().then(setChamados)
    getEquipamentos().then(setEquipamentos)
    getClientes().then(setClientes)
  }

  useEffect(() => {
    loadAll()
  }, [])

  const handleCreateChamado = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chamadoForm.cliente) return
    await createChamado({
      cliente: chamadoForm.cliente,
      equipamento: chamadoForm.equipamento,
      problema: chamadoForm.problema,
      data_abertura: new Date().toISOString(),
      status: 'Aberto',
    })
    setOpenChamadoModal(false)
    setChamadoForm({ cliente: '', equipamento: '', problema: '' })
    loadAll()
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Manutenção e Pós-Venda</h1>
        <p className="text-xs text-slate-500">Acompanhamento técnico e parque instalado</p>
      </div>

      <Tabs defaultValue="instalacoes" className="w-full">
        <TabsList className="w-full justify-start bg-white border-b border-slate-200 h-10 p-0 rounded-none">
          <TabsTrigger value="instalacoes" className="text-xs py-2">
            Instalações
          </TabsTrigger>
          <TabsTrigger value="chamados" className="text-xs py-2">
            Chamados
          </TabsTrigger>
          <TabsTrigger value="parque" className="text-xs py-2">
            Troca / Parque
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instalacoes" className="space-y-3 pt-3">
          {instalacoes.map((item) => (
            <Card key={item.id} className="bg-white shadow-sm">
              <CardContent className="p-3 text-xs space-y-1.5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900">
                      {item.expand?.cliente?.nome || 'Supermercado'}
                    </p>
                    <p className="text-slate-600">{item.equipamento}</p>
                  </div>
                  <Badge
                    variant={item.status === 'Atrasada' ? 'destructive' : 'outline'}
                    className="text-[10px]"
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-[11px] pt-1 border-t border-slate-100">
                  <span>
                    Prazo combinado:{' '}
                    {item.prazo ? new Date(item.prazo).toLocaleDateString('pt-BR') : 'N/D'}
                  </span>
                  <select
                    value={item.status}
                    onChange={async (e) => {
                      await updateInstalacao(item.id, { status: e.target.value as any })
                      loadAll()
                    }}
                    className="text-[10px] bg-slate-50 border rounded px-1"
                  >
                    <option value="Solicitada">Solicitada</option>
                    <option value="Agendada">Agendada</option>
                    <option value="Concluída">Concluída</option>
                    <option value="Atrasada">Atrasada</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="chamados" className="space-y-3 pt-3">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-700">Chamados de Assistência Técnica</h2>
            <Dialog open={openChamadoModal} onOpenChange={setOpenChamadoModal}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#1e3a8a] text-xs gap-1 h-7">
                  <Plus className="h-3.5 w-3.5" /> Abrir Chamado
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Abrir Chamado de Manutenção</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateChamado} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Cliente</Label>
                    <select
                      required
                      value={chamadoForm.cliente}
                      onChange={(e) => setChamadoForm({ ...chamadoForm, cliente: e.target.value })}
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
                    <Label className="text-xs">Equipamento</Label>
                    <Input
                      required
                      value={chamadoForm.equipamento}
                      onChange={(e) =>
                        setChamadoForm({ ...chamadoForm, equipamento: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Problema Relatado</Label>
                    <Textarea
                      required
                      value={chamadoForm.problema}
                      onChange={(e) => setChamadoForm({ ...chamadoForm, problema: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#1e3a8a]">
                    Registrar Chamado
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {chamados.map((item) => (
            <Card key={item.id} className="bg-white shadow-sm">
              <CardContent className="p-3 text-xs space-y-1.5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900">{item.expand?.cliente?.nome}</p>
                    <p className="text-slate-600">{item.equipamento}</p>
                  </div>
                  <Badge
                    variant={item.status === 'Aberto' ? 'destructive' : 'secondary'}
                    className="text-[10px]"
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="text-slate-700 bg-slate-50 p-2 rounded text-[11px]">
                  {item.problema}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="parque" className="space-y-3 pt-3">
          {equipamentos.map((item) => (
            <Card key={item.id} className="bg-white shadow-sm">
              <CardContent className="p-3 text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900">{item.modelo}</p>
                    <p className="text-slate-500">
                      {item.expand?.cliente?.nome} ({item.marca})
                    </p>
                  </div>
                  <Badge
                    variant={item.status === 'Troca recomendada' ? 'destructive' : 'outline'}
                    className="text-[10px]"
                  >
                    {item.status}
                  </Badge>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Expiração estimada:{' '}
                  {item.data_expiracao
                    ? new Date(item.data_expiracao).toLocaleDateString('pt-BR')
                    : 'N/D'}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
