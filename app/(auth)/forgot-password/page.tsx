'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-white">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg">
            <ShoppingCart size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">ApexTek POS</h1>
        </div>

        <Card className="shadow-2xl border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white text-xl">Forgot Password</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <CheckCircle size={48} className="text-green-500" />
                  <p className="text-white font-semibold">Check your inbox</p>
                  <p className="text-slate-400 text-sm">
                    We sent a password reset link to <strong className="text-white">{email}</strong>.
                    It expires in 30 minutes.
                  </p>
                </div>
                <Link href="/login">
                  <Button variant="outline" className="w-full gap-2 border-slate-600 text-slate-300 hover:bg-slate-700">
                    <ArrowLeft size={16} /> Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-slate-300" htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <div className="text-center">
                  <Link href="/login" className="text-blue-400 text-sm hover:underline flex items-center justify-center gap-1">
                    <ArrowLeft size={14} /> Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
