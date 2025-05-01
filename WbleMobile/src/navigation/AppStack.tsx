import React, {useContext} from 'react';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {AuthContext} from '@/contexts/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '@/screens/HomeScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SubjectScreen from '@/screens/SubjectScreen';

const Drawer = createDrawerNavigator();

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
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerComponent {...props} />}
        screenOptions={{
          drawerActiveTintColor: 'darkslateblue',
          drawerActiveBackgroundColor: 'pink',
        }}>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Subject" component={SubjectScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;
