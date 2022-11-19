import {Constant} from '../constants';
export function openRequestModal() {
  return {
    type: Constant.openRequestModal,
  };
}

export function closeRequestModal() {
  return {
    type: Constant.closeRequestModal,
  };
}
