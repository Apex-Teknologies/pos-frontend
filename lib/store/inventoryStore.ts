'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, Category, Supplier, PurchaseOrder } from '@/lib/types'
import { mockProducts, mockCategories, mockSuppliers } from '@/lib/mock/products'

interface InventoryState {
  products: Product[]
  categories: Category[]
  suppliers: Supplier[]
  purchaseOrders: PurchaseOrder[]
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  addCategory: (category: Category) => void
  updateCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  addSupplier: (supplier: Supplier) => void
  updateSupplier: (supplier: Supplier) => void
  deleteSupplier: (id: string) => void
  addPurchaseOrder: (po: PurchaseOrder) => void
  receivePurchaseOrder: (id: string) => void
  adjustStock: (productId: string, delta: number) => void
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      categories: mockCategories,
      suppliers: mockSuppliers,
      purchaseOrders: [],
      addProduct: (product) => set({ products: [...get().products, product] }),
      updateProduct: (product) =>
        set({ products: get().products.map((p) => (p.id === product.id ? product : p)) }),
      deleteProduct: (id) =>
        set({ products: get().products.filter((p) => p.id !== id) }),
      addCategory: (category) => set({ categories: [...get().categories, category] }),
      updateCategory: (category) =>
        set({ categories: get().categories.map((c) => (c.id === category.id ? category : c)) }),
      deleteCategory: (id) =>
        set({ categories: get().categories.filter((c) => c.id !== id) }),
      addSupplier: (supplier) => set({ suppliers: [...get().suppliers, supplier] }),
      updateSupplier: (supplier) =>
        set({ suppliers: get().suppliers.map((s) => (s.id === supplier.id ? supplier : s)) }),
      deleteSupplier: (id) =>
        set({ suppliers: get().suppliers.filter((s) => s.id !== id) }),
      addPurchaseOrder: (po) => set({ purchaseOrders: [...get().purchaseOrders, po] }),
      receivePurchaseOrder: (id) => {
        const po = get().purchaseOrders.find((p) => p.id === id)
        if (!po || po.status === 'received') return
        const updatedProducts = get().products.map((prod) => {
          const lineItem = po.items.find((i) => i.productId === prod.id)
          if (lineItem) return { ...prod, stock: prod.stock + lineItem.quantity }
          return prod
        })
        set({
          products: updatedProducts,
          purchaseOrders: get().purchaseOrders.map((p) =>
            p.id === id ? { ...p, status: 'received', receivedAt: new Date().toISOString() } : p
          ),
        })
      },
      adjustStock: (productId, delta) =>
        set({
          products: get().products.map((p) =>
            p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
          ),
        }),
    }),
    { name: 'apextek-inventory' }
  )
)
