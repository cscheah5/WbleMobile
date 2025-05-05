import React from 'react';
import AppNavigator from '@/navigation/AppNavigator';
import {AuthProvider} from '@/contexts/AuthContext';
import ChatProvider from '@/contexts/ChatContext';

const App = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppNavigator />
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;
