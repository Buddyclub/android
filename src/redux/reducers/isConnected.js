import {Constant} from '../constants/';

export const initialState = {
  connected: false,
};

export const isConnected = (state = initialState, action) => {
  switch (action.type) {
    case Constant.isConnected:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
