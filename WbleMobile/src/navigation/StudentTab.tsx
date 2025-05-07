import React from 'react';

import FriendStackNavigator from './FriendStackNavigator';
import SubjectStackNavigator from './SubjectStackNavigator';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

const StudentTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({navigation}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8e8e93',
      })}>
      <Tab.Screen
        name="Subjects"
        component={SubjectStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={36}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendStackNavigator}
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              size={36}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentTab;
