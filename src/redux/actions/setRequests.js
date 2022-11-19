import {Constant} from '../constants/';

export const setRequests = payload => ({
  type: Constant.set_requests,
  payload,
});

export const removeRequests = payload => ({
  type: Constant.rm_requests,
  payload,
});
