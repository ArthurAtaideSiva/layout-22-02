import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  BadgeDollarSign,
  Wrench,
  Calendar,
  Bell,
  LogOut,
  BotMessageSquare,
  User,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { getNotificacoes, Notificacao } from '@/services/notificacoes'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export function MainLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [notifs, setNotifs] = useState<Notificacao[]>([])

  const fetchNotifs = async () => {
    try {
      const data = await getNotificacoes()
      setNotifs(data)
    } catch {
      /* intentionally ignored */
    }
  }

  useEffect(() => {
    fetchNotifs()
  }, [])

  useRealtime('notificacoes', () => {
    fetchNotifs()
  })

  const unreadCount = notifs.filter((n) => n.status !== 'lida').length

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Clientes', path: '/clientes', icon: Users },
    { label: 'Vendas', path: '/vendas', icon: BadgeDollarSign },
    { label: 'Manutenção', path: '/manutencao', icon: Wrench },
    { label: 'Agenda', path: '/agenda', icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col md:flex-row text-slate-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-4 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="h-9 w-9 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-lg">
            GC
          </div>
          <div>
            <h1 className="font-bold text-base text-[#1e3a8a] leading-none">Gestão Comercial</h1>
            <p className="text-xs text-slate-500 mt-0.5">Maquinário Supermercados</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname.startsWith(item.path)
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#eff6ff] text-[#1e3a8a] font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-[#1e3a8a]' : 'text-slate-500'}`} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="text-xs">
              <p className="font-semibold text-slate-800">{user?.name || 'Sócio'}</p>
              <p className="text-slate-500 truncate max-w-[110px]">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sair">
            <LogOut className="h-4 w-4 text-slate-500 hover:text-red-600" />
          </Button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-sm">
              GC
            </div>
            <span className="font-bold text-base text-[#1e3a8a]">Gestão Comercial</span>
          </div>

          <div className="hidden lg:block text-sm text-slate-500 font-medium">
            Representação Comercial de Maquinário Móvel
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => navigate('/notificacoes')}
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
              title="Notificações"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <Sheet>
              <SheetTrigger asChild>
                <button className="p-1.5 rounded-full hover:bg-slate-100 transition-colors lg:hidden">
                  <div className="h-7 w-7 rounded-full bg-[#1e3a8a] text-white text-xs font-bold flex items-center justify-center">
                    {user?.name?.charAt(0) || 'S'}
                  </div>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>Perfil do Sócio</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <User className="h-8 w-8 text-[#1e3a8a]" />
                    <div>
                      <p className="font-semibold text-sm">{user?.name || 'Sócio'}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full justify-start gap-2"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4" /> Sair do Sistema
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating Action Button (FAB Assistant) */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-40 h-14 w-14 rounded-full bg-[#25d366] hover:bg-[#1ebf58] text-white shadow-lg flex items-center justify-center transition-transform active:scale-95 animate-bounce"
        title="Assistente Comercial Chat"
      >
        <BotMessageSquare className="h-7 w-7" />
      </button>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 flex items-center justify-around h-16 lg:hidden px-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = location.pathname.startsWith(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                active ? 'text-[#1e3a8a] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'scale-110 text-[#1e3a8a]' : ''}`} />
              <span className="text-[11px] leading-none">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
