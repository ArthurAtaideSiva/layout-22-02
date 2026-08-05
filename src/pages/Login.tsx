import { useState } from 'react'
import { useNavigate } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('arthurataidesilva2005@gmail.com')
  const [password, setPassword] = useState('Skip@Pass')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setErrorMsg('E-mail ou senha inválidos. Tente novamente.')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 via-[#1e3a8a] to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="mx-auto h-12 w-12 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xl shadow-md">
            GC
          </div>
          <CardTitle className="text-2xl font-bold text-[#1e3a8a]">Gestão Comercial</CardTitle>
          <CardDescription className="text-slate-600 text-xs md:text-sm">
            Representação de Maquinário para Supermercados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-md text-center font-medium">
                {errorMsg}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail Corporativo</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@empresa.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha de Acesso</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e3a8a] hover:bg-[#172a63] font-semibold py-5"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar no Sistema'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
