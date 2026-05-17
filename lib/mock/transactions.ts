import { Transaction } from '@/lib/types'
import { mockProducts } from './products'

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    branchId: 'branch-1',
    cashierId: 'user-3',
    cashierName: 'Kofi Boateng',
    items: [
      { product: mockProducts[0], quantity: 2, discount: 0 },
      { product: mockProducts[3], quantity: 4, discount: 0 },
    ],
    subtotal: 110,
    taxAmount: 16.5,
    discountAmount: 0,
    total: 126.5,
    paymentMethod: 'cash',
    amountTendered: 150,
    change: 23.5,
    status: 'completed',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    receiptNumber: 'RCP-20260517-001',
  },
  {
    id: 'txn-002',
    branchId: 'branch-1',
    cashierId: 'user-3',
    cashierName: 'Kofi Boateng',
    items: [
      { product: mockProducts[6], quantity: 1, discount: 5 },
      { product: mockProducts[7], quantity: 3, discount: 0 },
    ],
    subtotal: 116,
    taxAmount: 17.4,
    discountAmount: 5,
    total: 128.4,
    paymentMethod: 'card',
    status: 'completed',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    receiptNumber: 'RCP-20260517-002',
  },
  {
    id: 'txn-003',
    branchId: 'branch-1',
    cashierId: 'user-2',
    cashierName: 'Ama Asante',
    items: [
      { product: mockProducts[1], quantity: 1, discount: 0 },
      { product: mockProducts[4], quantity: 6, discount: 0 },
    ],
    subtotal: 316,
    taxAmount: 47.4,
    discountAmount: 0,
    total: 363.4,
    paymentMethod: 'mobile_money',
    status: 'completed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    receiptNumber: 'RCP-20260516-003',
  },
  {
    id: 'txn-004',
    branchId: 'branch-1',
    cashierId: 'user-3',
    cashierName: 'Kofi Boateng',
    items: [{ product: mockProducts[9], quantity: 2, discount: 10 }],
    subtotal: 150,
    taxAmount: 22.5,
    discountAmount: 10,
    total: 162.5,
    paymentMethod: 'cash',
    amountTendered: 200,
    change: 37.5,
    status: 'refunded',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    receiptNumber: 'RCP-20260515-004',
  },
  {
    id: 'txn-005',
    branchId: 'branch-1',
    cashierId: 'user-3',
    cashierName: 'Kofi Boateng',
    items: [
      { product: mockProducts[2], quantity: 3, discount: 0 },
      { product: mockProducts[5], quantity: 5, discount: 0 },
    ],
    subtotal: 75,
    taxAmount: 11.25,
    discountAmount: 0,
    total: 86.25,
    paymentMethod: 'cash',
    amountTendered: 100,
    change: 13.75,
    status: 'completed',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    receiptNumber: 'RCP-20260514-005',
  },
]

export function generateSalesData() {
  const days = 7
  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    const label = date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })
    const sales = Math.floor(Math.random() * 800) + 200
    return { date: label, sales }
  })
}
