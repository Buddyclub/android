import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import Screen from '../../components/screen';
import {useFetch} from '../../data-fetching-hooks/useFetch';
import {RoomCard} from '../../components/roomCard/roomCard';
import Fab from '../../components/fab';
import Loading from '../../components/loadingApp';
import Text from '../../components/text';

const HomeScreen = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  const joinRoom = React.useCallback(
    room_id => {
      navigation.navigate('Room', {room_id});
    },
    [navigation],
  );
  const createRoom = React.useCallback(() => {
    navigation.navigate('CreateRoom');
  }, [navigation]);

  // get all active rooms
  const opts = {
    shouldRetryOnError: true,
    errorRetryInterval: 2000,
    dedupingInterval: 1000,
    refreshInterval: 5000,
    revalidateIfStale: true,
  };

  const {data, error} = useFetch(opts, `rooms/lim/${100}/offs/${0}`, 'GET');

  if (!data) {
    <Loading />;
  }

  if (error) {
    return (
      <View style={{paddingLeft: 20}}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <Screen style={{...styles.screen}}>
      <RoomCard data={data} _navigate={joinRoom} />
      <Fab color={colors} onPress={createRoom} />
    </Screen>
  );
};
const styles = StyleSheet.create({
  screen: {flex: 1},
});
export default HomeScreen;
