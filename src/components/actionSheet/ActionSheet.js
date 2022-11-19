import React, {
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  memo,
} from 'react';
import {Keyboard} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {State, TapGestureHandler} from 'react-native-gesture-handler';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import Animated, {
  Extrapolate,
  Value,
  interpolateNode,
  EasingNode,
} from 'react-native-reanimated';
import {useTheme} from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import styles, {ITEM_HEIGHT} from './styles';

import {useBackHandler} from '@react-native-community/hooks';
import {useDimensions, useOrientation} from '../../utils/metrics/dimensions';
import {Handle} from './Handle';
import Touchable from '../Touchable';
import {Item} from './Item';
import Text from '../text';
import ListSeparator from '../ListSeparator';

const getItemLayout = (data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

const HANDLE_HEIGHT = 56;
const MAX_SNAP_HEIGHT = 16;
const CANCEL_HEIGHT = 64;

const ANIMATION_DURATION = 250;

const ANIMATION_CONFIG = {
  duration: ANIMATION_DURATION,
  // https://easings.net/#easeInOutCubic
  easing: EasingNode.bezier(0.645, 0.045, 0.355, 1.0),
};

const ActionSheet = memo(
  forwardRef(({children, theme}, ref) => {
    const bottomSheetRef = useRef();
    const [data, setData] = useState({});
    const [isVisible, setVisible] = useState(false);
    const {height} = useDimensions();
    const {isLandscape} = useOrientation();
    const insets = useSafeAreaInsets();
    const {colors} = useTheme();
    const maxSnap = Math.max(
      height -
        // Items height
        ITEM_HEIGHT * (data?.options?.length || 0) -
        // Handle height
        HANDLE_HEIGHT -
        // Custom header height
        (data?.headerHeight || 0) -
        // Insets bottom height (Notch devices)
        insets.bottom -
        // Cancel button height
        (data?.hasCancel ? CANCEL_HEIGHT : 0),
      MAX_SNAP_HEIGHT,
    );

    /*
     * if the action sheet cover more
     * than 60% of the whole screen
     * and it's not at the landscape mode
     * we'll provide more one snap
     * that point 50% of the whole screen
     */
    const snaps =
      height - maxSnap > height * 0.6 && !isLandscape
        ? [maxSnap, height * 0.5, height]
        : [maxSnap, height];
    const openedSnapIndex = snaps.length > 2 ? 1 : 0;
    const closedSnapIndex = snaps.length - 1;

    const toggleVisible = () => setVisible(!isVisible);

    const hide = () => {
      bottomSheetRef.current?.snapTo(closedSnapIndex);
    };

    const show = options => {
      setData(options);
      toggleVisible();
    };

    const onBackdropPressed = ({nativeEvent}) => {
      if (nativeEvent.oldState === State.ACTIVE) {
        hide();
      }
    };

    useBackHandler(() => {
      if (isVisible) {
        hide();
      }
      return isVisible;
    });

    useEffect(() => {
      if (isVisible) {
        Keyboard.dismiss();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        bottomSheetRef.current?.snapTo(openedSnapIndex);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    // Hides action sheet when orientation changes
    useEffect(() => {
      setVisible(false);
    }, [isLandscape]);

    useImperativeHandle(ref, () => ({
      showActionSheet: show,
      hideActionSheet: hide,
    }));
    const animatedPosition = React.useRef(new Value(0));
    // TODO: Similar to https://github.com/wcandillon/react-native-redash/issues/307#issuecomment-827442320
    const opacity = interpolateNode(animatedPosition.current, {
      inputRange: [0, 1],
      outputRange: [0, 0.9],
      extrapolate: Extrapolate.CLAMP,
    });
    const renderHandle = () => (
      <>
        <Handle colors={colors} />
        {/* {isValidElement(data?.customHeader) ? data.customHeader : null} */}
      </>
    );
    const renderFooter = () =>
      data?.hasCancel
        ? null
        : // <Touchable
          //   onPress={hide}
          //   style={[styles.button, {backgroundColor: colors.snow}]}
          //   theme={theme}>
          //   <Text style={[styles.text, {color: colors.snow}]}>Cancel</Text>
          // </Touchable>
          null;
    const renderItem = ({item}) => (
      <Item item={item} hide={hide} theme={theme} />
    );

    return (
      <>
        {children}
        {isVisible && (
          <>
            <TapGestureHandler onHandlerStateChange={onBackdropPressed}>
              <Animated.View
                testID="action-sheet-backdrop"
                style={[
                  styles.backdrop,
                  {
                    backgroundColor: colors.background,
                    opacity,
                  },
                ]}
              />
            </TapGestureHandler>
            <ScrollBottomSheet
              testID="action-sheet"
              ref={bottomSheetRef}
              componentType="FlatList"
              snapPoints={snaps}
              initialSnapIndex={closedSnapIndex}
              renderHandle={renderHandle}
              onSettle={index => index === closedSnapIndex && toggleVisible()}
              animatedPosition={animatedPosition.current}
              containerStyle={[
                styles.container,
                {backgroundColor: colors.background},
                // (isLandscape || isTablet) && styles.bottomSheet,,
              ]}
              animationConfig={ANIMATION_CONFIG}
              // FlatList props
              data={data?.options}
              renderItem={renderItem}
              keyExtractor={item => item?.title}
              style={{backgroundColor: colors.background}}
              contentContainerStyle={styles.content}
              ItemSeparatorComponent={ListSeparator}
              ListHeaderComponent={ListSeparator}
              ListFooterComponent={renderFooter}
              getItemLayout={getItemLayout}
              showsVerticalScrollIndicator={false}
              // removeClippedSubviews={isIOS}
            />
          </>
        )}
      </>
    );
  }),
);

export default ActionSheet;
