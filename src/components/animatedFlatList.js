import * as React from 'react';
import {
  StyleSheet,
  SectionList,
  FlatList,
  SafeAreaView,
  View,
} from 'react-native';
import Animated, {interpolate} from 'react-native-reanimated';
import {createNativeWrapper} from 'react-native-gesture-handler';
import refreshControl from './refreshControl';

export const AnimatedFlatListWithRefreshControl = createNativeWrapper(
  Animated.createAnimatedComponent(refreshControl(FlatList)),
  {
    disallowInterruption: true,
    shouldCancelWhenOutside: false,
  },
);
