import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '@/screens/HomeScreen';
import SubjectScreen from '@/screens/SubjectScreen';
import AnnouncementFormScreen from '@/screens/lecturerCRUD/AnnouncementFormScreen';
import MaterialFormScreen from '@/screens/lecturerCRUD/MaterialFormScreen';

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
      <Stack.Screen 
        name="AnnouncementForm" 
        component={AnnouncementFormScreen} 
        options={({route}) => ({
          title: route.params.announcement ? "Edit Announcement" : "Create Announcement"
        })}
      />
      <Stack.Screen 
        name="MaterialForm" 
        component={MaterialFormScreen} 
        options={({route}) => ({
          title: route.params.material ? "Edit Material" : "Upload Material"
        })}
      />
    </Stack.Navigator>
  );
};

export default SubjectStackNavigator;
