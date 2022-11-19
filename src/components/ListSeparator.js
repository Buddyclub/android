import React from 'react';
import {StyleSheet, View} from 'react-native';
import {withTheme} from 'react-native-paper';

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});

const ListSeparator = React.memo(({style, theme: {colors}}) => (
  <View
    style={[styles.separator, style, {backgroundColor: colors?.separatorColor}]}
  />
));

ListSeparator.displayName = 'List.Separator';

export default withTheme(ListSeparator);
