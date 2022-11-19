import * as React from 'react';
import Followings from '../../components/followFollower/Followings';
import {useConn, useWrappedConn} from '../../globalHooks/useWebsocketConn';
import {useFetch} from '../../data-fetching-hooks/useFetch';
import {useSelector} from 'react-redux';
import LoadingApp from '../../components/loadingApp';

export const UserFollowings = ({route: {params}}) => {
  const conn = useConn();
  const postConn = useWrappedConn();
  const {user_id, name} = params;
  const uid = useSelector(state => state.setUserId?.user_id);

  const {data, error, mutate, isValidating} = useFetch(
    {
      dedupingInterval: 1000,
    },
    `followers-following/${user_id}/${name.toLowerCase()}`,
    'GET',
  );

  const followUnfollow = async (action, id) => {
    const resp = await postConn.mutation.follow({
      id_followed: `${id}`,
      id_following: `${uid}`,
      action,
    });
    // await mutate([...data]);
  };

  if (error) {
    return null;
  }
  if (typeof data === 'undefined' || !data || isValidating) {
    return <LoadingApp />;
  }

  return (
    <>
      <Followings
        data={data}
        conn={conn}
        uid={uid}
        r={name.toLowerCase()}
        followUnfollow={followUnfollow}
      />
    </>
  );
};
