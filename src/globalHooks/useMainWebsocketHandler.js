import React, {useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {reqTospeak} from '../redux/actions/reqTospeak';
import {setRequests} from '../redux/actions/setRequests';
import {WebSocketContext} from '../modules/websokets/websokectProvider';
import {updateRoomData} from '../redux/actions/RoomData';
// import {setRoomId} from '../redux/actions/device';
import {setSpeakingChange} from '../redux/actions/setSpeakingChange';
import {event} from '../utils/events/events';
import {removeRequests} from '../redux/actions/setRequests';
import {setMessages} from '../redux/actions/messages';
import {INAPP_NOTIFICATION_EMITTER} from '../components/InAppNotification';

export const useMainWsHandler = () => {
  const {connection: conn} = useContext(WebSocketContext);
  const dispatch = useDispatch();
  const room_id = useSelector(state => {
    return state.deviceReducer?.room_id;
  });

  const storeData = useSelector(state => state.room_data);

  useEffect(() => {
    if (!conn && room_id) {
      return;
    }
    const unsubscribe = [
      conn.addListener('on_request_to_speak', d => {
        dispatch(reqTospeak(d));
      }),
      conn.addListener('new_peer', data => {
        const peers = new Set();

        const p = [...storeData.peers, data].filter(x => {
          const isX = peers.has(x.user_id);
          peers.add(x.user_id);
          return !isX;
        });

        dispatch(
          updateRoomData({
            ...storeData,
            peers: p,
          }),
        );
      }),

      conn.addListener('peer_left', data => {
        dispatch(
          updateRoomData({
            ...storeData,
            peers: storeData.peers.filter(x => x.user_id !== data.peer_id),
          }),
        );
      }),
      conn.addListener('onmute', data => {
        dispatch(
          updateRoomData({
            ...storeData,
            muted_speakers_obj: {
              ...storeData.muted_speakers_obj,
              [data.user_id]: data.isMuted,
            },
          }),
        );
      }),
      /** When a speaker is added mute him */
      conn.addListener('new_peer_speaker', data => {
        const new_room_state = {
          ...storeData,
          peers: storeData.peers.map(p =>
            data.user_id === p.user_id
              ? {
                  ...p,
                  room_permisions: {
                    ...p.room_permisions,
                    isSpeaker: true,
                  },
                }
              : p,
          ),
        };
        dispatch(updateRoomData(new_room_state));
      }),

      conn.addListener('speaker_removed', data => {
        const new_room_state = {
          ...storeData,
          peers: storeData.peers.map(p =>
            data.peer_id === p.user_id
              ? {
                  ...p,
                  room_permisions: {
                    ...p.room_permisions,
                    isSpeaker: false,
                  },
                }
              : p,
          ),
        };
        dispatch(updateRoomData(new_room_state));
      }),

      conn.addListener(`new_chat_msg_${room_id}`, msg => {
        dispatch(setMessages(msg));
      }),

      conn.addListener('onRequest', ({user, user_id}) => {
        dispatch(setRequests({user_id, user: {...user, room_id}}));
      }),

      conn.addListener('onPeerLeave', peer_id => {
        // remove peer from Request Que if available
        dispatch(removeRequests({id: peer_id}));
      }),

      conn.addListener('roominfochange', function (data) {
        const notiPayload = {
          payload: {
            title: 'Room info change',
            message: data.description + '🎈',
            imgUrl: null,
          },
          type: 'inApp',
          room_id: room_id,
        };
        dispatch(
          updateRoomData({
            ...storeData,
            about_room: data.description,
            room_name: data.name,
          }),
        );
        event.emitter(INAPP_NOTIFICATION_EMITTER, notiPayload);
      }),

      conn.addListener(
        `onactivespeaker-${room_id}`,
        ({volume, user_id: userId, room_id: rid}) => {
          dispatch(setSpeakingChange({rid, volume, userId}));
        },
      ),
    ];
    return () => unsubscribe.forEach(u => u());
  }, [conn, dispatch, room_id, storeData]);
};

const MainWsHandler = ({children}) => {
  useMainWsHandler();
  return <>{children}</>;
};

export default MainWsHandler;
