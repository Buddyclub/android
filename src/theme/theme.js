import {DarkTheme as NavigationDarkTheme} from '@react-navigation/native';
import {DarkTheme as PaperDarkTheme} from 'react-native-paper';
import color from 'color';
import {customFonts} from './fonsts';

const accent = '#33cc66';
const background = '#0e011d';
const surface = 'rgb(14, 1, 29)';
const selected = '#474747';
const primary = '#150329';
const separatorColor = '#2b2b2d';
// #33cc66 #1db954 strong cyan-lime-green

export const rgba = (c, a) => color(c).alpha(a).rgb().toString();

export const darken = (c, a) => color(c).darken(a).toString();

export const lighten = (c, a) => color(c).lighten(a).toString();

export const defaultTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  fonts: {...customFonts},
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    dark: 'rgba(14, 1, 29, 1)' /** hex color #0e011d */,
    borderColor: '#555555',
    background,
    surface,
    selected,
    coal: '#000000',
    accent,
    info: '#2d88ff', //#0800f5
    primary,
    grey: '#262626',
    statusBar: '#D105C6',
    snow: '#FFFFFF',
    toolbar: PaperDarkTheme.colors.background,
    toolbarTint: PaperDarkTheme.colors.text,
    bluish: '#F1F1F7',
    danger: '#FF1358',
    separatorColor,
  },
};
