import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {Hark} from '../../../RnModules/';
import {useWrappedConn, useConn} from '../../../globalHooks/useWebsocketConn';

export const MicHark = () => {
  const connections = useConn();
  const conn = useWrappedConn();
  const isMounted = useRef(false);
  const micStream = useSelector(state => state.deviceReducer?.micStream);
  const room_id = useSelector(state => state.deviceReducer.room_id);
  const user_id = useSelector(state => state.setUserId?.user_id);
  const muted = useSelector(s => s.setMute?.muted);
  useEffect(() => {
    isMounted.current = true;
    if (!micStream || !muted || !room_id || !connections) {
      return null;
    }
    if (isMounted.current) {
      Hark.start();
      Hark.onNewFrame = data => {
        if (data?.value < -120) {
          console.log('silence');
          // conn?.mutation.speakingChange({room_id, v: false, user_id});
        } else if (data?.value === 0 || data?.value > -120) {
          console.log('speaking');
          // conn?.mutation.speakingChange({room_id, v: true, user_id});
        }
      };
    }
    return () => {
      isMounted.current = false;
      Hark.stop();
    };
  }, [connections, micStream, muted, room_id]);
  return null;
};
