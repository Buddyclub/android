import {Constant} from '../constants/';

export const setEarPhone = payload => ({
  type: Constant.isEarPhonePlugged,
  payload,
});
