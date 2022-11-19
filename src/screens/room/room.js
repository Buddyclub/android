import * as React from 'react';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useDispatch, useSelector, connect} from 'react-redux';
import {dequal} from 'dequal';
import retry from 'async-retry';

import {useWrappedConn} from '../../globalHooks/useWebsocketConn';
import RoomComponents from '../../components/room';
import LoadingApp from '../../components/loadingApp';
import {updateRoomData} from '../../redux/actions/RoomData';
// import {useActionSheet} from '../../components/actionSheet';
import {budyclubNativeUtils} from '../../lib/incallManager/globalVars';
import {event} from '../../utils/events/events';
import {updateMessages} from '../../redux/actions/messages';
import {muteUnmute} from '../../redux/actions/muteUnmute';
import {useFetch} from '../../data-fetching-hooks/useFetch';

const NATIVE_AUDIO_MODE_IDLE = 'idle';
const NATIVE_AUDIO_MODE_VIDEO_CALL = 'video';

const Room = React.memo(
  ({
    route: {
      params: {room_id},
    },
    data,
    _mode,
  }) => {
    const conn = useWrappedConn();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // const {showActionSheet} = useActionSheet();
    const user_id = useSelector(state => state.setUserId.user_id);

    const [chatChecked, setChat] = React.useState(true);
    const [raiseHandChecked, setRaiseHand] = React.useState(false);

    const audioMode = _mode
      ? NATIVE_AUDIO_MODE_VIDEO_CALL
      : NATIVE_AUDIO_MODE_IDLE;

    const {error} = useFetch(
      {
        shouldRetryOnError: true,
        errorRetryInterval: 1000,
        revalidateIfStale: true,
        onSuccess: (_data, key) => {
          dispatch(updateRoomData({..._data}));
          // update mic state with the new data;
          if (user_id in _data.muted_speakers_obj) {
            dispatch(muteUnmute({muted: _data.muted_speakers_obj[user_id]}));
          }
          let messages = _data?.room_messages.map(m => m.message) ?? [];

          dispatch(updateMessages(messages));
        },
        onError: () => {},
        onErrorRetry: () => {},
      },
      `room/${room_id}/u/${user_id}`,
      'GET',
    );
    const _retry = React.useCallback(
      isSpeaker => {
        let retries = 0;
        try {
          return retry(
            async (bail, num) => {
              const res = await conn.query.reconnect({
                room_id,
                user_id,
                isSpeaker,
              });
              console.log('Success........', res, num); //Success........ true 6
              return res;
            },
            {
              retries: 10000,
              factor: 1,
              minTimeout: 200,
              onRetry: (err, i) => {
                if (err) {
                  console.log('Retry error', retries); // Retry error 4
                }
                retries = i;
              },
            },
          );
        } catch (err) {
          console.log('max....retries......', retries, err);
        }
      },
      [conn.query, room_id, user_id],
    );

    React.useEffect(() => {
      const listener = event.addEventListener('updateRoomSettings', d => {
        budyclubNativeUtils().setAudioMode(
          d === true ? NATIVE_AUDIO_MODE_VIDEO_CALL : NATIVE_AUDIO_MODE_IDLE,
        );
        budyclubNativeUtils().setShowOngoingMeetingNotification(
          d === true ? true : false,
          'Session',
          'Ongoing room session',
          'ic_daily_videocam_24dp',
          room_id,
        );
      });
      return () => {
        event.removeLister('updateRoomSettings', listener);
      };
    }, [audioMode, room_id]);

    const requestTospeak = React.useCallback(async () => {
      await conn.mutation.requestTospeak({room_id, user_id});
    }, [conn.mutation, room_id, user_id]);

    // const _showActionSheet = React.useCallback(() => {
    //   const options = [
    //     {
    //       icon: 'message',
    //       title: '9697t8yi67',
    //       onPress: () => {},
    //     },
    //     {
    //       icon: 'message',
    //       title: '2356tyfg12397',
    //       onPress: () => {},
    //     },
    //   ];
    //   showActionSheet({options, hasCancel: false});
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const sendMessage = React.useCallback(
      async m => await conn.mutation.sendMessage({room_id, user_id, ...m}),
      [conn.mutation, room_id, user_id],
    );

    const lockRoom = React.useCallback(async () => {
      return await conn.mutation.lockRoom({room_id, user_id});
    }, [conn.mutation, room_id, user_id]);

    const leaveRoom = React.useCallback(
      bool => {
        if (!bool) {
          // Listner leaving a room
          event.emitter('updateRoomSettings', false);
          conn.mutation.leaveRoom({room_id, user_id});
          navigation.navigate('Home');
          return;
        }
        Alert.alert(
          'End this Room?',
          'This will end this conversation for every one!',
          [
            {
              text: "Don't leave",
              style: 'cancel',
              onPress: () => {},
            },
            {
              text: 'End Room',
              style: 'destructive',
              onPress: () => {
                // If the user confirmed, then we dispatch the action we blocked earlier
                // This will continue the action that had triggered the removal of the screen
                // close room connection
                event.emitter('updateRoomSettings', false);
                conn.mutation.deleteRoom({room_id, user_id});
                navigation.navigate('Home');
              },
            },
          ],
          {cancelable: true},
        );
      },
      [conn.mutation, navigation, room_id, user_id],
    );

    const _setChat = React.useCallback(async () => {
      const _res = await conn.mutation.setChat({v: !chatChecked, room_id});
      setChat(_res);
    }, [chatChecked, conn.mutation, room_id]);

    const _setRaiseHand = React.useCallback(async () => {
      const _res = await conn.mutation.setRaiseHand({
        v: !raiseHandChecked,
        room_id,
      });
      setRaiseHand(_res);
    }, [conn.mutation, raiseHandChecked, room_id]);

    if (typeof data === 'undefined' || !data) {
      return <LoadingApp />;
    }

    const isData = Object.entries(data).length === 0;
    if (isData) {
      return <LoadingApp />;
    }

    if (error) {
      console.warn(error);
      return null;
    }

    console.log('room screen', 1);

    return (
      <>
        <RoomComponents
          requestTospeak={requestTospeak}
          leaveRoom={leaveRoom}
          user_id={user_id}
          room_id={room_id}
          conn={conn}
          raiseHandChecked={raiseHandChecked}
          chatChecked={chatChecked}
          _setChat={_setChat}
          _setRaiseHand={_setRaiseHand}
          sendMessage={sendMessage}
          retry={_retry}
          lockRoom={lockRoom}
        />
      </>
    );
  },
  (prevProps, nxtProps) =>
    dequal(prevProps.data?.room_id, nxtProps.data?.room_id),
);

const mapStateToProps = state => {
  return {
    data: state.room_data,
    _mode: state.setAudioMode,
  };
};

export default connect(mapStateToProps, null, null)(Room);
