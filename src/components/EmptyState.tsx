import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[200px] gap-3 p-8 text-center',
        className,
      )}
    >
      {icon && <div className="text-slate-300">{icon}</div>}
      <div>
        <h3 className="text-sm font-bold text-slate-700">{title}</h3>
        {description && <p className="text-xs text-slate-400 mt-1 max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  )
}

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[200px] gap-3 p-8 text-center"
      role="alert"
    >
      <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
        <span className="text-red-500 text-xl">!</span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-700">Erro ao carregar dados</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          {message || 'Tente novamente em alguns instantes.'}
        </p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="text-xs font-semibold text-[#1e3a8a] hover:underline">
          Tentar novamente
        </button>
      )}
    </div>
  )
}
