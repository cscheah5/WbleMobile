import React, {useEffect} from 'react';
import AppNavigator from '@/navigation/AppNavigator';
import {AuthProvider} from '@/contexts/AuthContext';
import SocketProvider from '@/contexts/SocketContext';
import messaging from '@react-native-firebase/messaging';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import notifee from '@notifee/react-native';

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

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('fcm token = ', token);
  };

  const setupNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
  };

  useEffect(() => {
    checkApplicationPermission();
    requestUserPermission();
    getToken();
    setupNotificationChannel();

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message Data:', remoteMessage);
      const {title, body} = remoteMessage.notification || {};
      await notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',
        },
      });
    });

    // Background & quit state handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      // const {title, body} = remoteMessage.notification || {};
      // await notifee.displayNotification({
      //   title: title,
      //   body: body,
      //   android: {
      //     channelId: 'default',
      //     smallIcon: 'ic_launcher',
      //     pressAction: {
      //       id: 'default',
      //     },
      //   },
      // });
    });

    return unsubscribe;
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
