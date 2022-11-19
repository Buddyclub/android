/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {useTheme, TextInput} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import {connect} from 'react-redux';

import Ttext from '../../text';
import RnModal from '../../../modals/RnModal';
import ButtonWrapped from '../../button/button';
import {openUpdateRoomTitleModal} from '../../../redux/actions/setRoomUpdateTitleDescModal';
import {useDimensions} from '../../../utils/metrics/dimensions';
import {KeyboardAvoidingView} from 'react-native';
import {useWrappedConn} from '../../../globalHooks/useWebsocketConn';

const EditRoomTitle = React.memo(
  ({name, description, isOpened, room_id, _openUpdateRoomTitleModal}) => {
    const inset = useSafeAreaInsets();
    const {colors} = useTheme();
    const {width} = useDimensions();
    const conn = useWrappedConn();
    return (
      <RnModal
        isOpened={isOpened}
        id={'ROOM_TITLE_DESC_MODAL'}
        preventBackdropClick={false}
        onClose={() => _openUpdateRoomTitleModal()}
        containerStyle={{}}>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            width: width - 20,
            marginBottom: 10,
            justifyContent: 'center',
          }}>
          <Formik
            initialValues={{
              name,
              description,
            }}
            onSubmit={async ({name, description}) => {
              _openUpdateRoomTitleModal();
              const resp = await conn.mutation.updateRoomInfo({
                name,
                description,
                room_id,
              });
            }}
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
            validateOnBlur={false}
            validateOnChange={true}>
            {({values, errors, handleChange, handleSubmit}) => {
              return (
                <View style={{}}>
                  <Ttext
                    semiBold
                    style={{textAlign: 'center', paddingVertical: 10}}>
                    Update Room info
                  </Ttext>
                  <TextInput
                    autoCapitalize="none"
                    mode="outlined"
                    placeholder="Update Room Title"
                    label="Cool room title here"
                    keyboardType="default"
                    selectionColor={colors.snow}
                    underlineColorAndroid={colors.snow}
                    outlineColor={colors.snow}
                    value={values.name}
                    error={errors.name}
                    onChangeText={handleChange('name')}
                  />
                  <TextInput
                    style={{paddingVertical: 15}}
                    mode="outlined"
                    placeholder="Update Room description"
                    label="Nice room description"
                    keyboardType="default"
                    multiline
                    selectionColor={colors.snow}
                    underlineColorAndroid={colors.snow}
                    outlineColor={colors.snow}
                    value={values.description}
                    error={errors.description}
                    onChangeText={handleChange('description')}
                  />
                  <ButtonWrapped
                    event="JOIN"
                    type="primary"
                    onPress={async () => await handleSubmit()}
                    title="Update"
                  />
                </View>
              );
            }}
          </Formik>
        </KeyboardAvoidingView>
      </RnModal>
    );
  },
);

const mapStateToProps = state => ({
  isOpened: state.updateRoomTitleDescModal?.isOpen,
});

const mapDispatchToProps = dispatch => ({
  _openUpdateRoomTitleModal: () => dispatch(openUpdateRoomTitleModal()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
)(EditRoomTitle);
