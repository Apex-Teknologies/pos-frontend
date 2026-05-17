'use client'
import { useMemo } from 'react'
import { useTransactionStore } from '@/lib/store/transactionStore'
import { useInventoryStore } from '@/lib/store/inventoryStore'
import { formatCurrency, formatDate } from '@/lib/utils'
import StatCard from '@/components/shared/StatCard'
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { generateSalesData } from '@/lib/mock/transactions'

export default function DashboardPage() {
  const transactions = useTransactionStore((s) => s.transactions)
  const products = useInventoryStore((s) => s.products)
  const categories = useInventoryStore((s) => s.categories)

  const today = new Date().toDateString()
  const todayTxns = transactions.filter(
    (t) => new Date(t.createdAt).toDateString() === today && t.status === 'completed'
  )
  const todaySales = todayTxns.reduce((sum, t) => sum + t.total, 0)
  const todayItemsSold = todayTxns.reduce((sum, t) => sum + t.items.reduce((s, i) => s + i.quantity, 0), 0)
  const lowStock = products.filter((p) => p.stock <= p.reorderPoint)

  const salesData = useMemo(() => generateSalesData(), [])

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back — here&apos;s what&apos;s happening today</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Today's Sales"
          value={formatCurrency(todaySales)}
          icon={DollarSign}
          iconColor="text-green-600"
          trend={12}
        />
        <StatCard
          title="Transactions"
          value={todayTxns.length}
          subtitle="completed today"
          icon={ShoppingCart}
          iconColor="text-blue-600"
          trend={5}
        />
        <StatCard
          title="Items Sold"
          value={todayItemsSold}
          subtitle="units today"
          icon={Package}
          iconColor="text-purple-600"
          trend={-3}
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStock.length}
          subtitle="products below reorder"
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
      </div>

      {/* Sales chart + Low stock */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp size={18} className="text-blue-600" />
              Sales Trend — Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₵${v}`} />
                <Tooltip formatter={(v) => [`₵${v}`, 'Sales']} />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563EB' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle size={18} className="text-red-500" />
              Low Stock ({lowStock.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-muted-foreground text-sm">All products are well-stocked!</p>
            ) : (
              <ul className="space-y-3">
                {lowStock.slice(0, 6).map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium leading-none">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{getCategoryName(p.categoryId)}</p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {p.stock} left
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left pb-2 font-medium">Receipt</th>
                  <th className="text-left pb-2 font-medium">Cashier</th>
                  <th className="text-left pb-2 font-medium">Time</th>
                  <th className="text-left pb-2 font-medium">Payment</th>
                  <th className="text-right pb-2 font-medium">Total</th>
                  <th className="text-right pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((t) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="py-2.5 font-mono text-xs">{t.receiptNumber}</td>
                    <td className="py-2.5">{t.cashierName}</td>
                    <td className="py-2.5 text-muted-foreground">{formatDate(t.createdAt)}</td>
                    <td className="py-2.5 capitalize">{t.paymentMethod.replace('_', ' ')}</td>
                    <td className="py-2.5 text-right font-semibold">{formatCurrency(t.total)}</td>
                    <td className="py-2.5 text-right">
                      <Badge variant={t.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
