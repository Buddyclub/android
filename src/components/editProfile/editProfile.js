import * as React from 'react';
import {View, StyleSheet, KeyboardAvoidingView, ScrollView} from 'react-native';
import {useTheme, TextInput} from 'react-native-paper';
import {Formik} from 'formik';

import Screen from '../screen';
import Ttext from '../text';
import ButtonWrapped from '../button/button';

export const EditProfileComponent = ({props, updateUserProfile}) => {
  const {colors} = useTheme();

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <Screen style={{...styles.screen}}>
        <View style={{...styles.formCont}}>
          <Formik
            initialValues={{
              full_name: props?.route?.params.full_name ?? '',
              user_name: props?.route?.params.user_name ?? '',
              email: props?.route?.params.email ?? '',
              bio: props?.route?.params.bio ?? '',
            }}
            validateOnChange={true}
            validateOnBlur={false}
            validate={({email, user_name, full_name, bio}) => {
              let errors = {};
              if (/\W/.test(user_name)) {
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
              } else if (
                !/(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/.test(
                  full_name,
                )
              ) {
                return {
                  full_name: true,
                };
              } else if (bio.length > 140) {
                return {
                  bio: true,
                };
              }
              return errors;
            }}
            onSubmit={async d => {
              await updateUserProfile(d)
                .then(resp => console.log(resp))
                .catch(err => console.log(err));
            }}>
            {({values, errors, handleChange, handleSubmit}) => {
              return (
                <ScrollView>
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
                    editable={false}
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
                    error={errors?.full_name}
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
                    // editable={data?.email === '' ? true : false}
                    error={errors?.email}
                    onChangeText={handleChange('email')}
                  />
                  <View paddingVertical={10} />
                  <TextInput
                    mode="outlined"
                    placeholder="Bio"
                    label="Bio"
                    keyboardType="default"
                    multiline={true}
                    selectionColor={colors.snow}
                    underlineColorAndroid={colors.snow}
                    outlineColor={colors.snow}
                    value={values?.bio}
                    error={errors?.bio}
                    onChangeText={handleChange('bio')}
                  />
                  <View paddingVertical={15} />
                  <ButtonWrapped
                    event="JOIN"
                    type="primary"
                    onPress={async () => handleSubmit()}
                    title="Continue"
                  />
                </ScrollView>
              );
            }}
          </Formik>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  formCont: {
    paddingHorizontal: 8,
    paddingTop: 10,
  },
});
