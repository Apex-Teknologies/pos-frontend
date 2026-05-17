'use client'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Something went wrong</h1>
          <p className="text-slate-500 mt-2 text-sm">
            An unexpected error occurred. You can try refreshing the page or go back to the dashboard.
          </p>
          {error?.digest && (
            <p className="text-xs text-slate-400 mt-2 font-mono bg-slate-100 rounded px-2 py-1 inline-block">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" className="gap-2" onClick={reset}>
            <RefreshCw size={15} /> Try Again
          </Button>
          <Link href="/">
            <Button className="gap-2">
              <Home size={15} /> Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
