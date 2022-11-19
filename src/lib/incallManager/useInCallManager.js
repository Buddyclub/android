import {useEffect} from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {useDispatch} from 'react-redux';

import {setEarPhone} from '../../redux/actions/isEraphone';

const nativeBridge = NativeModules.InCallManager;
const NativeModule = new NativeEventEmitter(nativeBridge);

export const useInCallManager = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    NativeModule.addListener('WiredHeadset', ({hasMic, isPlugged}) => {
      console.log(hasMic, isPlugged);
      dispatch(setEarPhone({isPlugged}));
      // do something
    });
    return () => NativeModule.removeSubscription('WiredHeadset');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (InCallManager.recordPermission !== 'granted') {
      InCallManager.requestRecordPermission()
        .then(requestedRecordPermissionResult => {
          if (requestedRecordPermissionResult === 'granted') {
            InCallManager.start();
            console.log('granted record permission');
          }
        })
        .catch(err => {
          console.log('InCallManager.requestRecordPermission() catch: ', err);
        });
    }
  }, []);
};
