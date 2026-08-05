import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface ChamadoDatum {
  name: string
  Aberto: number
  Concluido: number
}
export interface SaudeDatum {
  name: string
  value: number
  color: string
}
export interface PipelineDatum {
  status: string
  valor: number
}
export interface RegiaoDatum {
  regiao: string
  clientes: number
}
export interface VendasDatum {
  mes: string
  valor: number
}

export function ChamadosChart({ data }: { data: ChamadoDatum[] }) {
  const config: ChartConfig = {
    Aberto: { label: 'Aberto', color: '#ef4444' },
    Concluído: { label: 'Concluído', color: '#22c55e' },
  }
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-bold text-slate-800">
          Chamados: Abertos vs. Concluídos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 h-56">
        <ChartContainer config={config} className="h-full w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="Aberto" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Concluído" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function SaudeBaseChart({ data }: { data: SaudeDatum[] }) {
  const config: ChartConfig = { value: { label: 'Clientes' } }
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-bold text-slate-800">
          Saúde da Base de Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 h-56">
        <ChartContainer config={config} className="h-full w-full">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function PipelineChart({ data }: { data: PipelineDatum[] }) {
  const config: ChartConfig = { valor: { label: 'Valor (R$)', color: '#2563eb' } }
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-bold text-slate-800">
          Pipeline de Vendas por Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 h-56">
        <ChartContainer config={config} className="h-full w-full">
          <BarChart data={data} layout="vertical">
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="status" tick={{ fontSize: 10 }} width={90} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="valor" fill="#1e3a8a" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function RegiaoChart({ data }: { data: RegiaoDatum[] }) {
  const config: ChartConfig = { clientes: { label: 'Clientes', color: '#2563eb' } }
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-bold text-slate-800">Clientes por Região</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 h-56">
        <ChartContainer config={config} className="h-full w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="regiao" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="clientes" fill="#0891b2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function VendasChart({ data }: { data: VendasDatum[] }) {
  const config: ChartConfig = { valor: { label: 'Comissões (R$)', color: '#1e3a8a' } }
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-bold text-slate-800">
          Evolução Mensal de Vendas (R$)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 h-56">
        <ChartContainer config={config} className="h-full w-full">
          <LineChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="valor" stroke="#1e3a8a" strokeWidth={3} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
