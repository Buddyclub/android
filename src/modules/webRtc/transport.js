import {store} from '../../redux/configureStore';
import {
  recvTransport as setRecvT,
  sendTransport as setSendT,
} from '../../redux/actions/device';
import {
  sendTransport,
  recvTransport,
  setMicStream,
  setMic,
} from '../../redux/actions/device';
import {setConnState} from '../../redux/actions/connStateChange';
import {event} from '../../utils/events/events';

export async function createTransport(
  conn,
  wrappedConn,
  room_id,
  direction /**"recv" | "send" */,
  transportOptions /** TransportOptions */,
  device,
  user_id,
) {
  console.log(`create ${direction} transport`);
  // ask the server to create a server-side transport object and send
  // us back the info we need to create a client-side transport
  // console.log("transport options device.__proto__", device.device);
  const transport =
    direction === 'recv'
      ? await device?.createRecvTransport(transportOptions)
      : await device?.createSendTransport(transportOptions);
  // mediasoup-client will emit a connect event when media needs to
  // start flowing for the first time. send dtlsParameters to the
  // server, then call callback() on success or errback() on failure.
  transport.on('connect', ({dtlsParameters}, callback, errback) => {
    conn.once(`@connect_transport_${direction}_done`, d => {
      if (d.error) {
        console.log(`connect_transport ${direction} failed`, d.error);
        if (d.error.includes('already called')) {
          console.log(`@connect_transport_${direction}_done....`, d);
          callback();
        } else {
          errback();
        }
      } else {
        console.log(`connect_transport ${direction} success`);
        callback();
      }
    });
    conn.send('@connect_transport', {
      room_id,
      transportId: transportOptions.id,
      user_id,
      dtlsParameters,
      direction,
    });
  });

  if (direction === 'send') {
    // sending transports will emit a produce event when a new track
    // needs to be set up to start sending. the producer's appData is
    // passed as a parameter
    transport.on(
      'produce',
      ({kind, rtpParameters, appData}, callback, errback) => {
        console.log('transport produce event', appData.mediaTag);
        // we may want to start out paused (if the checkboxes in the ui
        // aren't checked, for each media type. not very clean code, here
        // but, you know, this isn't a real application.)
        // let paused = false;
        // if (appData.mediaTag === "cam-video") {
        //   paused = getCamPausedState();
        // } else if (appData.mediaTag === "cam-audio") {
        //   paused = getMicPausedState();
        // }
        // tell the server what it needs to know from us in order to set
        // up a server-side producer object, and get back a
        // producer.id. call callback() on success or errback() on
        // failure.

        conn.once(`@send_track_${direction}_done`, ({id, error}) => {
          console.log('@send_track_send_done', id);
          if (error) {
            console.log(`send_track ${direction} failed`, error);
            errback();
          } else {
            console.log(`send_track-transport ${direction} success....`);
            callback({id});
          }
        });

        conn.send('@send_track', {
          room_id,
          transportId: transportOptions.id,
          kind,
          rtpParameters,
          rtpCapabilities: device?.rtpCapabilities,
          paused: false,
          appData,
          direction,
          user_id,
        });
      },
    );
  }

  // for this simple demo, any time a transport transitions to closed,
  // failed, or disconnected, leave the room and reset
  //
  transport.on('connectionstatechange', state => {
    let timeoutOut = null;

    if (state === 'connected') {
      if (timeoutOut) {
        clearTimeout(timeoutOut);
      }
      console.log(
        `${direction} transport ${transport.id} connectionstatechange ${state}`,
      );
      event.emitter('transportconnectionstate', true);
      store.dispatch(setConnState({state: true}));
    }
    if (state === 'disconnected') {
      console.log(
        `${direction} transport ${transport.id} connectionstatechange ${state}`,
      );

      store.dispatch(setConnState({state: false}));
      store.dispatch(setMic({mic: null}));
      store.dispatch(setMicStream({micStream: null}));
      store.dispatch(
        recvTransport({
          recvTransport: null,
        }),
      );
      store.dispatch(
        sendTransport({
          sendTransport: null,
        }),
      );

      // give some time for room to unmount the screen when leaving the room;
      timeoutOut = setTimeout(() => {
        event.emitter('transportconnectionstatedisconnected', {
          state: false,
          direction,
        });
      }, 500);
    }
  });

  if (direction === 'recv') {
    console.log('Direction recv transport');
    store.dispatch(
      setRecvT({
        recvTransport: transport,
      }),
    );
  } else {
    console.log('Direction send transport');
    store.dispatch(
      setSendT({
        sendTransport: transport,
      }),
    );
  }
}
