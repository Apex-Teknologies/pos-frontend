'use client'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Printer, X } from 'lucide-react'

export default function ReceiptModal({ transaction: t, onClose }: { transaction: Transaction; onClose: () => void }) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <div className="space-y-4 font-mono text-sm" id="receipt">
          {/* Header */}
          <div className="text-center space-y-1">
            <p className="text-xl font-bold not-italic font-sans">ApexTek Store</p>
            <p className="text-xs text-muted-foreground">Tax Invoice</p>
            <p className="text-xs text-muted-foreground">{formatDate(t.createdAt)}</p>
            <p className="text-xs">Receipt: <strong>{t.receiptNumber}</strong></p>
            <p className="text-xs text-muted-foreground">Cashier: {t.cashierName}</p>
          </div>

          <Separator />

          {/* Items */}
          <div className="space-y-1">
            {t.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs">
                <div>
                  <span>{item.product.name}</span>
                  <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                </div>
                <span>{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(t.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (15%)</span>
              <span>{formatCurrency(t.taxAmount)}</span>
            </div>
            {t.discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount</span>
                <span>-{formatCurrency(t.discountAmount)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between font-bold text-base">
            <span>TOTAL</span>
            <span>{formatCurrency(t.total)}</span>
          </div>

          <div className="text-xs space-y-1 text-muted-foreground">
            <div className="flex justify-between">
              <span>Payment</span>
              <span className="capitalize">{t.paymentMethod.replace('_', ' ')}</span>
            </div>
            {t.amountTendered != null && (
              <div className="flex justify-between">
                <span>Tendered</span>
                <span>{formatCurrency(t.amountTendered)}</span>
              </div>
            )}
            {t.change != null && (
              <div className="flex justify-between font-semibold text-green-700">
                <span>Change</span>
                <span>{formatCurrency(t.change)}</span>
              </div>
            )}
          </div>

          <Separator />
          <p className="text-center text-xs text-muted-foreground">Thank you for shopping with us!</p>
        </div>

        <div className="flex gap-2 mt-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={() => window.print()}>
            <Printer size={15} /> Print
          </Button>
          <Button className="flex-1" onClick={onClose}>
            <X size={15} className="mr-1" /> Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
