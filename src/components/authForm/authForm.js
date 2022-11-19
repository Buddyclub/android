/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {useTheme, TextInput} from 'react-native-paper';
// import {useNavigation} from '@react-navigation/core';
import {Formik} from 'formik';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';

import Screen from '../../components/screen';
import Ttext from '../../components/text';
import ButtonWrapped from '../button/button';
import {Api} from '../../api/api';
import {saveString} from '../../utils/asyncStore/storage';
import {setAccessToken} from '../../redux/actions/setAccessToken';

const api = new Api();

const AuthForm = ({onFacebookButtonPress}) => {
  const {colors} = useTheme();
  const dispatch = useDispatch();
  const inset = useSafeAreaInsets();

  const [fbBtn, hideFbBtn] = React.useState(true);

  React.useEffect(() => api.setup(), []);

  const [data, setData] = React.useState(() => {
    return {
      user_name: '',
      full_name: '',
      email: '',
      providerId: '',
      photo_url: '',
      FB_id: null,
      background_photo_url: 'https://source.unsplash.com/WLUHO9A_xik/1600x900',
      bio: 'It is always a good time',
    };
  });

  async function loginWithFb() {
    const {additionalUserInfo} = await onFacebookButtonPress();
    const userData = {
      full_name: additionalUserInfo?.profile?.name,
      email: additionalUserInfo?.profile?.email ?? '',
      providerId: additionalUserInfo?.providerId,
      FB_id: additionalUserInfo?.profile?.id,
      photo_url:
        additionalUserInfo?.profile?.picture?.data?.url ??
        'https://placekitten.com/250/250',
    };
    if (userData.FB_id) {
      // check whether user is already registered
      const res = await api.postData({...userData}, 'u');
      console.log(res);
      if (res.data?.code === 0) {
        const {access_token} = res.data;
        // save access_token
        console.warn('user had loged in with FB');
        dispatch(setAccessToken({access_token}));
        return await saveString('user-access-token', access_token);
      } else if (res.data.code === 1) {
        setData({...userData});
        hideFbBtn(prev => !prev);
        return false;
      } else {
        return false;
      }
    }
  }

  const _full_name = name =>
    name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

  return (
    <KeyboardAvoidingView style={{...styles.screen}}>
      <Screen style={{...styles.screen}}>
        <View
          style={{
            paddingVertical: inset.top,
            paddingHorizontal: inset.left + 20,
          }}>
          {!fbBtn && (
            <Formik
              initialValues={{
                user_name: data.user_name ?? '',
                full_name: data.full_name,
                email: data.email,
                providerId: data.providerId,
                photo_url: data.photo_url ?? 'https://placekitten.com/250/250',
                FB_id: data.FB_id,
                background_photo_url:
                  'https://source.unsplash.com/WLUHO9A_xik/1600x900',
                bio: 'It is always a good time',
              }}
              validateOnChange={true}
              validateOnBlur={false}
              validate={({user_name, email}) => {
                let errors = {};
                if (/\W/.test(user_name) && user_name.length > 3) {
                  return {
                    user_name: true,
                  };
                } else if (
                  email === '' ||
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
                ) {
                  return {
                    email: true,
                  };
                }
                return errors;
              }}
              onSubmit={async ({
                user_name,
                full_name,
                email,
                providerId,
                FB_id,
                photo_url,
                background_photo_url,
                bio,
              }) => {
                const transFormedData = {
                  user_name: user_name.toLowerCase(),
                  full_name: _full_name(full_name),
                  email,
                  providerId,
                  FB_id,
                  photo_url,
                  background_photo_url,
                  bio,
                };
                const res = await api.postData(transFormedData, 'login');
                if (res.kind === 'ok' && res.data?.code === 0) {
                  const {access_token} = res.data;
                  // save access token
                  dispatch(setAccessToken({access_token}));
                  return await saveString('user-access-token', access_token);
                } else {
                  return false;
                }
              }}>
              {({values, errors, handleChange, handleSubmit, isSubmitting}) => {
                return (
                  <ScrollView>
                    <View
                      style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: 5,
                      }}>
                      <Image
                        source={{uri: values.photo_url}}
                        style={{width: 70, height: 70, borderRadius: 70 / 2}}
                      />
                    </View>
                    <TextInput
                      autoCapitalize="none"
                      mode="outlined"
                      placeholder="Enter user name"
                      label="User Name"
                      keyboardType="default"
                      selectionColor={colors.snow}
                      underlineColorAndroid={colors.snow}
                      outlineColor={colors.snow}
                      value={values.user_name}
                      error={errors.user_name}
                      onChangeText={handleChange('user_name')}
                    />
                    <View paddingVertical={10} />
                    <TextInput
                      mode="outlined"
                      placeholder="Full name"
                      label="Full Name"
                      keyboardType="default"
                      selectionColor={colors.snow}
                      underlineColorAndroid={colors.snow}
                      outlineColor={colors.snow}
                      value={values.full_name}
                      editable={false}
                      // error={errors?.full_name}
                      onChangeText={handleChange('full_name')}
                    />
                    <View paddingVertical={10} />
                    <TextInput
                      mode="outlined"
                      autoCapitalize="none"
                      placeholder="Enter email address"
                      label="Email address"
                      keyboardType="email-address"
                      selectionColor={colors.snow}
                      underlineColorAndroid={colors.snow}
                      outlineColor={colors.snow}
                      value={values.email}
                      editable={data?.email === '' ? true : false}
                      error={errors?.email}
                      onChangeText={handleChange('email')}
                    />
                    <View paddingVertical={15} />
                    <ButtonWrapped
                      event="JOIN"
                      type="primary"
                      disabled={isSubmitting}
                      onPress={async () => await handleSubmit()}
                      title="Continue"
                    />
                  </ScrollView>
                );
              }}
            </Formik>
          )}
        </View>
        {fbBtn && (
          <>
            <View style={{flex: 1, paddingVertical: 20}}>
              <View
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <Ttext
                  style={{
                    textAlign: 'center',
                    fontSize: 25,
                  }}>
                  Budyclub
                </Ttext>
              </View>
            </View>

            <View style={{flex: 1}}>
              <Ttext
                semiBold
                style={{
                  textAlign: 'center',
                  // fontSize: ,
                  // paddingTop: 0,
                }}>
                The Air Belongs to You
              </Ttext>

              <Ttext medium style={{textAlign: 'center', paddingVertical: 5}}>
                Create and connect over live talk and music streaming
              </Ttext>
            </View>

            <View
              style={{
                // flex: 1,
                alignSelf: 'center',
                position: 'absolute',
                bottom: 20,
                // alignItems: 'center',
                // justifyContent: 'center',
              }}>
              {/* <Ttext style={{textAlign: 'center'}}>
                Continue with Facebook
              </Ttext> */}
              <View paddingVertical={10} />
              <ButtonWrapped
                event="JOIN"
                type="primary"
                onPress={async () => loginWithFb()}
                title="Login with facebook"
                containerStyle={{backgroundColor: colors.info}}
              />
              <View style={{marginTop: 20}}>
                <View>
                  <Ttext medium>By Login with Facebook, you agree to our</Ttext>
                  <Ttext
                    style={{color: colors.info, textAlign: 'center'}}
                    onPress={() => {}}>
                    Terms of Services
                  </Ttext>
                  <Ttext medium>and acknowledge that you have read our</Ttext>
                  <Ttext
                    style={{color: colors.info, textAlign: 'center'}}
                    onPress={() => {}}>
                    Privacy Policy
                  </Ttext>
                  <Ttext medium>
                    to learn how to collect, use, and share your data.
                  </Ttext>
                </View>
              </View>
            </View>
          </>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
};

export default React.memo(AuthForm);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  fbBtn: {},
  termsTxt: {
    fontSize: 12,
    textAlign: 'left',
    letterSpacing: 1,
  },
});
