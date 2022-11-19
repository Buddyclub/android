const HEART_BEAT_INTERVAL = 5000;
function reconnectToVoice(state, online) {
  const _id = global.setTimeout(() => {
    if (!state && online) {
      // reconnect
    }
  }, HEART_BEAT_INTERVAL);
}
