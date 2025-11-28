import {AppBskyRichtextFacet,type RichText,UnicodeString} from '@atproto/api'

import {toShortUrl} from './url-helpers'

export function shortenLinks(rt: RichText): RichText {
  if (!rt.facets?.length) {
    return rt
  }
  rt = rt.clone()
  // enumerate the link facets
  if (rt.facets) {
    for (const facet of rt.facets) {
      const isLink = !!facet.features.find(AppBskyRichtextFacet.isLink)
      if (!isLink) {
        continue
      }

      // extract and shorten the URL
      const {byteStart, byteEnd} = facet.index
      const url = rt.unicodeText.slice(byteStart, byteEnd)
      const shortened = new UnicodeString(toShortUrl(url))

      // insert the shorten URL
      rt.insert(byteStart, shortened.utf16)
      // update the facet to cover the new shortened URL
      facet.index.byteStart = byteStart
      facet.index.byteEnd = byteStart + shortened.length
      // remove the old URL
      rt.delete(byteStart + shortened.length, byteEnd + shortened.length)
    }
  }
  return rt
}

// filter out any mention facets that didn't map to a user
export function stripInvalidMentions(rt: RichText): RichText {
  if (!rt.facets?.length) {
    return rt
  }
  rt = rt.clone()
  if (rt.facets) {
    rt.facets = rt.facets?.filter(facet => {
      const mention = facet.features.find(AppBskyRichtextFacet.isMention)
      if (mention && !mention.did) {
        return false
      }
      return true
    })
  }
  return rt
}

export function parseMarkdownLinks(text: string): {
  text: string
  facets: AppBskyRichtextFacet.Main[]
} {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match
  let newText = ''
  let lastIndex = 0
  const facets: AppBskyRichtextFacet.Main[] = []

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, linkText, linkUrl] = match
    const matchStart = match.index
    newText += text.slice(lastIndex, matchStart)
    const startByte = new UnicodeString(newText).length
    newText += linkText
    const endByte = new UnicodeString(newText).length
    let validUrl = linkUrl
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://') && !validUrl.startsWith('mailto:')) {
      validUrl = `https://${validUrl}`
    }

    facets.push({
      index: {
        byteStart: startByte,
        byteEnd: endByte,
      },
      features: [
        {
          $type: 'app.bsky.richtext.facet#link',
          uri: validUrl,
        },
      ],
    })

    lastIndex = matchStart + fullMatch.length
  }

  newText += text.slice(lastIndex)

  return {text: newText, facets}
}
