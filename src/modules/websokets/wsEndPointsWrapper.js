export const apisWrap = connection => ({
  connection,
  subscribe: {
    onNewChatMsg: (op, handler) => connection?.addListener(op, handler),
    newRoomDetails: handler =>
      connection?.addListener('new_room_details', handler),
    userJoinRoom: handler =>
      connection?.addListener('new_user_join_room', handler),
    userLeaveRoom: handler =>
      connection?.addListener('user_left_room', handler),
    invitationToRoom: handler =>
      connection?.addListener('invitation_to_room', handler),
    handRaised: handler => connection?.addListener('hand_raised', handler),
    speakerAdded: handler => connection?.addListener('speaker_added', handler),
    speakerRemoved: handler =>
      connection?.addListener('speaker_removed', handler),
  },
  query: {
    joinRoomAndGetInfo: (room_id, user_id) =>
      connection?.post(
        'join_room_and_get_info',
        {room_id, user_id},
        'onNewRoomData',
      ),
    getUserProfile: user_id_user_name =>
      connection?.post(
        'get_user_profile',
        user_id_user_name,
        'get_user_profile_done',
      ),
    getRoomUsers: () =>
      connection?.post(
        'get_current_room_users',
        {},
        'get_current_room_users_done',
      ),
    getRoomsList: (cursor = {}) =>
      connection?.post('get_rooms_list', cursor, 'new_room_created_done'),
    reconnect: data =>
      connection.post(
        'reconnect_to_lofi',
        data,
        'reconnect_to_lofi_done',
        2000,
      ),
  },
  mutation: {
    sendMessage: async data => await connection?.send('send_chat_msg', data),
    setAutoSpeaker: value => connection?.send('set_auto_speaker', {value}),
    speakingChange: data => connection?.send('speaking_change', data),
    updateRoomInfo: async data => await connection.send('updateroominfo', data),
    removeSpeaker: (user_id, room_id) =>
      connection?.send('remove_speaker', {user_id, room_id}),
    addSpeaker: data => connection?.send('add_speaker', data),
    setListener: userId => connection?.send('set_listener', {userId}),
    setMute: (isMuted, room_id, user_id) =>
      connection?.post('mute', {isMuted, room_id, user_id}),
    leaveRoom: (data = {}) => connection?.post('leave_room', data),
    createRoom: async (data = {}) =>
      await connection?.post('create_room', data, 'create_room_done'),
    requestTospeak: data => connection?.post('request_to_speak', data),
    deleteRoom: (data = {}) => connection?.post('destroy_room', data),
    follow: data =>
      connection?.post('follow_unfollow', data, 'follow_unfollow_done'),
    upDateUserProfile: data =>
      connection?.post('update_user_profile', data, 'update_user_profile_done'),
    setChat: data => connection?.post('set_chat', data, 'set_chat_done'),
    setRaiseHand: data =>
      connection?.post('set_raised_hand', data, 'set_raised_hand_done'),
    lockRoom: data => connection?.post('lock_room', data, 'lock_room_done'),
  },
});
