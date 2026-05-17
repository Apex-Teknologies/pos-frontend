'use client'
import { useState } from 'react'
import { useInventoryStore } from '@/lib/store/inventoryStore'
import { Supplier } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Trash2, Truck, Phone, Mail } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'

const emptySupplier: Omit<Supplier, 'id'> = {
  name: '', email: '', phone: '', address: '', contactPerson: '',
}

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useInventoryStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState(emptySupplier)

  const openNew = () => { setEditing(null); setForm(emptySupplier); setOpen(true) }
  const openEdit = (s: Supplier) => { setEditing(s); setForm(s); setOpen(true) }

  const save = () => {
    if (!form.name.trim()) return
    if (editing) {
      updateSupplier({ ...editing, ...form })
    } else {
      addSupplier({ id: `sup-${Date.now()}`, ...form })
    }
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Truck size={22} /> Suppliers</h1>
          <p className="text-muted-foreground text-sm">{suppliers.length} suppliers</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Add Supplier</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.contactPerson}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Edit size={15} /></Button>
                  <Button
                    variant="ghost" size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteSupplier(s.id)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Phone size={13} /> {s.phone}</div>
                <div className="flex items-center gap-2"><Mail size={13} /> {s.email}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {(['name', 'contactPerson', 'email', 'phone', 'address'] as const).map((field) => (
              <div key={field} className={`space-y-1 ${field === 'address' ? 'col-span-2' : ''}`}>
                <Label className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
                <Input
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
