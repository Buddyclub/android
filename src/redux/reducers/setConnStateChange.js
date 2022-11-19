import {Constant} from '../constants';

export const setConnState = (state = {state: undefined}, action) => {
  switch (action.type) {
    case Constant.connectionstatechange:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
