import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import ClienteDetalhe from './pages/ClienteDetalhe'
import Vendas from './pages/Vendas'
import Manutencao from './pages/Manutencao'
import Agenda from './pages/Agenda'
import Relatorios from './pages/Relatorios'
import Notificacoes from './pages/Notificacoes'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import { MainLayout } from './components/MainLayout'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="p-8 text-center text-slate-500">Carregando aplicação...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/:id" element={<ClienteDetalhe />} />
            <Route path="/vendas" element={<Vendas />} />
            <Route path="/manutencao" element={<Manutencao />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/notificacoes" element={<Notificacoes />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
