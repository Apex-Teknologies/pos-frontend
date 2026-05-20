'use client'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import OfflineIndicator from '@/components/shared/OfflineIndicator'
import KeyboardShortcutsModal from '@/components/shared/KeyboardShortcutsModal'
import SkipToMain from '@/components/shared/SkipToMain'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()
  // Zustand persist rehydrates from localStorage asynchronously after mount.
  // We must wait for mount before reading auth state — otherwise the default
  // isAuthenticated=false fires before the saved value is loaded, sending
  // the user back to /login immediately after a successful login.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/login')
    }
  }, [mounted, isAuthenticated, router])

  // Blank screen while waiting for localStorage — avoids flash of redirect
  if (!mounted) return null
  if (!isAuthenticated) return null

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <SkipToMain />
      {/* Sidebar — hidden on mobile */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
      <OfflineIndicator />
      <KeyboardShortcutsModal />
    </div>
  )
}
