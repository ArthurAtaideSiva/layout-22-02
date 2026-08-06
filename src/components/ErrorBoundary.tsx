import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <div>
            <h2 className="text-lg font-bold text-slate-800">Algo deu errado</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-md">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={this.handleReset} variant="outline" size="sm">
              Tentar novamente
            </Button>
            <Button onClick={() => window.location.reload()} size="sm" className="bg-[#1e3a8a]">
              Recarregar página
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
