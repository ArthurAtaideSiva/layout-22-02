import { useEffect, useState } from 'react'
import { useNavigate } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getOportunidades, Oportunidade } from '@/services/oportunidades'
import { getInstalacoes, Instalacao } from '@/services/instalacoes'
import { getChamados, Chamado } from '@/services/chamados'
import { getClientes, Cliente } from '@/services/clientes'
import { getEquipamentos, Equipamento } from '@/services/equipamentos'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([])
  const [instalacoes, setInstalacoes] = useState<Instalacao[]>([])
  const [chamados, setChamados] = useState<Chamado[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])

  useEffect(() => {
    Promise.all([
      getOportunidades(),
      getInstalacoes(),
      getChamados(),
      getClientes(),
      getEquipamentos(),
    ]).then(([ops, inst, cham, clis, eq]) => {
      setOportunidades(ops)
      setInstalacoes(inst)
      setChamados(cham)
      setClientes(clis)
      setEquipamentos(eq)
    })
  }, [])

  const opAbertas = oportunidades.filter((o) => o.status !== 'Fechado' && o.status !== 'Perdido')
  const valorTotalOp = opAbertas.reduce((acc, o) => acc + (o.valor_estimado || 0), 0)

  const instPendentes = instalacoes.filter((i) => i.status !== 'Concluída')
  const chamAbertos = chamados.filter((c) => c.status !== 'Concluído')

  const now = new Date()
  const cli30 = clientes.filter((c) => {
    if (!c.ultimo_contato) return true
    const diff = (now.getTime() - new Date(c.ultimo_contato).getTime()) / (1000 * 3600 * 24)
    return diff >= 30 && diff < 60
  }).length

  const cli60 = clientes.filter((c) => {
    if (!c.ultimo_contato) return false
    const diff = (now.getTime() - new Date(c.ultimo_contato).getTime()) / (1000 * 3600 * 24)
    return diff >= 60 && diff < 90
  }).length

  const cli90 = clientes.filter((c) => {
    if (!c.ultimo_contato) return false
    const diff = (now.getTime() - new Date(c.ultimo_contato).getTime()) / (1000 * 3600 * 24)
    return diff >= 90
  }).length

  const trocasOp = equipamentos.filter(
    (e) =>
      e.status === 'Troca recomendada' || (e.data_expiracao && new Date(e.data_expiracao) <= now),
  ).length

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">
          Olá, {user?.name || 'Sócio'} 👋
        </h1>
        <p className="text-xs md:text-sm text-slate-500">
          Resumo em tempo real da sua carteira comercial de maquinário.
        </p>
      </div>

      {/* KPI Cards Row */}
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
          onClick={() => navigate('/clientes')}
          className="cursor-pointer hover:border-slate-400 transition-all shadow-sm bg-white"
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                Sem contato
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-amber-600">{cli30}d</span>
              <span className="text-sm font-bold text-orange-600">{cli60}d</span>
              <span className="text-sm font-bold text-red-600">{cli90}d</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Sem Contato (30/60/90d)</p>
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

      {/* Daily Alerts Section */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-[#1e3a8a]" /> Alertas Proativos do Dia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {instPendentes.some((i) => i.status === 'Atrasada') && (
            <div
              onClick={() => navigate('/manutencao')}
              className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-red-100/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-semibold text-red-900">
                    Instalação Atrasada na Fabricante
                  </p>
                  <p className="text-xs text-red-700">
                    Cobrar posicionamento da equipe técnica imediatamente.
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-red-400" />
            </div>
          )}

          {cli90 > 0 && (
            <div
              onClick={() => navigate('/clientes')}
              className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-amber-100/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    {cli90} clientes sem contato há +90 dias
                  </p>
                  <p className="text-xs text-amber-700">
                    Risco de perda da conta. Agende uma visita.
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-amber-400" />
            </div>
          )}

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

      {/* Quick Actions */}
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
