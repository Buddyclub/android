import {Constant} from '../constants/';
let c_map = {};
export const initialState = {
  consumer: {},
};
export const consumer = (state = initialState, act) => {
  switch (act.type) {
    case Constant.consumer:
      const {c, peer_id} = act.payload;
      c_map[peer_id] = c;
      return {
        ...state,
        consumer: {...c_map},
      };
    case Constant.close_consumer:
      Object.keys(c_map).forEach(
        (_, k) => !c_map[k]?.closed && c_map[k]?.close(),
      );
      return state;
    default:
      return state;
  }
};
