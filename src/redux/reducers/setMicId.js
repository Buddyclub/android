import {Constant} from '../constants/';

export const initialState = {
  mic_id: null,
};

export const setmicId = (state = initialState, action) => {
  switch (action.type) {
    case Constant.micId:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
