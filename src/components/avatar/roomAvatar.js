import React from 'react';
import FastImage from 'react-native-fast-image';
import {View, StyleSheet} from 'react-native';
import Icon from '../icons/icon';

const RoomAvatar = ({
  style,
  src,
  size,
  color,
  mic,
  isSpeaker,
  mSize,
  contentContainerStyle,
}) => {
  return (
    <View style={{...contentContainerStyle}}>
      <FastImage
        style={{...style}}
        source={{
          uri: src,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />
      {isSpeaker && (
        <Icon name={mic} size={mSize} color={color} style={styles.micIcon} />
      )}
    </View>
  );
};

export default RoomAvatar;

const styles = StyleSheet.create({
  micIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
