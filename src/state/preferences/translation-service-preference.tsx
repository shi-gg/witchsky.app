import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['translationServicePreference']
type SetContext = (v: persisted.Schema['translationServicePreference']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.translationServicePreference,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['translationServicePreference']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('translationServicePreference'),
  )

  const setStateWrapped = React.useCallback(
    (
      translationServicePreference: persisted.Schema['translationServicePreference'],
    ) => {
      setState(translationServicePreference)
      persisted.write(
        'translationServicePreference',
        translationServicePreference,
      )
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'translationServicePreference',
      nextTranslationServicePreference => {
        setState(nextTranslationServicePreference)
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

export function useTranslationServicePreference() {
  return React.useContext(stateContext)
}

export function useSetTranslationServicePreference() {
  return React.useContext(setContext)
}
