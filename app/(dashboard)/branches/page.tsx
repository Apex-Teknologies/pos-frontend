'use client'
import { useState } from 'react'
import { useBranchStore } from '@/lib/store/branchStore'
import { Branch } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Building2, Plus, Edit, Trash2, MapPin, Phone } from 'lucide-react'
import { toast } from 'sonner'

export default function BranchesPage() {
  const { branches, currentBranch, setBranch, addBranch, updateBranch, deleteBranch } = useBranchStore() as any
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [form, setForm] = useState({ name: '', address: '', phone: '', managerId: '' })

  const branchList: Branch[] = branches ?? []

  const openNew = () => { setEditing(null); setForm({ name: '', address: '', phone: '', managerId: '' }); setOpen(true) }
  const openEdit = (b: Branch) => { setEditing(b); setForm({ name: b.name, address: b.address, phone: b.phone, managerId: b.managerId ?? '' }); setOpen(true) }

  const save = () => {
    if (!form.name) return
    if (editing) {
      updateBranch?.({ ...editing, ...form })
      toast.success('Branch updated')
    } else {
      addBranch?.({ id: `branch-${Date.now()}`, businessId: 'biz-1', ...form })
      toast.success('Branch added')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Building2 size={22} /> Branches</h1>
          <p className="text-muted-foreground text-sm">{branchList.length} branch{branchList.length !== 1 ? 'es' : ''} · Multi-location management</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Add Branch</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branchList.map((b: Branch) => (
          <Card key={b.id} className={`transition-shadow hover:shadow-md ${currentBranch?.id === b.id ? 'ring-2 ring-blue-500' : ''}`}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{b.name}</p>
                  {currentBranch?.id === b.id && <span className="text-xs text-blue-600 font-medium">● Active branch</span>}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Edit size={14} /></Button>
                  {branchList.length > 1 && (
                    <Button
                      variant="ghost" size="icon" className="text-red-500 hover:bg-red-50"
                      onClick={() => { deleteBranch?.(b.id); toast.success('Branch deleted') }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                {b.address && <div className="flex items-center gap-2"><MapPin size={13} />{b.address}</div>}
                {b.phone && <div className="flex items-center gap-2"><Phone size={13} />{b.phone}</div>}
              </div>
              {currentBranch?.id !== b.id && (
                <Button variant="outline" size="sm" onClick={() => setBranch(b)}>Switch to this branch</Button>
              )}
            </CardContent>
          </Card>
        ))}
        {branchList.length === 0 && <div className="col-span-full py-16 text-center text-muted-foreground">No branches yet</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Branch' : 'Add Branch'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {(['name', 'address', 'phone'] as const).map((field) => (
              <div key={field} className="space-y-1">
                <Label className="capitalize">{field}</Label>
                <Input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save' : 'Add Branch'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
