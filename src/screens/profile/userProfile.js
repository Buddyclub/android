/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useTheme} from 'react-native-paper';
import {useSelector, connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Screen from '../../components/screen';
import ProfileComponent from '../../components/profile/';
import {useFetch} from '../../data-fetching-hooks/useFetch';
import {useConn, useWrappedConn} from '../../globalHooks/useWebsocketConn';
import LoadingApp from '../../components/loadingApp';

const UserProfileScreen = ({route: {params}}) => {
  const {colors} = useTheme();
  const conn = useConn();
  const navigation = useNavigation();
  const postConn = useWrappedConn();
  const uid = useSelector(state => state.setUserId?.user_id);
  const id = params?.user_id;
  const isMe = uid === id;
  React.useEffect(() => {
    if (!conn) {
      return null;
    }
  }, [conn]);
  const {data, error, mutate, isValidating} = useFetch(
    {
      shouldRetryOnError: true,
      errorRetryInterval: 2000,
      dedupingInterval: 1000,
      // refreshInterval: 5000,
    },
    `user/${id}`,
    'GET',
  );
  const followUnfollow = React.useCallback(
    async action => {
      const resp = await postConn.mutation.follow({
        id_followed: `${id}`,
        id_following: `${uid}`,
        action,
      });
      await mutate({...data, ...resp}, false);
    },
    [data, id, mutate, postConn.mutation, uid],
  );
  const removeSpeaker = React.useCallback(async () => {
    await postConn.mutation.removeSpeaker(id, params.room_id);
    if (navigation.canGoBack) {
      navigation.goBack();
    }
  }, [id, navigation, params.room_id, postConn.mutation]);
  if (typeof data === 'undefined' || !data) {
    // return loading component
    return <LoadingApp />;
  }

  if (error) {
    // return error component
    return null;
  }

  return (
    <Screen style={{backgroundColor: colors.dark, flex: 1}}>
      <ProfileComponent
        data={data}
        isMe={isMe}
        uid={uid}
        user_id={id}
        isSpeaker={params?.isSpeaker}
        isMod={params?.moderator}
        room_id={params?.room_id}
        followUnfollow={followUnfollow}
        removeSpeaker={removeSpeaker}
      />
    </Screen>
  );
};

const mapStateToProps = state => {
  return {};
};
export default connect(mapStateToProps, null, null)(UserProfileScreen);
