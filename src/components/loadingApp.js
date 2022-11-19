/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ActivityIndicator} from 'react-native';
export default () => (
  <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
    <ActivityIndicator color="white" size={28} />
  </View>
);
