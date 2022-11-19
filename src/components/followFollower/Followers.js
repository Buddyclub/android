/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import Animated from 'react-native-reanimated';
import {useTheme} from 'react-native-paper';
import Card from '../card';
import Ttext from '../text/';
import UserAvatar from '../avatar/';
import Screen from '../screen';
import {AnimatedFlatListWithRefreshControl} from '../animatedFlatList';
import windowDimensions from '../../utils/metrics/windowDimensions';
const {Dw: width} = windowDimensions();

const FollowersList = ({item, conn, uid, r, followUnfollow, navigation}) => {
  const {colors} = useTheme();

  const [state, setState] = React.useState(() => {
    const _f = item?.u_following.follower.some(f => f?.id_following === uid);
    return {
      isAmfollowing: _f,
    };
  });

  return (
    <Card
      style={[{...styles.card, backgroundColor: colors.dark}]}
      onPress={() => {
        navigation.navigate('UserProfile', {
          user_id: item?.u_following?.user_id,
        });
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <UserAvatar
          src={
            'https://graph.facebook.com/' +
            item?.u_following?.FB_id +
            '/picture?type=large'
          }
          size={50}
          contentContainerStyle={{...styles.userAvatar}}
        />
        <View style={{paddingLeft: 10, width: width / 1.88}}>
          <Ttext style={styles.txtName}>{item?.u_following?.full_name}</Ttext>
          <Ttext
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.txtBio}
            medium>
            {item?.u_following?.bio}
          </Ttext>
        </View>
        {uid === item?.u_following?.user_id ? null : (
          <TouchableOpacity
            onPress={async () => {
              setState({isAmfollowing: !state.isAmfollowing});
              await followUnfollow(
                state.isAmfollowing ? 'following' : 'follow',
                item?.u_following?.user_id,
              );
            }}
            style={{
              ...styles.followBtn,
              backgroundColor: state.isAmfollowing
                ? colors.accent
                : colors.grey,
            }}>
            <Ttext>{state.isAmfollowing ? 'Following' : 'Follow'}</Ttext>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
};

const Followers = ({data, conn, uid, r, followUnfollow}) => {
  const ref = React.useRef();
  const navigation = useNavigation();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  // const {colors} = useTheme();

  // function keyExtractor(item) {
  //   return item?.index.toString();
  // }

  const renderItem = ({item}) => {
    return (
      <FollowersList
        item={item}
        followUnfollow={followUnfollow}
        uid={uid}
        navigation={navigation}
      />
    );
  };

  return (
    <Screen style={{...styles.screen}}>
      <AnimatedFlatListWithRefreshControl
        ref={ref}
        data={data}
        style={styles.inner}
        renderItem={renderItem}
        keyExtractor={(item, index) => String(index)}
        showsVerticalScrollIndicator={false}
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
        testID=""
      />
    </Screen>
  );
};

export default React.memo(Followers);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  txtName: {
    fontSize: 12,
  },
  txtBio: {
    fontSize: 11,
  },
  followBtn: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    right: 8,
    width: 90,
    height: 30,
    borderRadius: 50,
  },
  card: {
    paddingVertical: 10,
    marginVertical: 1,
    borderRadius: 0,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  inner: {
    position: 'relative',
    flex: 1,
  },
  list: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 64,
  },
  userAvatar: {
    left: 0,
  },
});
