import {NativeModules, NativeAppEventEmitter, Platform} from 'react-native';

const MicHark = NativeModules.RnMicHarkModule;
// Platform.OS === 'desktop'
//   ? NativeModules.RnMicHark
//   : NativeModules.RnMicHarkModule;

export const Hark = {
  timer: null,

  start: function (monitorInterval = 251) {
    if (this.frameSubscription) {
      this.frameSubscription.remove();
    }

    if (Platform.OS === 'desktop') {
      this.timer = setInterval(async () => {
        if (this.onNewFrame) {
          const frame = await MicHark.measure();
          this.onNewFrame(JSON.parse(frame));
        }
      }, monitorInterval);
    } else {
      this.frameSubscription = NativeAppEventEmitter.addListener(
        'frame',
        data => {
          if (this.onNewFrame) {
            this.onNewFrame(data);
          }
        },
      );
    }
    // Monitoring interval not supported for Android yet. Feel free to add and do a pull request. :)
    // return Platform.OS === 'ios'
    //   ? MicHark.start(monitorInterval)
    //   :
    return MicHark.start();
  },

  stop: function () {
    if (this.frameSubscription) {
      this.frameSubscription.remove();
    }

    if (this.timer) {
      clearInterval(this.timer);
    }

    return MicHark.stop();
  },
};
