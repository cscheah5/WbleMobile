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
import CreateAnnouncementScreen from '@/screens/CreateAnnouncementScreen';
import EditAnnouncementScreen from '@/screens/EditAnnouncementScreen';
import CreateMaterialScreen from '@/screens/CreateMaterialScreen';
import EditMaterialScreen from '@/screens/EditMaterialScreen';

const Stack = createStackNavigator();

const LecturerStack = () => {
  const {logout} = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          title: 'Lecturer Home',
          headerRight: () => (
            <Button title="Logout" onPress={logout} color="#000" />
          ),
        })}
      />
      <Stack.Screen name="Subject" component={SubjectScreen} />
      <Stack.Screen name="CreateAnnouncement" component={CreateAnnouncementScreen} />
      <Stack.Screen name="EditAnnouncement" component={EditAnnouncementScreen} />
      <Stack.Screen name="CreateMaterial" component={CreateMaterialScreen} />
      <Stack.Screen name="EditMaterial" component={EditMaterialScreen} />
      <Stack.Screen name="Friend" component={FriendScreen} />
      <Stack.Screen name="SearchUser" component={SearchUserScreen} />
      <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default LecturerStack;
