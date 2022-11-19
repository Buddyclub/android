/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
// import Animated from 'react-native-reanimated';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/core';
import {connect} from 'react-redux';
import Avatar from '../../avatar';
import Ttext from '../../text';
// import Icon from '../../icons/icon';

// import getWindowdimensions from '../../../utils/metrics/windowDimensions';
import extraStatusBarPadding from '../../../utils/metrics/extraStatusBarPadding';
// import {AnimatedFlatListWithRefreshControl} from '../../animatedFlatList';
import Requests from '../requests/requests';

import Touchable from '../../Touchable';

import {dequal} from 'dequal';

// const {Dh: height, Dw: width} = getWindowdimensions();

const SpeakingIndicator = React.memo(props => {
  const {colors} = useTheme();
  const {photoUrl, isMuted, volume, userId, user} = props;
  let borderColor;

  if (volume > -65 && user === userId) {
    borderColor = colors.danger;
  }

  const border_color = isMuted ? colors.dark : borderColor;
  return (
    <View style={[{...styles.speakingIndicator, borderColor: border_color}]}>
      <Avatar
        src={photoUrl}
        mSize={22}
        style={styles.avatarImg}
        isMuted={isMuted}
        size={68}
        mic="mic-off"
        color={colors.danger}
      />
    </View>
  );
});

const mapSpeakingStateToProps = state => {
  const data = state.speakingChange;
  return {...data};
};

const SpeakingChange = connect(
  mapSpeakingStateToProps,
  null,
  null,
)(SpeakingIndicator);

/**
 * Speakers Component
 */

const Speakers = React.memo(
  ({speakers, muted_speakers_obj, moderator, room_id}) => {
    const navigation = useNavigation();

    const speakersList = React.useMemo(() => {
      return (
        <>
          {speakers.map((v, i) => {
            const user_id = v.user.user_id;
            let isMuted;
            if (user_id in muted_speakers_obj) {
              isMuted = !muted_speakers_obj[user_id];
            }
            const photoUrl =
              'https://graph.facebook.com/' +
              v.user.FB_id +
              '/picture?type=large';
            return (
              <Touchable
                key={i}
                style={[{}]}
                onPress={() =>
                  navigation.navigate('UserProfile', {
                    user_id,
                    isSpeaker: true,
                    moderator,
                    room_id,
                  })
                }>
                <SpeakingChange
                  isMuted={isMuted}
                  photoUrl={photoUrl}
                  user={user_id}
                />
                <Ttext style={styles.speakerName}>{v.user.user_name}</Ttext>
              </Touchable>
            );
          })}
        </>
      );
    }, [moderator, muted_speakers_obj, navigation, room_id, speakers]);

    return <>{speakersList}</>;
  },
);

const mapStateToProps = state => {
  const {muted_speakers_obj, room_id} = state.room_data;
  return {
    muted_speakers_obj,
    room_id,
  };
};

const SpeakersComponent = connect(mapStateToProps)(Speakers);

/**
 * Listners component
 */

const Listeners = React.memo(({listeners}) => {
  const navigation = useNavigation();

  let numListeners: [];
  let remListeners: Number;

  if (listeners.length <= 50) {
    numListeners = listeners;
  } else {
    numListeners = listeners.splice(50);
    remListeners = listeners.length - numListeners.length;
  }

  console.log('Listners component');
  const listenerList = React.useMemo(() => {
    return (
      <>
        <Ttext bold style={{paddingHorizontal: 20, paddingTop: 15}}>
          Listeners
        </Ttext>
        <View style={{...styles.scrollviwCont}}>
          {numListeners.map((v, i) => {
            const user_id = v.user.user_id;
            const photoUrl =
              'https://graph.facebook.com/' +
              v.user.FB_id +
              '/picture?type=large';
            return (
              <Touchable
                onPress={() => navigation.navigate('UserProfile', {user_id})}
                key={i}>
                <View style={{...styles.listenerAvatarCont}}>
                  <Avatar src={photoUrl} size={50} />
                  <Ttext style={{fontSize: 12, paddingHorizontal: 10}}>
                    {v.user.user_name}
                  </Ttext>
                </View>
              </Touchable>
            );
          })}
          {remListeners > 0 && (
            <View style={{}}>
              <Ttext>+{remListeners}</Ttext>
            </View>
          )}
        </View>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listeners]);
  return <>{listenerList}</>;
});

const SpeakersList = React.memo(
  ({speakers, listeners, roomCreator, moderator}) => {
    return (
      <View style={{...styles.speakerCont}}>
        <ScrollView
          horizontal={false}
          decelerationRate="normal"
          showsVerticalScrollIndicator={false}>
          <View style={{...styles.scrollviwCont, justifyContent: 'center'}}>
            <SpeakersComponent speakers={speakers} moderator={moderator} />
          </View>
          <Requests />
          <Listeners listeners={listeners} />
        </ScrollView>
      </View>
    );
  },
  (prevProps, nxtProps) => dequal(prevProps, nxtProps),
);

export default SpeakersList;

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
  inner: {
    position: 'relative',
    flex: 1,
  },
  speakerCont: {
    flex: 1,
    flexDirection: 'row',
    // marginBottom: 50,
  },
  avatarImg: {
    alignSelf: 'center',
  },
  contentContainer: {
    paddingBottom: extraStatusBarPadding + 35,
    paddingHorizontal: 4,
  },
  listenerAvatarCont: {
    margin: 5,
  },
  speakingIndicator: {
    width: 75,
    height: 75,
    // padding: 20,
    margin: 2,
    borderRadius: 75 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
  },
  speakerName: {
    marginTop: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  micIcon: {
    position: 'absolute',
    right: 1,
    bottom: 0,
  },
});
