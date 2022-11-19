import React from 'react';
import {View} from 'react-native';

import styles from './styles';

export const Handle = React.memo(({colors}) => (
  <View
    style={[styles.handle, {backgroundColor: colors.background}]}
    testID="action-sheet-handle">
    <View style={[styles.handleIndicator, {backgroundColor: colors.snow}]} />
  </View>
));
