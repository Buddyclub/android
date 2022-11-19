/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Avatar from '../avatar';
import Ttext from '../text';
import Touchable from '../Touchable';
import ButtonWrapped from '../button/button';
const ProfileComponent = ({
  data,
  isMe,
  followUnfollow,
  removeSpeaker,
  uid,
  user_id,
  isSpeaker,
  isMod,
}) => {
  const {colors} = useTheme();
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const [state, setState] = React.useState(() => {
    const _f = data?.follower.some(f => f?.id_following === uid);
    const _fm = data?.following.some(f => f?.id_followed === uid);
    return {
      isAmfollowing: _f,
      isfollowingMe: _fm,
    };
  });

  return (
    <View style={{paddingHorizontal: 20}}>
      {/* <View> */}
      <View style={{flexDirection: 'row'}}>
        <Avatar
          size={80}
          src={
            'https://graph.facebook.com/' + data?.FB_id + '/picture?type=large'
          }
          style={{}}
        />
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            paddingHorizontal: 25 + inset.left,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Followers', {
                name: 'Followers',
                user_id,
              });
            }}
            style={{flexDirection: 'column'}}>
            <Ttext bold style={{...styles.txt}}>
              {data?.num_follower}
            </Ttext>
            <Ttext>Followers</Ttext>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Following', {
                name: 'Following',
                user_id,
              });
            }}
            style={{paddingHorizontal: 20, flexDirection: 'column'}}>
            <Ttext bold style={{...styles.txt}}>
              {data?.num_following}
            </Ttext>
            <Ttext>Following</Ttext>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{paddingTop: 5}}>
        <View style={{marginBottom: 8}}>
          <Ttext bold>{data?.full_name}</Ttext>
          <Ttext medium>@{data?.user_name}</Ttext>
        </View>
        <Ttext style={{...styles.bio}}>{data?.bio}</Ttext>
      </View>
      {/* </View> */}
      {isMe ? (
        <ButtonWrapped
          containerStyle={styles.btn}
          event="EDITPROFILE"
          outline={true}
          titleStyle={{...styles.titleStyle, color: colors.snow}}
          type="darkSecondary"
          onPress={() =>
            navigation.navigate('EditProfile', {
              name: 'Edit Profile',
              ...data,
            })
          }
          title="Edit Profile"
        />
      ) : (
        <View>
          <TouchableOpacity
            style={{
              ...styles.btn,
              backgroundColor: state.isAmfollowing
                ? colors.accent
                : colors.grey,
            }}
            onPress={async () => {
              setState({isAmfollowing: !state.isAmfollowing});
              await followUnfollow(
                state.isAmfollowing ? 'following' : 'follow',
              );
            }}>
            <Ttext>
              {' '}
              {state.isAmfollowing
                ? 'Following'
                : state.isfollowingMe
                ? 'Follow Back'
                : 'Follow'}
            </Ttext>
          </TouchableOpacity>
        </View>
      )}
      {isMod && isSpeaker && !isMe && (
        <Touchable
          onPress={() => removeSpeaker()}
          style={{paddingTop: 28, alignSelf: 'center'}}>
          <Ttext bold style={{color: colors.danger}}>
            Remove Speaker
          </Ttext>
        </Touchable>
      )}
    </View>
  );
};
export default ProfileComponent;
const styles = StyleSheet.create({
  txt: {
    textAlign: 'center',
  },
  bio: {
    fontSize: 12,
  },
  btn: {
    marginTop: 20,
    height: 35,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 14,
  },
});
