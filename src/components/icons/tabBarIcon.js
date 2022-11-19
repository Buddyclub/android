import * as React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {StyleSheet} from 'react-native';

const tabBarIcon =
  name =>
  ({color}) =>
    <Feather style={styles.icon} name={name} color={color} size={24} />;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});

export default tabBarIcon;
