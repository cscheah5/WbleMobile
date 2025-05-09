import React, { useEffect, useContext, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '@/contexts/AuthContext';
import config from '@/config/config.json';

const ProfileScreen = ({ navigation }) => {
  const { authAxios } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await authAxios.get('/auth/user');
        console.log('Profile data:', response.data.data);
        setUser(response.data.data.user);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: 'My Profile',
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Icon name="menu" size={24} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getImageUrl = () => {
    if (user?.profile_picture) {
      return `${config.laravelServerUrl}${user.profile_picture}`;
    } else {
      console.log('No profile picture found for user:', user);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Image source={{ uri: getImageUrl() }} style={styles.avatar} />
          <Text style={styles.text}>Username: {user.username}</Text>
          <Text style={styles.text}>Role: {user.role}</Text>
          <Text style={styles.text}>
            Joined: {new Date(user.created_at).toDateString()}
          </Text>
        </>
      ) : (
        <Text style={styles.text}>Loading profile...</Text>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  headerLeft: {
    marginLeft: 10,
    padding: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
});
