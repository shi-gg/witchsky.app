import {type Messages} from '@lingui/core'

import * as persisted from '#/state/persisted'

// Helper to apply the replacement to a single string
function replaceInString(text: string): string {
  const {string: replacement, enabled} = persisted.get('postReplacement')
  if (!enabled) return text
  let repl = replacement?.length ? replacement.toLowerCase() : 'skeet'
  return text
    .replaceAll('Post', repl[0].toUpperCase() + repl.slice(1))
    .replaceAll('post', repl)
}

// Recursive helper to traverse and replace strings in nested structures
function traverseAndReplace(value: any): any {
  if (typeof value === 'string') {
    return replaceInString(value)
  }
  if (Array.isArray(value)) {
    return value.map(item => traverseAndReplace(item))
  }
  if (typeof value === 'object' && value !== null) {
    const newObject: Record<string, any> = {}
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        newObject[key] = traverseAndReplace(value[key])
      }
    }
    return newObject
  }
  return value
}

/**
 * Applies "Post" to "Skeet" replacements (case-insensitive) to messages
 * for English locales.
 * @param messages The raw messages object loaded from Lingui.
 * @param locale The current locale string.
 * @returns The messages object with replacements applied if the locale is English,
 *          otherwise the original messages object.
 */
export function applySkeetReplacements(
  messages: Messages,
  locale: string,
): Messages {
  const {enabled} = persisted.get('postReplacement')
  console.log('replacements enabled:', enabled)
  if (!enabled || !locale.startsWith('en')) {
    return messages
  }

  // Traverse the entire messages catalog and apply replacements
  const transformedCatalog: Messages = {}
  for (const key in messages) {
    if (Object.prototype.hasOwnProperty.call(messages, key)) {
      transformedCatalog[key] = traverseAndReplace(messages[key])
    }
  }
  return transformedCatalog
}
