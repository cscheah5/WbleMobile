import {View, Text, PermissionsAndroid, Platform} from 'react-native';
import React, {useEffect, useContext} from 'react';
import {AuthContext} from '@/contexts/AuthContext';
import {
  getMessaging,
  getToken,
  requestPermission,
  isDeviceRegisteredForRemoteMessages,
} from '@react-native-firebase/messaging';
import {getApp} from '@react-native-firebase/app';

const checkApplicationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } catch (err) {
      console.log('Error checking permission ', err);
    }
  }
};

export default function NotificationManager() {
  const app = getApp(); // your Firebase app instance
  const messaging = getMessaging(app);
  const {authAxios} = useContext(AuthContext);

  const requestUserPermission = async () => {
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const getFcmToken = async () => {
    const token = await getToken(messaging);
    await authAxios.post('/store-fcm-token', {
      fcm_token: token,
    });

    console.log('FCM token updated = ', token);
  };

  useEffect(() => {
    checkApplicationPermission();
    requestUserPermission();
    getFcmToken();
  }, []);

  return null;
}
