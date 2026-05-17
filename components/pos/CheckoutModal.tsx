'use client'
import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Banknote, CreditCard, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

type PaymentMethod = 'cash' | 'card' | 'mobile_money'

interface Props {
  open: boolean
  onClose: () => void
  total: number
  onConfirm: (method: PaymentMethod, amountTendered?: number) => void
}

const methods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: 'cash', label: 'Cash', icon: <Banknote size={20} /> },
  { id: 'card', label: 'Card', icon: <CreditCard size={20} /> },
  { id: 'mobile_money', label: 'Mobile Money', icon: <Smartphone size={20} /> },
]

const quickAmounts = [50, 100, 200, 500]

export default function CheckoutModal({ open, onClose, total, onConfirm }: Props) {
  const [method, setMethod] = useState<PaymentMethod>('cash')
  const [tendered, setTendered] = useState('')

  const tenderedNum = parseFloat(tendered) || 0
  const change = method === 'cash' ? tenderedNum - total : 0

  const handleConfirm = () => {
    onConfirm(method, method === 'cash' ? tenderedNum : undefined)
    setTendered('')
    setMethod('cash')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center py-2 bg-blue-50 rounded-lg">
            <p className="text-muted-foreground text-sm">Amount Due</p>
            <p className="text-4xl font-bold text-blue-600">{formatCurrency(total)}</p>
          </div>

          {/* Payment method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-3 gap-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors text-sm font-medium',
                    method === m.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cash tendered */}
          {method === 'cash' && (
            <div className="space-y-2">
              <Label>Amount Tendered</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={tendered}
                onChange={(e) => setTendered(e.target.value)}
                className="text-lg font-semibold"
              />
              <div className="flex gap-2">
                {quickAmounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => setTendered(String(a))}
                    className="flex-1 py-1.5 text-sm border rounded-lg hover:bg-slate-50 font-medium"
                  >
                    ₵{a}
                  </button>
                ))}
              </div>
              {tenderedNum >= total && (
                <div className="flex justify-between font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-2">
                  <span>Change</span>
                  <span>{formatCurrency(change)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button
              className="flex-1 h-11"
              onClick={handleConfirm}
              disabled={method === 'cash' && (tenderedNum < total || !tendered)}
            >
              Confirm Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
