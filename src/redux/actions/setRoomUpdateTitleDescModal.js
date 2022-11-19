import {Constant} from '../constants';
export function openUpdateRoomTitleModal() {
  return {
    type: Constant.openUpdateRoomTitleModal,
  };
}

export function closeUpdateRoomTitleModal() {
  return {
    type: Constant.closeUpdateRoomTitleModal,
  };
}
