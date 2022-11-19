import React, {useRef, useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';

import Avatar from '../../avatar';
import Ttext from '../../text';
import Icon from '../../icons/icon';
import getWindowdimensions from '../../../utils/metrics/windowDimensions';
const {Dh: height, Dw: width} = getWindowdimensions();
import Touchable from '../../Touchable';
const ListenersList = React.memo(({navigation, data, room_id}) => {
  const {colors} = useTheme();
  return (
    <>
      <Ttext bold style={{paddingHorizontal: 20, paddingTop: 15}}>
        Listeners
      </Ttext>
      <View style={{...styles.scrollviwCont}}>
        {data.map((v, i) => {
          const user_id = v?.user_id;
          const photoUrl =
            'https://graph.facebook.com/' + v?.FB_id + '/picture?type=large';
          return (
            <Touchable
              onPress={() => navigation.navigate('UserProfile', {user_id})}
              key={i}>
              <View style={{...styles.listenerAvatarCont}}>
                <Avatar src={photoUrl} size={50} />
                <Ttext style={{fontSize: 12, paddingHorizontal: 10}}>
                  {v?.user_name}
                </Ttext>
              </View>
            </Touchable>
          );
        })}
      </View>
    </>
  );
});

export default ListenersList;

const styles = StyleSheet.create({
  scrollviwCont: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    overflow: 'hidden',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  listenerAvatarCont: {
    margin: 5,
  },
  speakerName: {
    position: 'absolute',
    bottom: -3,
    left: 25,
    fontSize: 14,
  },
});
