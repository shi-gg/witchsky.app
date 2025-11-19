import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: enableSquareAvatars – when true, disables notifications sent when liking/reposting a post someone else reposted

type StateContext = persisted.Schema['enableSquareAvatars']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['enableSquareAvatars']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.enableSquareAvatars,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['enableSquareAvatars']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('enableSquareAvatars'))

  const setStateWrapped = React.useCallback(
    (value: persisted.Schema['enableSquareAvatars']) => {
      setState(value)
      persisted.write('enableSquareAvatars', value)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('enableSquareAvatars', next => {
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

export function useEnableSquareAvatars() {
  return React.useContext(stateContext)
}

export function useSetEnableSquareAvatars() {
  return React.useContext(setContext)
}
