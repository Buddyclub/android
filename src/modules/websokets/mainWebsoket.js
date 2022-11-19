import WebSocket from 'isomorphic-ws';
import ReconnectingWebSocket from './ws/reconnecting-websocket';

import {store} from '../../redux/configureStore';
import {setUser_id} from '../../redux/actions/user_id';
import {v4 as generateUuid} from 'uuid';

const heartbeatInterval = 4000;
const connectionTimeout = 5000;
const maxRetries = 50;

export const wsConnection = (
  authToken,
  {url, onConnectionTaken},
  getTimeout,
  // getAuthOptions = () => {},
) =>
  new Promise((resolve, reject) => {
    const socket = new ReconnectingWebSocket(url, [], {
      connectionTimeout,
      WebSocket,
      maxRetries,
      // debug: true,
    });

    const sendToApi = (act, data, ref_id) => {
      return new Promise((_resolve, _reject) => {
        if (socket.readyState !== socket.OPEN) {
          _reject(new Error('Websocket is not ready'));
        }
        const raw = `{"act":"${act}","dt":${JSON.stringify(data)}${
          ref_id ? `,"ref_id":"${ref_id}"` : ''
        }}`;
        socket.send(raw);
        _resolve();
        //  console.log('out', JSON.parse(raw));
      });
    };

    const listeners = [];

    socket.addEventListener('close', error => {
      // NativeModules.Webrtc.stopService();
      reject(error);
    });

    socket.addEventListener('message', e => {
      if (e.data === '"pong"' || e.data === 'pong') {
        // console.log('received in', 'pong');
        return;
      }
      let message;
      try {
        message = JSON.parse(e.data);
      } catch (er) {
        console.log(er);
      }
      if (message.act === 'we_are_good_to_go') {
        store.dispatch(
          setUser_id({
            user_id: message.user_id,
          }),
        );
        const conn = {
          close: () => socket.close(),
          send: sendToApi,
          ws: socket,
          user: message,
          once: (act, handler) => {
            const listener = {act, handler};

            listener.handler = (...params) => {
              handler(...params);
              listeners.splice(listeners.indexOf(listener), 1);
            };

            listeners.push(listener);
          },
          addListener: (act, handler) => {
            const listener = {act, handler};

            listeners.push(listener);

            return () => listeners.splice(listeners.indexOf(listener), 1);
          },
          post: (act, parameters, done_act_code, timeout) => {
            return new Promise((resolveGet, rejectGet) => {
              if (socket.readyState !== socket.OPEN) {
                rejectGet(new Error('Websocket is not ready'));
                return;
              }
              const get_id = !done_act_code && generateUuid();
              let timeout_id = null;
              const unsubscribe = conn.addListener(
                done_act_code ?? 'done',
                (data, ref_id) => {
                  if (!done_act_code && get_id !== ref_id) {
                    reject(new Error('no data'));
                  }
                  if (timeout_id) {
                    clearTimeout(timeout_id);
                  }
                  resolveGet(data);
                  // console.log('resolved data response', data);
                  unsubscribe();
                },
              );
              // Timeout is a number
              if (timeout) {
                timeout_id = setTimeout(() => {
                  unsubscribe();
                  rejectGet(false);
                }, timeout);
              }
              sendToApi(act, parameters, get_id || undefined);
            });
          },
        };
        resolve(conn);
      } else {
        listeners
          .filter(({act}) => act === message.act)
          .forEach((it, i) => {
            it.handler(message.dt || message.py, message.ref_id);
          });
      }
    });

    socket.addEventListener('open', () => {
      sendToApi('auth_data', {
        access_token: authToken,
      });
      const id = global.setInterval(() => {
        if (socket.readyState === socket.CLOSED) {
          global.clearInterval(id);
        } else {
          socket.send('ping');
        }
      }, heartbeatInterval);
    });
  });
