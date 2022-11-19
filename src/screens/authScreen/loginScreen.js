import * as React from 'react';
import {Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import AuthForm from '../../components/authForm';

async function onFacebookButtonPress() {
  if (Platform.OS === 'android') {
    LoginManager.setLoginBehavior('web_only');
  }
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken,
  );
  // Sign-in the user with the credential
  return auth().signInWithCredential(facebookCredential);
}

export const LogingScreen = () => {
  React.useEffect(() => {
    return async () =>
      await Promise.all([await auth().signOut(), LoginManager.logOut()]);
  }, []);
  return <AuthForm onFacebookButtonPress={onFacebookButtonPress} />;
};
