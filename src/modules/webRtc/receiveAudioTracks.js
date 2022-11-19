import {consumeAudio} from './consumeAudio';
export const receiveAudioTracks = (conn, room_id, flushQueue, device, uid) => {
  if (!conn) {
    return;
  }
  conn.once('@recv_tracks_done', async d => {
    try {
      for (const {peer_id, consumerParameters} of d.consumerParametersArr) {
        console.log('consumer peer_id', peer_id);
        // consumeAudio(consumerParameters, peer_id);
        if (!(await consumeAudio(consumerParameters, peer_id))) {
          break;
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      await flushQueue();
    }
  });
  conn.send('@recv_tracks', {
    room_id,
    user_id: uid,
    rtpCapabilities: device?.rtpCapabilities,
  });
};
