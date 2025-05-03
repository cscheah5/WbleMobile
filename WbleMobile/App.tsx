import React from 'react';
import AppNavigator from '@/navigation/AppNavigator';
import {AuthProvider} from '@/contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
