import {Constant} from '../constants/';

export const initialState = {
  rid: null,
  volume: null,
  userId: null,
};

export const speakingChange = (state = initialState, action) => {
  switch (action.type) {
    case Constant.speakingChange:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
