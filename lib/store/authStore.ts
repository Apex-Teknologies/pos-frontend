'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Role } from '@/lib/types'
import { mockUsers } from '@/lib/mock/business'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  loginWithPin: (pin: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, _password: string) => {
        const found = mockUsers.find((u) => u.email === email)
        if (found) {
          set({ user: found, isAuthenticated: true })
          return true
        }
        return false
      },
      loginWithPin: (pin: string) => {
        const found = mockUsers.find((u) => u.pin === pin)
        if (found) {
          set({ user: found, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'apextek-auth' }
  )
)

export function hasRole(userRole: Role, required: Role[]): boolean {
  return required.includes(userRole)
}
