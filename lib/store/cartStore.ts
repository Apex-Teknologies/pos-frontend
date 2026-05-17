'use client'
import { create } from 'zustand'
import { CartItem, Product } from '@/lib/types'

interface CartState {
  items: CartItem[]
  discount: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  setDiscount: (amount: number) => void
  clearCart: () => void
  subtotal: () => number
  taxAmount: (rate: number) => number
  total: (rate: number) => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discount: 0,
  addItem: (product) => {
    const { items } = get()
    const existing = items.find((i) => i.product.id === product.id)
    if (existing) {
      set({
        items: items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      })
    } else {
      set({ items: [...items, { product, quantity: 1, discount: 0 }] })
    }
  },
  removeItem: (productId) =>
    set({ items: get().items.filter((i) => i.product.id !== productId) }),
  updateQty: (productId, qty) => {
    if (qty <= 0) {
      set({ items: get().items.filter((i) => i.product.id !== productId) })
    } else {
      set({
        items: get().items.map((i) =>
          i.product.id === productId ? { ...i, quantity: qty } : i
        ),
      })
    }
  },
  setDiscount: (amount) => set({ discount: amount }),
  clearCart: () => set({ items: [], discount: 0 }),
  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity - i.discount, 0),
  taxAmount: (rate) => get().subtotal() * (rate / 100),
  total: (rate) => get().subtotal() + get().taxAmount(rate) - get().discount,
}))
