import React, {useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {event} from '../../utils/events/events';
import {createTransport} from './transport';
import {sendAudioTracks} from './sendAudioTracks';
import {receiveAudioTracks} from './receiveAudioTracks';
import {store} from '../../redux/configureStore';
import {
  setRoomId,
  sendTransport,
  recvTransport,
  setMicStream,
  setMic,
} from '../../redux/actions/device';
// import {audioMode} from '../../redux/actions/audioMode';
import {consumeAudio} from './consumeAudio';
import {updateRoomData} from '../../redux/actions/RoomData';
import * as RootNavigation from '../../navigation/rootNavigation';
// import {MicHark} from './components/hark';

import {useConn, useWrappedConn} from '../../globalHooks/useWebsocketConn';

import {INAPP_NOTIFICATION_EMITTER} from '../../components/InAppNotification';

const notif = {
  payload: {
    title: 'Room End',
    message: 'Room has just ended thanks 🎉👏🎈',
    imgUrl: null,
  },
  type: '',
  room_id: null,
};

export const WebRtc = ({children}) => {
  const conn = useConn();
  const wrappedConn = useWrappedConn();
  const dispatch = useDispatch();
  const device = useSelector(state => state.deviceReducer.device);
  const consumerQueue = useRef([]);
  const initialLoad = useRef(true);
  const uid = useSelector(state => state.setUserId?.user_id);
  const _room_id = useSelector(state => state.deviceReducer?.room_id);
  const mic = useSelector(state => state.deviceReducer?.mic);
  const muted = useSelector(s => s.setMute?.muted);

  function closeVoiceConnections(id) {
    if (id === null || _room_id === id) {
      if (mic) {
        console.log('stopping mic', mic);
        mic?.stop();
      }
      console.log('nulling transports');
      nullify();
    }
  }

  useEffect(() => {
    if (mic) {
      console.log('microphone is', muted);
      mic.enabled = muted;
    }
  }, [mic, muted]);

  useEffect(() => {
    if (!initialLoad.current) {
      (async () => {
        try {
          await sendAudioTracks();
        } catch (err) {
          console.log(err);
        }
      })();
      initialLoad.current = false;
    }
  }, []);

  /**
   *
   * @param {String} id room_id the room id
   */

  async function flushConsumerQueue(id) {
    try {
      for (const {
        room_id,
        d: {peer_id, consumerParameters},
      } of consumerQueue.current) {
        if (id === room_id) {
          await consumeAudio(consumerParameters, peer_id);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      consumerQueue.current = [];
    }
  }

  function nullify() {
    dispatch(setMic({mic: null}));
    dispatch(setMicStream({micStream: null}));
    dispatch(
      recvTransport({
        recvTransport: null,
      }),
    );
    dispatch(
      sendTransport({
        sendTransport: null,
      }),
    );
    dispatch(
      setRoomId({
        room_id: '',
      }),
    );
  }
  useEffect(() => {
    if (!conn) {
      return;
    }
    const unsubs = [
      conn.addListener(
        'you_joined_as_speaker',
        async ({
          room_id,
          routerRtpCapabilities,
          sendTransportOptions,
          recvTransportOptions,
        }) => {
          closeVoiceConnections(null);
          dispatch(
            setRoomId({
              room_id,
            }),
          );
          consumerQueue.current = [];
          console.log('creating a device');
          try {
            if (!device?.loaded) {
              await device?.load({routerRtpCapabilities});
            }
          } catch (err) {
            console.log('error creating a device | ', err);
            return;
          }

          try {
            await createTransport(
              conn,
              wrappedConn,
              room_id,
              'send',
              sendTransportOptions,
              device,
              uid,
            );
          } catch (err) {
            console.log('error creating send transport | ', err);
            return;
          }
          console.log('sending audio tracks i.e. voice');
          try {
            await sendAudioTracks();
          } catch (err) {
            console.log('error sending voice | ', err);
            return;
          }
          await createTransport(
            conn,
            wrappedConn,
            room_id,
            'recv',
            recvTransportOptions,
            device,
            uid,
          );
          receiveAudioTracks(
            conn,
            room_id,
            async () => await flushConsumerQueue(room_id),
            device,
            uid,
          );
          event.emitter('updateRoomSettings', true);
        },
      ),

      // join as listener
      conn.addListener(
        'joined_as_listener',
        async ({
          room_id,
          peer_id,
          routerRtpCapabilities,
          recvTransportOptions,
        }) => {
          closeVoiceConnections(null);
          dispatch(
            setRoomId({
              room_id,
            }),
          );
          consumerQueue.current = [];
          console.log('creating listener device.... for', peer_id);
          try {
            if (!device.loaded) {
              await device.load({routerRtpCapabilities});
            }
          } catch (err) {
            console.log('error creating a device | ', err);
            return;
          }
          try {
            await createTransport(
              conn,
              wrappedConn,
              room_id,
              'recv',
              recvTransportOptions,
              device,
              uid,
            );
          } catch (err) {
            console.log('error creating recv transport | ', err);
            return;
          }
          receiveAudioTracks(
            conn,
            room_id,
            async () => await flushConsumerQueue(room_id),
            device,
            uid,
          );
          // updateAudioMode(true);
          event.emitter('updateRoomSettings', true);
        },
      ),

      conn.addListener('onGoodByeRoom', async ({room_id}) => {
        console.log('Closing voice connections', room_id);
        closeVoiceConnections(room_id);
        // updateAudioMode(false);
        event.emitter('updateRoomSettings', false);
      }),

      conn.addListener('on_new_peer_speaker', async d => {
        console.log('app.. on_new_peer_speaker', d);
        // eslint-disable-next-line no-shadow
        const {room_id, recvTransport} = store.getState().deviceReducer;
        if (recvTransport && room_id === d.room_id) {
          await consumeAudio(d.consumerParameters, d.peer_id);
        } else {
          consumerQueue.current = [...consumerQueue.current, {room_id, ...d}];
        }
      }),

      conn.addListener('on_added_as_speaker', async d => {
        // # TODO usetate to get room id
        if (d.room_id !== store.getState().deviceReducer.room_id) {
          return;
        }
        // setStatus("connected-speaker");
        try {
          await createTransport(
            conn,
            wrappedConn,
            d.room_id,
            'send',
            d.sendTransportOptions,
            device,
            uid,
          );
        } catch (err) {
          console.log(err);
          return;
        }
        console.log('sending voice');
        try {
          // InCallManagerStart();
          await sendAudioTracks();
        } catch (err) {
          console.log(err);
        }
      }),
      conn.addListener('room_deleted', function (data) {
        dispatch(updateRoomData({}));
        event.emitter('updateRoomSettings', false);
        event.emitter(INAPP_NOTIFICATION_EMITTER, notif);
        closeVoiceConnections(data.room_id);
        RootNavigation.navigate('Home');
      }),
    ];

    return () => {
      unsubs.forEach(x => x());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conn]);

  return <>{/* <MicHark /> */}</>;
};
