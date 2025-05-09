import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CreateUserScreen from '@/screens/admin/CreateUserScreen';

const Stack = createStackNavigator();

const CreateUserStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreateUser"
        component={CreateUserScreen}
        options={{title: 'Create User'}}
      />
    </Stack.Navigator>
  );
};

export default CreateUserStackNavigator;