/**
 * Unit tests for lib/store/cartStore.ts
 * Demonstrates store testing pattern with Zustand
 */
import { renderHook, act } from '@testing-library/react'
import { useCartStore } from '@/lib/store/cartStore'
import { mockProducts } from '@/lib/mock/products'

const sampleProduct = mockProducts[0]

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
  })

  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCartStore())
    expect(result.current.items).toHaveLength(0)
  })

  it('adds an item to cart', () => {
    act(() => {
      useCartStore.getState().addItem(sampleProduct)
    })
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].product.id).toBe(sampleProduct.id)
  })

  it('increments quantity on duplicate add', () => {
    act(() => {
      useCartStore.getState().addItem(sampleProduct)
      useCartStore.getState().addItem(sampleProduct)
    })
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(2)
  })

  it('clears cart', () => {
    act(() => {
      useCartStore.getState().addItem(sampleProduct)
      useCartStore.getState().clearCart()
    })
    expect(useCartStore.getState().items).toHaveLength(0)
  })
})
