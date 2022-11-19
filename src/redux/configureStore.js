import {applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import {deviceReducer} from './reducers/setupDevice.reducer';
import {setmicId} from './reducers/setMicId';
import {producer} from './reducers/setProducer';
import {setUserId} from './reducers/userId';
import {consumer} from './reducers/setConsumer';
import {room_data} from './reducers/updateRoomData';
import {setMute} from './reducers/muteUnmute';
import {setConnState} from './reducers/setConnStateChange';
import {unMount} from './reducers/unmountRoomScreen';
import {accessToken} from './reducers/accessToken';
import {deviceToken} from './reducers/deviceFcmId';
import {requests} from './reducers/speakerRequest';
import {isPlugged} from './reducers/isEarPhonePlugged';
import {isConnected} from './reducers/isConnected';
import {appState} from './reducers/appState';
import {setAudioMode} from './reducers/setAudioMode';
import {msg} from './reducers/setMessages';
import {peerData} from './reducers/setPeerRequstingData';
import {requestModal} from './reducers/requestModal';
import {speakingChange} from './reducers/speakingChange';
import {updateRoomTitleDescModal} from './reducers/updateRoomTitleDescModal';
export const store = createStore(
  combineReducers({
    deviceReducer,
    setmicId,
    room_data,
    producer,
    setUserId,
    consumer,
    setMute,
    setConnState,
    unMount,
    accessToken,
    deviceToken,
    requests,
    isPlugged,
    isConnected,
    appState,
    setAudioMode,
    msg,
    peerData,
    requestModal,
    speakingChange,
    updateRoomTitleDescModal,
  }),
  applyMiddleware(thunk),
);

export const dispatch = store.dispatch;
