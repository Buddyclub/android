import React from 'react';
// import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from 'react-native-paper';
import {LogingScreen} from '../../screens/authScreen';
import {DefaultNavigationOptions} from '../navigationOptions/DefaultNavigationoptions';
export const AuthStack = createStackNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export const AuthStackScreen = () => {
  const theme = useTheme();

  return (
    <AuthStack.Navigator
      mode="modal"
      headerMode="screen"
      screenOptions={{
        ...DefaultNavigationOptions(theme),
      }}>
      <AuthStack.Screen
        name="Login"
        component={LogingScreen}
        options={{
          header: () => null,
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
    </AuthStack.Navigator>
  );
};
