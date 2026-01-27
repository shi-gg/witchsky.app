import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['translationServicePreference']
type SetContext = (v: persisted.Schema['translationServicePreference']) => void
type InstanceStateContext = persisted.Schema['libreTranslateInstance']
type SetInstanceContext = (
  v: persisted.Schema['libreTranslateInstance'],
) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.translationServicePreference,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['translationServicePreference']) => {},
)
const instanceStateContext = React.createContext<InstanceStateContext>(
  persisted.defaults.libreTranslateInstance,
)
const setInstanceContext = React.createContext<SetInstanceContext>(
  (_: persisted.Schema['libreTranslateInstance']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('translationServicePreference'),
  )
  const [instanceState, setInstanceState] = React.useState(
    persisted.get('libreTranslateInstance'),
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

  const setInstanceStateWrapped = React.useCallback(
    (libreTranslateInstance: persisted.Schema['libreTranslateInstance']) => {
      setInstanceState(libreTranslateInstance)
      persisted.write('libreTranslateInstance', libreTranslateInstance)
    },
    [setInstanceState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'translationServicePreference',
      nextTranslationServicePreference => {
        setState(nextTranslationServicePreference)
      },
    )
  }, [setStateWrapped])

  React.useEffect(() => {
    return persisted.onUpdate('libreTranslateInstance', nextInstance => {
      setInstanceState(nextInstance)
    })
  }, [setInstanceStateWrapped])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        <instanceStateContext.Provider value={instanceState}>
          <setInstanceContext.Provider value={setInstanceStateWrapped}>
            {children}
          </setInstanceContext.Provider>
        </instanceStateContext.Provider>
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

export function useLibreTranslateInstance() {
  return (
    React.useContext(instanceStateContext) ??
    persisted.defaults.libreTranslateInstance!
  )
}

export function useSetLibreTranslateInstance() {
  return React.useContext(setInstanceContext)
}
