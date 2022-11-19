import {Constant} from '../constants';
export const setAppState = payload => ({
  type: Constant.appState,
  payload,
});
