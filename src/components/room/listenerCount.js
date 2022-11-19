import React from 'react';
import {View} from 'react-native';
import Ttext from '../text';
import Icon from '../icons/icon';

export default React.memo(({count, styles, colors}) => {
  return (
    <View style={{backgroundColor: colors.grey, ...styles}}>
      <Ttext medium>{count}</Ttext>
      <Icon name="headset" size={16} color={colors.snow} />
    </View>
  );
});
