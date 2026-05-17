'use client'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useInventoryStore } from '@/lib/store/inventoryStore'
import { Product } from '@/lib/types'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  supplierId: z.string().optional(),
  price: z.number().min(0),
  cost: z.number().min(0),
  stock: z.number().min(0),
  reorderPoint: z.number().min(0),
  unit: z.string().min(1),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
  product: Product | null
}

export default function ProductFormDialog({ open, onClose, product }: Props) {
  const { categories, suppliers, addProduct, updateProduct } = useInventoryStore()

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { unit: 'pcs', reorderPoint: 10 },
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        categoryId: product.categoryId,
        supplierId: product.supplierId,
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        reorderPoint: product.reorderPoint,
        unit: product.unit,
        description: product.description,
      })
    } else {
      reset({ unit: 'pcs', reorderPoint: 10 })
    }
  }, [product, reset, open])

  const onSubmit = (data: FormData) => {
    if (product) {
      updateProduct({ ...product, ...data, isActive: true })
    } else {
      addProduct({
        id: `prod-${Date.now()}`,
        isActive: true,
        ...data,
      } as Product)
    }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <Label>Product Name *</Label>
              <Input {...register('name')} placeholder="e.g. USB-C Cable" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>SKU *</Label>
              <Input {...register('sku')} placeholder="e.g. ELEC-0001" />
              {errors.sku && <p className="text-xs text-red-500">{errors.sku.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Barcode</Label>
              <Input {...register('barcode')} placeholder="e.g. 600123..." />
            </div>
            <div className="space-y-1">
              <Label>Category *</Label>
              <select
                defaultValue={product?.categoryId ?? ''}
                onChange={(e) => setValue('categoryId', e.target.value)}
                className="w-full h-10 border rounded-md px-3 text-sm bg-white"
              >
                <option value="">Select category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Supplier</Label>
              <select
                defaultValue={product?.supplierId ?? ''}
                onChange={(e) => setValue('supplierId', e.target.value)}
                className="w-full h-10 border rounded-md px-3 text-sm bg-white"
              >
                <option value="">Select supplier (optional)</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Selling Price (₵) *</Label>
              <Input {...register('price', { valueAsNumber: true })} type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="space-y-1">
              <Label>Cost Price (₵)</Label>
              <Input {...register('cost', { valueAsNumber: true })} type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="space-y-1">
              <Label>Stock Qty *</Label>
              <Input {...register('stock', { valueAsNumber: true })} type="number" placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label>Reorder Point</Label>
              <Input {...register('reorderPoint', { valueAsNumber: true })} type="number" placeholder="10" />
            </div>
            <div className="space-y-1">
              <Label>Unit</Label>
              <Input {...register('unit')} placeholder="pcs / kg / bottles" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Description</Label>
              <Textarea {...register('description')} placeholder="Optional product description" rows={2} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{product ? 'Save Changes' : 'Add Product'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
