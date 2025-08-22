'use client'

import React, { createContext, useContext, ReactNode } from 'react'

interface AppContextType {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark')

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
