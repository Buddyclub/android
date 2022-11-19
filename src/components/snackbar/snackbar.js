import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import Animated, {
  set,
  interpolateNode,
  Extrapolate,
  useCode,
  EasingNode,
} from 'react-native-reanimated';
import {useClock, timing} from 'react-native-redash/lib/module/v1';

import {useTheme} from 'react-native-paper';

import {rgba} from '../../theme/theme';

import getWindowDimensions from '../../utils/metrics/windowDimensions';
import LText from '../text';

const {Dw: width} = getWindowDimensions();

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableHighlight);

export default function Snackbar({toast, onPress, onClose}) {
  const [anim] = useState(new Animated.Value(0));

  const clock = useClock();
  const [closed, setIsClosed] = useState(false);

  useCode(
    () =>
      set(
        anim,
        timing({
          duration: 800,
          easing: EasingNode.ease,
          clock,
          from: anim,
          to: new Animated.Value(closed ? 0 : 1),
        }),
      ),
    [closed],
  );

  const handleClose = useCallback(() => {
    setIsClosed(true);
    setTimeout(() => onClose(toast), 1000);
  }, [onClose, toast]);

  const handleOnPress = useCallback(() => {
    onPress(toast);
  }, [onPress, toast]);

  const {colors} = useTheme();

  const {title, type} = toast;

  // const iconColors = {
  //   info: colors.live,
  //   warning: colors.orange,
  // };

  // const Icon = icon && icons[icon];
  // const iconColor = icon && iconColors[icon];

  const maxHeight = interpolateNode(anim, {
    inputRange: [0, 0.4, 1],
    outputRange: [0, 200, 200],
    extrapolate: Extrapolate.CLAMP,
  });

  const translateX = interpolateNode(anim, {
    inputRange: [0, 0.6, 1],
    outputRange: [width + 100, width - 100, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const opacity = interpolateNode(anim, {
    inputRange: [0, 0.6, 1],
    outputRange: [0, 0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.root,
        {
          backgroundColor: colors.accent,
          maxHeight,
          transform: [{translateX}],
          opacity,
        },
      ]}
      onPress={handleOnPress}
      underlayColor={rgba(colors.primary, 0.8)}>
      <View style={styles.container}>
        {/* <View style={styles.leftSection}>
          {Icon && <Icon size={17} color={iconColor} />}
        </View> */}
        <View style={styles.rightSection}>
          <LText bold style={styles.subTitle} color={colors.snow}>
            {type}
          </LText>
          <LText semiBold style={[styles.title, {color: colors.snow}]}>
            {title}
          </LText>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          {/* <Close size={16} color={colors.snackBarColor} /> */}
          <LText>Close</LText>
        </TouchableOpacity>
      </View>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 4,
    marginBottom: 0,
  },
  container: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 36,
  },
  leftSection: {width: 18, marginRight: 14},
  rightSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {fontSize: 14},
  subTitle: {fontSize: 8, textTransform: 'uppercase', letterSpacing: 1.5},
  closeButton: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
