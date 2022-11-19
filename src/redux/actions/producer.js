import {Constant} from '../constants';
export const setProducer = payload => ({
  type: Constant.producer,
  payload,
});
