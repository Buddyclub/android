import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Platform, StyleSheet, Text} from 'react-native';
import {useTheme} from 'react-native-paper';

import HomeScreen from './home';
import UpcomingRooms from './upcomingRooms/';
import {DefaultNavigationOptions} from '../navigation/navigationOptions/DefaultNavigationoptions';
import HeaderIconBtn from '../components/icons/headerIconBtn';

const HomeScreenStacks = createStackNavigator();
// RootStack
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

export const HomeNavigator = () => {
  const theme = useTheme();
  const {fonts, colors} = theme;
  return (
    <HomeScreenStacks.Navigator
      screenOptions={{
        ...DefaultNavigationOptions(theme),
      }}>
      <HomeScreenStacks.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => {
          const goToUpcomingRooms = () => {
            return navigation.navigate('UpcomingRooms');
          };
          return {
            headerLeft: () => (
              <View style={{...style.logoName}}>
                <Text
                  style={{
                    fontFamily: fonts.black,
                    color: colors.text,
                    ...style.logoText,
                  }}>
                  Budyclub
                </Text>
              </View>
            ),
            headerRight: () => {
              return (
                <View style={{...style.headerIcon}}>
                  <HeaderIconBtn
                    icon={Platform.OS === 'ios' ? 'date-range' : 'calendar'}
                    size={25}
                    onPress={() => goToUpcomingRooms()}
                  />
                </View>
              );
            },
          };
        }}
      />
      <HomeScreenStacks.Screen
        name="UpcomingRooms"
        component={UpcomingRooms}
        options={{
          transitionSpec: {open: config, close: config},
          headerTitle: 'Upcoming Rooms',
          headerTitleStyle: {fontSize: 15},
        }}
      />
    </HomeScreenStacks.Navigator>
  );
};

const style = StyleSheet.create({
  logoName: {
    padding: 8,
    left: 10,
  },
  logoText: {
    fontSize: 25,
  },
  headerIcon: {
    right: 20,
  },
});
