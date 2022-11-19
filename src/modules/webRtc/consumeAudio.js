import {store} from '../../redux/configureStore';
import {setConsumer} from '../../redux/actions/consumer';
export const consumeAudio = async (consumerParameters, peer_id) => {
  const transport = store.getState().deviceReducer?.recvTransport;
  if (!transport) {
    console.log('skipping consumeAudio because recvTransport is null');
    return false;
  }
  /**
   * instruct the transport to receive an audio track from the
   * mediasoup router
   */
  try {
    const c = await transport.consume({
      ...consumerParameters,
      appData: {
        peer_id,
        producerId: consumerParameters.producerId,
        mediaTag: 'cam-audio',
      },
    });
    // console.log('tracks are....', JSON.stringify(c));
    store.dispatch(setConsumer({c, peer_id}));
  } catch (err) {
    console.log('setting up listener error', err);
  }
  return true;
};
