'use client'
import { Menu, Bell, ChevronDown } from 'lucide-react'
import { useBranchStore } from '@/lib/store/branchStore'
import { useAuthStore } from '@/lib/store/authStore'
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

export default function Topbar() {
  const { currentBranch, branches, setBranch } = useBranchStore()
  const { user, logout } = useAuthStore()

  return (
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

      <div className="flex-1" />

      {/* Notifications */}
      <button className="relative inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition-colors">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

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
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => { logout(); window.location.href = '/login' }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
