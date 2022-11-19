import {Constant} from '../constants/';

export const setConnState = payload => ({
  type: Constant.connectionstatechange,
  payload,
});
