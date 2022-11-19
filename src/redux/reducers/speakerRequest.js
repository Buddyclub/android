import {Constant} from '../constants/';
let re_map = {};
export const initialState = {
  re: {},
};
export const requests = (state = initialState, act) => {
  switch (act.type) {
    case Constant.set_requests:
      const {user_id, user} = act.payload;
      re_map[user_id] = user;
      return {
        ...state,
        re: {...re_map},
      };
    case Constant.rm_requests:
      const {id} = act.payload;
      if (id in re_map) {
        delete re_map[id];
      }
      // Object.keys(c_map).forEach((_, k)=> !c_map[k]?.closed && c_map[k]?.close());
      return {
        ...state,
        re: {...re_map},
      };
    default:
      return state;
  }
};
