/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import Touchable from '../Touchable';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import Ttext from '../text';
import getWindowDimension from '../../utils/metrics/windowDimensions';
import Icon from '../icons/icon';
// import FeatherIcon from 'react-native-vector-icons/Feather';
import {GiftedChat, Send, Bubble} from '../../../lib';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const {Dw: width} = getWindowDimension();

// Hex: #D06800
// RGB: (208, 104, 0)

const MuteUnmute = React.memo(({muteUnmute, isMuted}) => {
  const {colors} = useTheme();
  const inset = useSafeAreaInsets();
  return (
    <>
      <Touchable
        onPress={() => muteUnmute(isMuted)}
        style={{
          ...styles.controllerIconHolder,
          marginRight: 20 + inset.right,
          padding: 6,
        }}>
        <Icon
          name={!isMuted ? 'mic-off' : 'mic'}
          size={25}
          color={!isMuted ? colors.danger : colors.snow}
        />
      </Touchable>
    </>
  );
});

const _mapStateToProps = state => ({
  isMuted: state?.setMute?.muted,
});

const MuteUnmuteBtn = connect(_mapStateToProps)(MuteUnmute);

const ChatComponent = React.memo(
  ({
    user_id,
    reqToSpeak,
    muteUnmute,
    leaveRoom,
    leaveStage,
    shareRoom,
    isSpeaker,
    isRoomCreater,
    isMuted,
    roomActionModal,
    sendMessage,
    messages,
  }) => {
    const {colors} = useTheme();
    const navigation = useNavigation();
    const [showCallBtn, setHideCallBtn] = React.useState(false);

    const request = React.useCallback(() => {
      reqToSpeak();
      setHideCallBtn(!showCallBtn);
    }, [reqToSpeak, showCallBtn]);

    const onSend = React.useCallback(
      // eslint-disable-next-line no-shadow
      async (messages = []) => {
        const msgPayload = {
          _id: messages[0]?._id,
          user: {
            ...messages[0]?.user,
          },
          message: {
            text: messages[0]?.text,
            createdAt: new Date(),
          },
        };
        await sendMessage(msgPayload);
      },
      [sendMessage],
    );
    const callBtn = React.useMemo(() => {
      let hand;
      let _onPress;
      if (isRoomCreater && isSpeaker) {
        hand = 'more-vert';
        _onPress = roomActionModal;
      } else if (isSpeaker && !isRoomCreater) {
        hand = 'do-not-touch';
        _onPress = leaveStage;
      } else {
        hand = 'pan-tool';
        _onPress = request;
      }
      return (
        <>
          <Touchable
            borderless={true}
            onPress={async () => await _onPress()}
            style={[{...styles.controllerIconHolder}, {padding: 6}]}>
            <Icon
              name={hand}
              size={25}
              style={{backgroundColor: 'transparent'}}
              color={isRoomCreater && isSpeaker ? colors.snow : '#D06800'}
            />
          </Touchable>
        </>
      );
    }, [
      colors.snow,
      isRoomCreater,
      isSpeaker,
      leaveStage,
      request,
      roomActionModal,
    ]);

    const shareButton = React.useMemo(() => {
      return (
        <>
          <Touchable
            borderless={true}
            onPress={() => shareRoom()}
            style={[{...styles.controllerIconHolder, paddingLeft: 25}]}>
            <Icon
              name="group-add"
              size={30}
              style={{backgroundColor: 'transparent'}}
              color={colors.info}
            />
          </Touchable>
        </>
      );
    }, [colors.info, shareRoom]);
    return (
      <View style={[{backgroundColor: colors.grey, ...styles.chContent}]}>
        <View style={{...styles.toggle, backgroundColor: colors.bluish}} />
        <View style={{...styles.roomControllerCont}}>
          {callBtn}
          {shareButton}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              position: 'absolute',
              right: 0,
            }}>
            {isSpeaker && <MuteUnmuteBtn muteUnmute={muteUnmute} />}
            <Touchable
              onPress={() => leaveRoom(isSpeaker && isRoomCreater)}
              style={{...styles.controllerIconHolder, padding: 8}}>
              <Ttext style={{color: colors.danger}}>Leave</Ttext>
            </Touchable>
          </View>
        </View>
        <GiftedChat
          alignTop
          renderTicks={() => null}
          onPressAvatar={({_id}) =>
            navigation.navigate('UserProfile', {user_id: _id})
          }
          placeholder="Type your message...."
          renderUsernameOnMessage
          maxInputLength={500}
          listViewProps={{
            showsVerticalScrollIndicator: false,
          }}
          containerStyle={{
            backgroundColor: colors.dark,
            ...styles.textInputCont,
          }}
          textInputStyle={{
            color: colors.snow,
            backgroundColor: colors.surface,
            borderRadius: 20,
          }}
          renderBubble={p => {
            return (
              <Bubble
                {...p}
                textStyle={{
                  right: {
                    fontSize: 13,
                  },
                  left: {
                    fontSize: 13,
                  },
                }}
                wrapperStyle={{
                  left: {
                    // backgroundColor: colors.bluish,
                    // marginVertical: 15,
                  },
                  right: {
                    // backgroundColor: colors.info,
                    // marginVertical: 15,
                  },
                }}
              />
            );
          }}
          messages={messages}
          renderSend={p => (
            <Send
              {...p}
              containerStyle={{
                ...styles.sendContainer,
              }}>
              <MaterialIcons name="send" size={25} color={colors.accent} />
            </Send>
          )}
          onSend={m => onSend(m)}
          user={{
            _id: user_id,
          }}
          isLoadingEarlier
        />
      </View>
    );
  },
);

const mapStateToProps = state => {
  const {messages} = state.msg;
  return {messages};
};

export default connect(mapStateToProps)(ChatComponent);

const styles = StyleSheet.create({
  chContent: {
    width,
    height: '100%',
    padding: 5,
    // justifyContent: 'flex-end',
  },
  toggle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
  roomControllerCont: {
    padding: 0,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    flexWrap: 'nowrap',
  },
  controllerIconHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginRight: 20,
  },
  textInputCont: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
  },
});
