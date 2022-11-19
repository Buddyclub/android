import {Constant} from '../constants';
export function setSpeakingChange(payload) {
  return {
    type: Constant.speakingChange,
    payload,
  };
}
