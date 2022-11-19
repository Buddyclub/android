import * as React from 'react';
import {useSelector} from 'react-redux';
import CreateNewRoom from '../../components/CreateNewRoom';
import {useWrappedConn} from '../../globalHooks/useWebsocketConn';

const CreateRoom = () => {
  const conn = useWrappedConn();
  const user_id = useSelector(state => state.setUserId?.user_id);
  if (!user_id) {
    return <></>;
  }
  return <CreateNewRoom conn={conn} user_id={user_id} />;
};

export default CreateRoom;
