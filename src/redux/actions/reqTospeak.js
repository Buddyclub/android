import {Constant} from '../constants/';

export const reqTospeak = payload => ({
  type: Constant.requesting_to_speak,
  payload,
});
