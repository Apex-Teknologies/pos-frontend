'use client'
import { useState } from 'react'
import { useInventoryStore } from '@/lib/store/inventoryStore'
import { Category } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Edit, Trash2, Tag } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function CategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useInventoryStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const openNew = () => { setEditing(null); setName(''); setDescription(''); setOpen(true) }
  const openEdit = (c: Category) => { setEditing(c); setName(c.name); setDescription(c.description ?? ''); setOpen(true) }

  const save = () => {
    if (!name.trim()) return
    if (editing) {
      updateCategory({ ...editing, name, description })
    } else {
      addCategory({ id: `cat-${Date.now()}`, name, description, color: '#3B82F6' })
    }
    setOpen(false)
  }

  const productCount = (id: string) => products.filter((p) => p.categoryId === id).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Tag size={22} /> Categories</h1>
          <p className="text-muted-foreground text-sm">{categories.length} categories</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus size={16} /> Add Category</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: c.color ?? '#3B82F6' }}
                >
                  {c.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{productCount(c.id)} products</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Edit size={15} /></Button>
                <Button
                  variant="ghost" size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => deleteCategory(c.id)}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Electronics" />
            </div>
            <div className="space-y-1">
              <Label>Description</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
            </div>
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
