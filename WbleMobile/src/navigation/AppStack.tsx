import React, {useContext} from 'react';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
  Button,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from '@/contexts/AuthContext';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SubjectScreen from '@/screens/SubjectScreen';
import FriendScreen from '@/screens/FriendScreen';

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
    </Stack.Navigator>
  );
};

export default AppStack;
