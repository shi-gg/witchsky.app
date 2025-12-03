import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: disableVerifyEmailReminder – when true, disables the "verify email" reminder that you get on boot on mobile, useful if you are on a PDS without any email verification setup

type StateContext = persisted.Schema['disableVerifyEmailReminder']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['disableVerifyEmailReminder']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.disableVerifyEmailReminder,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['disableVerifyEmailReminder']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('disableVerifyEmailReminder'),
  )

  const setStateWrapped = React.useCallback(
    (value: persisted.Schema['disableVerifyEmailReminder']) => {
      setState(value)
      persisted.write('disableVerifyEmailReminder', value)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('disableVerifyEmailReminder', next => {
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

export function useDisableVerifyEmailReminder() {
  return React.useContext(stateContext)
}

export function useSetDisableVerifyEmailReminder() {
  return React.useContext(setContext)
}
