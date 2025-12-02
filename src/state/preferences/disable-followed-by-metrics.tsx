import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: disableFollowedByMetrics – when true, disables following metrics on profiles

type StateContext = persisted.Schema['disableFollowedByMetrics']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['disableFollowedByMetrics']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.disableFollowedByMetrics,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['disableFollowedByMetrics']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('disableFollowedByMetrics'),
  )

  const setStateWrapped = React.useCallback(
    (value: persisted.Schema['disableFollowedByMetrics']) => {
      setState(value)
      persisted.write('disableFollowedByMetrics', value)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('disableFollowedByMetrics', next => {
      setState(next)
    })
  }, [setStateWrapped])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useDisableFollowedByMetrics() {
  return React.useContext(stateContext)
}

export function useSetDisableFollowedByMetrics() {
  return React.useContext(setContext)
}
