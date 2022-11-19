import {Constant} from '../constants';
export const initialState = {
  mode: false,
};

export const setAudioMode = (state = initialState, action) => {
  switch (action.type) {
    case Constant.audioMode:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
