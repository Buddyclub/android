import {Constant} from '../constants';
const initialState = {u: undefined};
export const unMount = (state = initialState, action) => {
  switch (action.type) {
    case Constant.unmountRoomScreen:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
