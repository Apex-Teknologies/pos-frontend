import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction } from '@/lib/types'
import { mockTransactions } from '@/lib/mock/transactions'

interface TransactionState {
  transactions: Transaction[]
  addTransaction: (txn: Transaction) => void
  refundTransaction: (id: string) => void
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      addTransaction: (txn) =>
        set({ transactions: [txn, ...get().transactions] }),
      refundTransaction: (id) =>
        set({
          transactions: get().transactions.map((t) =>
            t.id === id ? { ...t, status: 'refunded' } : t
          ),
        }),
    }),
    { name: 'apextek-transactions' }
  )
)
