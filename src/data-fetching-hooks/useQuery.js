import {useContext} from 'react';
import useSWR from 'swr';
import {apisWrap} from '../modules/websokets/wsEndPointsWrapper';
import {WebSocketContext} from '../modules/websokets/websokectProvider';

export const useQueryData = (cHk, _c, k, p, opt) => {
  const conn = apisWrap(_c);
  const fn = conn.query[typeof k === 'string' ? k : k[0]];

  return useSWR(cHk, () => fn(...p), {
    ...opt,
  });
};
