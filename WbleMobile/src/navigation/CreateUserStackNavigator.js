import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CreateUserScreen from '@/screens/admin/CreateUserScreen';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();

const CreateUserStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreateUser"
        component={CreateUserScreen}
        options={({ navigation }) => ({
                  title: 'Create Users',
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

export default CreateUserStackNavigator;