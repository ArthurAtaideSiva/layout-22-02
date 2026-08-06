import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  hasPrev: boolean
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
  totalItems: number
  className?: string
}

export function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  totalItems,
  className,
}: PaginationProps) {
  if (totalItems === 0) return null
  return (
    <div
      className={cn('flex items-center justify-between gap-2 pt-3', className)}
      role="navigation"
      aria-label="Paginação"
    >
      <span className="text-xs text-slate-500">
        {totalItems} {totalItems === 1 ? 'registro' : 'registros'}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={!hasPrev}
          className="h-8 px-2"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-slate-600 font-medium">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasNext}
          className="h-8 px-2"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
