/**
 * @format
 */
import 'react-native-get-random-values';
import {
  AppRegistry,
  LogBox,
  // AppState,
  NativeModules,
  NativeEventEmitter,
  Platform,
} from 'react-native';
import _BackgroundTimer from 'react-native-background-timer';
import {registerGlobals} from 'react-native-webrtc';

import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);
const {BudyclubNativeUtils, WebRTCModule} = NativeModules;
const webRTCEventEmitter = new NativeEventEmitter(WebRTCModule);

let hasAudioFocus;

const audioFocusChangeListeners = new Set();
// const appActiveStateChangeListeners = new Set();

function setupEventListeners() {
  // audio focus: used by daily-js to auto-mute mic, for Android only
  hasAudioFocus = true; // safe assumption, hopefully
  webRTCEventEmitter.addListener('EventAudioFocusChange', event => {
    if (!event || typeof event.hasFocus !== 'boolean') {
      console.error('invalid EventAudioFocusChange event');
    }
    const hadAudioFocus = hasAudioFocus;
    hasAudioFocus = event.hasFocus;
    console.log('has audio focus', hasAudioFocus);
    if (hadAudioFocus !== hasAudioFocus) {
      audioFocusChangeListeners.forEach(listener => listener(hasAudioFocus));
    }
  });
}

function setupGlobalVars() {
  /**WEBRTC API + global `window` object */
  registerGlobals();

  /**A shim to prevent errors in RN (Not ideal) */
  global.window.addEventListener = () => {};

  // Let timers run while Android app is in the background.
  // See https://github.com/jitsi/jitsi-meet/blob/caabdadf19ae5def3f8173acec6c49111f50a04e/react/features/mobile/polyfills/browser.js#L409,
  // where this technique was borrowed from.
  // For now we don't need this for iOS since we're recommending that apps use
  // the "voip" background mode capability, which keeps the app running normally
  // during a call.
  if (Platform.OS === 'android') {
    global.clearTimeout = _BackgroundTimer.clearTimeout.bind(_BackgroundTimer);
    global.clearInterval =
      _BackgroundTimer.clearInterval.bind(_BackgroundTimer);
    global.setInterval = _BackgroundTimer.setInterval.bind(_BackgroundTimer);
    global.setTimeout = (fn, ms = 0) => _BackgroundTimer.setTimeout(fn, ms);
  }

  global.budyclubNativeUtils = {
    ...BudyclubNativeUtils,
    setAudioMode: WebRTCModule.setDailyAudioMode,
    addAudioFocusChangeListener: listener => {
      audioFocusChangeListeners.add(listener);
    },
    removeAudioFocusChangeListener: listener => {
      audioFocusChangeListeners.delete(listener);
    },
  };
}

setupGlobalVars();
setupEventListeners();

AppRegistry.registerComponent(appName, () => App);
