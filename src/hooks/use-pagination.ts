import { useState, useMemo, useCallback } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialPageSize?: number
}

export function usePagination<T>(items: T[], options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialPageSize = 20 } = options
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [items, page, pageSize])

  const goToPage = useCallback(
    (p: number) => {
      setPage(Math.min(Math.max(1, p), totalPages))
    },
    [totalPages],
  )

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage])
  const prevPage = useCallback(() => goToPage(page - 1), [page, goToPage])

  return {
    page,
    pageSize,
    totalPages,
    paginatedItems,
    totalItems: items.length,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  }
}
