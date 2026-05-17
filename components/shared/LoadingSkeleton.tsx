import { cn } from '@/lib/utils'

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-slate-200 rounded-md', className)} />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border bg-white p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-xl border bg-white p-5">
          <Skeleton className="h-5 w-48 mb-4" />
          <Skeleton className="h-[220px] w-full" />
        </div>
        <div className="rounded-xl border bg-white p-5 space-y-3">
          <Skeleton className="h-5 w-32" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="border-b bg-slate-50 px-4 py-3 flex gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="border-b last:border-0 px-4 py-3.5 flex gap-4 items-center">
          {[...Array(5)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function POSSkeleton() {
  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 space-y-3">
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-24" />)}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-white p-3 space-y-2">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="w-80 rounded-xl border bg-white p-4 space-y-3">
        <Skeleton className="h-6 w-24" />
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}

export default Skeleton
