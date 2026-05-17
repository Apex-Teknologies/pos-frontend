'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    // In production this would call the registration API.
    // For the mock, we log in as the admin user if email matches demo.
    const ok = login(form.email, form.password)
    setLoading(false)
    if (ok) {
      router.push('/')
    } else {
      // Simulate successful registration redirect to login
      router.push('/login?registered=1')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2 text-white">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg">
            <ShoppingCart size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">ApexTek POS</h1>
          <p className="text-slate-400 text-sm">Create your account</p>
        </div>

        <Card className="shadow-2xl border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white text-xl">Get started</CardTitle>
            <CardDescription className="text-slate-400">Fill in your details to register</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-slate-300" htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Kwame Mensah"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300" htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300" htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-slate-300" htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-950/30 rounded-md p-3">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 hover:underline">Sign in</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
