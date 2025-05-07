import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import FriendScreen from '@/screens/FriendScreen';
import ChatScreen from '@/screens/ChatScreen';
import SearchUserScreen from '@/screens/SearchUserScreen';
import FriendRequestScreen from '@/screens/FriendRequestScreen';

const Stack = createStackNavigator();

const FriendStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Friend" component={FriendScreen} />
      <Stack.Screen name="SearchUser" component={SearchUserScreen} />
      <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default FriendStack;
