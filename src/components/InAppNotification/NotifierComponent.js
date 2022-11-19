import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {Notifier} from 'react-native-notifier';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';

import UserAvatar from '../avatar/avatar';
import Text from '../text';
import {ROW_HEIGHT} from '../../utils/metrics/windowDimensions';

const BUTTON_HIT_SLOP = {top: 12, right: 12, bottom: 12, left: 12};
const AVATAR_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    height: ROW_HEIGHT,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
  },
  avatar: {
    marginRight: 10,
  },
  roomName: {
    fontSize: 15,
    lineHeight: 20,
  },
  message: {
    fontSize: 13,
    lineHeight: 17,
  },
  close: {
    marginLeft: 10,
  },
  small: {
    width: '50%',
    alignSelf: 'center',
  },
});

const hideNotification = () => Notifier.hideNotification();

const NotifierComponent = React.memo(({notification, isMasterDetail}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  const {payload, type} = notification;
  const {title, imgUrl, message} = payload;

  function onPress() {
    hideNotification();
  }
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
          marginTop: insets.top,
        },
      ]}>
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        hitSlop={BUTTON_HIT_SLOP}>
        <>
          {imgUrl && (
            <UserAvatar
              size={AVATAR_SIZE}
              src={imgUrl}
              style={{}}
              contentContainerStyle={{...styles.avatar}}
            />
          )}
          <View style={{flex: 1}}>
            <Text medium style={{...styles.roomName}} numberOfLines={2}>
              {title}
            </Text>
            <Text italic style={{...styles.message}} numberOfLines={1}>
              {message}
            </Text>
          </View>
        </>
      </TouchableOpacity>
    </View>
  );
});

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(NotifierComponent);
