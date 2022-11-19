// import {mediaDevices} from '@daily-co/react-native-webrtc';
import {store} from '../../redux/configureStore';
import {setMic, setMicStream} from '../../redux/actions/device';
import {setProducer} from '../../redux/actions/producer';

export const sendAudioTracks = async () => {
  const mic = store.getState().deviceReducer?.mic;

  const transport = store.getState().deviceReducer?.sendTransport;
  console.log('transport is.......', transport?.produce);
  if (!transport) {
    console.log('no sendTransport in sendVoice');
    return;
  }

  if (mic) {
    console.log('stoping mic');
    mic?.stop();
  }

  // get user device micStream
  let micStream;

  try {
    const availabeMic = await navigator.mediaDevices.enumerateDevices();
    const {deviceId} = availabeMic.find(
      device => device.kind === 'audioinput' && device.deviceId,
    );
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch (err) {
    console.warn(`${err.message}`, err);
    return;
  }
  const audioTrack = micStream?.getAudioTracks();

  if (audioTrack.length) {
    const track = audioTrack[0];
    /**
     * instruct the transport to send an audio track to the mediasoup router.
     */

    const p = await transport?.produce({
      track,
      appData: {mediaTag: 'cam-audio'},
    });
    console.log('setting up producer.....');

    // set producer
    store.dispatch(setProducer({producer: p}));
    // set mictrack for your mic.
    store.dispatch(setMic({mic: track}));
    // set mic stream for hark.
    store.dispatch(setMicStream({micStream}));
    return;
  }
  store.dispatch(setMic({mic: null}));
  store.dispatch(setMicStream({micStream: null}));
};
