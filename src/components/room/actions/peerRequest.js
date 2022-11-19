/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {connect} from 'react-redux';
import Avatar from '../../avatar';
import Ttext from '../../text';
import RnModal from '../../../modals/RnModal';
import ButtonWrapped from '../../button/button';
import {openRequestModal} from '../../../redux/actions/setRequestModal';
import {styles} from '../roomCompnents';

const PeerRequests = React.memo(({addSpeaker, onClose, isOpen, data}) => {
  const {colors} = useTheme();

  return (
    <RnModal
      isOpened={isOpen}
      preventBackdropClick
      styles={{}}
      containerStyle={{
        ...styles.modalContent,
        backgroundColor: colors.snow,
      }}>
      <View>
        <Avatar
          style={{...styles.avatorStyle}}
          src={`https://graph.facebook.com/${data?.FB_id}/picture?type=large`}
          size={65}
        />
        <Ttext italic style={{color: colors.coal, textAlign: 'center'}}>
          {data?.user_name}
        </Ttext>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            paddingVertical: 8,
          }}>
          <Ttext style={{color: colors.coal}}> Followers</Ttext>
          <Ttext semiBold italic style={{color: colors.coal, marginLeft: 7}}>
            {data?.num_follower}
          </Ttext>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 5,
          }}>
          <ButtonWrapped
            containerStyle={styles.btn}
            titleStyle={styles.titleStyle}
            event="ACCEPT"
            type="primary"
            onPress={() => addSpeaker(data?.user_id)}
            title="Accept"
          />
          <ButtonWrapped
            containerStyle={styles.btn}
            event="CANCEL"
            outline={false}
            titleStyle={styles.titleStyle}
            type="secondary"
            onPress={() => onClose()}
            title="Cancel"
          />
        </View>
      </View>
    </RnModal>
  );
});

const mapStateToProps = state => ({
  data: state?.peerData?.data,
  isOpen: state.requestModal?.isOpen,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(openRequestModal()),
});

export default connect(mapStateToProps, mapDispatchToProps, null)(PeerRequests);
