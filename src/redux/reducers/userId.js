import {Constant} from '../constants/';
export const initialState = {
  user_id: null,
};

export const setUserId = (state = initialState, action) => {
  switch (action.type) {
    case Constant.user_id:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
