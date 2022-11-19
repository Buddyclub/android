/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Touchable from '../../Touchable';
import {useTheme} from 'react-native-paper';
import Ttext from '../../text';
import Avatar from '../../avatar';
import {peerRequestingAct} from '../../../redux/actions/peerRequestingDataAct';
import {openRequestModal} from '../../../redux/actions/setRequestModal';
import {dequal} from 'dequal/lite';

const Requests = React.memo(
  ({re, setPeerData, openModal}) => {
    const {colors} = useTheme();
    const isRequestsToSpeak = Object.entries(re).length > 0;
    const re_keys = Object.keys(re);
    const _requests = React.useMemo(() => {
      return (
        <View style={{...styles.scrollviwCont}}>
          {re_keys.map((v, key) => {
            const u = re[v];
            const photoUrl =
              'https://graph.facebook.com/' + u?.FB_id + '/picture?type=large';
            return (
              <Touchable
                onPress={() => {
                  setPeerData({user_id: v, ...u});
                  openModal();
                }}
                key={key}
                style={{
                  margin: 10,
                }}>
                <Avatar src={photoUrl} size={60} />
                <Ttext style={{fontSize: 12, paddingHorizontal: 10}}>
                  {u?.user_name}
                </Ttext>
              </Touchable>
            );
          })}
        </View>
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [re, re_keys]);
    return (
      <>
        {isRequestsToSpeak && (
          <>
            <Ttext bold style={{paddingHorizontal: 20, paddingTop: 15}}>
              Requests
            </Ttext>
            {_requests}
          </>
        )}
      </>
    );
  },
  // (prevProps, nxtProps) => dequal(prevProps.re, nxtProps.re),
);

const mapStateToProps = ({requests}) => {
  return {
    ...requests,
  };
};

const mapDispatchToProps = dispatch => ({
  setPeerData: payload => dispatch(peerRequestingAct(payload)),
  openModal: () => dispatch(openRequestModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Requests);

const styles = StyleSheet.create({
  scrollviwCont: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
    overflow: 'hidden',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
});
