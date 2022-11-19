import React from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from 'react-native-paper';
import {StatusBar, Linking, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {WebRtc} from '../modules/webRtc/webrtc';
import {RootStack} from './mainNavigation';
import {navigationRef} from './rootNavigation';
import {WebSocketProvider} from '../modules/websokets/websokectProvider';
import MainWsHandler from '../globalHooks/useMainWebsocketHandler';
import {AuthStackScreen} from './authNavigation/authStack';
import Ttext from '../components/text';
import InAppNotification from '../components/InAppNotification';
// DeepLinking
const linking = {
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    console.log(url);
    if (!url) {
      return;
    }
    return url;
    // return getProxyURL(url);
  },
  subscribe(listener) {
    function onReceiveURL({url: _url}) {
      // const url = getProxyURL(_url);
      console.log(_url);
      listener(_url);
    }

    Linking.addEventListener('url', onReceiveURL);

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener('url', onReceiveURL);
    };
  },
  prefixes: ['budyclub://', 'https://budyclub.com'],
  config: {
    screens: {
      Main: {
        initialRouteName: 'Budyclub',
        screens: {
          Room: {
            /**
             * @params ?room_id: UUID
             * i.e. https://budyclub.com/room/866ae363-1e6d-463e-ac4f-f9f128d3058b -> will open room
             * i.e. budyclub://room/866ae363-1e6d-463e-ac4f-f9f128d3058b -> will open room
             */
            path: 'room/:room_id',
          },
        },
      },
      // UserProfile: "user"
    },
  },
};

const DeepLinkingNavigator = ({children, theme}) => {
  return (
    <NavigationContainer
      linking={{...linking}}
      ref={navigationRef}
      fallback={
        <View>
          <Ttext>.....Loading</Ttext>
        </View>
      }
      theme={{
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.background,
          border: theme.colors.toolbar,
          text: theme.colors.text,
        },
      }}>
      {children}
    </NavigationContainer>
  );
};

const RootNavigationComponent = () => {
  const token = useSelector(state => state.accessToken?.access_token);
  const theme = useTheme();
  return (
    <DeepLinkingNavigator theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.dark} />

      {token !== null ? (
        <>
          {/* <SaveDeviceToken /> */}
          <WebSocketProvider token={token} shouldConnect={true}>
            <MainWsHandler>
              <WebRtc />
              <InAppNotification />
              <RootStack />
            </MainWsHandler>
          </WebSocketProvider>
        </>
      ) : (
        // Auth screen
        <AuthStackScreen />
      )}
    </DeepLinkingNavigator>
  );
};

export default RootNavigationComponent;
