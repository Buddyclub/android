import React from 'react';
import {StyleSheet, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import ButtonUseTouchable from '../useContext/buttonUseTouchable';
import getWindowDimensions from '../utils/metrics/windowDimensions';
import {useDimensions} from '../utils/metrics/dimensions';

// export type Props = {
//   id?: string,
//   isOpened?: boolean,
//   onClose?: () => void,
//   onModalHide?: () => void,
//   children?: *,
//   style?: ViewStyleProp,
//   preventBackdropClick?: boolean,
//   containerStyle?: ViewStyleProp,
//   styles?: ViewStyleProp,
// };

// Add some extra padding at the bottom of the modal
// and make it overflow the bottom of the screen
// so that the underlying UI doesn't show up
// when it gets the position wrong and display too high
// See Jira LL-451 and GitHub #617
const EXTRA_PADDING_SAMSUNG_FIX = 100;

// const {Dw: width, Dh: height} = getWindowDimensions();

const RnModal = ({
  isOpened,
  onClose,
  children,
  preventBackdropClick,
  id,
  containerStyle,
  styles: propStyles,
  ...rest
}) => {
  const {height, width} = useDimensions();
  const backDropProps = preventBackdropClick
    ? {}
    : {
        onBackdropPress: onClose,
        onBackButtonPress: onClose,
      };
  return (
    <ButtonUseTouchable.Provider value={true}>
      <ReactNativeModal
        {...rest}
        {...backDropProps}
        backdropOpacity={0.93}
        testID={id}
        isVisible={isOpened}
        deviceWidth={width}
        deviceHeight={height}
        animationInTiming={1000}
        animationOutTiming={1000}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        useNativeDriver={true}
        hideModalContentWhileAnimating
        style={[styles.root, propStyles || {}]}>
        <View style={[styles.modal, containerStyle]}>{children}</View>
      </ReactNativeModal>
    </ButtonUseTouchable.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    margin: 0,
  },
  modal: {
    alignSelf: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 8,
    paddingBottom: 10,
    marginBottom: EXTRA_PADDING_SAMSUNG_FIX * -1,
  },
});

export default RnModal;
