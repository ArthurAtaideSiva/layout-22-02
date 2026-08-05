import { useEffect, useState } from 'react'
import {
  getNotificacoes,
  marcarComoLida,
  marcarTodasLidas,
  Notificacao,
} from '@/services/notificacoes'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCheck, Cake, Clock, AlertTriangle, Wrench } from 'lucide-react'

export default function Notificacoes() {
  const [notifs, setNotifs] = useState<Notificacao[]>([])

  const loadNotifs = () => {
    getNotificacoes().then(setNotifs)
  }

  useEffect(() => {
    loadNotifs()
  }, [])

  useRealtime('notificacoes', () => {
    loadNotifs()
  })

  const handleMarkRead = async (id: string) => {
    await marcarComoLida(id)
    loadNotifs()
  }

  const handleMarkAllRead = async () => {
    await marcarTodasLidas(notifs)
    loadNotifs()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Centro de Notificações</h1>
          <p className="text-xs text-slate-500">Alertas inteligentes proativos do sistema</p>
        </div>

        <Button onClick={handleMarkAllRead} variant="outline" size="sm" className="text-xs gap-1">
          <CheckCheck className="h-3.5 w-3.5" /> Ler todas
        </Button>
      </div>

      <div className="space-y-2">
        {notifs.map((n) => {
          const isLida = n.status === 'lida'
          return (
            <Card
              key={n.id}
              onClick={() => handleMarkRead(n.id)}
              className={`cursor-pointer transition-all ${
                isLida
                  ? 'bg-white opacity-70 border-slate-200'
                  : 'bg-blue-50/60 border-blue-200 shadow-sm font-semibold'
              }`}
            >
              <CardContent className="p-3 flex items-start gap-3 text-xs">
                <Bell
                  className={`h-5 w-5 mt-0.5 shrink-0 ${isLida ? 'text-slate-400' : 'text-[#1e3a8a]'}`}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {n.tipo || 'alerta'}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      {n.data_disparo
                        ? new Date(n.data_disparo).toLocaleDateString('pt-BR')
                        : 'Hoje'}
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed">{n.mensagem}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
