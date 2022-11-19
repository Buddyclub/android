import {Constant} from '../constants';
export const setMessages = payload => ({
  type: Constant.chatMessages,
  payload,
});

export const updateMessages = payload => ({
  type: Constant.updateMessages,
  payload,
});
