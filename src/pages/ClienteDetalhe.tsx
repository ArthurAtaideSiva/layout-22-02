import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react'
import { getCliente, updateCliente, Cliente } from '@/services/clientes'
import { getContatosByCliente, Contato } from '@/services/contatos'
import { getInteracoesByCliente, createInteracao, Interacao } from '@/services/interacoes'
import { getEquipamentosByCliente, Equipamento } from '@/services/equipamentos'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Plus, MessageSquare } from 'lucide-react'

export default function ClienteDetalhe() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [contatos, setContatos] = useState<Contato[]>([])
  const [interacoes, setInteracoes] = useState<Interacao[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])

  const [openInteracaoModal, setOpenInteracaoModal] = useState(false)
  const [interacaoForm, setInteracaoForm] = useState({
    tipo: 'visita',
    resultado: '',
    proximo_passo: '',
  })

  const loadData = () => {
    if (!id) return
    getCliente(id).then(setCliente)
    getContatosByCliente(id).then(setContatos)
    getInteracoesByCliente(id).then(setInteracoes)
    getEquipamentosByCliente(id).then(setEquipamentos)
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleAddInteracao = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    await createInteracao({
      cliente: id,
      data: new Date().toISOString(),
      tipo: interacaoForm.tipo as any,
      resultado: interacaoForm.resultado,
      proximo_passo: interacaoForm.proximo_passo,
    })
    setOpenInteracaoModal(false)
    setInteracaoForm({ tipo: 'visita', resultado: '', proximo_passo: '' })
    loadData()
  }

  if (!cliente) return <div className="p-4 text-slate-500">Carregando cliente...</div>

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate('/clientes')}
        className="flex items-center gap-1 text-xs text-[#1e3a8a] font-semibold hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para Clientes
      </button>

      {/* Header */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-900">{cliente.nome}</h1>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {cliente.cidade || 'São Luís'} - {cliente.estado || 'MA'} | CNPJ:{' '}
                {cliente.cnpj || 'Não informado'}
              </p>
            </div>
            <Badge className="text-[10px]">{cliente.status || 'Ativo'}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="visao_geral" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto bg-white border-b border-slate-200 rounded-none p-0 h-10">
          <TabsTrigger value="visao_geral" className="text-xs py-2">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="contatos" className="text-xs py-2">
            Contatos
          </TabsTrigger>
          <TabsTrigger value="equipamentos" className="text-xs py-2">
            Equipamentos
          </TabsTrigger>
          <TabsTrigger value="interacoes" className="text-xs py-2">
            Interações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao_geral" className="space-y-3 pt-3">
          <Card className="bg-white">
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block">Porte do Cliente</span>
                  <span className="font-semibold text-slate-800">{cliente.porte || 'Médio'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Região Atendida</span>
                  <span className="font-semibold text-slate-800">
                    {cliente.regiao || 'Norte / Nordeste'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Último Contato</span>
                  <span className="font-semibold text-slate-800">
                    {cliente.ultimo_contato
                      ? new Date(cliente.ultimo_contato).toLocaleDateString('pt-BR')
                      : 'Sem registro'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Última Visita</span>
                  <span className="font-semibold text-slate-800">
                    {cliente.ultima_visita
                      ? new Date(cliente.ultima_visita).toLocaleDateString('pt-BR')
                      : 'Sem registro'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contatos" className="space-y-3 pt-3">
          {contatos.map((c) => (
            <Card key={c.id} className="bg-white">
              <CardContent className="p-3 space-y-1 text-xs">
                <p className="font-bold text-sm text-slate-900">{c.nome}</p>
                <p className="text-slate-500 capitalize">{c.cargo || 'Contato'}</p>
                <div className="flex items-center gap-3 pt-1 text-slate-600">
                  {c.telefone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {c.telefone}
                    </span>
                  )}
                  {c.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {c.email}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="equipamentos" className="space-y-3 pt-3">
          {equipamentos.map((e) => (
            <Card key={e.id} className="bg-white">
              <CardContent className="p-3 text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-slate-900">{e.modelo}</p>
                  <Badge
                    variant={e.status === 'Troca recomendada' ? 'destructive' : 'outline'}
                    className="text-[10px]"
                  >
                    {e.status}
                  </Badge>
                </div>
                <p className="text-slate-500">Marca: {e.marca}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="interacoes" className="space-y-3 pt-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xs text-slate-700">Histórico de Interações</h3>
            <Dialog open={openInteracaoModal} onOpenChange={setOpenInteracaoModal}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-[#1e3a8a] text-xs gap-1 h-7">
                  <Plus className="h-3.5 w-3.5" /> Registrar Interação
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Nova Interação Comercial</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddInteracao} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Tipo de Interação</Label>
                    <select
                      value={interacaoForm.tipo}
                      onChange={(e) => setInteracaoForm({ ...interacaoForm, tipo: e.target.value })}
                      className="w-full h-9 rounded-md border border-slate-200 text-xs px-2"
                    >
                      <option value="visita">Visita presencial</option>
                      <option value="ligação">Ligação telefônica</option>
                      <option value="WhatsApp">Mensagem WhatsApp</option>
                      <option value="proposta">Apresentação de proposta</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Resultado da Conversa</Label>
                    <Textarea
                      required
                      value={interacaoForm.resultado}
                      onChange={(e) =>
                        setInteracaoForm({ ...interacaoForm, resultado: e.target.value })
                      }
                      placeholder="Descreva o que foi discutido..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Próximo Passo / Compromisso</Label>
                    <Input
                      value={interacaoForm.proximo_passo}
                      onChange={(e) =>
                        setInteracaoForm({ ...interacaoForm, proximo_passo: e.target.value })
                      }
                      placeholder="Ex: Enviar orçamento na sexta-feira"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#1e3a8a]">
                    Salvar Registro
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {interacoes.map((item) => (
            <Card key={item.id} className="bg-white">
              <CardContent className="p-3 text-xs space-y-1">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-semibold text-slate-700 capitalize">{item.tipo}</span>
                  <span>{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-slate-800 font-medium mt-1">{item.resultado}</p>
                {item.proximo_passo && (
                  <p className="text-blue-700 bg-blue-50 p-1.5 rounded text-[11px]">
                    👉 <strong>Próximo passo:</strong> {item.proximo_passo}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
