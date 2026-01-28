import React from 'react'
import {msg, Plural, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {useFocusEffect} from '@react-navigation/native'

import {useSetTitle} from '#/lib/hooks/useSetTitle'
import {
  type CommonNavigatorParams,
  type NativeStackScreenProps,
} from '#/lib/routes/types'
import {makeRecordUri} from '#/lib/strings/url-helpers'
import {usePostQuery} from '#/state/queries/post'
import {useProfileQuery} from '#/state/queries/profile'
import {useResolveDidQuery} from '#/state/queries/resolve-uri'
import {useSetMinimalShellMode} from '#/state/shell'
import {PostRepostedBy as PostRepostedByComponent} from '#/view/com/post-thread/PostRepostedBy'
import * as Layout from '#/components/Layout'

type Props = NativeStackScreenProps<CommonNavigatorParams, 'PostRepostedBy'>
export const PostRepostedByScreen = ({route}: Props) => {
  const {_} = useLingui()
  const {name, rkey} = route.params
  const uri = makeRecordUri(name, 'app.bsky.feed.post', rkey)
  const setMinimalShellMode = useSetMinimalShellMode()
  const {data: post} = usePostQuery(uri)

  const {data: resolvedDid} = useResolveDidQuery(name)
  const {data: profile} = useProfileQuery({did: resolvedDid})

  useSetTitle(profile ? _(msg`Post by @${profile.handle}`) : undefined)

  let quoteCount
  if (post) {
    quoteCount = post.repostCount
  }

  useFocusEffect(
    React.useCallback(() => {
      setMinimalShellMode(false)
    }, [setMinimalShellMode]),
  )

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          {post && (
            <>
              <Layout.Header.TitleText>
                <Trans>Reposted By</Trans>
              </Layout.Header.TitleText>
              <Layout.Header.SubtitleText>
                <Plural
                  value={quoteCount ?? 0}
                  one="# repost"
                  other="# reposts"
                />
              </Layout.Header.SubtitleText>
            </>
          )}
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <PostRepostedByComponent uri={uri} />
    </Layout.Screen>
  )
}
