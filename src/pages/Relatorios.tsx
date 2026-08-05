import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

export default function Relatorios() {
  const perfData = [
    { mes: 'Mai', propostas: 5, fechadas: 2 },
    { mes: 'Jun', propostas: 8, fechadas: 4 },
    { mes: 'Jul', propostas: 12, fechadas: 6 },
    { mes: 'Ago', propostas: 9, fechadas: 5 },
  ]

  const pieData = [
    { name: 'Grande rede', value: 40, color: '#1e3a8a' },
    { name: 'Médio', value: 35, color: '#2563eb' },
    { name: 'Pequeno', value: 25, color: '#60a5fa' },
  ]

  const comissaoData = [
    { mes: 'Mai', valor: 12000 },
    { mes: 'Jun', valor: 18500 },
    { mes: 'Jul', valor: 24000 },
    { mes: 'Ago', valor: 21000 },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Relatórios de Desempenho</h1>
        <p className="text-xs text-slate-500">Métricas comerciais e comissões da representação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance de Vendas */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              Performance de Vendas (Propostas vs. Fechadas)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfData}>
                <XAxis dataKey="mes" textAnchor="end" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="propostas" fill="#2563eb" name="Propostas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fechadas" fill="#16a34a" name="Fechadas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Evolução de Comissões */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-bold text-slate-800">
              Evolução Mensal de Comissões (R$)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comissaoData}>
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="valor" stroke="#1e3a8a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
