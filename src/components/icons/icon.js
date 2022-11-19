import * as React from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {StyleSheet} from 'react-native';

const Icon = ({name, size, color, style}) => (
  <MaterialIcon
    style={[{...styles.icon}, style]}
    name={name}
    color={color}
    size={size}
  />
);

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});

export default Icon;
