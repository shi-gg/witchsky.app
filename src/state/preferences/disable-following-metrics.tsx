import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: disableFollowingMetrics – when true, disables following metrics on profiles

type StateContext = persisted.Schema['disableFollowingMetrics']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['disableFollowingMetrics']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.disableFollowingMetrics,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['disableFollowingMetrics']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('disableFollowingMetrics'),
  )

  const setStateWrapped = React.useCallback(
    (value: persisted.Schema['disableFollowingMetrics']) => {
      setState(value)
      persisted.write('disableFollowingMetrics', value)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('disableFollowingMetrics', next => {
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

export function useDisableFollowingMetrics() {
  return React.useContext(stateContext)
}

export function useSetDisableFollowingMetrics() {
  return React.useContext(setContext)
}
