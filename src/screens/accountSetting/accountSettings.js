import * as React from 'react';
import {useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {LoginManager} from 'react-native-fbsdk-next';

import UserAccountSettings from '../../components/userAccountSetting';
import {setAccessToken} from '../../redux/actions/setAccessToken';
import {clear} from '../../utils/asyncStore/storage';
import {useConn} from '../../globalHooks/useWebsocketConn';

const AccountSetting = props => {
  const dispatch = useDispatch();
  const conn = useConn();
  const logout = React.useCallback(async () => {
    await Promise.all([
      clear(),
      dispatch(setAccessToken({access_token: null})),
      auth().signOut(),
      LoginManager.logOut(),
      conn?.close(),
    ]);
  }, [conn, dispatch]);
  return <UserAccountSettings loagout={logout} />;
};

export default React.memo(AccountSetting);
