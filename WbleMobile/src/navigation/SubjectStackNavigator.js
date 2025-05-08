import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '@/screens/HomeScreen';
import SubjectScreen from '@/screens/SubjectScreen';
import CreateAnnouncementScreen from '@/screens/lecturerCRUD/CreateAnnouncementScreen';
import EditAnnouncementScreen from '@/screens/lecturerCRUD/EditAnnouncementScreen';
import CreateMaterialScreen from '@/screens/lecturerCRUD/CreateMaterialScreen';
import EditMaterialScreen from '@/screens/lecturerCRUD/EditMaterialScreen';

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
      <Stack.Screen name="CreateAnnouncement" component={CreateAnnouncementScreen} />
      <Stack.Screen name="EditAnnouncement" component={EditAnnouncementScreen} />
      <Stack.Screen name="CreateMaterial" component={CreateMaterialScreen} />
      <Stack.Screen name="EditMaterial" component={EditMaterialScreen} />
    </Stack.Navigator>
  );
};

export default SubjectStackNavigator;
