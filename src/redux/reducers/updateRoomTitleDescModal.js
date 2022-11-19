import {Constant} from '../constants/';

export const initialState = {
  isOpen: false,
};

export const updateRoomTitleDescModal = (state = initialState, action) => {
  switch (action.type) {
    case Constant.openUpdateRoomTitleModal:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    case Constant.closeUpdateRoomTitleModal:
      return {
        ...state.isOpen,
        isOpen: false,
      };
    default:
      return state;
  }
};
