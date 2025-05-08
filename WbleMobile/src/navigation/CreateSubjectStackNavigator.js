import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CreateSubjectScreen from '@/screens/admin/CreateSubjectScreen';

const Stack = createStackNavigator();

const CreateSubjectStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreateSubject"
        component={CreateSubjectScreen}
        options={({ navigation }) => ({
          title: 'Create Subject',
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

export default CreateSubjectStackNavigator;