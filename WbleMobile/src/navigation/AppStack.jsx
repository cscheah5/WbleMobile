import React, {useContext} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Button,
  StyleSheet,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {AuthContext} from '@/contexts/AuthContext';
import {SocketContext} from '@/contexts/SocketContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SettingsScreen from '@/screens/SettingsScreen';

import AdminTab from './AdminTab';
import StudentLecturerTab from './StudentLecturerTab';
import NotificationManager from '@/components/NotificationManager';
import ProfileStack from './ProfileStack';

const Drawer = createDrawerNavigator();

const CustomDrawerComponent = props => {
  const {logout, userInfo} = useContext(AuthContext);
  const {socket} = useContext(SocketContext);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.profileImage}
            source={require('@/assets/images/wble_banner.jpg')}
          />
          <Text style={styles.profileName}>
            You are logged in as {userInfo.username}
          </Text>
          <Text>Role: {userInfo.role}</Text>
        </View>

        {/* Menu items */}
        <View style={styles.menuContainer}>
          <DrawerItemList
            {...props}
            itemStyle={styles.drawerItem}
            labelStyle={styles.drawerLabel}
            activeTintColor="#2962ff"
            activeBackgroundColor="#e3f2fd"
          />
        </View>

        {/* Footer with logout button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              socket.disconnect();
              logout();
            }}>
            <Ionicons name="exit-outline" size={22} color="#555" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const AppStack = () => {
  const {userInfo} = useContext(AuthContext);
  let RoleStack;
  switch (userInfo.role) {
    case 'admin':
      RoleStack = AdminTab;
      break;
    case 'lecturer':
      RoleStack = StudentLecturerTab;
      break;
    case 'student':
      RoleStack = StudentLecturerTab;
      break;
    default:
      RoleStack = StudentLecturerTab;
      break;
  }

  return (
    <>
      <NotificationManager />
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={props => <CustomDrawerComponent {...props} />}>
        <Drawer.Screen
          name="Home"
          component={RoleStack}
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({color, focused}) => (
              <Ionicons name={focused ? "home" : "home-outline" } size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            drawerLabel: 'My Profile',
            drawerIcon: ({color, focused}) => (
              <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{
            headerShown: true,
            drawerLabel: 'Settings',
            drawerIcon: ({color, focused}) => (
              <Ionicons name={focused ? "settings" :"settings-outline"} size={22} color={color} />
            ),
          }}  
        />
      </Drawer.Navigator>
    </>
  );
};

export default AppStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 5,
    marginVertical: 2,
  },
  drawerLabel: {
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
});
