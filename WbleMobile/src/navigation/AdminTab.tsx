import React from 'react';

import SubjectStackNavigator from './SubjectStackNavigator';
import CreateSubjectStackNavigator from './CreateSubjectStackNavigator';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateUserStackNavigator from './CreateUserStackNavigator';
import AssignUserStackNavigator from './AssignUserStackNavigator';

const Tab = createBottomTabNavigator();

const AdminTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8e8e93',
      }}>
      <Tab.Screen
        name="Subjects"
        component={SubjectStackNavigator}
        options={{
          tabBarLabel: 'Subjects',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={36}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CreateSubjectTab"
        component={CreateSubjectStackNavigator}
        options={{
          tabBarLabel: 'Create Subject',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="file-document-outline"
              size={36}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CreateUserTab"
        component={CreateUserStackNavigator}
        options={{
          tabBarLabel: 'Create User',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="face-man"
              size={36}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AssignTab"
        component={AssignUserStackNavigator}
        options={{
          tabBarLabel: 'Assign',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="plus-box-outline"
              size={36}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTab;