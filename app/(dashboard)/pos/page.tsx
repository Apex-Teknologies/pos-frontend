'use client'
import { useState } from 'react'
import { useInventoryStore } from '@/lib/store/inventoryStore'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useBranchStore } from '@/lib/store/branchStore'
import { useTransactionStore } from '@/lib/store/transactionStore'
import { formatCurrency, generateReceiptNumber } from '@/lib/utils'
import { Product, Transaction } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Search, Minus, Plus, Trash2, ShoppingCart, X } from 'lucide-react'
import CheckoutModal from '@/components/pos/CheckoutModal'
import ReceiptModal from '@/components/pos/ReceiptModal'

export default function POSPage() {
  const { products, categories, adjustStock } = useInventoryStore()
  const cart = useCartStore()
  const { user } = useAuthStore()
  const { currentBranch } = useBranchStore()
  const { addTransaction } = useTransactionStore()

  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [showCheckout, setShowCheckout] = useState(false)
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null)

  const TAX_RATE = 15

  const filtered = products
    .filter((p) => p.isActive && p.stock > 0)
    .filter((p) =>
      (catFilter === 'all' || p.categoryId === catFilter) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    )

  const handleCheckout = (paymentMethod: 'cash' | 'card' | 'mobile_money', amountTendered?: number) => {
    const subtotal = cart.subtotal()
    const taxAmount = cart.taxAmount(TAX_RATE)
    const total = cart.total(TAX_RATE)
    const txn: Transaction = {
      id: `txn-${Date.now()}`,
      branchId: currentBranch.id,
      cashierId: user!.id,
      cashierName: user!.name,
      items: cart.items,
      subtotal,
      taxAmount,
      discountAmount: cart.discount,
      total,
      paymentMethod,
      amountTendered,
      change: amountTendered != null ? amountTendered - total : undefined,
      status: 'completed',
      createdAt: new Date().toISOString(),
      receiptNumber: generateReceiptNumber(),
    }
    cart.items.forEach((item) => adjustStock(item.product.id, -item.quantity))
    addTransaction(txn)
    cart.clearCart()
    setShowCheckout(false)
    setCompletedTxn(txn)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-3.5rem-3rem)] min-h-0">
      {/* Product grid — left panel */}
      <div className="flex-1 flex flex-col min-h-0 space-y-3">
        {/* Search + category filter */}
        <div className="space-y-2 flex-shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              size="sm"
              variant={catFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setCatFilter('all')}
              className="flex-shrink-0"
            >
              All
            </Button>
            {categories.map((c) => (
              <Button
                key={c.id}
                size="sm"
                variant={catFilter === c.id ? 'default' : 'outline'}
                onClick={() => setCatFilter(c.id)}
                className="flex-shrink-0"
              >
                {c.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={() => cart.addItem(product)} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-muted-foreground">
                No products found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart — right panel */}
      <div className="lg:w-80 xl:w-96 flex flex-col border rounded-xl bg-white shadow-sm min-h-0">
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
          <h2 className="font-semibold flex items-center gap-2">
            <ShoppingCart size={18} />
            Cart
            {cart.items.length > 0 && (
              <Badge className="ml-1">{cart.items.length}</Badge>
            )}
          </h2>
          {cart.items.length > 0 && (
            <Button variant="ghost" size="sm" className="text-red-500 h-7 px-2 gap-1" onClick={cart.clearCart}>
              <X size={13} /> Clear
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {cart.items.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
              Add products to start a sale
            </div>
          )}
          {cart.items.map((item) => (
            <div key={item.product.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(item.product.price)} each</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  className="w-6 h-6 rounded border flex items-center justify-center hover:bg-slate-100"
                  onClick={() => cart.updateQty(item.product.id, item.quantity - 1)}
                >
                  <Minus size={12} />
                </button>
                <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  className="w-6 h-6 rounded border flex items-center justify-center hover:bg-slate-100"
                  onClick={() => cart.updateQty(item.product.id, item.quantity + 1)}
                >
                  <Plus size={12} />
                </button>
              </div>
              <div className="w-16 text-right flex-shrink-0">
                <p className="text-sm font-semibold">{formatCurrency(item.product.price * item.quantity)}</p>
              </div>
              <button
                className="text-red-400 hover:text-red-600 ml-1"
                onClick={() => cart.removeItem(item.product.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Totals + checkout */}
        <div className="border-t px-4 py-3 space-y-3 flex-shrink-0">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(cart.subtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (15%)</span>
              <span>{formatCurrency(cart.taxAmount(TAX_RATE))}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Discount</span>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-xs">₵</span>
                <input
                  type="number"
                  value={cart.discount || ''}
                  onChange={(e) => cart.setDiscount(+e.target.value)}
                  className="w-16 text-right border rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="0"
                  min={0}
                />
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-600">{formatCurrency(cart.total(TAX_RATE))}</span>
          </div>
          <Button
            className="w-full gap-2 h-11 text-base"
            disabled={cart.items.length === 0}
            onClick={() => setShowCheckout(true)}
          >
            <ShoppingCart size={18} />
            Checkout
          </Button>
        </div>
      </div>

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        total={cart.total(TAX_RATE)}
        onConfirm={handleCheckout}
      />

      {completedTxn && (
        <ReceiptModal
          transaction={completedTxn}
          onClose={() => setCompletedTxn(null)}
        />
      )}
    </div>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <button
      onClick={onAdd}
      className="flex flex-col p-3 rounded-xl border bg-white hover:border-blue-400 hover:shadow-md active:scale-95 transition-all text-left"
    >
      <div className="w-full aspect-square rounded-lg bg-slate-100 mb-2 flex items-center justify-center text-3xl">
        📦
      </div>
      <p className="text-sm font-medium leading-tight line-clamp-2">{product.name}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{product.stock} {product.unit} left</p>
      <p className="text-base font-bold text-blue-600 mt-1">{formatCurrency(product.price)}</p>
    </button>
  )
}
