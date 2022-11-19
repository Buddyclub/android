import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native';

import tabBarIcon from '../../components/icons/tabBarIcon';
import {HomeNavigator} from '../../screens/homeNavigtor';
import {SearchNavigator} from '../../screens/searchNavigator';
import {ProfileNavigator} from '../../screens/profileNavigator';
import Room from '../../screens/room';

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

export const TabNavigation = props => {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Budyclub" options={{header: () => null}}>
        {() => (
          <Tab.Navigator
            initialRouteName="Home"
            backBehavior="history"
            shifting={true}
            keyboardHidesNavigationBar={true}
            screenOptions={{
              tabBarHideOnKeyboard: true,
            }}
            barStyle={{
              borderColor: theme.colors.borderColor,
              borderTopWidth: StyleSheet.hairlineWidth,
            }}>
            <Tab.Screen
              name="Home"
              component={HomeNavigator}
              options={{
                tabBarIcon: tabBarIcon('home'),
              }}
            />
            <Tab.Screen
              name="Search"
              component={SearchNavigator}
              options={{
                tabBarIcon: tabBarIcon('search'),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileNavigator}
              options={{
                tabBarIcon: tabBarIcon('user'),
              }}
            />
          </Tab.Navigator>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Room"
        component={Room}
        options={{
          header: () => null,
        }}
      />
    </Stack.Navigator>
  );
};
