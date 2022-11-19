import React from 'react';
import {apisWrap} from '../modules/websokets/wsEndPointsWrapper';
import {WebSocketContext} from '../modules/websokets/websokectProvider';

export const useConn = () => {
  return React.useContext(WebSocketContext)?.connection;
};

export const useWrappedConn = () => {
  // return apisWrap(React.useContext(WebSocketContext)?.connection);
  return apisWrap(useConn());
};
