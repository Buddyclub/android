import {Constant} from '../constants';
export const peerRequestAction = payload => ({
  type: Constant.peerRequest,
  payload,
});
