import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: disableFollowersMetrics – when true, disables followers metrics on profiles

type StateContext = persisted.Schema['disableFollowersMetrics']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['disableFollowersMetrics']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.disableFollowersMetrics,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['disableFollowersMetrics']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('disableFollowersMetrics'),
  )

  const setStateWrapped = React.useCallback(
    (value: persisted.Schema['disableFollowersMetrics']) => {
      setState(value)
      persisted.write('disableFollowersMetrics', value)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('disableFollowersMetrics', next => {
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

export function useDisableFollowersMetrics() {
  return React.useContext(stateContext)
}

export function useSetDisableFollowersMetrics() {
  return React.useContext(setContext)
}
