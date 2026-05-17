'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Delete, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const PAD = ['1','2','3','4','5','6','7','8','9','','0','⌫']

export default function PinPage() {
  const router = useRouter()
  const loginWithPin = useAuthStore((s) => s.loginWithPin)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setPin((p) => p.slice(0, -1))
      return
    }
    if (pin.length >= 4) return
    const next = pin + key
    setPin(next)
    if (next.length === 4) {
      setTimeout(() => {
        const ok = loginWithPin(next)
        if (ok) {
          router.push('/')
        } else {
          setError('Invalid PIN. Try 1234 (admin), 5678 (manager), or 0000 (cashier).')
          setShake(true)
          setPin('')
          setTimeout(() => setShake(false), 600)
        }
      }, 100)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-white">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg">
            <ShoppingCart size={28} />
          </div>
          <h1 className="text-2xl font-bold">PIN Login</h1>
          <p className="text-slate-400 text-sm">Enter your 4-digit PIN</p>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur shadow-2xl">
          <CardContent className="pt-6 space-y-6">
            {/* PIN dots */}
            <div className={`flex justify-center gap-4 ${shake ? 'animate-bounce' : ''}`}>
              {[0,1,2,3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pin.length > i
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-slate-500'
                  }`}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 rounded-md p-3">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-3">
              {PAD.map((key, idx) => (
                key === '' ? (
                  <div key={idx} />
                ) : (
                  <button
                    key={idx}
                    onClick={() => handleKey(key)}
                    className="h-14 rounded-xl text-xl font-semibold text-white bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all"
                  >
                    {key === '⌫' ? <Delete size={20} className="mx-auto" /> : key}
                  </button>
                )
              ))}
            </div>

            <div className="text-center">
              <Link href="/login" className="text-blue-400 text-sm hover:underline">
                ← Back to email login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
