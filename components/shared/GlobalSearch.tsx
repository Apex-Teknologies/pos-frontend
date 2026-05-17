'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useInventoryStore } from '@/lib/store/inventoryStore'
import { useCustomerStore } from '@/lib/store/customerStore'
import { useTransactionStore } from '@/lib/store/transactionStore'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, Package, Users, Receipt, BarChart2, Settings, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

interface SearchResult {
  id: string
  type: 'product' | 'customer' | 'transaction' | 'page'
  label: string
  subtitle?: string
  href: string
  icon: React.ReactNode
}

const PAGES: SearchResult[] = [
  { id: 'dashboard', type: 'page', label: 'Dashboard', href: '/', icon: <BarChart2 size={16} /> },
  { id: 'pos', type: 'page', label: 'POS / Checkout', href: '/pos', icon: <Receipt size={16} /> },
  { id: 'inventory', type: 'page', label: 'Inventory', href: '/inventory', icon: <Package size={16} /> },
  { id: 'customers', type: 'page', label: 'Customers', href: '/customers', icon: <Users size={16} /> },
  { id: 'reports', type: 'page', label: 'Reports', href: '/reports', icon: <BarChart2 size={16} /> },
  { id: 'invoices', type: 'page', label: 'Invoices', href: '/invoices', icon: <FileText size={16} /> },
  { id: 'settings', type: 'page', label: 'Settings', href: '/settings', icon: <Settings size={16} /> },
]

export default function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const products = useInventoryStore((s) => s.products)
  const customers = useCustomerStore((s) => s.customers)
  const transactions = useTransactionStore((s) => s.transactions)

  useEffect(() => {
    if (open) { setQuery(''); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  const results: SearchResult[] = query.length < 2 ? PAGES : [
    ...products
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 4)
      .map((p) => ({ id: p.id, type: 'product' as const, label: p.name, subtitle: `${p.sku} · ${formatCurrency(p.price)} · ${p.stock} in stock`, href: `/inventory`, icon: <Package size={16} /> })),
    ...customers
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query))
      .slice(0, 3)
      .map((c) => ({ id: c.id, type: 'customer' as const, label: c.name, subtitle: c.phone, href: `/customers`, icon: <Users size={16} /> })),
    ...transactions
      .filter((t) => t.receiptNumber.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map((t) => ({ id: t.id, type: 'transaction' as const, label: t.receiptNumber, subtitle: `${formatCurrency(t.total)} · ${t.cashierName}`, href: `/transactions`, icon: <Receipt size={16} /> })),
    ...PAGES.filter((p) => p.label.toLowerCase().includes(query.toLowerCase())),
  ]

  const navigate = (r: SearchResult) => {
    router.push(r.href)
    onClose()
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, results.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)) }
      if (e.key === 'Enter' && results[selected]) navigate(results[selected])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, results, selected])

  const typeLabel: Record<string, string> = { product: 'Product', customer: 'Customer', transaction: 'Transaction', page: 'Page' }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
            placeholder="Search products, customers, transactions..."
            className="border-0 shadow-none focus-visible:ring-0 p-0 h-auto text-base"
          />
          <kbd className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No results for "{query}"</p>
          )}
          {results.map((r, i) => (
            <button
              key={r.id}
              className={cn('w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors', i === selected && 'bg-slate-100')}
              onClick={() => navigate(r)}
              onMouseEnter={() => setSelected(i)}
            >
              <div className="text-muted-foreground">{r.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{r.label}</p>
                {r.subtitle && <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>}
              </div>
              <span className="text-xs text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded">{typeLabel[r.type]}</span>
            </button>
          ))}
        </div>
        <div className="px-4 py-2 border-t flex items-center gap-3 text-xs text-muted-foreground">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>ESC close</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
