import * as React from 'react';
import {useDispatch} from 'react-redux';
import {loadString} from '../utils/asyncStore/storage';
import {setAccessToken} from '../redux/actions/setAccessToken';
import LoadingApp from '../components/loadingApp';

const useAuth = () => {
  const dispatch = useDispatch();
  const ref = React.useRef();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    ref.current = true;
    const unsubscribe = (async () => {
      const access_token = (await loadString('user-access-token')) || null;
      if (ref.current) {
        dispatch(setAccessToken({access_token}));
        setLoading(prev => !prev);
      }
    })();
    // return () => unsubscribe;
    return () => (ref.current = false);
  }, [dispatch]);
  return {loading};
};

export const AuthComponent = ({children}) => {
  const {loading} = useAuth();

  return <>{loading ? <LoadingApp /> : <>{children}</>}</>;
};
