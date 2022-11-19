import React, {useEffect, useMemo, useState, useRef} from 'react';
import {useSelector} from 'react-redux';
import {wsConnection} from './mainWebsoket';
import defaulUrl from '../../config/url';
import Loading from '../../components/loadingApp';

export const WebSocketContext = React.createContext({
  connection: null,
});

export const WebSocketProvider = ({children, token}) => {
  const [connection, setConn] = useState(null);
  const isConnectingRef = useRef(false);
  const {connected} = useSelector(state => state.isConnected);

  useEffect(() => {
    if (!connection && token && !isConnectingRef.current) {
      isConnectingRef.current = true;
      wsConnection(token, {
        url: `${defaulUrl.ws}?type=signaling&token=${token}`,
        fn: () => {},
        onConnectionTaken: false,
      })
        .then(conn => {
          setConn(conn);
        })
        .catch(err => console.log('Websokect error:', err))
        .finally(() => (isConnectingRef.current = false));
    }
  }, [token, connected, connection]);

  return (
    <WebSocketContext.Provider
      value={useMemo(() => ({connection}), [connection])}>
      {!connection ? <Loading /> : children}
    </WebSocketContext.Provider>
  );
};
