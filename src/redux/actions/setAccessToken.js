import {Constant} from '../constants/';

export const setAccessToken = payload => ({
  type: Constant.access_token,
  payload,
});
