'use client'
import { useState, useMemo } from 'react'
import { useTransactionStore } from '@/lib/store/transactionStore'
import { useInventoryStore } from '@/lib/store/inventoryStore'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, ShoppingBag, CreditCard, Package, Download, BarChart2 } from 'lucide-react'

type Range = '7d' | '30d' | 'all'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ReportsPage() {
  const { transactions } = useTransactionStore()
  const { products } = useInventoryStore()
  const [range, setRange] = useState<Range>('7d')

  const filtered = useMemo(() => {
    if (range === 'all') return transactions
    const days = range === '7d' ? 7 : 30
    const cutoff = new Date(Date.now() - days * 86400000).toISOString()
    return transactions.filter((t) => t.createdAt >= cutoff && t.status === 'completed')
  }, [transactions, range])

  // Daily sales chart data
  const dailySales = useMemo(() => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 14
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(Date.now() - (days - 1 - i) * 86400000)
      const label = d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })
      const dayTxns = filtered.filter((t) => new Date(t.createdAt).toDateString() === d.toDateString())
      return {
        date: label,
        sales: dayTxns.reduce((s, t) => s + t.total, 0),
        orders: dayTxns.length,
      }
    })
  }, [filtered, range])

  // Payment method breakdown
  const paymentBreakdown = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.forEach((t) => { map[t.paymentMethod] = (map[t.paymentMethod] ?? 0) + t.total })
    return Object.entries(map).map(([name, value]) => ({ name: name.replace('_', ' '), value: Math.round(value) }))
  }, [filtered])

  // Top products
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {}
    filtered.forEach((t) =>
      t.items.forEach((item) => {
        const id = item.product.id
        if (!map[id]) map[id] = { name: item.product.name, qty: 0, revenue: 0 }
        map[id].qty += item.quantity
        map[id].revenue += item.product.price * item.quantity
      })
    )
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [filtered])

  const totalRevenue = filtered.reduce((s, t) => s + t.total, 0)
  const totalOrders = filtered.length
  const avgOrder = totalOrders ? totalRevenue / totalOrders : 0
  const lowStock = products.filter((p) => p.stock <= p.reorderPoint).length

  const exportCSV = () => {
    const rows = [
      ['Receipt', 'Date', 'Cashier', 'Items', 'Total', 'Payment', 'Status'],
      ...filtered.map((t) => [
        t.receiptNumber, t.createdAt.slice(0, 10), t.cashierName,
        t.items.length, t.total.toFixed(2), t.paymentMethod, t.status,
      ]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `apextek-report-${range}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart2 size={22} /> Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm">Sales performance and business insights</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', 'all'] as Range[]).map((r) => (
            <Button key={r} size="sm" variant={range === r ? 'default' : 'outline'} onClick={() => setRange(r)}>
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'All Time'}
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={exportCSV} className="gap-1.5">
            <Download size={14} /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-green-600 bg-green-50' },
          { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
          { label: 'Avg Order Value', value: formatCurrency(avgOrder), icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
          { label: 'Low Stock Items', value: lowStock, icon: Package, color: 'text-red-600 bg-red-50' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${s.color}`}><s.icon size={20} /></div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-bold text-lg leading-tight">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales chart */}
      <Card>
        <CardHeader><CardTitle className="text-base">Daily Revenue</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailySales} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₵${v}`} />
              <Tooltip formatter={(v) => [formatCurrency(v as number), 'Revenue']} />
              <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orders trend */}
        <Card>
          <CardHeader><CardTitle className="text-base">Orders Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment method pie */}
        <Card>
          <CardHeader><CardTitle className="text-base">Payment Methods</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={paymentBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {paymentBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip formatter={(v) => [formatCurrency(v as number)]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top products */}
      <Card>
        <CardHeader><CardTitle className="text-base">Top Selling Products</CardTitle></CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">No sales data for this period</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-6 text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.qty} units sold</p>
                  </div>
                  <span className="font-semibold text-sm">{formatCurrency(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
