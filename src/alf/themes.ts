import {
  createThemes,
  // I REJECT NODE MODULE SOCIETY
  //  DEFAULT_PALETTE,
  //  DEFAULT_SUBDUED_PALETTE,
} from '@bsky.app/alf'

export type Palette = {
  white: string
  black: string
  like: string

  contrast_0: string
  contrast_25: string
  contrast_50: string
  contrast_100: string
  contrast_200: string
  contrast_300: string
  contrast_400: string
  contrast_500: string
  contrast_600: string
  contrast_700: string
  contrast_800: string
  contrast_900: string
  contrast_950: string
  contrast_975: string
  contrast_1000: string

  primary_25: string
  primary_50: string
  primary_100: string
  primary_200: string
  primary_300: string
  primary_400: string
  primary_500: string
  primary_600: string
  primary_700: string
  primary_800: string
  primary_900: string
  primary_950: string
  primary_975: string

  positive_25: string
  positive_50: string
  positive_100: string
  positive_200: string
  positive_300: string
  positive_400: string
  positive_500: string
  positive_600: string
  positive_700: string
  positive_800: string
  positive_900: string
  positive_950: string
  positive_975: string

  negative_25: string
  negative_50: string
  negative_100: string
  negative_200: string
  negative_300: string
  negative_400: string
  negative_500: string
  negative_600: string
  negative_700: string
  negative_800: string
  negative_900: string
  negative_950: string
  negative_975: string
}

export const DEFAULT_PALETTE: Palette = {
  white: '#FEFBFB',
  black: '#000000',
  like: '#dd5e8f',

  contrast_0: '#FEFBFB',
  contrast_25: '#ECE9E9',
  contrast_50: '#DBD8D8',
  contrast_100: '#C9C7C7',
  contrast_200: '#B8B6B6',
  contrast_300: '#A8A5A5',
  contrast_400: '#979595',
  contrast_500: '#878585',
  contrast_600: '#787575',
  contrast_700: '#686666',
  contrast_800: '#595757',
  contrast_900: '#4B4848',
  contrast_950: '#3D3A3A',
  contrast_975: '#1b1a1aff',
  contrast_1000: '#000000ff',

  primary_25: `hsl(5, 30%, 97%)`,
  primary_50: `hsl(5, 30%, 95%)`,
  primary_100: `hsl(5, 30%, 90%)`,
  primary_200: `hsl(5, 52%, 80%)`,
  primary_300: `hsl(5, 64%, 70%)`,
  primary_400: `hsl(5, 75%, 58%)`,
  primary_500: `hsl(5, 82%, 60%)`,
  primary_600: `hsl(5, 80%, 54%)`,
  primary_700: `hsl(5, 40%, 32%)`,
  primary_800: `hsl(5, 42%, 25%)`,
  primary_900: `hsl(5, 45%, 18%)`,
  primary_950: `hsl(5, 48%, 10%)`,
  primary_975: `hsl(5, 50%, 7%)`,

  positive_25: '#ECFEF5',
  positive_50: '#D3FDE8',
  positive_100: '#A3FACF',
  positive_200: '#6AF6B0',
  positive_300: '#2CF28F',
  positive_400: '#0DD370',
  positive_500: '#09B35E',
  positive_600: '#04904A',
  positive_700: '#036D38',
  positive_800: '#04522B',
  positive_900: '#033F21',
  positive_950: '#032A17',
  positive_975: '#021D0F',

  negative_25: '#FFF5F7',
  negative_50: '#FEE7EC',
  negative_100: '#FDD3DD',
  negative_200: '#FBBBCA',
  negative_300: '#F891A9',
  negative_400: '#F65A7F',
  negative_500: '#E91646',
  negative_600: '#CA123D',
  negative_700: '#A71134',
  negative_800: '#7F0B26',
  negative_900: '#5F071C',
  negative_950: '#430413',
  negative_975: '#30030D',
}

export const DEFAULT_SUBDUED_PALETTE: Palette = {
  white: '#FEFBFB',
  black: '#383434',
  like: '#dd5e8f',

  contrast_0: '#FEFBFB',
  contrast_25: '#ECE9E9',
  contrast_50: '#DBD8D8',
  contrast_100: '#C9C7C7',
  contrast_200: '#B8B6B6',
  contrast_300: '#A8A5A5',
  contrast_400: '#979595',
  contrast_500: '#878585',
  contrast_600: '#787575',
  contrast_700: '#686666',
  contrast_800: '#595757',
  contrast_900: '#4B4848',
  contrast_950: '#3D3A3A',
  contrast_975: '#2F2D2D',
  contrast_1000: '#222020',

  primary_25: `hsl(5, 30%, 97%)`,
  primary_50: `hsl(5, 30%, 95%)`,
  primary_100: `hsl(5, 30%, 90%)`,
  primary_200: `hsl(5, 52%, 80%)`,
  primary_300: `hsl(5, 64%, 70%)`,
  primary_400: `hsl(5, 84%, 66%)`,
  primary_500: `hsl(5, 82%, 60%)`,
  primary_600: `hsl(5, 80%, 54%)`,
  primary_700: `hsl(5, 58%, 55%)`,
  primary_800: `hsl(5, 42%, 25%)`,
  primary_900: `hsl(5, 45%, 18%)`,
  primary_950: `hsl(5, 48%, 10%)`,
  primary_975: `hsl(5, 50%, 7%)`,

  positive_25: '#ECFEF5',
  positive_50: '#D8FDEB',
  positive_100: '#A8FAD1',
  positive_200: '#6FF6B3',
  positive_300: '#31F291',
  positive_400: '#0EDD75',
  positive_500: '#0AC266',
  positive_600: '#049F52',
  positive_700: '#038142',
  positive_800: '#056636',
  positive_900: '#04522B',
  positive_950: '#053D21',
  positive_975: '#052917',

  negative_25: '#FFF5F7',
  negative_50: '#FEEBEF',
  negative_100: '#FDD8E1',
  negative_200: '#FCC0CE',
  negative_300: '#F99AB0',
  negative_400: '#F76486',
  negative_500: '#EB2452',
  negative_600: '#D81341',
  negative_700: '#BA1239',
  negative_800: '#910D2C',
  negative_900: '#6F0B22',
  negative_950: '#500B1C',
  negative_975: '#3E0915',
}

export function invertPalette(palette: Palette) {
  return {
    white: palette.white,
    black: palette.black,
    like: palette.like,

    contrast_0: palette.contrast_1000,
    contrast_25: palette.contrast_975,
    contrast_50: palette.contrast_950,
    contrast_100: palette.contrast_900,
    contrast_200: palette.contrast_800,
    contrast_300: palette.contrast_700,
    contrast_400: palette.contrast_600,
    contrast_500: palette.contrast_500,
    contrast_600: palette.contrast_400,
    contrast_700: palette.contrast_300,
    contrast_800: palette.contrast_200,
    contrast_900: palette.contrast_100,
    contrast_950: palette.contrast_50,
    contrast_975: palette.contrast_25,
    contrast_1000: palette.contrast_0,

    primary_25: palette.primary_975,
    primary_50: palette.primary_950,
    primary_100: palette.primary_900,
    primary_200: palette.primary_800,
    primary_300: palette.primary_700,
    primary_400: palette.primary_600,
    primary_500: palette.primary_500,
    primary_600: palette.primary_400,
    primary_700: palette.primary_300,
    primary_800: palette.primary_200,
    primary_900: palette.primary_100,
    primary_950: palette.primary_50,
    primary_975: palette.primary_25,

    positive_25: palette.positive_975,
    positive_50: palette.positive_950,
    positive_100: palette.positive_900,
    positive_200: palette.positive_800,
    positive_300: palette.positive_700,
    positive_400: palette.positive_600,
    positive_500: palette.positive_500,
    positive_600: palette.positive_400,
    positive_700: palette.positive_300,
    positive_800: palette.positive_200,
    positive_900: palette.positive_100,
    positive_950: palette.positive_50,
    positive_975: palette.positive_25,

    negative_25: palette.negative_975,
    negative_50: palette.negative_950,
    negative_100: palette.negative_900,
    negative_200: palette.negative_800,
    negative_300: palette.negative_700,
    negative_400: palette.negative_600,
    negative_500: palette.negative_500,
    negative_600: palette.negative_400,
    negative_700: palette.negative_300,
    negative_800: palette.negative_200,
    negative_900: palette.negative_100,
    negative_950: palette.negative_50,
    negative_975: palette.negative_25,
  }
}

const DEFAULT_THEMES = createThemes({
  defaultPalette: DEFAULT_PALETTE,
  subduedPalette: DEFAULT_SUBDUED_PALETTE,
})

export const themes = {
  lightPalette: DEFAULT_THEMES.light.palette,
  darkPalette: DEFAULT_THEMES.dark.palette,
  dimPalette: DEFAULT_THEMES.dim.palette,
  light: DEFAULT_THEMES.light,
  dark: DEFAULT_THEMES.dark,
  dim: DEFAULT_THEMES.dim,
}

/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export const lightPalette = DEFAULT_THEMES.light.palette
/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export const darkPalette = DEFAULT_THEMES.dark.palette
/**
 * @deprecated use ALF and access palette from `useTheme()`
 */
export const dimPalette = DEFAULT_THEMES.dim.palette
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export const light = DEFAULT_THEMES.light
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export const dark = DEFAULT_THEMES.dark
/**
 * @deprecated use ALF and access theme from `useTheme()`
 */
export const dim = DEFAULT_THEMES.dim
