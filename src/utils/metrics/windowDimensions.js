import ExtraDimensions from 'react-native-extra-dimensions-android';
import {PixelRatio} from 'react-native';

export default () => ({
  Dw: ExtraDimensions.get('REAL_WINDOW_WIDTH'),
  Dh: ExtraDimensions.get('REAL_WINDOW_HEIGHT'),
});

export const softMenuBarHeight = () =>
  ExtraDimensions.get('SOFT_MENU_BAR_HEIGHT');

export const ROW_HEIGHT = 75 * PixelRatio.getFontScale();
export const ROW_HEIGHT_CONDENSED = 60 * PixelRatio.getFontScale();
export const ACTION_WIDTH = 80;
export const SMALL_SWIPE = ACTION_WIDTH / 2;
export const LONG_SWIPE = ACTION_WIDTH * 3;
