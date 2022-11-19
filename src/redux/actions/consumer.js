import {Constant} from '../constants/';

export const setConsumer = payload => ({
  type: Constant.consumer,
  payload,
});
