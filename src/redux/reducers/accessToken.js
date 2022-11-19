import {Constant} from '../constants/';

export const initialState = {
  access_token: null,
};

export const accessToken = (state = initialState, action) => {
  switch (action.type) {
    case Constant.access_token:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
