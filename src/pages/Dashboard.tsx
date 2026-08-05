import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { getOportunidades, Oportunidade } from '@/services/oportunidades'
import { getInstalacoes, Instalacao } from '@/services/instalacoes'
import { getChamados, Chamado } from '@/services/chamados'
import { getClientes, Cliente } from '@/services/clientes'
import { getEquipamentos, Equipamento } from '@/services/equipamentos'
import { getNotificacoes, Notificacao } from '@/services/notificacoes'
import { getMetaAtual, Meta } from '@/services/metas'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  ChamadosChart,
  SaudeBaseChart,
  PipelineChart,
  RegiaoChart,
  VendasChart,
} from '@/components/DashboardCharts'
import {
  BadgeDollarSign,
  Wrench,
  AlertTriangle,
  Clock,
  RefreshCw,
  PlusCircle,
  FileBarChart,
  CalendarPlus,
  ChevronRight,
  Cake,
  AlertCircle,
  BellRing,
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ops, setOps] = useState<Oportunidade[]>([])
  const [inst, setInst] = useState<Instalacao[]>([])
  const [cham, setCham] = useState<Chamado[]>([])
  const [clis, setClis] = useState<Cliente[]>([])
  const [eqs, setEqs] = useState<Equipamento[]>([])
  const [notifs, setNotifs] = useState<Notificacao[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)

  const loadData = useCallback(async () => {
    try {
      const [o, i, c, cl, eq, n, m] = await Promise.all([
        getOportunidades(),
        getInstalacoes(),
        getChamados(),
        getClientes(),
        getEquipamentos(),
        getNotificacoes(),
        getMetaAtual(),
      ])
      setOps(o)
      setInst(i)
      setCham(c)
      setClis(cl)
      setEqs(eq)
      setNotifs(n)
      setMeta(m)
    } catch {
      /* intentionally ignored */
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useRealtime('chamados', () => loadData())
  useRealtime('oportunidades', () => loadData())
  useRealtime('instalacoes', () => loadData())
  useRealtime('clientes', () => loadData())
  useRealtime('notificacoes', () => loadData())
  useRealtime('metas', () => loadData())

  const now = new Date()
  const opAbertas = ops.filter((o) => o.status !== 'Fechado' && o.status !== 'Perdido')
  const valorTotalOp = opAbertas.reduce((a, o) => a + (o.valor_estimado || 0), 0)
  const instPendentes = inst.filter((i) => i.status !== 'Concluída')
  const instAtrasadas = inst.filter((i) => i.status === 'Atrasada')
  const chamAbertos = cham.filter((c) => c.status !== 'Concluído')
  const chamConcluidos = cham.filter((c) => c.status === 'Concluído')
  const propostasTotal = ops.length
  const convRate =
    propostasTotal > 0
      ? Math.round((ops.filter((o) => o.status === 'Fechado').length / propostasTotal) * 100)
      : 0
  const pendingNotifs = notifs.filter((n) => n.status === 'pendente')
  const trocasOp = eqs.filter(
    (e) =>
      e.status === 'Troca recomendada' || (e.data_expiracao && new Date(e.data_expiracao) <= now),
  ).length
  const cliAtivos = clis.filter((c) => c.status === 'Ativo').length
  const cliInativos = clis.filter((c) => c.status === 'Inativo' || c.status === 'Prospecção').length
  const metaPct =
    meta && meta.valor_meta > 0
      ? Math.min(100, Math.round((meta.valor_realizado / meta.valor_meta) * 100))
      : 0

  const chamadoData = [
    { name: 'Hoje', Aberto: chamAbertos.length, Concluído: chamConcluidos.length },
    {
      name: 'Semana',
      Aberto: Math.max(chamAbertos.length, cham.length > 0 ? 2 : 0),
      Concluído: chamConcluidos.length,
    },
  ]
  const saudeData = [
    { name: 'Ativo', value: cliAtivos, color: '#22c55e' },
    {
      name: 'Prospecção',
      value: clis.filter((c) => c.status === 'Prospecção').length,
      color: '#3b82f6',
    },
    {
      name: 'Pós-venda',
      value: clis.filter((c) => c.status === 'Pós-venda').length,
      color: '#f59e0b',
    },
    { name: 'Inativo', value: clis.filter((c) => c.status === 'Inativo').length, color: '#ef4444' },
  ].filter((d) => d.value > 0)
  const pipelineData = ['Prospecção', 'Cotação enviada', 'Em análise', 'Fechado', 'Perdido'].map(
    (s) => ({
      status: s,
      valor: ops.filter((o) => o.status === s).reduce((a, o) => a + (o.valor_estimado || 0), 0),
    }),
  )
  const regiaoData = Array.from(new Set(clis.map((c) => c.regiao).filter(Boolean))).map((r) => ({
    regiao: r || 'N/A',
    clientes: clis.filter((c) => c.regiao === r).length,
  }))
  const vendasData = [
    { mes: 'Mai', valor: 12000 },
    { mes: 'Jun', valor: 18500 },
    { mes: 'Jul', valor: 24000 },
    { mes: 'Ago', valor: meta?.valor_realizado || 21000 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">
          Olá, {user?.name || 'Sócio'} 👋
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Resumo em tempo real da sua carteira comercial de maquinário.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card
          onClick={() => navigate('/vendas')}
          className="cursor-pointer hover:border-blue-400 transition-all shadow-sm bg-white"
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-blue-600">
              <BadgeDollarSign className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase bg-blue-50 px-1.5 py-0.5 rounded">
                Em Vendas
              </span>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{opAbertas.length}</div>
              <p className="text-xs text-slate-500 font-medium truncate">
                R$ {valorTotalOp.toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card
          onClick={() => navigate('/manutencao')}
          className="cursor-pointer hover:border-amber-400 transition-all shadow-sm bg-white"
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-amber-600">
              <Clock className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase bg-amber-50 px-1.5 py-0.5 rounded">
                Instalações
              </span>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{instPendentes.length}</div>
              <p className="text-xs text-slate-500 font-medium">Instalações Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card
          onClick={() => navigate('/manutencao')}
          className="cursor-pointer hover:border-red-400 transition-all shadow-sm bg-white"
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-red-600">
              <Wrench className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase bg-red-50 px-1.5 py-0.5 rounded">
                Chamados
              </span>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{chamAbertos.length}</div>
              <p className="text-xs text-slate-500 font-medium">Manutenção Aberta</p>
            </div>
          </CardContent>
        </Card>
        <Card
          onClick={() => navigate('/notificacoes')}
          className="cursor-pointer hover:border-purple-400 transition-all shadow-sm bg-white"
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-purple-600">
              <BellRing className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase bg-purple-50 px-1.5 py-0.5 rounded">
                Alertas
              </span>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{pendingNotifs.length}</div>
              <p className="text-xs text-slate-500 font-medium">Notificações Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card
          onClick={() => navigate('/manutencao')}
          className="cursor-pointer hover:border-emerald-400 transition-all shadow-sm bg-white col-span-2 md:col-span-1"
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-emerald-600">
              <RefreshCw className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                Oportunidade
              </span>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">{trocasOp}</div>
              <p className="text-xs text-slate-500 font-medium">Trocas de Equipamento</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ChamadosChart data={chamadoData} />
        <SaudeBaseChart
          data={
            saudeData.length > 0 ? saudeData : [{ name: 'Sem dados', value: 1, color: '#e2e8f0' }]
          }
        />
        <PipelineChart data={pipelineData} />
        <RegiaoChart
          data={regiaoData.length > 0 ? regiaoData : [{ regiao: 'Sem dados', clientes: 0 }]}
        />
        <VendasChart data={vendasData} />
        {meta && (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">
                  Meta {meta.periodo === 'mensal' ? 'Mensal' : 'Trimestral'}
                </h3>
                <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                  {metaPct}%
                </span>
              </div>
              <Progress value={metaPct} className="h-3" />
              <div className="flex justify-between text-xs text-slate-600">
                <span>R$ {(meta.valor_realizado || 0).toLocaleString('pt-BR')}</span>
                <span className="font-semibold">
                  Meta: R$ {(meta.valor_meta || 0).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-slate-500 pt-1 border-t">
                <span>
                  Propostas: <strong className="text-slate-700">{meta.propostas_enviadas}</strong>
                </span>
                <span>
                  Vendas: <strong className="text-slate-700">{meta.vendas_fechadas}</strong>
                </span>
                <span>
                  Conv: <strong className="text-slate-700">{convRate}%</strong>
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-[#1e3a8a]" /> Alertas Proativos do Dia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {instAtrasadas.length > 0 &&
            instAtrasadas.map((i, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/manutencao')}
                className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-red-100/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">Instalação Atrasada</p>
                    <p className="text-xs text-red-700">
                      {i.expand?.cliente?.nome || 'Cliente'} - {i.equipamento || 'Equipamento'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-red-400" />
              </div>
            ))}
          {pendingNotifs.slice(0, 3).map((n) => (
            <div
              key={n.id}
              onClick={() => navigate('/notificacoes')}
              className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-amber-100/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">{n.tipo || 'Alerta'}</p>
                  <p className="text-xs text-amber-700 truncate max-w-[200px]">{n.mensagem}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-amber-400" />
            </div>
          ))}
          <div
            onClick={() => navigate('/clientes')}
            className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-100/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Cake className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Aniversariante da Semana</p>
                <p className="text-xs text-blue-700">
                  Fernando Silva (Supermercado Mateus) - Enviar felicitações.
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => navigate('/clientes')}
            variant="outline"
            className="h-auto py-3 px-4 flex flex-col items-center gap-2 bg-white border-slate-200 hover:bg-slate-50"
          >
            <PlusCircle className="h-5 w-5 text-[#1e3a8a]" />
            <span className="text-xs font-semibold">Novo Cliente</span>
          </Button>
          <Button
            onClick={() => navigate('/vendas')}
            variant="outline"
            className="h-auto py-3 px-4 flex flex-col items-center gap-2 bg-white border-slate-200 hover:bg-slate-50"
          >
            <BadgeDollarSign className="h-5 w-5 text-[#1e3a8a]" />
            <span className="text-xs font-semibold">Nova Venda</span>
          </Button>
          <Button
            onClick={() => navigate('/agenda')}
            variant="outline"
            className="h-auto py-3 px-4 flex flex-col items-center gap-2 bg-white border-slate-200 hover:bg-slate-50"
          >
            <CalendarPlus className="h-5 w-5 text-[#1e3a8a]" />
            <span className="text-xs font-semibold">Registrar Visita</span>
          </Button>
          <Button
            onClick={() => navigate('/relatorios')}
            variant="outline"
            className="h-auto py-3 px-4 flex flex-col items-center gap-2 bg-white border-slate-200 hover:bg-slate-50"
          >
            <FileBarChart className="h-5 w-5 text-[#1e3a8a]" />
            <span className="text-xs font-semibold">Relatórios</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
