import React from 'react';

import FriendStackNavigator from './FriendStackNavigator';
import SubjectStackNavigator from './SubjectStackNavigator';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

const StudentLecturerTab = () => {
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
        name="WBLE"
        component={SubjectStackNavigator}
        options={{
          tabBarLabel: 'WBLE',
          tabBarIcon: ({color, focused}) => (
            <MaterialCommunityIcons
              name={focused ? "school" : "school-outline"}
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
          tabBarIcon: ({color, focused}) => (
            <MaterialCommunityIcons
              name={focused ? "account-group" : "account-group-outline"}
              size={36}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentLecturerTab;
