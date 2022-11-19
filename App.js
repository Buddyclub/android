import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Provider, useDispatch} from 'react-redux';
import {useNetInfo} from '@react-native-community/netinfo';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import PaperThemeProvider from './src/theme/PaperThemeProvider';
import {store} from './src/redux/configureStore';
import {setDivice} from './src/redux/actions/device';
import {setAppState} from './src/redux/actions/appState';
import RootNavigationComponent from './src/navigation';

import {getDevice} from './src/device/';
import {AuthComponent} from './src/globalHooks/useAuth';

import {toggleIsConnected} from './src/redux/actions/isConnected';
// import SwrConfig from './src/data-fetching-hooks/SWRConfig';
import useAppState from './src/globalHooks/useAppState';
import {ActionSheetProvider} from './src/components/actionSheet';

// pm2 start npm --name lofi -- run "dev"

const SetDevice = () => {
  const {appState} = useAppState({
    onChange: newAppState => console.log('App state changed to ', newAppState),
    onForeground: () => {},
    onBackground: () => {},
  });
  const dispatch = useDispatch();
  const isMounted = React.useRef(false);
  const {isConnected, isInternetReachable} = useNetInfo();
  console.log(isConnected);
  useEffect(() => {
    isMounted.current = true;
    if (isMounted.current) {
      dispatch(setDivice({device: getDevice()}));
      dispatch(toggleIsConnected({connected: isInternetReachable}));
      dispatch(setAppState({appState}));
    }
    return () => (isMounted.current = false);
  }, [appState, dispatch, isInternetReachable]);
  return null;
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <Provider store={store}>
          <PaperThemeProvider>
            <ActionSheetProvider>
              <AuthComponent>
                {/* <SwrConfig /> */}
                <SetDevice />
                <RootNavigationComponent />
                {/* </SwrConfig> */}
              </AuthComponent>
            </ActionSheetProvider>
          </PaperThemeProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
