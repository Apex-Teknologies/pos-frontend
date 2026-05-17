'use client'
import { useEffect, useState } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

export default function OfflineIndicator() {
  const [online, setOnline] = useState(true)
  const [showRestored, setShowRestored] = useState(false)

  useEffect(() => {
    setOnline(navigator.onLine)

    const handleOffline = () => setOnline(false)
    const handleOnline = () => {
      setOnline(true)
      setShowRestored(true)
      setTimeout(() => setShowRestored(false), 3000)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)
    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (online && !showRestored) return null

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm font-medium transition-all ${
        online
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white animate-pulse'
      }`}
    >
      {online ? (
        <>
          <Wifi size={16} />
          Connection restored
        </>
      ) : (
        <>
          <WifiOff size={16} />
          You&apos;re offline — sales will sync when reconnected
        </>
      )}
    </div>
  )
}
