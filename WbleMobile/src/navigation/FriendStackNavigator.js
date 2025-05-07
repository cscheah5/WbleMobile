import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import FriendScreen from '@/screens/friend/FriendScreen';
import ChatScreen from '@/screens/friend/ChatScreen';
import SearchUserScreen from '@/screens/friend/SearchUserScreen';
import FriendRequestScreen from '@/screens/friend/FriendRequestScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {DrawerActions} from '@react-navigation/native';

const Stack = createStackNavigator();

const FriendStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Friends"
        component={FriendScreen}
        options={({navigation}) => ({
          title: 'Your Friends',
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={28}
              color="#000"
              style={{marginLeft: 15}}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            />
          ),
        })}
      />
      <Stack.Screen name="SearchUser" component={SearchUserScreen} />
      <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default FriendStack;
