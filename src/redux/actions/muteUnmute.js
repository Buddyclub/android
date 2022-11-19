import {Constant} from '../constants';
export const muteUnmute = payload => ({
  type: Constant.mute_unmute,
  payload,
});

// export const muteUnmute = (payload) => {
//   var newState = Object.assign({}, payload);
//   newState.muteMic = !newState.muteMic;
//   console.log(newState);
//   return {
//     type: Constant.mute_unmute,
//     newState,
//   }
// };
