import React from 'react';
import {Avatar} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import Icon from '../icons/icon';

const UserAvatar = ({
  style,
  src,
  size,
  color,
  mic,
  isMuted,
  mSize,
  contentContainerStyle,
}) => {
  return (
    <View style={{...contentContainerStyle}}>
      <Avatar.Image size={size} style={{...style}} source={{uri: src}} />
      {isMuted && (
        <Icon name={mic} size={mSize} color={color} style={styles.micIcon} />
      )}
    </View>
  );
};

export default UserAvatar;

const styles = StyleSheet.create({
  micIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
