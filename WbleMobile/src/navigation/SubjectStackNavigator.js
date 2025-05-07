import React, {useContext} from 'react';
import {
  Button,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from '@/contexts/AuthContext';
import HomeScreen from '@/screens/HomeScreen';
import SubjectScreen from '@/screens/SubjectScreen';
import FriendScreen from '@/screens/friend/FriendScreen';
import SearchUserScreen from '@/screens/friend/SearchUserScreen';
import FriendRequestScreen from '@/screens/friend/FriendRequestScreen';
import ChatScreen from '@/screens/friend/ChatScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {DrawerActions} from '@react-navigation/native';

const Stack = createStackNavigator();

const SubjectStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          title: 'My Home',
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
      <Stack.Screen name="Subject" component={SubjectScreen} />
    </Stack.Navigator>
  );
};

export default SubjectStackNavigator;
