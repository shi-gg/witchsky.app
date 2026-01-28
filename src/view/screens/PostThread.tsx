import {useCallback} from 'react'
import {msg} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {useFocusEffect} from '@react-navigation/native'

import {useSetTitle} from '#/lib/hooks/useSetTitle'
import {
  type CommonNavigatorParams,
  type NativeStackScreenProps,
} from '#/lib/routes/types'
import {makeRecordUri} from '#/lib/strings/url-helpers'
import {useProfileQuery} from '#/state/queries/profile'
import {useResolveDidQuery} from '#/state/queries/resolve-uri'
import {useSetMinimalShellMode} from '#/state/shell'
import {PostThread} from '#/screens/PostThread'
import * as Layout from '#/components/Layout'

type Props = NativeStackScreenProps<CommonNavigatorParams, 'PostThread'>
export function PostThreadScreen({route}: Props) {
  const {_} = useLingui()
  const setMinimalShellMode = useSetMinimalShellMode()

  const {name, rkey} = route.params
  const uri = makeRecordUri(name, 'app.bsky.feed.post', rkey)

  const {data: resolvedDid} = useResolveDidQuery(name)
  const {data: profile} = useProfileQuery({did: resolvedDid})

  useSetTitle(profile ? _(msg`Post by @${profile.handle}`) : undefined)

  useFocusEffect(
    useCallback(() => {
      setMinimalShellMode(false)
    }, [setMinimalShellMode]),
  )

  return (
    <Layout.Screen testID="postThreadScreen">
      <PostThread uri={uri} />
    </Layout.Screen>
  )
}
