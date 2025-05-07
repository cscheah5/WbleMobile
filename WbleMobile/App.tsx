import React from 'react';
import AppNavigator from '@/navigation/AppNavigator';
import { AuthProvider } from '@/contexts/AuthContext';
import { PermissionProvider } from '@/contexts/PermissionContext';
import SocketProvider from '@/contexts/SocketContext';

const App = () => {
  return (
    <AuthProvider>
      <PermissionProvider>
        <SocketProvider>
          <AppNavigator />
        </SocketProvider>
      </PermissionProvider>
    </AuthProvider>
  );
};

export default App;