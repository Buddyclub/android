/* eslint-disable react-native/no-inline-styles */
/* @flow */

import React, {Component} from 'react';
import {RectButton} from 'react-native-gesture-handler';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Ttext from '../text';
import ButtonUseTouchable from '../../useContext/buttonUseTouchable';
import {defaultTheme as c} from '../../theme/theme';
const {colors} = c;
const WAIT_TIME_BEFORE_SPINNER = 150;
const BUTTON_HEIGHT = 45;
const ANIM_OFFSET = 20;
const ANIM_DURATION = 300;

const ButtonWrapped = props => (
  <ButtonUseTouchable.Consumer>
    {useTouchable => <Button {...props} useTouchable={useTouchable} />}
  </ButtonUseTouchable.Consumer>
);

class Button extends Component {
  static defaultProps = {
    outline: true,
  };

  state = {
    pending: false,
    spinnerOn: false,
    anim: new Animated.Value(0),
  };

  timeout;

  unmounted = false;

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.unmounted = true;
  }

  onPress = async () => {
    const {onPress, event, eventProperties} = this.props;
    if (!onPress) {
      return;
    }
    // if (event) {
    //   track(event, eventProperties);
    // }
    let isPromise;
    try {
      const res = onPress();
      isPromise = !!res && !!res.then;
      if (isPromise) {
        // it's a promise, we will use pending/spinnerOn state
        this.setState({pending: true});
        this.timeout = setTimeout(() => {
          this.setState(({pending, spinnerOn}) => {
            if (spinnerOn || !pending) {
              return null;
            }
            return {spinnerOn: true};
          });

          Animated.spring(this.state.anim, {
            toValue: 1,
            duration: ANIM_DURATION,
            useNativeDriver: true,
          }).start();
        }, WAIT_TIME_BEFORE_SPINNER);
        await res;
      }
    } finally {
      if (isPromise) {
        clearTimeout(this.timeout);
        if (!this.unmounted) {
          this.setState(({pending}) =>
            pending ? {pending: false, spinnerOn: false} : null,
          );

          Animated.spring(this.state.anim, {
            toValue: 0,
            duration: ANIM_DURATION,
            useNativeDriver: true,
          }).start();
        }
      }
    }
  };

  render() {
    const {
      // required props
      title,
      onPress,
      titleStyle,
      IconLeft,
      IconRight,
      disabled,
      type,
      useTouchable,
      outline,
      // everything else
      containerStyle,
      ...otherProps
    } = this.props;

    if (__DEV__ && 'style' in otherProps) {
      console.warn(
        "Button props 'style' must not be used. Use 'containerStyle' instead.",
      );
    }

    const {pending, anim} = this.state;
    const isDisabled = disabled || !onPress || pending;

    const needsBorder =
      (type === 'secondary' ||
        type === 'tertiary' ||
        type === 'darkSecondary') &&
      !isDisabled &&
      outline;

    const mainContainerStyle = [
      styles.container,
      isDisabled ? styles.disabledContainer : styles[`${type}Container`],
      containerStyle,
    ];

    const borderStyle = [styles.outlineBorder, styles[`${type}OutlineBorder`]];

    const textStyle = [
      styles.title,
      titleStyle,
      isDisabled ? styles.disabledTitle : styles[`${type}Title`],
    ];

    const iconColor = isDisabled
      ? styles.disabledTitle.color
      : (styles[`${type}Title`] || {}).color;

    const titleSliderOffset = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -ANIM_OFFSET],
    });

    const titleOpacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const spinnerSliderOffset = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [ANIM_OFFSET, 0],
    });

    const titleSliderStyle = [
      styles.slider,
      {
        opacity: titleOpacity,
        transform: [{translateY: titleSliderOffset}],
      },
    ];

    const spinnerSliderStyle = [
      styles.spinnerSlider,
      {
        opacity: anim,
        transform: [{translateY: spinnerSliderOffset}],
      },
    ];

    const Container = useTouchable
      ? disabled
        ? View
        : TouchableOpacity
      : RectButton;
    const containerSpecificProps = useTouchable ? {} : {enabled: !isDisabled};

    return (
      // $FlowFixMe
      <Container
        onPress={isDisabled ? undefined : this.onPress}
        style={mainContainerStyle}
        {...containerSpecificProps}
        {...otherProps}>
        {needsBorder ? <View style={borderStyle} /> : null}

        <Animated.View style={titleSliderStyle}>
          {IconLeft ? (
            <View style={{paddingRight: title ? 10 : null}}>
              <IconLeft size={16} color={iconColor} />
            </View>
          ) : null}

          {title ? (
            <Ttext numberOfLines={1} semiBold style={textStyle}>
              {title}
            </Ttext>
          ) : null}

          {IconRight ? (
            <View style={{paddingLeft: title ? 10 : null}}>
              <IconRight size={16} color={iconColor} />
            </View>
          ) : null}
        </Animated.View>

        <Animated.View style={spinnerSliderStyle}>
          <ActivityIndicator color={colors.accent} />
        </Animated.View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  slider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  spinnerSlider: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
  },
  outlineBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1.5,
    borderRadius: 4,
  },

  // theme

  primaryContainer: {backgroundColor: colors.accent},
  primaryTitle: {color: colors.snow},

  lightPrimaryContainer: {backgroundColor: colors.primary},
  lightPrimaryTitle: {color: colors.snow},

  negativePrimaryContainer: {backgroundColor: colors.snow},
  negativePrimaryTitle: {color: colors.accent},

  secondaryContainer: {backgroundColor: 'transparent'},
  secondaryTitle: {color: colors.coal},
  secondaryOutlineBorder: {borderColor: colors.bluish},

  lightSecondaryContainer: {backgroundColor: 'transparent'},
  lightSecondaryTitle: {color: colors.accent},

  darkSecondaryContainer: {backgroundColor: 'transparent'},
  darkSecondaryTitle: {color: colors.snow},
  darkSecondaryOutlineBorder: {borderColor: colors.borderColor},

  tertiaryContainer: {backgroundColor: 'transparent'},
  tertiaryTitle: {color: colors.accent},
  tertiaryOutlineBorder: {borderColor: colors.accent},

  alertContainer: {backgroundColor: colors.error},
  alertTitle: {color: colors.snow},

  disabledContainer: {backgroundColor: colors.disabled},
  disabledTitle: {color: colors.grey},
});

export default ButtonWrapped;
