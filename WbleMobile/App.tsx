import React, {useEffect} from 'react';
import AppNavigator from '@/navigation/AppNavigator';
import {AuthProvider} from '@/contexts/AuthContext';
import SocketProvider from '@/contexts/SocketContext';
import messaging from '@react-native-firebase/messaging';
import {Alert, PermissionsAndroid, Platform} from 'react-native';

const App = () => {
  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (err) {}
    }
  };

  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }

  // const getToken = async () => {
  //   const token = await messaging().getToken();
  //   console.log('fcm token = ', token);
  // };

  useEffect(() => {
    checkApplicationPermission();
    // requestUserPermission();
    // getToken();
    // Foreground message handler
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   console.log('FCM Message Data:', remoteMessage);
    //   // Optionally display an alert or notification
    //   const {title, body} = remoteMessage.notification || {};
    //   Alert.alert(title || 'New Notification', body || 'U received a new noti');
    // });
    // // Background & quit state handler
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    // });
    // return unsubscribe;
  }, []);

  return (
    <AuthProvider>
      <SocketProvider>
        <AppNavigator />
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
