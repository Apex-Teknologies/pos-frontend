'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Invoice } from '@/lib/types'

const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-001',
    customerId: 'cust-4',
    customerName: 'Kofi Agyemang',
    customerEmail: 'kofi.a@example.com',
    items: [
      { description: 'Wireless Earbuds × 2', quantity: 2, unitPrice: 280, total: 560 },
      { description: 'USB-C Charging Cable × 5', quantity: 5, unitPrice: 45, total: 225 },
    ],
    subtotal: 785,
    taxAmount: 117.75,
    discountAmount: 50,
    total: 852.75,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'sent',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-002',
    customerId: 'cust-1',
    customerName: 'Abena Owusu',
    customerEmail: 'abena@example.com',
    items: [
      { description: 'Basmati Rice 5kg × 3', quantity: 3, unitPrice: 85, total: 255 },
      { description: 'Cooking Oil 2L × 2', quantity: 2, unitPrice: 55, total: 110 },
    ],
    subtotal: 365,
    taxAmount: 54.75,
    discountAmount: 0,
    total: 419.75,
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'overdue',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-003',
    customerName: 'Walk-in Customer',
    items: [{ description: 'Cotton T-Shirt (M) × 4', quantity: 4, unitPrice: 75, total: 300 }],
    subtotal: 300,
    taxAmount: 45,
    discountAmount: 20,
    total: 325,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'paid',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

interface InvoiceState {
  invoices: Invoice[]
  addInvoice: (inv: Invoice) => void
  updateInvoice: (inv: Invoice) => void
  markPaid: (id: string) => void
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set, get) => ({
      invoices: mockInvoices,
      addInvoice: (inv) => set({ invoices: [inv, ...get().invoices] }),
      updateInvoice: (inv) => set({ invoices: get().invoices.map((i) => (i.id === inv.id ? inv : i)) }),
      markPaid: (id) => set({ invoices: get().invoices.map((i) => (i.id === id ? { ...i, status: 'paid' } : i)) }),
    }),
    { name: 'apextek-invoices' }
  )
)
