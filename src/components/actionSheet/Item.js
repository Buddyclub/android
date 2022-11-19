import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import Touchable from '../Touchable';
import Text from '../text';

export const Item = React.memo(({item, hide, theme}) => {
  const {colors} = theme;
  const onPress = () => {
    hide();
    item?.onPress();
  };

  return (
    <Touchable
      onPress={onPress}
      style={[styles.item]}
      theme={theme}
      // testID={item.testID}
    >
      {/* <CustomIcon
        name={item.icon}
        size={20}
        color={item.danger ? themes[theme].dangerColor : themes[theme].bodyText}
      /> */}
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} style={[styles.title]}>
          <Text>Test ActionSheet</Text>
        </Text>
      </View>
      {/* {item.right ? (
        <View style={styles.rightContainer}>
          {item.right ? item.right() : null}
        </View>
      ) : null} */}
    </Touchable>
  );
});
