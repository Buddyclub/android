import {Constant} from '../constants';
export const setDivice = payload => ({
  type: Constant.device,
  payload,
});

export const setRoomId = payload => ({
  type: Constant.roomId,
  payload,
});
export const setMicStream = payload => ({
  type: Constant.micStream,
  payload,
});
export const setMic = payload => ({
  type: Constant.mic,
  payload,
});
export const recvTransport = payload => ({
  type: Constant.recvTransport,
  payload,
});
export const sendTransport = payload => ({
  type: Constant.sendTransport,
  payload,
});
