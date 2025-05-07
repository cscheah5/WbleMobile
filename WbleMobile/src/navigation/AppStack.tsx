import React, {useContext} from 'react';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
  Button,
  StyleSheet,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {AuthContext} from '@/contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AdminStack from './AdminStack';
import LecturerStack from './LecturerStack';
import StudentTab from './StudentTab';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerComponent = (props) => {
  const {logout} = useContext(AuthContext);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <View style={styles.container}>
        {/* Header section */}
        <View style={styles.header}>
          {/* Uncomment this section when profilePic is ready */}
          {/* 
          <Image
            style={styles.profileImage}
            source={require('./profilePic.jpg')}
          />
          <Text style={styles.profileName}>My Profile</Text>
          */}
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
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="exit-outline" size={22} color="#555" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const AppDrawerNavigator = ({role}: any) => {
  let RoleStack;
  switch (role) {
    case 'admin':
      RoleStack = AdminStack;
      break;
    case 'lecturer':
      RoleStack = LecturerStack;
      break;
    case 'student':
    default:
      RoleStack = StudentTab;
      break;
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={props => <CustomDrawerComponent {...props} />}>
      <Drawer.Screen name="MainDrawer" component={RoleStack} />
    </Drawer.Navigator>
  );
};

const AppStack = () => {
  const {userInfo} = useContext(AuthContext);

  return <AppDrawerNavigator role={userInfo} />;
};

export default AppStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#2962ff',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
