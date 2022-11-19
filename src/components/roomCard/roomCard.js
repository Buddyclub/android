/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {useTheme} from 'react-native-paper';
import Ttext from '../text';
import Card from '../../components/card';
import UserAvatar from '../avatar';
import Icon from '../icons/icon';

import {AnimatedFlatListWithRefreshControl} from '../animatedFlatList';

export const RoomCard = ({_navigate, data}) => {
  const {colors} = useTheme();
  const ref = React.useRef();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const renderRoomCard = React.useCallback(
    ({item}) => {
      const spk = item.peers.filter(sp => sp.room_permisions.isSpeaker);
      const lst = item.peers.filter(l => !l.room_permisions?.isSpeaker);
      return (
        <Card
          onPress={() => {
            _navigate(item?.room_id);
          }}
          style={{...style.card}}>
          <View
            style={{...style.liveIndicator, backgroundColor: colors.danger}}>
            <Ttext style={{...style.liveText}}>Live</Ttext>
          </View>
          <View style={{...style.avatatCont}}>
            {item?.peers.map((v, i) => {
              const {isMod, isSpeaker} = v.room_permisions;
              return (
                <UserAvatar
                  style={{...style.UserAvatar}}
                  isSpeaker={isSpeaker}
                  color={colors.snow}
                  key={i}
                  size={40}
                  mSize={16}
                  mic="mic"
                  src={v?.photo_url}
                />
              );
            })}
          </View>
          <View style={{...style.chipCont}}>
            <View style={{backgroundColor: colors.grey, ...style.chipRight}}>
              <Ttext medium>
                {spk?.length > 999 ? `+${spk?.length}` : spk?.length}
              </Ttext>
              <Icon name="mic" size={16} color={colors.snow} />
            </View>
            <View
              style={{
                backgroundColor: colors.grey,
                ...style.chipRight,
              }}>
              <Ttext medium style={{fontSize: 13}}>
                {lst?.length > 999 ? `+${lst?.length}` : lst?.length}
              </Ttext>
              <Icon name="headset" size={16} color={colors.snow} />
            </View>
          </View>
          <Ttext italic style={{color: colors.accent, fontSize: 13}}>
            {item?.room_name}
          </Ttext>
          <Ttext numberOfLines={4} ellipsizeMode="tail" bold>
            {item?.about_room}
          </Ttext>
        </Card>
      );
    },
    [colors.accent, colors.danger, colors.grey, colors.snow, _navigate],
  );

  return (
    <AnimatedFlatListWithRefreshControl
      ref={ref}
      data={data}
      style={{...style.inner}}
      renderItem={renderRoomCard}
      keyExtractor={(item, index) => String(index)}
      showsVerticalScrollIndicator={false}
      // stickyHeaderIndices={[2]}
      onScroll={Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {y: scrollY},
            },
          },
        ],
        {useNativeDriver: true},
      )}
      testID={'ROOMSDATA'}
    />
  );
};

const style = StyleSheet.create({
  card: {
    padding: 15,
    marginTop: 10,
    paddingTop: 2,
    marginVertical: 4,
    marginHorizontal: 8,
    backgroundColor: 'rgba(38,38,38, .779)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  liveIndicator: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 17,
    borderRadius: 4,
  },
  inner: {
    position: 'relative',
    flex: 1,
  },
  liveText: {
    fontSize: 13,
  },
  avatatCont: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    marginEnd: 8,
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  UserAvatar: {
    margin: 2,
  },
  chipCont: {
    position: 'absolute',
    flexDirection: 'row',
    top: 5,
    right: 0,
  },
  chipRight: {
    height: 20,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width: 50,
    flexDirection: 'row',
  },
});
