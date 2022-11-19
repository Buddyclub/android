import {Constant} from '../constants';
const initialData = {};
export const room_data = (state = initialData, action) => {
  switch (action.type) {
    case Constant.room_data:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
