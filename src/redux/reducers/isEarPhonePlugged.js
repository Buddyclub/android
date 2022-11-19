import {Constant} from '../constants/';

export const initialState = {
  isPlugged: false,
};

export const isPlugged = (state = initialState, action) => {
  switch (action.type) {
    case Constant.isEarPhonePlugged:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
