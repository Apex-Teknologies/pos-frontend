'use client'
import { useState, useEffect } from 'react'
import { Menu, Bell, ChevronDown, Search } from 'lucide-react'
import { useBranchStore } from '@/lib/store/branchStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useNotificationStore } from '@/lib/store/notificationStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from './Sidebar'
import GlobalSearch from '@/components/shared/GlobalSearch'

export default function Topbar() {
  const { currentBranch, branches, setBranch } = useBranchStore()
  const { user, logout } = useAuthStore()
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.read).length)
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSearchOpen])

  return (
    <>
      <header className="h-14 border-b bg-white flex items-center px-4 gap-3 sticky top-0 z-20">
        {/* Mobile sidebar trigger */}
        <Sheet>
          <SheetTrigger className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-transparent hover:bg-accent transition-colors">
            <Menu size={20} />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Branch selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 h-9 px-3 rounded-md border text-sm font-medium hover:bg-accent transition-colors">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            {currentBranch.name}
            <ChevronDown size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {branches.map((b) => (
              <DropdownMenuItem
                key={b.id}
                onClick={() => setBranch(b)}
                className={currentBranch.id === b.id ? 'font-semibold' : ''}
              >
                {b.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Global search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 h-9 px-3 rounded-md border text-sm text-muted-foreground hover:bg-accent transition-colors flex-1 max-w-xs"
          aria-label="Search"
        >
          <Search size={14} />
          <span>Search...</span>
          <kbd className="ml-auto text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>

        <div className="flex-1" />

        {/* Mobile search */}
        <button
          onClick={() => setSearchOpen(true)}
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition-colors"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <Link href="/notifications" className="relative inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition-colors" aria-label={`${unreadCount} unread notifications`}>
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent transition-colors">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <p>{user?.name}</p>
              <p className="text-xs text-muted-foreground font-normal capitalize">{user?.role}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/help')}>Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => { logout(); router.push('/login') }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
