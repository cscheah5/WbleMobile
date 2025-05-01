import React, {useContext} from 'react';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from '@/contexts/AuthContext';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SubjectScreen from '@/screens/SubjectScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      <Stack.Screen name="Subject" component={SubjectScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
