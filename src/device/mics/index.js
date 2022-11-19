import {mediaDevices} from 'react-native-webrtc';
import {useState, useEffect, useCallback} from 'react';
export const useDevicesMic = () => {
  const [devices, setDevices] = useState([]);
  const fetchMics = useCallback(() => {
    mediaDevices.getUserMedia({audio: true}).then(() => {
      mediaDevices
        .enumerateDevices()
        .then(d =>
          setDevices(
            d
              .filter(device => device.kind === 'audioinput' && device.deviceId)
              .map(device => ({id: device.deviceId, label: device.label})),
          ),
        );
    });
  }, []);
  useEffect(() => {
    fetchMics();
    // devices.forEach(d => dispatch(setMicId({mic_id: d.id})));
  }, [fetchMics]);
  return {
    devices,
  };
};
