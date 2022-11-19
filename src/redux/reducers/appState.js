import {Constant} from '../constants/';

export const initialState = {
  appState: undefined,
};

export const appState = (state = initialState, action) => {
  switch (action.type) {
    case Constant.appState:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
