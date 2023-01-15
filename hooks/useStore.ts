import { useMemo } from 'react'
import { create } from 'zustand'

type State = {
  theme: 'light' | 'dark'
  peripherals: any
  list: any[]
}

type Action = {
  updateTheme: (theme: State['theme']) => void
  updatePeripherals: (peripherals: State['peripherals']) => void
  setList: (list: State['list']) => void
}

export const useStore = create<State & Action>(set => ({
  theme: 'light',
  peripherals: useMemo(() => new Map<string, any>(), []),
  list: [],
  updateTheme: theme => set(() => ({ theme: theme })),
  updatePeripherals: peripherals => set(() => ({ peripherals: peripherals })),
  setList: list => set(() => ({ list: list })),
}))
