import React from 'react'
import {createTheme, type Theme, type ThemeName} from '@bsky.app/alf'
import chroma from 'chroma-js'

import {useThemePrefs} from '#/state/shell/color-mode'
import {
  computeFontScaleMultiplier,
  getFontFamily,
  getFontScale,
  setFontFamily as persistFontFamily,
  setFontScale as persistFontScale,
} from '#/alf/fonts'
import {
  blackskyscheme,
  blueskyscheme,
  deerscheme,
  kittyscheme,
  type Palette,
  reddwarfscheme,
  themes,
  witchskyscheme,
  zeppelinscheme,
} from '#/alf/themes'
import {type Device} from '#/storage'

export {
  type TextStyleProp,
  type Theme,
  utils,
  type ViewStyleProp,
} from '@bsky.app/alf'
export {atoms} from '#/alf/atoms'
export * from '#/alf/breakpoints'
export * from '#/alf/fonts'
export * as tokens from '#/alf/tokens'
export * from '#/alf/util/flatten'
export * from '#/alf/util/platform'
export * from '#/alf/util/themeSelector'
export * from '#/alf/util/useGutters'

export type Alf = {
  themeName: ThemeName
  theme: Theme
  themes: typeof themes
  fonts: {
    scale: Exclude<Device['fontScale'], undefined>
    scaleMultiplier: number
    family: Device['fontFamily']
    setFontScale: (fontScale: Exclude<Device['fontScale'], undefined>) => void
    setFontFamily: (fontFamily: Device['fontFamily']) => void
  }
  /**
   * Feature flags or other gated options
   */
  flags: {}
}

/*
 * Context
 */
export const Context = React.createContext<Alf>({
  themeName: 'light',
  theme: themes.light,
  themes,
  fonts: {
    scale: getFontScale(),
    scaleMultiplier: computeFontScaleMultiplier(getFontScale()),
    family: getFontFamily(),
    setFontScale: () => {},
    setFontFamily: () => {},
  },
  flags: {},
})
Context.displayName = 'AlfContext'

export type SchemeType = typeof themes

export function changeHue(colorStr: string, hueShift: number) {
  if (!hueShift || hueShift === 0) return colorStr

  const color = chroma(colorStr).oklch()

  const newHue = (color[2] + hueShift + 360) % 360

  return chroma.oklch(color[0], color[1], newHue).hex()
}

export function shiftPalette(palette: Palette, hueShift: number): Palette {
  const newPalette = {...palette}
  const keys = Object.keys(newPalette) as Array<keyof Palette>

  keys.forEach(key => {
    newPalette[key] = changeHue(newPalette[key], hueShift)
  })

  return newPalette
}

export function hueShifter(scheme: SchemeType, hueShift: number): SchemeType {
  if (!hueShift || hueShift === 0) {
    return scheme
  }

  const lightPalette = shiftPalette(scheme.lightPalette, hueShift)
  const darkPalette = shiftPalette(scheme.darkPalette, hueShift)
  const dimPalette = shiftPalette(scheme.dimPalette, hueShift)

  const light = createTheme({
    scheme: 'light',
    name: 'light',
    palette: lightPalette,
  })

  const dark = createTheme({
    scheme: 'dark',
    name: 'dark',
    palette: darkPalette,
    options: {
      shadowOpacity: 0.4,
    },
  })

  const dim = createTheme({
    scheme: 'dark',
    name: 'dim',
    palette: dimPalette,
    options: {
      shadowOpacity: 0.4,
    },
  })

  return {
    lightPalette,
    darkPalette,
    dimPalette,
    light,
    dark,
    dim,
  }
}

export function selectScheme(colorScheme: string | undefined): SchemeType {
  switch (colorScheme) {
    case 'witchsky':
      return witchskyscheme
    case 'bluesky':
      return blueskyscheme
    case 'blacksky':
      return blackskyscheme
    case 'deer':
      return deerscheme
    case 'zeppelin':
      return zeppelinscheme
    case 'kitty':
      return kittyscheme
    case 'reddwarf':
      return reddwarfscheme
    default:
      return themes
  }
}

export function ThemeProvider({
  children,
  theme: themeName,
}: React.PropsWithChildren<{theme: ThemeName}>) {
  const {colorScheme, hue} = useThemePrefs()
  const currentScheme = selectScheme(colorScheme)
  const [fontScale, setFontScale] = React.useState<Alf['fonts']['scale']>(() =>
    getFontScale(),
  )
  const [fontScaleMultiplier, setFontScaleMultiplier] = React.useState(() =>
    computeFontScaleMultiplier(fontScale),
  )
  const setFontScaleAndPersist = React.useCallback<
    Alf['fonts']['setFontScale']
  >(
    fs => {
      setFontScale(fs)
      persistFontScale(fs)
      setFontScaleMultiplier(computeFontScaleMultiplier(fs))
    },
    [setFontScale],
  )
  const [fontFamily, setFontFamily] = React.useState<Alf['fonts']['family']>(
    () => getFontFamily(),
  )
  const setFontFamilyAndPersist = React.useCallback<
    Alf['fonts']['setFontFamily']
  >(
    ff => {
      setFontFamily(ff)
      persistFontFamily(ff)
    },
    [setFontFamily],
  )

  const value = React.useMemo<Alf>(
    () => ({
      themes: hueShifter(currentScheme, hue),
      themeName: themeName,
      theme: hueShifter(currentScheme, hue)[themeName],
      fonts: {
        scale: fontScale,
        scaleMultiplier: fontScaleMultiplier,
        family: fontFamily,
        setFontScale: setFontScaleAndPersist,
        setFontFamily: setFontFamilyAndPersist,
      },
      flags: {},
    }),
    [
      currentScheme,
      hue,
      themeName,
      fontScale,
      fontScaleMultiplier,
      fontFamily,
      setFontScaleAndPersist,
      setFontFamilyAndPersist,
    ],
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useAlf() {
  return React.useContext(Context)
}

export function useTheme(theme?: ThemeName) {
  const alf = useAlf()
  return React.useMemo(() => {
    return theme ? alf.themes[theme] : alf.theme
  }, [theme, alf])
}
