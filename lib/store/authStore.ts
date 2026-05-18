import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Role } from '@/lib/types'
import { mockUsers } from '@/lib/mock/business'

interface AuthState {
  user: User | null
  users: User[]
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  loginWithPin: (pin: string) => boolean
  logout: () => void
  addUser: (u: User) => void
  updateUser: (u: User) => void
  deleteUser: (id: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: mockUsers,
      isAuthenticated: false,
      // Mock auth — password not validated in frontend store (dev mode only)
      login: (email: string, _password: string) => {
        const found = get().users.find((u) => u.email === email)
        if (found) {
          set({ user: found, isAuthenticated: true })
          return true
        }
        return false
      },
      loginWithPin: (pin: string) => {
        const found = get().users.find((u) => u.pin === pin)
        if (found) {
          set({ user: found, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      addUser: (u) => set({ users: [...get().users, u] }),
      updateUser: (u) => set({ users: get().users.map((x) => (x.id === u.id ? u : x)) }),
      deleteUser: (id) => set({ users: get().users.filter((x) => x.id !== id) }),
    }),
    { name: 'apextek-auth' }
  )
)

export function hasRole(userRole: Role, required: Role[]): boolean {
  return required.includes(userRole)
}
