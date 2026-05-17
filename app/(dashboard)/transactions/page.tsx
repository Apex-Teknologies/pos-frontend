'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { useTransactionStore } from '@/lib/store/transactionStore'
import { Transaction } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Receipt, Eye, RotateCcw } from 'lucide-react'
import ReceiptModal from '@/components/pos/ReceiptModal'

export default function TransactionsPage() {
  const { transactions, refundTransaction } = useTransactionStore()
  const [methodFilter, setMethodFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [viewing, setViewing] = useState<Transaction | null>(null)

  const filtered = transactions.filter((t) => {
    const matchMethod = methodFilter === 'all' || t.paymentMethod === methodFilter
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchSearch =
      t.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.cashierName.toLowerCase().includes(search.toLowerCase())
    return matchMethod && matchStatus && matchSearch
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Receipt size={22} /> Transactions</h1>
        <p className="text-muted-foreground text-sm">{transactions.length} total transactions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search receipt or cashier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="h-10 border rounded-md px-3 text-sm bg-white w-40"
        >
          <option value="all">All Methods</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="mobile_money">Mobile Money</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 border rounded-md px-3 text-sm bg-white w-36"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Receipt</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cashier</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Items</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payment</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">No transactions found</td>
                  </tr>
                )}
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs">{t.receiptNumber}</td>
                    <td className="py-3 px-4">{t.cashierName}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{formatDate(t.createdAt)}</td>
                    <td className="py-3 px-4">{t.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                    <td className="py-3 px-4 capitalize">{t.paymentMethod.replace('_', ' ')}</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrency(t.total)}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={t.status === 'completed' ? 'default' : 'secondary'}
                        className={t.status === 'refunded' ? 'bg-orange-100 text-orange-700' : ''}
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setViewing(t)}>
                          <Eye size={15} />
                        </Button>
                        {t.status === 'completed' && (
                          <Button
                            variant="ghost" size="icon"
                            className="text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                            onClick={() => { refundTransaction(t.id); toast.info('Transaction refunded') }}
                          >
                            <RotateCcw size={15} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {viewing && <ReceiptModal transaction={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}
