import {Constant} from '../constants';
const initialState = {
  muted: true,
};

export const setMute = (state = initialState, action) => {
  switch (action.type) {
    case Constant.mute_unmute:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
