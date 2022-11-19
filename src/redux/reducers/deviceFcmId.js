import {Constant} from '../constants/';

export const initialState = {
  deviceToken: null,
};

export const deviceToken = (state = initialState, action) => {
  switch (action.type) {
    case Constant.deviceToken:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
