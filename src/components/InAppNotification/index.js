import React, {memo, useEffect} from 'react';
import {Easing, Notifier, NotifierRoot} from 'react-native-notifier';
import {connect} from 'react-redux';
import {dequal} from 'dequal';

import NotifierComponent from './NotifierComponent';
import {event} from '../../utils/events/events';
import {useConn} from '../../globalHooks/useWebsocketConn';

import {navigationRef, getActiveRoute} from '../../navigation/rootNavigation';

export const INAPP_NOTIFICATION_EMITTER = 'NotificationInApp';

const InAppNotification = memo(
  ({appState}) => {
    const conn = useConn();
    const show = notification => {
      if (appState === 'background') {
        return;
      }

      const {room_id} = notification;
      const state = navigationRef.current?.getRootState();
      const route = getActiveRoute(state);
      // console.log(notification);
      // if (room_id) {
      //   if (route?.name === 'Room') {
      //     return;
      //   }
      Notifier.showNotification({
        showEasing: Easing.inOut(Easing.quad),
        Component: NotifierComponent,
        duration: 0,
        swipeEnabled: true,
        componentProps: {
          notification,
        },
      });
      // }
    };
    useEffect(() => {
      const unsub = [
        conn?.addListener('invite-to-speak', show),
        conn?.addListener('room-invite', show),
        conn?.addListener('new-follow', show),
        conn?.addListener('new-message', show),
        conn?.addListener('room-topic-change', show),
      ];
      const listener = event.addEventListener(INAPP_NOTIFICATION_EMITTER, show);
      return () => {
        unsub.forEach(x => x());
        event.removeLister(INAPP_NOTIFICATION_EMITTER, listener);
      };
    });
    return <NotifierRoot />;
  },
  (prevProps, nextProps) => dequal(prevProps, nextProps),
);

const mapStateToProps = state => {
  return {
    appState: state?.appState?.appState,
  };
};

export default connect(mapStateToProps)(InAppNotification);
