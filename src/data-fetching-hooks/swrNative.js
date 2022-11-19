import useSWR from 'swr';
import {useRef, useEffect} from 'react';
import {AppState, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

/**
 * swrNative
 *
 * This helps you revalidate your SWR calls, based on navigation actions in `react-navigation`.
 */

export const useRevalidate = props => {
  const {
    mutate,
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    focusThrottleInterval = 5000,
  } = props;

  const {addListener} = useNavigation();
  const lastFocusedAt = useRef(null);
  const previousAppState = useRef(AppState.currentState);
  const previousNetworkState = useRef(null);
  const fetchRef = useRef(mutate);

  useEffect(() => {
    fetchRef.current = mutate;
  });

  const focusCount = useRef(
    Platform.select({
      // react-navigation fire a focus event on the initial mount, but not on web
      web: 1,
      default: 0,
    }),
  );

  useEffect(() => {
    let unsubscribeReconnect = null;
    if (revalidateOnReconnect) {
      // inline require to avoid breaking SSR when window doesn't exist
      const Network = require('@react-native-community/netinfo').default;
      unsubscribeReconnect = Network.addEventListener(state => {
        if (
          previousNetworkState.current?.isInternetReachable === false &&
          state.isConnected &&
          state.isInternetReachable
        ) {
          fetchRef.current();
        }
        previousNetworkState.current = state;
      });
    }

    const onFocus = () => {
      if (focusCount.current < 1) {
        focusCount.current++;
        return;
      }
      const isThrottled =
        focusThrottleInterval &&
        lastFocusedAt.current &&
        Date.now() - lastFocusedAt.current <= focusThrottleInterval;

      if (!isThrottled) {
        lastFocusedAt.current = Date.now();
        fetchRef.current();
      }
    };

    const onAppStateChange = nextAppState => {
      if (
        previousAppState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onFocus();
      }

      previousAppState.current = nextAppState;
    };

    let unsubscribeFocus = null;
    let unsubscribeAppState = null;

    if (revalidateOnFocus) {
      unsubscribeFocus = addListener('focus', onFocus);
      unsubscribeAppState = AppState.addEventListener(
        'change',
        onAppStateChange,
      );
    }

    return () => {
      if (revalidateOnFocus) {
        unsubscribeFocus?.();
      }
      if (unsubscribeAppState) {
        unsubscribeAppState?.remove();
      }
      if (revalidateOnReconnect) {
        unsubscribeReconnect?.();
      }
    };
  }, [
    addListener,
    focusThrottleInterval,
    revalidateOnFocus,
    revalidateOnReconnect,
  ]);
};

const useSwrRnHook = (key, fn, params, config) => {
  const swr = useSWR(key, () => fn(...params), config);

  useRevalidate({
    mutate: swr.mutate,
    revalidateOnFocus: config?.revalidateOnFocus,
    revalidateOnReconnect: config?.revalidateOnReconnect,
    focusThrottleInterval: config?.focusThrottleInterval,
  });

  return swr;
};

export default useSwrRnHook;
