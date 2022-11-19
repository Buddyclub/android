import {Constant} from '../constants';

const initialState = {
  data: {},
};

export const peerData = (state = initialState, act) => {
  switch (act.type) {
    case Constant.peerRequestData:
      return {
        ...state,
        data: act.payload,
      };

    default:
      return state;
  }
};
