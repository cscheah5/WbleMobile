import React, {useContext} from 'react';
import {
  Button,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from '@/contexts/AuthContext';
import HomeScreen from '@/screens/HomeScreen';
import SubjectScreen from '@/screens/SubjectScreen';
import FriendScreen from '@/screens/FriendScreen';
import SearchUserScreen from '@/screens/SearchUserScreen';
import FriendRequestScreen from '@/screens/FriendRequestScreen';
import ChatScreen from '@/screens/ChatScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  const {logout} = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          title: 'My Home',
          headerRight: () => (
            <Button title="Logout" onPress={logout} color="#000" />
          ),
        })}
      />
      <Stack.Screen name="Subject" component={SubjectScreen} />
      <Stack.Screen name="Friend" component={FriendScreen} />
      <Stack.Screen name="SearchUser" component={SearchUserScreen} />
      <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
