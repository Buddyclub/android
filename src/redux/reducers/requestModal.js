import {Constant} from '../constants/';

export const initialState = {
  isOpen: false,
};

export const requestModal = (state = initialState, action) => {
  switch (action.type) {
    case Constant.openRequestModal:
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    default:
      return state;
  }
};
