import React from 'react'
import {reloadAppAsync} from 'expo'

import * as persisted from '#/state/persisted'
import {IS_WEB} from '#/env'

type StateContext = persisted.Schema['useHandleInLinks']
type SetContext = (v: persisted.Schema['useHandleInLinks']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.useHandleInLinks,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['useHandleInLinks']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('useHandleInLinks'))

  const setStateWrapped = React.useCallback(
    (useHandleInLinks: persisted.Schema['useHandleInLinks']) => {
      setState(useHandleInLinks)
      persisted.write('useHandleInLinks', useHandleInLinks)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('useHandleInLinks', nextUseHandleInLinks => {
      setState(nextUseHandleInLinks)
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

export function useHandleInLinks() {
  return React.useContext(stateContext)
}

export function useSetHandleInLinks() {
  const set = React.useContext(setContext)

  return React.useCallback(
    (useHandleInLinks: persisted.Schema['useHandleInLinks']) => {
      set(useHandleInLinks)

      if (IS_WEB) {
        window.location.reload()
      } else {
        void reloadAppAsync()
      }
    },
    [set],
  )
}
