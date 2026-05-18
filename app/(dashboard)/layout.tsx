'use client'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import OfflineIndicator from '@/components/shared/OfflineIndicator'
import KeyboardShortcutsModal from '@/components/shared/KeyboardShortcutsModal'
import SkipToMain from '@/components/shared/SkipToMain'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const _hydrated = useAuthStore((s) => s._hydrated)
  const router = useRouter()

  useEffect(() => {
    // Only redirect after the store has loaded from localStorage.
    // Without this guard, the default isAuthenticated=false fires before
    // the persisted value is read, bouncing the user back to /login.
    if (_hydrated && !isAuthenticated) router.replace('/login')
  }, [_hydrated, isAuthenticated, router])

  // Show nothing while waiting for localStorage to load
  if (!_hydrated) return null
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
