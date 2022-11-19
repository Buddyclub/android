import {Constant} from '../constants/';

export const initialState = {
  messages: [],
};
export const msg = (state = initialState, act) => {
  switch (act.type) {
    case Constant.chatMessages:
      return {
        ...state,
        messages: [...state.messages, act.payload].sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
        ),
      };
    case Constant.updateMessages:
      return {
        ...state,
        messages: [...act.payload].sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt),
        ),
      };
    default:
      return state;
  }
};
