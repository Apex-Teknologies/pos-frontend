'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useInventoryStore } from '@/lib/store/inventoryStore'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tag,
  Truck,
  ClipboardList,
  Receipt,
  Building2,
  Settings,
  LogOut,
  ShoppingBag,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles?: string[]
  badge?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asNavItem(x: any): NavItem { return x }

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const products = useInventoryStore((s) => s.products)
  const lowStockCount = products.filter((p) => p.stock <= p.reorderPoint).length

  const navGroups = [
    {
      label: 'Main',
      items: [
        { label: 'Dashboard', href: '/', icon: <LayoutDashboard size={18} /> },
        { label: 'POS / Checkout', href: '/pos', icon: <ShoppingCart size={18} /> },
        { label: 'Transactions', href: '/transactions', icon: <Receipt size={18} />, roles: ['admin', 'manager'] },
      ],
    },
    {
      label: 'Inventory',
      roles: ['admin', 'manager'],
      items: [
        { label: 'Products', href: '/inventory', icon: <Package size={18} />, badge: lowStockCount },
        { label: 'Categories', href: '/categories', icon: <Tag size={18} /> },
        { label: 'Suppliers', href: '/suppliers', icon: <Truck size={18} /> },
        { label: 'Purchase Orders', href: '/purchase-orders', icon: <ClipboardList size={18} /> },
      ],
    },
    {
      label: 'Business',
      roles: ['admin'],
      items: [
        { label: 'Business Profile', href: '/business', icon: <Building2 size={18} /> },
        { label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
      ],
    },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <aside className="flex flex-col h-full w-64 bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <ShoppingBag size={20} />
        </div>
        <div>
          <p className="font-bold text-base leading-none">ApexTek</p>
          <p className="text-xs text-slate-400 mt-0.5">Smart POS</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navGroups.map((group) => {
          if (group.roles && user && !group.roles.includes(user.role)) return null
          return (
            <div key={group.label}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  if ((item as any).roles && user && !(item as any).roles.includes(user.role)) return null
                  const active = isActive(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                          active
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        )}
                      >
                        {item.icon}
                        <span className="flex-1">{item.label}</span>
                        {(item as NavItem).badge != null && (item as NavItem).badge! > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0">
                            {(item as NavItem).badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-slate-700 p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); window.location.href = '/login' }}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
