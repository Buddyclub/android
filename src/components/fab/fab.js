import * as React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';

const Fab = ({color, onPress}) => (
  <FAB
    style={{...styles.fab, backgroundColor: color.accent}}
    icon="plus"
    onPress={onPress}
    color={color.snow}
    animated={true}
  />
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 5,
    bottom: 5,
    zIndex: 1200,
  },
});

export default Fab;
