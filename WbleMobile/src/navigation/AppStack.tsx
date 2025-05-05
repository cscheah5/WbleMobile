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

import AdminStack from './AdminStack';
import LecturerStack from './LecturerStack';
import StudentStack from './StudentStack';

import HomeScreen from '@/screens/HomeScreen';
import SubjectScreen from '@/screens/SubjectScreen';
import FriendScreen from '@/screens/FriendScreen';
import SearchUserScreen from '@/screens/SearchUserScreen';
import FriendRequestScreen from '@/screens/FriendRequestScreen';
import ChatScreen from '@/screens/ChatScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  const {userInfo} = useContext(AuthContext);

  const renderAppStack = () => {
    switch (userInfo.role) {
      case 'admin':
        console.log('User is admin, showing AdminStack');
        return <AdminStack />;
      case 'lecturer':
        console.log('User is lecturer, showing LecturerStack');
        return <LecturerStack />;
      case 'student':
        console.log('User is student, showing StudentStack');
        return <StudentStack />;
      default:
        console.log('Unknown role, defaulting to StudentStack');
        return <StudentStack />;
    }
  };

  return renderAppStack();
};

export default AppStack;
