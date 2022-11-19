import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Platform, StyleSheet, Text} from 'react-native';
import {useTheme} from 'react-native-paper';

import SearchScreen from './search';
import {DefaultNavigationOptions} from '../navigation/navigationOptions/DefaultNavigationoptions';

const SearchScreenStacks = createStackNavigator();

export const SearchNavigator = () => {
  const theme = useTheme();
  const {fonts} = theme;
  return (
    <SearchScreenStacks.Navigator
      screenOptions={{
        ...DefaultNavigationOptions(theme),
      }}>
      <SearchScreenStacks.Screen
        name="Search"
        component={SearchScreen}
        options={{header: () => null}}
      />
    </SearchScreenStacks.Navigator>
  );
};
