import {useState, useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import useIsMounted from './useIsMounted';

export default function useAppState(settings) {
  const {onChange, onForeground, onBackground} = settings || {};
  const isMounted = useRef(false);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    isMounted.current = true;
    function handleAppStateChange(nextAppState) {
      if (nextAppState === 'active' && appState !== 'active') {
        isValidFunction(onForeground) && onForeground();
      } else if (
        appState === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        isValidFunction(onBackground) && onBackground();
      }
      if (isMounted.current) {
        setAppState(nextAppState);
      }
      isValidFunction(onChange) && onChange(nextAppState);
    }

    const unsub = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      unsub?.remove();
      () => (isMounted.current = false);
    };
  }, [onChange, onForeground, onBackground, appState, isMounted]);

  // settings validation
  function isValidFunction(func) {
    return func && typeof func === 'function';
  }
  return {appState};
}
