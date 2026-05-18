import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Customer } from '@/lib/types'
import { mockCustomers } from '@/lib/mock/customers'

interface CustomerState {
  customers: Customer[]
  addCustomer: (c: Customer) => void
  updateCustomer: (c: Customer) => void
  deleteCustomer: (id: string) => void
  addLoyaltyPoints: (id: string, points: number) => void
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customers: mockCustomers,
      addCustomer: (c) => set({ customers: [...get().customers, c] }),
      updateCustomer: (c) =>
        set({ customers: get().customers.map((x) => (x.id === c.id ? c : x)) }),
      deleteCustomer: (id) =>
        set({ customers: get().customers.filter((x) => x.id !== id) }),
      addLoyaltyPoints: (id, points) =>
        set({
          customers: get().customers.map((x) =>
            x.id === id ? { ...x, loyaltyPoints: x.loyaltyPoints + points } : x
          ),
        }),
    }),
    { name: 'apextek-customers' }
  )
)
