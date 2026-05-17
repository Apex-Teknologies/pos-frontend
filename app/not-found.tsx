import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center">
            <ShoppingBag size={40} className="text-white" />
          </div>
        </div>
        <div>
          <p className="text-8xl font-black text-slate-200 select-none">404</p>
          <h1 className="text-2xl font-bold text-slate-800 -mt-2">Page not found</h1>
          <p className="text-slate-500 mt-2">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Link href="/">
          <Button className="gap-2">
            <Home size={16} />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
