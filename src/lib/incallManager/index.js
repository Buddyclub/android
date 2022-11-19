import InCallManager from 'react-native-incall-manager';

export const inCallManagerSetSpeakerOn = on => {
  InCallManager.setSpeakerphoneOn(on);
  // InCallManager.setForceSpeakerphoneOn(on);
};

export const incallManagerStop = () => InCallManager.stop('');

const getAudioUri = async () => {
  const uri = await InCallManager.getAudioUri();
  // console.log('audio uri', uri);
};
