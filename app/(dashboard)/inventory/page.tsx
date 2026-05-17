'use client'
import { useState } from 'react'
import { useInventoryStore } from '@/lib/store/inventoryStore'
import { formatCurrency } from '@/lib/utils'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react'
import { toast } from 'sonner'
import ProductFormDialog from '@/components/inventory/ProductFormDialog'

export default function InventoryPage() {
  const { products, categories, deleteProduct } = useInventoryStore()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || p.categoryId === catFilter
    return matchSearch && matchCat
  })

  const getCatName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—'

  const stockBadge = (p: Product) => {
    if (p.stock === 0) return <Badge variant="destructive">Out of Stock</Badge>
    if (p.stock <= p.reorderPoint) return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Low Stock</Badge>
    return <Badge variant="outline" className="text-green-700 border-green-300">In Stock</Badge>
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package size={22} /> Products
          </h1>
          <p className="text-muted-foreground text-sm">{products.length} total products</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setShowForm(true) }} className="gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={catFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCatFilter('all')}
          >
            All
          </Button>
          {categories.map((c) => (
            <Button
              key={c.id}
              variant={catFilter === c.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCatFilter(c.id)}
            >
              {c.name}
            </Button>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Price</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Cost</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Stock</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-medium">{p.name}</p>
                      {p.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{p.description}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{p.sku}</td>
                    <td className="py-3 px-4">{getCatName(p.categoryId)}</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrency(p.price)}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{formatCurrency(p.cost)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={p.stock <= p.reorderPoint ? 'text-red-600 font-semibold' : ''}>
                        {p.stock} {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">{stockBadge(p)}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => { setEditingProduct(p); setShowForm(true) }}
                        >
                          <Edit size={15} />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => { deleteProduct(p.id); toast.success(`${p.name} deleted`) }}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ProductFormDialog
        open={showForm}
        onClose={() => setShowForm(false)}
        product={editingProduct}
      />
    </div>
  )
}
