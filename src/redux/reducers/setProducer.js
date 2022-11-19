import {Constant} from '../constants/';

export const initialState = {
  producer: null,
};

export const producer = (state = initialState, act) => {
  switch (act.type) {
    case Constant.producer:
      return {
        ...state,
        ...act.payload,
      };
    case Constant.close_producer:
      return {
        producer: null,
      };
    default:
      return state;
  }
};
