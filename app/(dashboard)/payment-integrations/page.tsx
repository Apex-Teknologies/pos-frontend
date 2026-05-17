'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CreditCard, CheckCircle, AlertCircle, ExternalLink, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface Gateway {
  id: string
  name: string
  description: string
  logo: string
  connected: boolean
  testMode: boolean
  publicKey: string
  secretKey: string
  webhookUrl: string
  currencies: string[]
}

const defaultGateways: Gateway[] = [
  { id: 'stripe', name: 'Stripe', description: 'Accept cards worldwide. Used for international payments.', logo: '💳', connected: false, testMode: true, publicKey: '', secretKey: '', webhookUrl: '', currencies: ['USD', 'EUR', 'GBP'] },
  { id: 'paystack', name: 'Paystack', description: 'Leading payment gateway for African businesses.', logo: '🟢', connected: false, testMode: true, publicKey: '', secretKey: '', webhookUrl: '', currencies: ['GHS', 'NGN', 'ZAR', 'KES'] },
  { id: 'flutterwave', name: 'Flutterwave', description: 'Pan-African payment infrastructure.', logo: '🦋', connected: false, testMode: true, publicKey: '', secretKey: '', webhookUrl: '', currencies: ['GHS', 'NGN', 'USD', 'KES'] },
  { id: 'mtn_momo', name: 'MTN Mobile Money', description: 'Accept MTN MoMo payments directly.', logo: '📱', connected: false, testMode: true, publicKey: '', secretKey: '', webhookUrl: '', currencies: ['GHS'] },
]

export default function PaymentIntegrationsPage() {
  const [gateways, setGateways] = useState(defaultGateways)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({})

  const update = (id: string, field: keyof Gateway, value: string | boolean) =>
    setGateways((gs) => gs.map((g) => (g.id === id ? { ...g, [field]: value } : g)))

  const save = (g: Gateway) => {
    if (!g.publicKey || !g.secretKey) return toast.error('Public key and secret key are required')
    update(g.id, 'connected', true)
    toast.success(`${g.name} connected successfully`)
    setExpanded(null)
  }

  const disconnect = (g: Gateway) => {
    update(g.id, 'connected', false)
    update(g.id, 'publicKey', '')
    update(g.id, 'secretKey', '')
    toast.success(`${g.name} disconnected`)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><CreditCard size={22} /> Payment Integrations</h1>
        <p className="text-muted-foreground text-sm">Configure payment gateways for your checkout</p>
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-center gap-2">
        <AlertCircle size={16} className="shrink-0" />
        All gateways are in sandbox/test mode until a live backend is connected. No real transactions will be processed.
      </div>

      <div className="space-y-3">
        {gateways.map((g) => (
          <Card key={g.id} className={g.connected ? 'border-green-300' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{g.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{g.name}</p>
                    {g.connected
                      ? <Badge className="bg-green-100 text-green-700 text-xs"><CheckCircle size={10} className="mr-1" />Connected</Badge>
                      : <Badge variant="outline" className="text-xs text-muted-foreground">Not connected</Badge>
                    }
                    {g.connected && g.testMode && <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Test mode</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{g.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Currencies: {g.currencies.join(', ')}</p>
                </div>
                <div className="flex gap-2">
                  {g.connected ? (
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => disconnect(g)}>Disconnect</Button>
                  ) : (
                    <Button size="sm" onClick={() => setExpanded(expanded === g.id ? null : g.id)}>
                      {expanded === g.id ? 'Cancel' : 'Connect'}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => window.open(`https://${g.id}.com`, '_blank')}>
                    <ExternalLink size={14} />
                  </Button>
                </div>
              </div>

              {expanded === g.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      id={`testmode-${g.id}`}
                      checked={g.testMode}
                      onChange={(e) => update(g.id, 'testMode', e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor={`testmode-${g.id}`} className="text-sm font-medium cursor-pointer">Test / Sandbox mode</label>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Public Key {g.testMode ? '(Test)' : '(Live)'}</Label>
                    <Input
                      value={g.publicKey}
                      onChange={(e) => update(g.id, 'publicKey', e.target.value)}
                      placeholder={`pk_${g.testMode ? 'test' : 'live'}_...`}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Secret Key {g.testMode ? '(Test)' : '(Live)'}</Label>
                    <div className="relative">
                      <Input
                        type={showSecret[g.id] ? 'text' : 'password'}
                        value={g.secretKey}
                        onChange={(e) => update(g.id, 'secretKey', e.target.value)}
                        placeholder={`sk_${g.testMode ? 'test' : 'live'}_...`}
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowSecret((s) => ({ ...s, [g.id]: !s[g.id] }))}
                      >
                        {showSecret[g.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Webhook URL (optional)</Label>
                    <Input
                      value={g.webhookUrl}
                      onChange={(e) => update(g.id, 'webhookUrl', e.target.value)}
                      placeholder="https://your-domain.com/webhooks/..."
                    />
                  </div>
                  <Button size="sm" onClick={() => save(g)}>Save & Connect</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
