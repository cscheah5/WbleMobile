import React, {useContext, useState, useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';

// Screens
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '@/screens/auth/SplashScreen';

import {AuthContext} from '@/contexts/AuthContext';

const AppNavigator = () => {
  const {isLoading, userToken, loginError} = useContext(AuthContext);
  const [initialAuthRoute, setInitialAuthRoute] = useState('GetStarted');

  useEffect(() => {
    if (loginError) setInitialAuthRoute('SignIn');
  }, [loginError]);

  if (isLoading) {
    // Wait for checking token
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {userToken == null ? (
        <AuthStack initialRouteName={initialAuthRoute} />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
