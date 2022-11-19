import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Platform, StyleSheet, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import ProfileScreen from './profile';
import {DefaultNavigationOptions} from '../navigation/navigationOptions/DefaultNavigationoptions';
import HeaderIconBtn from '../components/icons/headerIconBtn';
const ProfileScreenStacks = createStackNavigator();

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

export const ProfileNavigator = () => {
  const theme = useTheme();
  const {fonts} = theme;
  return (
    <ProfileScreenStacks.Navigator
      screenOptions={{
        ...DefaultNavigationOptions(theme),
      }}>
      <ProfileScreenStacks.Screen
        name="Profile"
        component={ProfileScreen}
        options={({navigation}) => {
          return {
            headerTitle: 'Profile',
            headerTitleStyle: {fontSize: 15},
            headerRight: () => {
              return (
                <View style={{paddingRight: 20}}>
                  <HeaderIconBtn
                    icon={Platform.OS === 'ios' ? 'settings' : 'tune'}
                    size={25}
                    onPress={() =>
                      navigation.navigate('AccountSetting', {
                        name: 'Account Setting',
                      })
                    }
                  />
                </View>
              );
            },
          };
        }}
      />
    </ProfileScreenStacks.Navigator>
  );
};
