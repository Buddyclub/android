import {Constant} from '../constants';

export const setUnmount = payload => ({
  type: Constant.unmountRoomScreen,
  payload,
});
