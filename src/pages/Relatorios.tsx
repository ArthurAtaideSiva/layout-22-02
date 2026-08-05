import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { getOportunidades, Oportunidade } from '@/services/oportunidades'
import { getClientes, Cliente } from '@/services/clientes'
import { getEquipamentos, Equipamento } from '@/services/equipamentos'
import { getNotificacoes, Notificacao } from '@/services/notificacoes'
import { CalendarClock, Users, RefreshCw, BellRing } from 'lucide-react'

export default function Relatorios() {
  const [ops, setOps] = useState<Oportunidade[]>([])
  const [clis, setClis] = useState<Cliente[]>([])
  const [eqs, setEqs] = useState<Equipamento[]>([])
  const [notifs, setNotifs] = useState<Notificacao[]>([])

  useEffect(() => {
    Promise.all([getOportunidades(), getClientes(), getEquipamentos(), getNotificacoes()]).then(
      ([o, c, e, n]) => {
        setOps(o)
        setClis(c)
        setEqs(e)
        setNotifs(n)
      },
    )
  }, [])

  const pipelineData = ['Prospecção', 'Cotação enviada', 'Em análise', 'Fechado', 'Perdido'].map(
    (s) => ({
      status: s,
      valor: ops.filter((o) => o.status === s).reduce((a, o) => a + (o.valor_estimado || 0), 0),
    }),
  )
  const pipelineConfig: ChartConfig = { valor: { label: 'Valor (R$)', color: '#1e3a8a' } }

  const inativosPorRegiao = Array.from(new Set(clis.map((c) => c.regiao).filter(Boolean))).map(
    (r) => ({
      regiao: r || 'N/A',
      ativos: clis.filter((c) => c.regiao === r && c.status === 'Ativo').length,
      inativos: clis.filter((c) => c.regiao === r && c.status !== 'Ativo').length,
    }),
  )

  const now = new Date()
  const trocasPorTrimestre = eqs
    .filter((e) => e.data_expiracao && new Date(e.data_expiracao) >= now)
    .map((e) => {
      const d = new Date(e.data_expiracao!)
      const q = Math.floor(d.getMonth() / 3) + 1
      return {
        q: `Q${q} ${d.getFullYear()}`,
        cliente: e.expand?.cliente?.nome || 'N/A',
        modelo: e.modelo || 'N/A',
        marca: e.marca || 'N/A',
        data: e.data_expiracao,
      }
    })
    .sort((a, b) => (a.data || '').localeCompare(b.data || ''))

  const followUps = notifs.filter(
    (n) =>
      n.tipo?.includes('reativacao') ||
      n.tipo === 'followup_venda' ||
      n.tipo === 'proposta sem resposta',
  )

  const trocasChartData = Array.from(new Set(trocasPorTrimestre.map((t) => t.q))).map((q) => ({
    trimestre: q,
    quantidade: trocasPorTrimestre.filter((t) => t.q === q).length,
  }))
  const trocasConfig: ChartConfig = { quantidade: { label: 'Trocas', color: '#0891b2' } }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Relatórios de Desempenho</h1>
        <p className="text-xs text-slate-500">
          Pipeline, clientes inativos, trocas previstas e follow-ups
        </p>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-blue-600" /> Pipeline de Vendas por Status (R$)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 h-64">
          <ChartContainer config={pipelineConfig} className="h-full w-full">
            <BarChart data={pipelineData} layout="vertical">
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="status" tick={{ fontSize: 10 }} width={90} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="valor" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" /> Clientes Ativos vs. Inativos por Região
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Região</TableHead>
                <TableHead className="text-xs text-center">Ativos</TableHead>
                <TableHead className="text-xs text-center">Inativos/Prospecção</TableHead>
                <TableHead className="text-xs text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inativosPorRegiao.map((r) => (
                <TableRow key={r.regiao}>
                  <TableCell className="text-xs font-medium">{r.regiao}</TableCell>
                  <TableCell className="text-xs text-center">
                    <Badge className="bg-green-100 text-green-700">{r.ativos}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-center">
                    <Badge className="bg-red-100 text-red-700">{r.inativos}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-center font-bold">
                    {r.ativos + r.inativos}
                  </TableCell>
                </TableRow>
              ))}
              {inativosPorRegiao.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-xs text-center text-slate-400">
                    Nenhum dado disponível
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-cyan-600" /> Trocas Previstas por Trimestre
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 h-48">
          <ChartContainer config={trocasConfig} className="h-full w-full">
            <BarChart data={trocasChartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="trimestre" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="quantidade" fill="#0891b2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {trocasPorTrimestre.length > 0 && (
        <Card className="bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              Detalhamento de Trocas Previstas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Trimestre</TableHead>
                  <TableHead className="text-xs">Cliente</TableHead>
                  <TableHead className="text-xs">Equipamento</TableHead>
                  <TableHead className="text-xs">Marca</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trocasPorTrimestre.slice(0, 10).map((t, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs">{t.q}</TableCell>
                    <TableCell className="text-xs font-medium">{t.cliente}</TableCell>
                    <TableCell className="text-xs">{t.modelo}</TableCell>
                    <TableCell className="text-xs">{t.marca}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white shadow-sm">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <BellRing className="h-4 w-4 text-amber-600" /> Follow-ups Agendados ({followUps.length}
            )
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Tipo</TableHead>
                <TableHead className="text-xs">Mensagem</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followUps.slice(0, 10).map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="text-xs">
                    <Badge variant="outline">{f.tipo}</Badge>
                  </TableCell>
                  <TableCell className="text-xs truncate max-w-[250px]">{f.mensagem}</TableCell>
                  <TableCell className="text-xs">
                    <Badge
                      className={
                        f.status === 'pendente'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }
                    >
                      {f.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {followUps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-xs text-center text-slate-400">
                    Nenhum follow-up agendado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
