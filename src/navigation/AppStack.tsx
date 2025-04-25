import React, {useContext} from 'react';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';

import { AuthContext } from '@/contexts/AuthContext';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

// User Screens
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Custom button if needed
const CustomButton = ({children, onPress}: any) => {
  return (
    <TouchableNativeFeedback
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}>
      <View
        style={{
          width: 100,
          backgroundColor: '#609146',
        }}>
        {children}
      </View>
    </TouchableNativeFeedback>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <Ionicons name="home" size={20} color={'red'} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return <Ionicons name="person" size={20} color={'blue'} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

// Drawer component
const CustomDrawerComponent = (props: any) => {
  const {logout} = useContext(AuthContext);

  return (
    <DrawerContentScrollView>
      <View style={{height: '100%'}}>
        {/* Image styling */}
        {/* <View style={{alignItems:'center', justifyContent: 'center', backgroundColor: '#eb4034'}}>
            <Image
              style={{
                width: 80,
                height: 80,
                borderRadius: 15,
              }}
              source={require('./profilePic.jpg')}
            />
            <Text>My Profile Picture</Text>
          </View> */}
        <View style={{backgroundColor: '#fff', paddingTop: 10, flex: 1}}>
          <DrawerItemList {...props} />
        </View>
        <TouchableOpacity style={{paddingTop: '100%'}} onPress={() => logout()}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 20,
              borderTopWidth: 1,
              borderTopColor: 'grey',
            }}>
            <Ionicons name="exit-outline" size={23} />
            <Text
              style={{
                marginLeft: 20,
                fontSize: 23,
              }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerComponent {...props} />}
      screenOptions={{
        drawerActiveTintColor: 'darkslateblue',
        drawerActiveBackgroundColor: 'pink',
      }}>
      <Drawer.Screen
        name="Tab"
        component={TabNavigator}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
          drawerLabelStyle: {
            fontSize: 23,
          },
        }}
      />
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

export default AppStack;
