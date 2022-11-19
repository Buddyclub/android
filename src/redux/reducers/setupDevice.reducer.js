import {Constant} from '../constants';
export const initialState = {
  room_id: '',
  device: null,
  micStream: null,
  mic: null,
  recvTransport: null,
  sendTransport: null,
};
export const deviceReducer = (state = initialState, act) => {
  switch (act.type) {
    case Constant.device:
      return {
        ...state,
        ...act.payload,
      };
    case Constant.mic:
      return {
        ...state,
        ...act.payload,
      };
    case Constant.micStream:
      return {
        ...state,
        ...act.payload,
      };
    case Constant.recvTransport:
      return {
        ...state,
        ...act.payload,
      };
    case Constant.sendTransport:
      return {
        ...state,
        ...act.payload,
      };
    case Constant.roomId:
      return {
        ...state,
        ...act.payload,
      };
    default:
      return state;
  }
};
