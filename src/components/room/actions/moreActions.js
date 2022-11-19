/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {useTheme, Checkbox} from 'react-native-paper';
import {connect} from 'react-redux';
import Avatar from '../../avatar';
import Ttext from '../../text';
import RnModal from '../../../modals/RnModal';
import ButtonWrapped from '../../button/button';
import {styles} from '../roomCompnents';
import Touchable from '../../Touchable';

const PeerRequests = React.memo(
  ({_setChat, _setRaiseHand, closeActionModal}) => {
    const {colors} = useTheme();

    return (
      <RnModal
        isOpened={isAction}
        preventBackdropClick
        styles={{}}
        containerStyle={{
          ...styles.modalContent,
          backgroundColor: colors.background,
        }}>
        <View
          style={{
            paddingHorizontal: 10,
          }}>
          <View style={{paddingBottom: 10}}>
            <Checkbox.Item
              label={`${chatChecked ? 'Disable' : 'Enable'} Chat`}
              labelStyle={{fontSize: 14}}
              status={chatChecked ? 'checked' : 'unchecked'}
              onPress={() => _setChat()}
            />
          </View>
          <View>
            <Checkbox.Item
              label={`${raiseHandChecked ? 'Disable' : 'Enable'} Raise Hand`}
              labelStyle={{fontSize: 14}}
              status={raiseHandChecked ? 'checked' : 'unchecked'}
              onPress={() => _setRaiseHand()}
            />
          </View>
          <Touchable
            onPress={() => closeActionModal()}
            style={{
              padding: 20,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ttext semiBold>Close</Ttext>
          </Touchable>
        </View>
      </RnModal>
    );
  },
);

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, null, null)(PeerRequests);
