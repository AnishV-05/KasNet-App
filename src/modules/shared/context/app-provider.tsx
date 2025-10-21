import React, { createContext, ReactNode, useMemo, useState } from 'react'
import { KdsLoader } from '../components/kds/kds-loader/kds-loader.component'

type LoaderState = {
  label?: string
  show: boolean
}

type AppProviderState = {
  loaderState: LoaderState
  setLoaderState: (state: LoaderState) => void
}

type AppContextProvider = {
  children: ReactNode
}

export const AppContext = createContext<AppProviderState | undefined>(undefined)

export const AppProvider: React.FC<AppContextProvider> = ({ children }) => {
  const [loaderState, setLoaderState] = useState<LoaderState>({
    show: false,
  })

  const contextValue: AppProviderState = useMemo(
    () => ({
      loaderState,
      setLoaderState: (s: LoaderState) =>
        setLoaderState(prev => ({
          ...prev,
          ...s,
        })),
    }),
    [loaderState, setLoaderState]
  )

  return (
    <AppContext.Provider value={contextValue}>
      <div style={{ backgroundColor: 'white', height: '100%' }}>
        {loaderState.show && <KdsLoader name="spinner" full />}
        {children}
      </div>
    </AppContext.Provider>
  )
}
