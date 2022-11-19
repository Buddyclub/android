import React from 'react';
// import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import {useTheme} from 'react-native-paper';

// import Room from '../screens/room';
import CreateRoom from '../screens/createRoom';
import {DefaultNavigationOptions} from './navigationOptions/DefaultNavigationoptions';
import {TabNavigation} from './bottomTabNavigator/tabNavigation';
import UserProfileScreen from '../screens/profile/userProfile';
import {UserFollowers} from '../screens/follow/Followers';
import {UserFollowings} from '../screens/follow/Followings';
import {EditProfile} from '../screens/editProfile/';
import AccountSetting from '../screens/accountSetting/';
export const Stacks = createStackNavigator();

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

export const RootStack = ({children}) => {
  const theme = useTheme();
  return (
    <Stacks.Navigator
      mode="modal"
      headerMode="screen"
      screenOptions={{...DefaultNavigationOptions(theme)}}>
      {/* <Stacks.Screen name="Main" options={{header: () => null}}>
        {() => {
          return <TabNavigation />;
        }}
      </Stacks.Screen> */}
      <Stacks.Screen
        name="Main"
        component={TabNavigation}
        options={{header: () => null}}
      />

      {/* Room Screen */}
      {/* <Stacks.Screen
        name="Room"
        component={Room}
        options={{
          header: () => null,
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      /> */}
      {/* Create Room Screen */}
      <Stacks.Screen
        name="CreateRoom"
        component={CreateRoom}
        options={{
          transitionSpec: {open: config, close: config},
          headerTitle: 'Create room ❤🚀',
          headerTitleStyle: {fontSize: 15, textAlign: 'center'},
        }}
      />
      <Stacks.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          transitionSpec: {open: config, close: config},
          headerTitle: 'User Profile',
          headerTitleStyle: {fontSize: 15, textAlign: 'center'},
        }}
      />

      <Stacks.Screen
        name="Followers"
        component={UserFollowers}
        options={({navigation, route}) => ({
          headerTitle: route.params?.name,
          transitionSpec: {open: config, close: config},
          headerTitleStyle: {fontSize: 15, textAlign: 'center'},
        })}
      />
      <Stacks.Screen
        name="Following"
        component={UserFollowings}
        options={({navigation, route}) => ({
          headerTitle: route.params?.name,
          transitionSpec: {open: config, close: config},
          headerTitleStyle: {fontSize: 15, textAlign: 'center'},
        })}
      />
      <Stacks.Screen
        name="EditProfile"
        component={EditProfile}
        options={({navigation, route}) => ({
          headerTitle: route.params?.name,
          transitionSpec: {open: config, close: config},
          headerTitleStyle: {fontSize: 15, textAlign: 'center'},
        })}
      />
      <Stacks.Screen
        name="AccountSetting"
        component={AccountSetting}
        options={({route, navigation}) => ({
          headerTitle: route.params?.name,
          transitionSpec: {open: config, close: config},
          headerTitleStyle: {fontSize: 15, textAlign: 'center'},
        })}
      />
    </Stacks.Navigator>
  );
};
