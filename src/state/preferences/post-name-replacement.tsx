import React from 'react'

import * as persisted from '#/state/persisted'

interface PostReplacementState {
  enabled: boolean
  string: string
}

type StateContext = PostReplacementState
type SetContext = (
  v:
    | PostReplacementState
    | ((curr: PostReplacementState) => PostReplacementState),
) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.postReplacement as PostReplacementState,
)
const setContext = React.createContext<SetContext>(
  (
    _:
      | PostReplacementState
      | ((curr: PostReplacementState) => PostReplacementState),
  ) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, _setState] = React.useState<PostReplacementState>(() => {
    const persistedState = persisted.get('postReplacement')
    return {
      enabled:
        persistedState?.enabled ?? persisted.defaults.postReplacement.enabled!,
      string:
        persistedState?.string ?? persisted.defaults.postReplacement.string!,
    }
  })

  const setState = React.useCallback(
    (
      val:
        | PostReplacementState
        | ((curr: PostReplacementState) => PostReplacementState),
    ) => {
      _setState(curr => {
        const next = typeof val === 'function' ? val(curr) : val
        persisted.write('postReplacement', next)
        return next
      })
    },
    [],
  )

  React.useEffect(() => {
    return persisted.onUpdate('postReplacement', next => {
      setState({string: next.string ?? 'skeet', enabled: next.enabled ?? true})
      /*
      if (nextVal) {
        _setState({
          enabled:
            nextVal.enabled ?? persisted.defaults.postReplacement.enabled!,
          string: nextVal.string ?? persisted.defaults.postReplacement.string!,
        })
      }*/
    })
  }, [])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setState}>{children}</setContext.Provider>
    </stateContext.Provider>
  )
}

export function usePostReplacement() {
  return React.useContext(stateContext)
}

export function useSetPostReplacement() {
  return React.useContext(setContext)
}
