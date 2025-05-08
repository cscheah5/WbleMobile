import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ManageEnrollmentScreen from '@/screens/admin/AssignUserScreen';

const Stack = createStackNavigator();

const AssignUserStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ManageEnrollment"
        component={ManageEnrollmentScreen}
        options={({ navigation }) => ({
          title: 'Assign Users to Subjects',
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={28}
              color="#000"
              style={{ marginLeft: 15 }}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default AssignUserStackNavigator;