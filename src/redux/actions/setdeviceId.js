import {Constant} from '../constants';
export const setDeviceToken = payload => ({
  type: Constant.deviceToken,
  payload,
});
