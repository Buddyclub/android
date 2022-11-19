/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/core';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Share from 'react-native-share';

import Ttext from '../../components/text';
import {useDispatch, connect} from 'react-redux';
import {removeRequests} from '../../redux/actions/setRequests';
import Icon from '../icons/icon';
import getWindowDimensions from '../../utils/metrics/windowDimensions';
import RoomBottomSheet from './bottomSheet';
import Speakerslist from './speakers';
// import _ from 'lodash';
import {event} from '../../utils/events/events';
import Touchable from '../Touchable';
import SpeakerCount from './speakercount';
import ListenerCount from './listenerCount';
import PeerRequests from './actions/peerRequest';
import {openRequestModal} from '../../redux/actions/setRequestModal';
import {openUpdateRoomTitleModal} from '../../redux/actions/setRoomUpdateTitleDescModal';
import EditRoomTitle from './actions/editRoomTitle';
import {dequal} from 'dequal';
const {Dw: width} = getWindowDimensions();

const RoomComponents = React.memo(
  ({
    data,
    requestTospeak,
    leaveRoom,
    user_id,
    conn,
    onClose,
    sendMessage,
    _openUpdateRoomTitleModal,
    retry,
  }) => {
    const {colors} = useTheme();
    // const inset = useSafeAreaInsets();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const _isSpeaker = React.useMemo(
      () =>
        data.peers.filter(sp => sp.user_id === user_id)[0].room_permisions
          .isSpeaker,
      [data.peers, user_id],
    );
    const isRoomCreater = React.useMemo(
      () => user_id === data.created_by_id,
      [data.created_by_id, user_id],
    );

    const roomCreator = React.useMemo(
      () => data.peers.filter(u => u.user_id === data.created_by_id),
      [data.created_by_id, data.peers],
    );

    const isMod = React.useMemo(
      () =>
        data.peers.filter(mod => mod.user_id === user_id)[0].room_permisions
          .isMod,
      [data.peers, user_id],
    );

    // const roomCreator = data.room_creator;

    const speakers = React.useMemo(
      () => data.peers.filter(u => u.room_permisions.isSpeaker),
      [data.peers],
    );

    const speakerCount = React.useMemo(() => {
      const sp = data.peers.filter(u => u.room_permisions.isSpeaker).length;
      return (
        <SpeakerCount count={sp} styles={styles.chipRight} colors={colors} />
      );
    }, [colors, data.peers]);

    const listeners = React.useMemo(
      () => data.peers.filter(u => !u.room_permisions.isSpeaker),
      [data.peers],
    );

    const listenerCount = React.useMemo(() => {
      const ls = data.peers.filter(u => !u.room_permisions.isSpeaker).length;
      return (
        <ListenerCount count={ls} styles={styles.chipRight} colors={colors} />
      );
    }, [colors, data.peers]);

    const addSpeaker = React.useCallback(
      // eslint-disable-next-line no-shadow
      async user_id => {
        const d = {
          user_id,
          room_id: data.room_id,
        };

        await conn.mutation.addSpeaker({...d});
        dispatch(removeRequests({id: d.user_id}));
        onClose();
      },
      [conn.mutation, data.room_id, dispatch, onClose],
    );

    const leaveStage = React.useCallback(async () => {
      await conn.mutation.removeSpeaker(user_id, data.room_id);
    }, [conn.mutation, data.room_id, user_id]);

    React.useEffect(() => {
      const listener = event.addEventListener(
        'transportconnectionstatedisconnected',
        ev => {
          let sp;
          if (!_isSpeaker && ev.direction === 'recv') {
            sp = false;
          }
          if (_isSpeaker && ev.direction === 'send') {
            sp = true;
          }

          if (typeof sp !== 'undefined') {
            // console.log(sp);
            retry(sp);
          }
        },
      );
      return () => {
        event.removeLister('transportconnectionstatedisconnected', listener);
      };
    }, [_isSpeaker, retry]);

    const shareRoom = React.useCallback(async () => {
      try {
        await Share.open({
          message: `Come join me on Budyclub 🙌✌ ${data.about_room}`,
          title: data.room_name,
          url: `https://budyclub.com/room/${data.room_id}`,
        });
      } catch (err) {
        console.log(err);
      }
    }, [data.about_room, data.room_id, data.room_name]);

    const shareApp = React.useCallback(async () => {
      try {
        Share.open({
          message:
            'Hi, I am on Budyclub, come join me😊, Click the link below to download the app on Play Store,',
          title: 'Budyclub App',
          url: 'https://play.google.com/store/apps/details?id=com.budyclub.app',
        });
      } catch (err) {
        console.log(err);
      }
    }, []);

    React.useEffect(() => {
      navigation.addListener('beforeRemove', e => {
        if (_isSpeaker && isRoomCreater) {
          e.preventDefault();
          const b = _isSpeaker && isRoomCreater;
          leaveRoom(b);
        } else if (_isSpeaker) {
          console.log('Speaker only');
          leaveRoom(false);
        } else {
          console.log('Listner');
          leaveRoom(false);
        }
      });
      return () => navigation.removeListener('beforeRemove');
    }, [_isSpeaker, isRoomCreater, leaveRoom, navigation]);

    console.log('roomcomponent', 2);

    const canEdit = isMod || isRoomCreater;
    return (
      <SafeAreaView
        style={{
          ...styles.screen,
          paddingTop: 0,
          backgroundColor: colors.dark,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <View
              style={{...styles.liveIndicator, backgroundColor: colors.danger}}>
              <Ttext style={{...styles.liveText}}>Live</Ttext>
            </View>
            {speakerCount}
            {listenerCount}
          </View>
          <View
            style={{
              ...styles.chipRight,
              position: 'absolute',
              right: 20,
              backgroundColor: colors.grey,
            }}>
            <Touchable onPress={shareApp} style={{flex: 1}}>
              <Icon name="share" size={16} color={colors.snow} />
            </Touchable>
          </View>
        </View>
        <Touchable
          onPress={() => _openUpdateRoomTitleModal()}
          style={{marginBottom: 8}}>
          <Ttext medium style={{paddingHorizontal: 20, paddingVertical: 8}}>
            {data.room_name}
          </Ttext>
          <Ttext
            numberOfLines={3}
            ellipsizeMode="tail"
            style={{paddingHorizontal: 20, bottom: 5}}>
            {data.about_room}
          </Ttext>
        </Touchable>
        <Speakerslist
          speakers={speakers}
          listeners={listeners}
          roomCreator={roomCreator}
          moderator={isMod}
        />
        <PeerRequests addSpeaker={addSpeaker} />
        <RoomBottomSheet
          user_id={user_id}
          conn={conn}
          requestTospeak={requestTospeak}
          leaveRoom={leaveRoom}
          leaveStage={leaveStage}
          shareRoom={shareRoom}
          _isSpeaker={_isSpeaker}
          _isRoomCreater={isRoomCreater}
          roomCreator={roomCreator}
          sendMessage={sendMessage}
        />
        {canEdit && (
          <EditRoomTitle
            name={data.room_name}
            description={data.about_room}
            conn={conn}
            room_id={data.room_id}
          />
        )}
      </SafeAreaView>
    );
  },
  (prevProps, nxtProps) =>
    dequal(prevProps.data?.peers, nxtProps.data?.peers) &&
    dequal(prevProps.data?.room_name, nxtProps.data?.room_name) &&
    dequal(prevProps.data?.about_room, nxtProps.data?.about_room),
);

const mapStateToProps = state => {
  const {room_data} = state;
  return {
    data: room_data,
  };
};
const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(openRequestModal()),
  _openUpdateRoomTitleModal: () => dispatch(openUpdateRoomTitleModal()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
)(RoomComponents);

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  roomCont: {
    // flex: 1,
    display: 'flex',
  },
  card: {
    padding: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 17,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 13,
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
  modalContent: {
    width: width - 80,
    borderRadius: 10,
  },
  avatorStyle: {
    alignSelf: 'center',
  },
  btn: {
    width: 100,
    height: 30,
    borderRadius: 4,
  },
  titleStyle: {
    fontSize: 14,
  },
});
