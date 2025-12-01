import {type ReactNode, useMemo} from 'react'
import {createContext, useContext} from 'react'
import {type TextStyle, type ViewStyle} from 'react-native'
import {type ThemeName} from '@bsky.app/alf'

import {useThemePrefs} from '#/state/shell/color-mode'
import {hueShifter, type SchemeType, selectScheme} from '#/alf'
import {themes} from '#/alf/themes'
import {darkTheme, defaultTheme, dimTheme} from './themes'

export type ColorScheme = 'light' | 'dark'

export type PaletteColorName =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'inverted'
  | 'error'
export type PaletteColor = {
  background: string
  backgroundLight: string
  text: string
  textLight: string
  textInverted: string
  link: string
  border: string
  borderDark: string
  icon: string
  [k: string]: string
}
export type Palette = Record<PaletteColorName, PaletteColor>

export type ShapeName = 'button' | 'bigButton' | 'smallButton'
export type Shapes = Record<ShapeName, ViewStyle>

/**
 * @deprecated use typography atoms from `#/alf`
 */
export type TypographyVariant =
  | '2xl-thin'
  | '2xl'
  | '2xl-medium'
  | '2xl-bold'
  | '2xl-heavy'
  | 'xl-thin'
  | 'xl'
  | 'xl-medium'
  | 'xl-bold'
  | 'xl-heavy'
  | 'lg-thin'
  | 'lg'
  | 'lg-medium'
  | 'lg-bold'
  | 'lg-heavy'
  | 'md-thin'
  | 'md'
  | 'md-medium'
  | 'md-bold'
  | 'md-heavy'
  | 'sm-thin'
  | 'sm'
  | 'sm-medium'
  | 'sm-bold'
  | 'sm-heavy'
  | 'xs-thin'
  | 'xs'
  | 'xs-medium'
  | 'xs-bold'
  | 'xs-heavy'
  | 'title-2xl'
  | 'title-xl'
  | 'title-lg'
  | 'title'
  | 'title-sm'
  | 'post-text-lg'
  | 'post-text'
  | 'button'
  | 'button-lg'
  | 'mono'
export type Typography = Record<TypographyVariant, TextStyle>

export interface Theme {
  colorScheme: ColorScheme
  palette: Palette
  shapes: Shapes
  typography: Typography
}

export interface ThemeProviderProps {
  children?: ReactNode
  theme: ThemeName
}

export const ThemeContext = createContext<Theme>(
  defaultTheme({
    lightPalette: themes.lightPalette,
    darkPalette: themes.darkPalette,
  }),
)
ThemeContext.displayName = 'ThemeContext'

export const useTheme = () => useContext(ThemeContext)

function getTheme(themeName: ThemeName, scheme: SchemeType) {
  const paletteOptions = {
    lightPalette: scheme.lightPalette,
    darkPalette: scheme.darkPalette,
    dimPalette: scheme.dimPalette,
  }

  switch (themeName) {
    case 'light':
      return defaultTheme(paletteOptions)
    case 'dim':
      return dimTheme(paletteOptions)
    case 'dark':
      return darkTheme(paletteOptions)
    default:
      return defaultTheme(paletteOptions)
  }
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  children,
}) => {
  const {colorScheme, hue} = useThemePrefs()

  const themeValue = useMemo(() => {
    const currentScheme = hueShifter(selectScheme(colorScheme), hue)
    return getTheme(theme, currentScheme)
  }, [theme, colorScheme, hue])

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  )
}
