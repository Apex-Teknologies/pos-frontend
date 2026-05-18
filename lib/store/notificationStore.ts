import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Notification } from '@/lib/types'

const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Low Stock Alert', message: 'Bottled Water 1.5L has only 5 units left.', type: 'warning', read: false, createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), link: '/inventory' },
  { id: 'n2', title: 'Low Stock Alert', message: 'Cooking Oil 2L has only 3 units left.', type: 'warning', read: false, createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), link: '/inventory' },
  { id: 'n3', title: 'New Sale Completed', message: 'Transaction RCP-20260517-001 for ₵126.50 completed.', type: 'success', read: true, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), link: '/transactions' },
  { id: 'n4', title: 'Purchase Order Received', message: 'PO from TechWorld Ltd has been marked as received.', type: 'info', read: true, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), link: '/purchase-orders' },
  { id: 'n5', title: 'New Customer Registered', message: 'Adwoa Boateng joined the loyalty programme.', type: 'info', read: true, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), link: '/customers' },
]

interface NotificationState {
  notifications: Notification[]
  markRead: (id: string) => void
  markAllRead: () => void
  addNotification: (n: Notification) => void
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      markRead: (id) => set({ notifications: get().notifications.map((n) => n.id === id ? { ...n, read: true } : n) }),
      markAllRead: () => set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }),
      addNotification: (n) => set({ notifications: [n, ...get().notifications] }),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: 'apextek-notifications' }
  )
)
