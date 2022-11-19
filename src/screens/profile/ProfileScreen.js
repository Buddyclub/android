import * as React from 'react';
import {useTheme} from 'react-native-paper';
import Screen from '../../components/screen';
import ProfileComponent from '../../components/profile/';
import {useFetch} from '../../data-fetching-hooks/useFetch';
import {useSelector} from 'react-redux';
import LoadingApp from '../../components/loadingApp';
const ProfileScreen = params => {
  const {colors} = useTheme();
  const uid = useSelector(state => state.setUserId?.user_id);
  const {data, error} = useFetch(
    {
      shouldRetryOnError: true,
      errorRetryInterval: 2000,
      dedupingInterval: 1000,
      // refreshInterval: 5000,
    },
    `user/${uid}`,
    'GET',
  );
  if (typeof data === 'undefined' || !data || error in data) {
    // return loading component
    return <LoadingApp />;
  }

  if (error) {
    // return error component
    return null;
  }
  return (
    <Screen style={{backgroundColor: colors.dark, flex: 1}}>
      <ProfileComponent data={data} isMe user_id={uid} />
    </Screen>
  );
};
export default React.memo(ProfileScreen);
