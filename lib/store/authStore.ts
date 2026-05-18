import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Role } from '@/lib/types'
import { mockUsers } from '@/lib/mock/business'

interface AuthState {
  _hydrated: boolean
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

const setAuthCookie = (authenticated: boolean) => {
  if (typeof document === 'undefined') return
  if (authenticated) {
    document.cookie = `apextek-auth=${encodeURIComponent(JSON.stringify({ state: { isAuthenticated: true } }))}; path=/; max-age=604800; SameSite=Lax`
  } else {
    document.cookie = 'apextek-auth=; path=/; max-age=0'
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      _hydrated: false,
      user: null,
      users: mockUsers,
      isAuthenticated: false,
      // Mock auth — password not validated in frontend store (dev mode only)
      login: (email: string, _password: string) => {
        const found = get().users.find((u) => u.email === email)
        if (found) {
          set({ user: found, isAuthenticated: true })
          setAuthCookie(true)
          return true
        }
        return false
      },
      loginWithPin: (pin: string) => {
        const found = get().users.find((u) => u.pin === pin)
        if (found) {
          set({ user: found, isAuthenticated: true })
          setAuthCookie(true)
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
        setAuthCookie(false)
      },
      addUser: (u) => set({ users: [...get().users, u] }),
      updateUser: (u) => set({ users: get().users.map((x) => (x.id === u.id ? u : x)) }),
      deleteUser: (id) => set({ users: get().users.filter((x) => x.id !== id) }),
    }),
    {
      name: 'apextek-auth',
      // Mark the store as hydrated once localStorage data is loaded
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true
      },
    }
  )
)

export function hasRole(userRole: Role, required: Role[]): boolean {
  return required.includes(userRole)
}
