import React, {useEffect, useState} from 'react';
import {RefreshControl} from 'react-native';
import {useTheme} from 'react-native-paper';
// import { useBridgeSync } from "@ledgerhq/live-common/lib/bridge/react";
// import { useCountervaluesPolling } from "@ledgerhq/live-common/lib/countervalues/react";
// import { useTheme } from "@react-navigation/native";
// import { SYNC_DELAY } from "../constants";

export default ScrollListLike => {
  function Inner({forwardedRef, ...scrollListLikeProps}) {
    const {colors} = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    // const setSyncBehavior = useBridgeSync();
    // const {poll} = useCountervaluesPolling();

    function onRefresh() {
      // refetch data
      // poll();
      // setSyncBehavior({
      //   type: 'SYNC_ALL_ACCOUNTS',
      //   priority: 5,
      // });
      setRefreshing(true);
    }

    useEffect(() => {
      if (!refreshing) {
        return () => {};
      }

      const timer = setTimeout(() => {
        setRefreshing(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }, [refreshing]);

    return (
      <ScrollListLike
        {...scrollListLikeProps}
        ref={forwardedRef}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={colors.accent}
            colors={[colors.snow]}
            tintColor={colors.snow}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    );
  }

  return React.forwardRef((props, ref) => (
    <Inner {...props} forwardedRef={ref} />
  ));
};
