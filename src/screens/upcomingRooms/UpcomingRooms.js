import * as React from 'react';
import {StyleSheet} from 'react-native';
import Card from '../../components/card';
import {useTheme} from 'react-native-paper';
import Ttext from '../../components/text';
import Screen from '../../components/screen';
const UpcomingRooms = props => {
  const {colors} = useTheme();
  return (
    <Screen style={{...styles.screen}}>
      <Card style={{padding: 20}}>
        <Ttext>We are Working on this Awesome feature</Ttext>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default React.memo(UpcomingRooms);
