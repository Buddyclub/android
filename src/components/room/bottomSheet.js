import * as React from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {connect, useDispatch} from 'react-redux';
import ChatComponent from './Chat';
import {muteUnmute} from '../../redux/actions/muteUnmute';

// import getWindowDimension from '../../utils/metrics/windowDimensions';
const RoomBottomSheet = React.memo(
  ({
    user_id,
    requestTospeak,
    leaveRoom,
    shareRoom,
    leaveStage,
    _isSpeaker,
    conn,
    room_id,
    roomCreator,
    _isRoomCreater,
    roomActionModal,
    sendMessage,
  }) => {
    const inset = useSafeAreaInsets();
    const sheetRef = React.useRef(null);
    const dispatch = useDispatch();
    const _requestTospeak = React.useCallback(async () => {
      await requestTospeak();
    }, [requestTospeak]);
    const toggleMuteBtn = React.useCallback(
      muted => {
        dispatch(muteUnmute({muted: !muted}));
        // conn.mutation.speakingChange({room_id, v: !muted, user_id});
        conn.mutation.setMute(!muted, room_id, user_id);
      },
      [conn.mutation, dispatch, room_id, user_id],
    );
    console.log('bottom sheet');
    const renderChatContent = () => (
      <ChatComponent
        user_id={user_id}
        reqToSpeak={_requestTospeak}
        leaveRoom={leaveRoom}
        leaveStage={leaveStage}
        shareRoom={shareRoom}
        muteUnmute={toggleMuteBtn}
        isSpeaker={_isSpeaker}
        isRoomCreater={_isRoomCreater}
        roomCreator={roomCreator}
        roomActionModal={roomActionModal}
        sendMessage={sendMessage}
      />
    );

    return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={['65.9%', '18.9%' + inset.bottom]}
        initialSnap={1}
        borderRadius={20}
        enabledInnerScrolling
        renderContent={renderChatContent}
      />
    );
  },
);

const mapStateToProps = state => {
  return {
    room_id: state?.room_data.room_id,
  };
};

export default connect(mapStateToProps)(RoomBottomSheet);
