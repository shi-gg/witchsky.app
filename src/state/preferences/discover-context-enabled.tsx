import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: discoverContextEnabled – when true, shows debug context for discover feed

type StateContext = persisted.Schema['discoverContextEnabled']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['discoverContextEnabled']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.discoverContextEnabled,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['discoverContextEnabled']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('discoverContextEnabled'),
  )

  const setStateWrapped = React.useCallback(
    (discoverContextEnabled: persisted.Schema['discoverContextEnabled']) => {
      setState(discoverContextEnabled)
      persisted.write('discoverContextEnabled', discoverContextEnabled)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'discoverContextEnabled',
      nextDiscoverContextEnabled => {
        setState(nextDiscoverContextEnabled)
      },
    )
  }, [setStateWrapped])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useDiscoverContextEnabled() {
  return React.useContext(stateContext)
}

export function useSetDiscoverContextEnabled() {
  return React.useContext(setContext)
}
