export type Role = 'admin' | 'manager' | 'cashier'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  pin?: string
  branchId: string
  avatar?: string
}

export interface Business {
  id: string
  name: string
  logo?: string
  address: string
  phone: string
  email: string
  taxNumber: string
  taxRate: number
  taxInclusive: boolean
  currency: string
  currencySymbol: string
}

export interface Branch {
  id: string
  businessId: string
  name: string
  address: string
  phone: string
  managerId?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
}

export interface Product {
  id: string
  name: string
  sku: string
  barcode?: string
  categoryId: string
  supplierId?: string
  price: number
  cost: number
  stock: number
  reorderPoint: number
  unit: string
  image?: string
  description?: string
  isActive: boolean
}

export interface PurchaseOrderItem {
  productId: string
  quantity: number
  unitCost: number
}

export interface PurchaseOrder {
  id: string
  supplierId: string
  branchId: string
  items: PurchaseOrderItem[]
  status: 'draft' | 'ordered' | 'received'
  totalAmount: number
  createdAt: string
  receivedAt?: string
  notes?: string
}

export interface CartItem {
  product: Product
  quantity: number
  discount: number
}

export interface Transaction {
  id: string
  branchId: string
  cashierId: string
  cashierName: string
  items: CartItem[]
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  paymentMethod: 'cash' | 'card' | 'mobile_money'
  amountTendered?: number
  change?: number
  status: 'completed' | 'refunded'
  createdAt: string
  receiptNumber: string
}

export interface StockMovement {
  id: string
  productId: string
  type: 'sale' | 'purchase' | 'adjustment' | 'transfer'
  quantity: number
  note?: string
  createdAt: string
}
