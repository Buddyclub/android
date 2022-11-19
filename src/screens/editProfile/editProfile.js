import * as React from 'react';
import {connect} from 'react-redux';
import {EditProfileComponent} from '../../components/editProfile';
import {useConn, useWrappedConn} from '../../globalHooks/useWebsocketConn';
import {Api} from '../../api/api';

const api = new Api();
const EditComponent = React.memo(props => {
  const conn = useConn();
  const connection = useWrappedConn();
  const {user_id} = props;
  React.useEffect(() => api.setup(), []);

  const updateUserProfile = React.useCallback(
    async d => {
      return await api.putData(d, `update-user-profile/${user_id}`);
    },
    [user_id],
  );
  return (
    <EditProfileComponent updateUserProfile={updateUserProfile} props={props} />
  );
});

const mapStateToProps = state => ({
  user_id: state.setUserId.user_id,
});

export const EditProfile = connect(mapStateToProps, null, null)(EditComponent);
