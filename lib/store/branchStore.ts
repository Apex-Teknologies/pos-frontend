'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Branch } from '@/lib/types'
import { mockBranches } from '@/lib/mock/business'

interface BranchState {
  currentBranch: Branch
  setBranch: (branch: Branch) => void
  branches: Branch[]
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      currentBranch: mockBranches[0],
      branches: mockBranches,
      setBranch: (branch) => set({ currentBranch: branch }),
    }),
    { name: 'apextek-branch' }
  )
)
