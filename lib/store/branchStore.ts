import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Branch } from '@/lib/types'
import { mockBranches } from '@/lib/mock/business'

interface BranchState {
  currentBranch: Branch
  setBranch: (branch: Branch) => void
  branches: Branch[]
  addBranch: (b: Branch) => void
  updateBranch: (b: Branch) => void
  deleteBranch: (id: string) => void
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set, get) => ({
      currentBranch: mockBranches[0],
      branches: mockBranches,
      setBranch: (branch) => set({ currentBranch: branch }),
      addBranch: (b) => set({ branches: [...get().branches, b] }),
      updateBranch: (b) => set({ branches: get().branches.map((x) => (x.id === b.id ? b : x)) }),
      deleteBranch: (id) => set({ branches: get().branches.filter((x) => x.id !== id) }),
    }),
    { name: 'apextek-branch' }
  )
)
