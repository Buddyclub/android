/* @flow */

import {Platform} from 'react-native';
import {TransitionPresets} from '@react-navigation/stack';

export const DefaultNavigationOptions = theme => ({
  gestureEnabled: false,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: {
      animation: 'timing',
      delay: 10000,
    },
    close: {
      animation: 'timing',
      config: {
        duration: 300,
      },
    },
  },
  //: {current: {progress: number}}
  cardStyleInterpolator: ({current}) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
  headerStyle: {
    elevation: 0,
  },
  headerTitleStyle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
  },
  // headerTintColor: theme.colors.toolbarTint,
  headerPressColorAndroid: 'rgba(255, 255, 255, .20)',
  // cardStyle: {
  //   backgroundColor: theme.colors.background,
  // },
  headerTitle: null,

  ...(Platform.OS === 'android'
    ? TransitionPresets.FadeFromBottomAndroid
    : undefined),
});
