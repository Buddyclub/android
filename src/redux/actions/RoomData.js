import {Constant} from '../constants/';

export const updateRoomData = payload => ({
  type: Constant.room_data,
  payload,
});
