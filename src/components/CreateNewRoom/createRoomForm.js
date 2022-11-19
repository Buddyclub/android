/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/core';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme, TextInput} from 'react-native-paper';

import Screen from '../../components/screen';
import Ttext from '../../components/text';
import ButtonWrapped from '../button/button';
import CheckBox from '../checkBox';
import {useWrappedConn} from '../../globalHooks/useWebsocketConn';
import {Api} from '../../api/api';

const fetch = new Api();

const CreateNewRoom = ({user_id}) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const {colors} = useTheme();
  const inset = useSafeAreaInsets();
  const conn = useWrappedConn();

  React.useEffect(() => fetch.setup(), []);

  const setIsprivate = () => {
    setChecked(prv => !prv);
  };

  return (
    <KeyboardAvoidingView style={style.screen}>
      <Screen style={{...style.screen}}>
        <View
          style={{
            paddingVertical: inset.top,
            paddingHorizontal: inset.left + 20,
          }}>
          <Formik
            initialValues={{
              name: '',
              isPrivate: checked,
              user_id: user_id,
              description: '',
            }}
            validateOnChange={true}
            validateOnBlur={false}
            validate={({name, description}) => {
              let errors = {};
              if (name.length < 4 || name.length > 50) {
                return {
                  name: true,
                };
              } else if (description.length > 140 || description.length < 5) {
                return {
                  description: true,
                };
              }
              return errors;
            }}
            // eslint-disable-next-line no-shadow
            onSubmit={async ({name, description, isPrivate, user_id}) => {
              //set loading to true
              setLoading(prev => !prev);
              const d = {name, description, isPrivate: checked, user_id};
              await fetch
                .postData(d, 'create-room')
                .then(({data}) => {
                  setLoading(prev => !prev);
                  navigation.navigate('Room', {
                    room_id: data.room_id,
                    user_id,
                  });
                })
                .catch(err => {
                  console.log(err);
                });
            }}>
            {({
              values,
              errors,
              setFieldValue,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => {
              return (
                <ScrollView>
                  <Ttext style={{paddingVertical: 10}}>
                    Fill the following fields to start a new room
                  </Ttext>
                  <View paddingVertical={10} />
                  <Ttext>Room name</Ttext>
                  <TextInput
                    mode="outlined"
                    placeholder="Room Name"
                    label="Room Name"
                    keyboardType="default"
                    selectionColor={colors.snow}
                    underlineColorAndroid={colors.snow}
                    outlineColor={colors.snow}
                    value={values.name}
                    error={errors.name}
                    onChangeText={handleChange('name')}
                  />
                  <View paddingVertical={15} />
                  <Ttext>What do you want to talk about</Ttext>
                  <TextInput
                    mode="outlined"
                    placeholder="Room Description"
                    label="Description"
                    keyboardType="default"
                    selectionColor={colors.snow}
                    underlineColorAndroid={colors.snow}
                    outlineColor={colors.snow}
                    multiline={true}
                    value={values.description}
                    error={errors.description}
                    onChangeText={handleChange('description')}
                  />
                  <View paddingVertical={15} />
                  <Ttext>Is the room public? or private.</Ttext>
                  <Ttext
                    style={{
                      fontSize: 13,
                    }}
                    medium>
                    Only you can see private room. You have to invite users to
                    join.
                  </Ttext>
                  <View
                    style={{
                      marginBottom: 25,
                      paddingVertical: 2,
                    }}>
                    <CheckBox checked={checked} setChecked={setIsprivate} />
                  </View>
                  <ButtonWrapped
                    event="CreateRoomDone"
                    type="primary"
                    onPress={handleSubmit}
                    title="Go live"
                    disabled={isSubmitting}
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
export default CreateNewRoom;
const style = StyleSheet.create({
  screen: {flex: 1},
  mainCont: {},
  segment: {
    paddingVertical: 16,
  },
});
