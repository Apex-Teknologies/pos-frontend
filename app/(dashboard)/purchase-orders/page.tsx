'use client'
import { useState } from 'react'
import { useInventoryStore } from '@/lib/store/inventoryStore'
import { useBranchStore } from '@/lib/store/branchStore'
import { PurchaseOrder, PurchaseOrderItem } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, ClipboardList, CheckCircle, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

export default function PurchaseOrdersPage() {
  const { suppliers, products, purchaseOrders, addPurchaseOrder, receivePurchaseOrder } = useInventoryStore()
  const { currentBranch } = useBranchStore()
  const [open, setOpen] = useState(false)
  const [supplierId, setSupplierId] = useState('')
  const [items, setItems] = useState<PurchaseOrderItem[]>([])
  const [newProductId, setNewProductId] = useState('')
  const [newQty, setNewQty] = useState(1)
  const [newCost, setNewCost] = useState(0)
  const [notes, setNotes] = useState('')

  const addLine = () => {
    if (!newProductId || newQty <= 0) return
    setItems([...items, { productId: newProductId, quantity: newQty, unitCost: newCost }])
    setNewProductId(''); setNewQty(1); setNewCost(0)
  }

  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0)

  const submit = () => {
    if (!supplierId || items.length === 0) return
    addPurchaseOrder({
      id: `po-${Date.now()}`,
      supplierId,
      branchId: currentBranch.id,
      items,
      status: 'ordered',
      totalAmount,
      createdAt: new Date().toISOString(),
      notes,
    })
    setOpen(false); setSupplierId(''); setItems([]); setNotes('')
  }

  const statusBadge = (s: string) => {
    if (s === 'received') return <Badge className="bg-green-100 text-green-700">Received</Badge>
    if (s === 'ordered') return <Badge className="bg-blue-100 text-blue-700">Ordered</Badge>
    return <Badge variant="outline">Draft</Badge>
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardList size={22} /> Purchase Orders</h1>
          <p className="text-muted-foreground text-sm">{purchaseOrders.length} orders</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2"><Plus size={16} /> Create PO</Button>
      </div>

      {purchaseOrders.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No purchase orders yet. Create one to replenish stock.
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {purchaseOrders.map((po) => {
          const supplier = suppliers.find((s) => s.id === po.supplierId)
          return (
            <Card key={po.id}>
              <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{supplier?.name ?? 'Unknown Supplier'}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(po.createdAt)} · {po.items.length} line items</p>
                  {po.notes && <p className="text-xs text-muted-foreground mt-1">{po.notes}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(po.totalAmount)}</p>
                    {statusBadge(po.status)}
                  </div>
                  {po.status !== 'received' && (
                    <Button
                      size="sm" variant="outline"
                      className="gap-1 text-green-700 border-green-300 hover:bg-green-50"
                      onClick={() => receivePurchaseOrder(po.id)}
                    >
                      <CheckCircle size={15} /> Mark Received
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Supplier *</Label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full h-10 border rounded-md px-3 text-sm bg-white"
              >
                <option value="">Select supplier</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="border rounded-lg p-3 space-y-3">
              <p className="font-medium text-sm">Line Items</p>
              {items.map((item, i) => {
                const prod = products.find((p) => p.id === item.productId)
                return (
                  <div key={i} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded">
                    <span>{prod?.name}</span>
                    <span>{item.quantity} × {formatCurrency(item.unitCost)}</span>
                    <Button
                      variant="ghost" size="icon"
                      onClick={() => setItems(items.filter((_, j) => j !== i))}
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                )
              })}

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3">
                  <select
                    value={newProductId}
                    onChange={(e) => setNewProductId(e.target.value)}
                    className="w-full h-10 border rounded-md px-3 text-sm bg-white"
                  >
                    <option value="">Select product</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <Input type="number" placeholder="Qty" value={newQty} onChange={(e) => setNewQty(+e.target.value)} min={1} />
                <Input type="number" placeholder="Unit Cost" value={newCost} onChange={(e) => setNewCost(+e.target.value)} min={0} step={0.01} />
                <Button type="button" onClick={addLine} variant="outline">Add</Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label>Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
            </div>

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={!supplierId || items.length === 0}>Submit Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
