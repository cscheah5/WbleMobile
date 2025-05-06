import React from 'react';
import AppNavigator from '@/navigation/AppNavigator';
import {AuthProvider} from '@/contexts/AuthContext';
import SocketProvider from '@/contexts/SocketContext';

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppNavigator />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
