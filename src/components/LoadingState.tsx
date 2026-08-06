import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2.5" role="status" aria-label="Carregando dados">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-[60%]" />
          <div className="flex justify-between pt-2 border-t border-slate-100">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LoadingChart() {
  return (
    <div
      className="h-56 flex items-center justify-center"
      role="status"
      aria-label="Carregando gráfico"
    >
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  )
}

export function InlineSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex items-center justify-center p-8', className)}
      role="status"
      aria-label="Carregando"
    >
      <div className="h-6 w-6 border-2 border-slate-300 border-t-[#1e3a8a] rounded-full animate-spin" />
    </div>
  )
}
