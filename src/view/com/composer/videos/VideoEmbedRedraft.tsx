import {Platform, View} from 'react-native'
import {type BlobRef} from '@atproto/api'
import {BlueskyVideoView} from '@haileyok/bluesky-video'

import {atoms as a} from '#/alf'
import {VideoEmbedInnerWeb} from '#/components/Post/Embed/VideoEmbed/VideoEmbedInner/VideoEmbedInnerWeb'
import {ExternalEmbedRemoveBtn} from '../ExternalEmbedRemoveBtn'

interface Props {
  blobRef: BlobRef
  playlistUri: string
  aspectRatio: {width: number; height: number}
  onRemove: () => void
}

export function VideoEmbedRedraft({blobRef, playlistUri, aspectRatio, onRemove}: Props) {
  const cidString = blobRef.ref.toString()
  const aspectRatioValue = aspectRatio.width / aspectRatio.height || 16 / 9
  const thumbnailUrl = playlistUri.replace('playlist.m3u8', 'thumbnail.jpg')

  const mockEmbed = {
    $type: 'app.bsky.embed.video#view' as const,
    video: blobRef,
    playlist: playlistUri,
    thumbnail: thumbnailUrl,
    aspectRatio,
    alt: '',
    captions: [],
    cid: cidString,
  }

  return (
    <View style={[a.w_full, a.rounded_sm, {aspectRatio: aspectRatioValue}]}>
      {Platform.OS === 'web' ? (
        <VideoEmbedInnerWeb
          embed={mockEmbed}
          active={false}
          setActive={() => {}}
          onScreen={true}
          lastKnownTime={{current: undefined}}
        />
      ) : (
        <BlueskyVideoView
          url={playlistUri}
          autoplay={false}
          beginMuted={true}
          style={[a.flex_1, a.rounded_sm]}
        />
      )}
      <ExternalEmbedRemoveBtn
        onRemove={onRemove}
        style={{top: 16, right: 16, position: 'absolute', zIndex: 10}}
      />
    </View>
  )
}
