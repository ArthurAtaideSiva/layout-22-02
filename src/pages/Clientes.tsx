import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClientes, createCliente, Cliente } from '@/services/clientes'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Plus, MapPin, Building, Calendar, PhoneCall } from 'lucide-react'

export default function Clientes() {
  const navigate = useNavigate()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [search, setSearch] = useState('')
  const [porteFilter, setPorteFilter] = useState<string>('todos')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [openModal, setOpenModal] = useState(false)

  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    porte: 'Médio',
    cidade: '',
    estado: 'MA',
    regiao: 'Norte / Nordeste',
    status: 'Ativo',
  })

  const loadClientes = () => {
    getClientes().then(setClientes)
  }

  useEffect(() => {
    loadClientes()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome) return
    await createCliente({
      ...formData,
      porte: formData.porte as any,
      status: formData.status as any,
      ultimo_contato: new Date().toISOString(),
    })
    setOpenModal(false)
    setFormData({
      nome: '',
      cnpj: '',
      porte: 'Médio',
      cidade: '',
      estado: 'MA',
      regiao: 'Norte / Nordeste',
      status: 'Ativo',
    })
    loadClientes()
  }

  const filtered = clientes.filter((c) => {
    const matchSearch =
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      (c.cidade && c.cidade.toLowerCase().includes(search.toLowerCase())) ||
      (c.cnpj && c.cnpj.includes(search))
    const matchPorte = porteFilter === 'todos' || c.porte === porteFilter
    const matchStatus = statusFilter === 'todos' || c.status === statusFilter
    return matchSearch && matchPorte && matchStatus
  })

  const calcDaysWithoutContact = (dateStr?: string) => {
    if (!dateStr) return 999
    const diff = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24)
    return Math.floor(diff)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Carteira de Clientes</h1>
          <p className="text-xs text-slate-500">Supermercados e redes atendidas</p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button className="bg-[#1e3a8a] hover:bg-[#172a63] gap-1 text-xs">
              <Plus className="h-4 w-4" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Supermercado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label className="text-xs">Razão Social / Nome Fantasia *</Label>
                <Input
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Supermercado Mateus"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">CNPJ</Label>
                  <Input
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Porte</Label>
                  <Select
                    value={formData.porte}
                    onValueChange={(v) => setFormData({ ...formData, porte: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pequeno">Pequeno</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Grande rede">Grande rede</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1 col-span-2">
                  <Label className="text-xs">Cidade</Label>
                  <Input
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">UF</Label>
                  <Input
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-[#1e3a8a] mt-4">
                Salvar Cliente
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, cidade ou CNPJ..."
            className="pl-9 bg-white"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          <Select value={porteFilter} onValueChange={setPorteFilter}>
            <SelectTrigger className="w-[120px] bg-white h-8 text-xs">
              <SelectValue placeholder="Porte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Portes</SelectItem>
              <SelectItem value="Pequeno">Pequeno</SelectItem>
              <SelectItem value="Médio">Médio</SelectItem>
              <SelectItem value="Grande rede">Grande rede</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-white h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Prospecção">Prospecção</SelectItem>
              <SelectItem value="Pós-venda">Pós-venda</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Client List */}
      <div className="space-y-2.5">
        {filtered.map((cli) => {
          const days = calcDaysWithoutContact(cli.ultimo_contato)
          return (
            <Card
              key={cli.id}
              onClick={() => navigate(`/clientes/${cli.id}`)}
              className="cursor-pointer hover:border-blue-400 transition-all bg-white shadow-sm"
            >
              <CardContent className="p-3.5 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-bold text-sm text-slate-900">{cli.nome}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {cli.cidade || 'Não informada'} -{' '}
                      {cli.estado || 'MA'}
                    </p>
                  </div>
                  <Badge
                    variant={cli.status === 'Ativo' ? 'default' : 'secondary'}
                    className="text-[10px]"
                  >
                    {cli.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600">
                  <span className="flex items-center gap-1">
                    <Building className="h-3.5 w-3.5 text-slate-400" /> {cli.porte || 'Médio'}
                  </span>
                  {days > 30 ? (
                    <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <PhoneCall className="h-3 w-3" /> sem contato há {days} dias
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {days === 0 ? 'Hoje' : `${days}d atrás`}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
