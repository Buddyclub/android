import {Constant} from '../constants/';

export const toggleIsConnected = payload => ({
  type: Constant.isConnected,
  payload,
});
