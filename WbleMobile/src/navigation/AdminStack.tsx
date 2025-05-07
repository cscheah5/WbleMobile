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

const Stack = createStackNavigator();

const AppStack = () => {
  const {logout} = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          title: 'Admin Home',
          headerRight: () => (
            <Button title="Logout" onPress={logout} color="#000" />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
