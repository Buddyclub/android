import {StackActions} from '@react-navigation/native';
import * as React from 'react';

// This allow to get route and navigation props

// This allow to call navigation from outside a Navigator. Usefull for floating RoomController

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

// export function navigate(name, params = {}) {
//   navigationRef.current?.dispatch(StackActions.popToTop());
//   navigationRef.current?.navigate(name, params);
// }

export function navigate(name, params = {}) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  }
}

// Gets the current screen from navigation state
export const getActiveRoute = state => {
  const route = state?.routes[state?.index];

  if (route?.state) {
    // Dive into nested navigators
    return getActiveRoute(route.state);
  }

  return route;
};

export const getActiveRouteName = state => getActiveRoute(state)?.name;
