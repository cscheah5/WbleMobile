import React, { useContext } from 'react';

import {NavigationContainer} from '@react-navigation/native';

// Screens
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '@/screens/auth/SplashScreen';

import { AuthContext } from '@/contexts/AuthContext';

const AppNavigator = () => {
  const {isLoading, userToken, userInfo} = useContext(AuthContext);
  
  if (isLoading) {
    // Wait for checking token
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {userToken == null ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
