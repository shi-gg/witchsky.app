import React from 'react'

import * as persisted from '#/state/persisted'

// Preference: disableComposerPrompt – when true, disables the composer prompt

type StateContext = persisted.Schema['disableComposerPrompt']
// Same setter signature used across other preference modules
type SetContext = (v: persisted.Schema['disableComposerPrompt']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.disableComposerPrompt,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['disableComposerPrompt']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('disableComposerPrompt'),
  )

  const setStateWrapped = React.useCallback(
    (disableComposerPrompt: persisted.Schema['disableComposerPrompt']) => {
      setState(disableComposerPrompt)
      persisted.write('disableComposerPrompt', disableComposerPrompt)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'disableComposerPrompt',
      nextDisableComposerPrompt => {
        setState(nextDisableComposerPrompt)
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

export function useDisableComposerPrompt() {
  return React.useContext(stateContext)
}

export function useSetDisableComposerPrompt() {
  return React.useContext(setContext)
}
