'use client'
import { useState } from 'react'
import { useInvoiceStore } from '@/lib/store/invoiceStore'
import { Invoice } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { FileText, Plus, Search, CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

const statusColor: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
}

const statusIcon: Record<string, React.ReactNode> = {
  draft: <FileText size={12} />,
  sent: <Clock size={12} />,
  paid: <CheckCircle size={12} />,
  overdue: <AlertCircle size={12} />,
}

export default function InvoicesPage() {
  const { invoices, addInvoice, markPaid } = useInvoiceStore()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [viewing, setViewing] = useState<Invoice | null>(null)
  const [form, setForm] = useState({ customerName: '', customerEmail: '', dueDate: '', notes: '' })
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }])

  const filtered = invoices.filter(
    (inv) =>
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  )

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
  const taxAmount = +(subtotal * 0.15).toFixed(2)
  const total = subtotal + taxAmount

  const addItem = () => setItems([...items, { description: '', quantity: 1, unitPrice: 0 }])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const updateItem = (i: number, field: string, val: string | number) =>
    setItems(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  const save = () => {
    if (!form.customerName || items.every((i) => !i.description)) return
    const inv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      customerName: form.customerName,
      customerEmail: form.customerEmail || undefined,
      items: items.map((i) => ({ ...i, total: i.quantity * i.unitPrice })),
      subtotal,
      taxAmount,
      discountAmount: 0,
      total,
      dueDate: form.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      notes: form.notes || undefined,
    }
    addInvoice(inv)
    toast.success('Invoice created')
    setOpen(false)
    setForm({ customerName: '', customerEmail: '', dueDate: '', notes: '' })
    setItems([{ description: '', quantity: 1, unitPrice: 0 }])
  }

  const stats = [
    { label: 'Total Invoices', value: invoices.length, icon: FileText, color: 'text-blue-600' },
    { label: 'Outstanding', value: formatCurrency(invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.total, 0)), icon: DollarSign, color: 'text-yellow-600' },
    { label: 'Paid', value: formatCurrency(invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)), icon: CheckCircle, color: 'text-green-600' },
    { label: 'Overdue', value: invoices.filter(i => i.status === 'overdue').length, icon: AlertCircle, color: 'text-red-600' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><FileText size={22} /> Invoices</h1>
          <p className="text-muted-foreground text-sm">{invoices.length} invoices total</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2"><Plus size={16} /> New Invoice</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-slate-100 ${s.color}`}><s.icon size={20} /></div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-bold text-lg leading-tight">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Invoice list */}
      <div className="space-y-2">
        {filtered.map((inv) => (
          <Card key={inv.id} className="hover:shadow-sm transition cursor-pointer" onClick={() => setViewing(inv)}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-sm">{inv.invoiceNumber}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[inv.status]}`}>
                    {statusIcon[inv.status]} {inv.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{inv.customerName}</p>
                <p className="text-xs text-muted-foreground">Due: {formatDate(inv.dueDate)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(inv.total)}</p>
                <p className="text-xs text-muted-foreground">{inv.items.length} item{inv.items.length !== 1 ? 's' : ''}</p>
              </div>
              {inv.status !== 'paid' && (
                <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); markPaid(inv.id); toast.success('Invoice marked as paid') }}>
                  Mark Paid
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <div className="py-16 text-center text-muted-foreground">No invoices found</div>}
      </div>

      {/* Create dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Customer Name *</Label>
                <Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Customer Email</Label>
                <Input value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} type="email" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Due Date</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Line Items</Label>
                <Button type="button" size="sm" variant="outline" onClick={addItem}>+ Add Line</Button>
              </div>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="grid grid-cols-[1fr_60px_80px_24px] gap-2 items-center">
                    <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} />
                    <Input type="number" placeholder="Qty" min={1} value={item.quantity} onChange={(e) => updateItem(i, 'quantity', +e.target.value)} />
                    <Input type="number" placeholder="Price" min={0} value={item.unitPrice} onChange={(e) => updateItem(i, 'unitPrice', +e.target.value)} />
                    <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 text-lg leading-none">×</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-3 text-sm space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Tax (15%)</span><span>{formatCurrency(taxAmount)}</span></div>
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
            <div className="space-y-1">
              <Label>Notes</Label>
              <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View dialog */}
      {viewing && (
        <Dialog open onOpenChange={() => setViewing(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{viewing.invoiceNumber}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 text-sm">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{viewing.customerName}</p>
                  {viewing.customerEmail && <p className="text-muted-foreground">{viewing.customerEmail}</p>}
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[viewing.status]}`}>
                  {statusIcon[viewing.status]} {viewing.status}
                </span>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-2 font-medium">Description</th>
                      <th className="text-right p-2 font-medium">Qty</th>
                      <th className="text-right p-2 font-medium">Price</th>
                      <th className="text-right p-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewing.items.map((item, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{item.description}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-2 text-right">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(viewing.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(viewing.taxAmount)}</span></div>
                {viewing.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCurrency(viewing.discountAmount)}</span></div>}
                <div className="flex justify-between font-bold text-base border-t pt-1"><span>Total</span><span>{formatCurrency(viewing.total)}</span></div>
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>Created: {formatDate(viewing.createdAt)}</span>
                <span>Due: {formatDate(viewing.dueDate)}</span>
              </div>
              {viewing.notes && <p className="text-sm italic text-muted-foreground">"{viewing.notes}"</p>}
            </div>
            <DialogFooter>
              {viewing.status !== 'paid' && (
                <Button onClick={() => { markPaid(viewing.id); toast.success('Marked as paid'); setViewing(null) }}>
                  Mark as Paid
                </Button>
              )}
              <Button variant="outline" onClick={() => window.print()}>Print</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
