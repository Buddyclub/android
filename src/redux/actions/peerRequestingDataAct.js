import {Constant} from '../constants/';

export const peerRequestingAct = payload => ({
  type: Constant.peerRequestData,
  payload,
});
