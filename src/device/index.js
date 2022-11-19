import {Device} from 'mediasoup-client';
import {detectDevice} from 'mediasoup-client/lib/types';
export const getDevice = () => {
  try {
    let handlerName = detectDevice();
    if (!handlerName) {
      console.warn(
        'mediasoup does not recognize this device, it has been defaulted it to Chrome74',
      );
      handlerName = 'Chrome74';
    }
    return new Device({handlerName});
  } catch {
    return null;
  }
};
