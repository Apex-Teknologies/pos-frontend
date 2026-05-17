'use client'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { User, Role } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Users, Plus, Edit, Trash2, Shield, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

const roleBadge: Record<Role, string> = {
  admin: 'bg-red-100 text-red-700',
  manager: 'bg-blue-100 text-blue-700',
  cashier: 'bg-green-100 text-green-700',
}

export default function UsersPage() {
  const { users, user: currentUser, addUser, updateUser, deleteUser } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [showPin, setShowPin] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'cashier' as Role, pin: '', branchId: 'branch-1' })

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', email: '', role: 'cashier', pin: '', branchId: 'branch-1' })
    setOpen(true)
  }
  const openEdit = (u: User) => {
    setEditing(u)
    setForm({ name: u.name, email: u.email, role: u.role, pin: u.pin ?? '', branchId: u.branchId })
    setOpen(true)
  }

  const save = () => {
    if (!form.name || !form.email) return toast.error('Name and email are required')
    if (editing) {
      updateUser?.({ ...editing, ...form })
      toast.success('User updated')
    } else {
      addUser?.({ id: `user-${Date.now()}`, ...form })
      toast.success('User added')
    }
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users size={22} /> User Management</h1>
          <p className="text-muted-foreground text-sm">{users.length} users · Role-based access control</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Add User</Button>
      </div>

      {/* RBAC legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {([
          { role: 'admin', perms: ['Full access', 'Business settings', 'User management', 'All reports'] },
          { role: 'manager', perms: ['POS + Inventory', 'Purchase orders', 'Transactions', 'Reports'] },
          { role: 'cashier', perms: ['POS checkout only', 'Own transactions', 'No settings access'] },
        ] as const).map(({ role, perms }) => (
          <Card key={role} className="border-2 border-slate-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} />
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${roleBadge[role]}`}>{role}</span>
              </div>
              <ul className="space-y-1">
                {perms.map((p) => <li key={p} className="text-xs text-muted-foreground flex items-center gap-1.5">✓ {p}</li>)}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users list */}
      <div className="space-y-2">
        {users.map((u: User) => (
          <Card key={u.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{u.name}</p>
                  {currentUser?.id === u.id && <Badge variant="outline" className="text-xs">You</Badge>}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${roleBadge[u.role]}`}>{u.role}</span>
                </div>
                <p className="text-sm text-muted-foreground">{u.email}</p>
                {u.pin && <p className="text-xs text-muted-foreground">PIN: {'•'.repeat(u.pin.length)}</p>}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Edit size={14} /></Button>
                {currentUser?.id !== u.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50"
                    onClick={() => { deleteUser?.(u.id); toast.success('User deleted') }}
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit User' : 'Add User'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
                className="w-full h-10 border rounded-md px-3 text-sm bg-white"
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>PIN (4-digit)</Label>
              <div className="relative">
                <Input
                  type={showPin ? 'text' : 'password'}
                  maxLength={4}
                  value={form.pin}
                  onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/, '') })}
                  placeholder="Quick login PIN"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save' : 'Add User'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
