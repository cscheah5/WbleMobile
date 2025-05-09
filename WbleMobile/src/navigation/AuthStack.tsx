import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

// Authentication Screens
import GetStartedScreen from '@/screens/auth/GetStartedScreen';
import SignInScreen from '@/screens/auth/SignInScreen';

const Stack = createStackNavigator();

const AuthStack = ({initialRouteName}: any) => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={initialRouteName}>
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
