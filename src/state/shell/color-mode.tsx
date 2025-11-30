import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = {
  colorMode: persisted.Schema['colorMode']
  darkTheme: persisted.Schema['darkTheme']
  colorScheme: persisted.Schema['colorScheme']
}
type SetContext = {
  setColorMode: (v: persisted.Schema['colorMode']) => void
  setDarkTheme: (v: persisted.Schema['darkTheme']) => void
  setColorScheme: (v: persisted.Schema['colorScheme']) => void
}

const stateContext = React.createContext<StateContext>({
  colorMode: 'system',
  darkTheme: 'dark',
  colorScheme: 'witchsky',
})
stateContext.displayName = 'ColorModeStateContext'
const setContext = React.createContext<SetContext>({} as SetContext)
setContext.displayName = 'ColorModeSetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [colorMode, setColorMode] = React.useState(persisted.get('colorMode'))
  const [darkTheme, setDarkTheme] = React.useState(persisted.get('darkTheme'))
  const [colorScheme, setColorScheme] = React.useState(
    persisted.get('colorScheme'),
  )

  const stateContextValue = React.useMemo(
    () => ({
      colorMode,
      darkTheme,
      colorScheme,
    }),
    [colorMode, darkTheme, colorScheme],
  )

  const setContextValue = React.useMemo(
    () => ({
      setColorMode: (_colorMode: persisted.Schema['colorMode']) => {
        setColorMode(_colorMode)
        persisted.write('colorMode', _colorMode)
      },
      setDarkTheme: (_darkTheme: persisted.Schema['darkTheme']) => {
        setDarkTheme(_darkTheme)
        persisted.write('darkTheme', _darkTheme)
      },
      setColorScheme: (_colorScheme: persisted.Schema['colorScheme']) => {
        setColorScheme(_colorScheme)
        persisted.write('colorScheme', _colorScheme)
      },
    }),
    [],
  )

  React.useEffect(() => {
    const unsub1 = persisted.onUpdate('darkTheme', nextDarkTheme => {
      setDarkTheme(nextDarkTheme)
    })
    const unsub2 = persisted.onUpdate('colorMode', nextColorMode => {
      setColorMode(nextColorMode)
    })
    const unsub3 = persisted.onUpdate('colorScheme', nextColorScheme => {
      setColorScheme(nextColorScheme)
    })
    return () => {
      unsub1()
      unsub2()
      unsub3()
    }
  }, [])

  return (
    <stateContext.Provider value={stateContextValue}>
      <setContext.Provider value={setContextValue}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useThemePrefs() {
  return React.useContext(stateContext)
}

export function useSetThemePrefs() {
  return React.useContext(setContext)
}
