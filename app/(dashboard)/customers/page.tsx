'use client'
import { useState } from 'react'
import { useCustomerStore } from '@/lib/store/customerStore'
import { useTransactionStore } from '@/lib/store/transactionStore'
import { Customer } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Edit, Trash2, Users, Star, Wallet, ShoppingBag, Phone, Mail, MapPin } from 'lucide-react'
import { toast } from 'sonner'

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomerStore()
  const { transactions } = useTransactionStore()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [viewing, setViewing] = useState<Customer | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' })

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  )

  const openNew = () => { setEditing(null); setForm({ name: '', email: '', phone: '', address: '', notes: '' }); setOpen(true) }
  const openEdit = (c: Customer) => { setEditing(c); setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address ?? '', notes: c.notes ?? '' }); setOpen(true) }

  const save = () => {
    if (!form.name || !form.phone) return
    if (editing) {
      updateCustomer({ ...editing, ...form })
      toast.success('Customer updated')
    } else {
      addCustomer({ id: `cust-${Date.now()}`, ...form, loyaltyPoints: 0, walletBalance: 0, totalSpent: 0, totalOrders: 0, createdAt: new Date().toISOString() })
      toast.success('Customer added')
    }
    setOpen(false)
  }

  const customerTxns = (id: string) => transactions.filter((t) => t.customerId === id)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users size={22} /> Customers</h1>
          <p className="text-muted-foreground text-sm">{customers.length} registered customers</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Add Customer</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-blue-600' },
          { label: 'Total Loyalty Pts', value: customers.reduce((s, c) => s + c.loyaltyPoints, 0).toLocaleString(), icon: Star, color: 'text-yellow-500' },
          { label: 'Wallet Balances', value: formatCurrency(customers.reduce((s, c) => s + c.walletBalance, 0)), icon: Wallet, color: 'text-green-600' },
          { label: 'Total Revenue', value: formatCurrency(customers.reduce((s, c) => s + c.totalSpent, 0)), icon: ShoppingBag, color: 'text-purple-600' },
        ].map((s) => (
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
        <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Customer cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewing(c)}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-lg">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.totalOrders} orders · {formatCurrency(c.totalSpent)} spent</p>
                  </div>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Edit size={14} /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => { deleteCustomer(c.id); toast.success('Customer deleted') }}><Trash2 size={14} /></Button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                {c.phone && <div className="flex items-center gap-2"><Phone size={13} />{c.phone}</div>}
                {c.email && <div className="flex items-center gap-2"><Mail size={13} />{c.email}</div>}
              </div>
              <div className="flex gap-3 pt-1 border-t">
                <div className="flex items-center gap-1 text-xs"><Star size={12} className="text-yellow-500" />{c.loyaltyPoints} pts</div>
                <div className="flex items-center gap-1 text-xs"><Wallet size={12} className="text-green-600" />{formatCurrency(c.walletBalance)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground">No customers found</div>
        )}
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Customer' : 'Add Customer'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {(['name','email','phone','address','notes'] as const).map((field) => (
              <div key={field} className="space-y-1">
                <Label className="capitalize">{field}</Label>
                <Input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={field === 'email' ? 'email@example.com' : ''} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save' : 'Add Customer'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      {viewing && (
        <Dialog open onOpenChange={() => setViewing(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">{viewing.name.charAt(0)}</div>
                {viewing.name}
              </DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="info">
              <TabsList><TabsTrigger value="info">Info</TabsTrigger><TabsTrigger value="history">Purchase History</TabsTrigger></TabsList>
              <TabsContent value="info" className="space-y-3 pt-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{viewing.phone}</p></div>
                  <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{viewing.email || '—'}</p></div>
                  <div><p className="text-muted-foreground text-xs">Total Spent</p><p className="font-bold text-green-700">{formatCurrency(viewing.totalSpent)}</p></div>
                  <div><p className="text-muted-foreground text-xs">Orders</p><p className="font-bold">{viewing.totalOrders}</p></div>
                  <div><p className="text-muted-foreground text-xs">Loyalty Points</p><p className="font-bold text-yellow-600">{viewing.loyaltyPoints} pts</p></div>
                  <div><p className="text-muted-foreground text-xs">Wallet Balance</p><p className="font-bold text-blue-600">{formatCurrency(viewing.walletBalance)}</p></div>
                </div>
                {viewing.address && <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin size={13} />{viewing.address}</p>}
                {viewing.notes && <p className="text-sm italic text-muted-foreground">"{viewing.notes}"</p>}
                <p className="text-xs text-muted-foreground">Member since {formatDate(viewing.createdAt)}</p>
              </TabsContent>
              <TabsContent value="history" className="pt-3">
                {customerTxns(viewing.id).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No transactions found for this customer.</p>
                ) : (
                  <div className="space-y-2">
                    {customerTxns(viewing.id).map((t) => (
                      <div key={t.id} className="flex items-center justify-between text-sm border rounded-lg px-3 py-2">
                        <div>
                          <p className="font-medium">{t.receiptNumber}</p>
                          <p className="text-xs text-muted-foreground">{t.createdAt.slice(0, 10)} · {t.paymentMethod.replace('_', ' ')}</p>
                        </div>
                        <span className="font-semibold">{formatCurrency(t.total)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
