import React, { useEffect, useContext, useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '@/contexts/AuthContext';
import config from '@/config/config.json';

const ProfileScreen = ({ navigation }) => {
  const { authAxios } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await authAxios.get('/auth/user');
        setUser(response.data.data.user);
        console.log('User data:', response.data.data.user);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
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
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : user ? (
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: getImageUrl() }} 
              style={styles.avatar}
              onError={() => console.log('Error loading image')}
            />
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Icon name="person-outline" size={20} color="#007bff" style={styles.detailIcon} />
              <Text style={styles.detailText}>{user.name || 'No name provided'}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Icon name="mail-outline" size={20} color="#007bff" style={styles.detailIcon} />
              <Text style={styles.detailText}>{user.email}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Icon name="calendar-outline" size={20} color="#007bff" style={styles.detailIcon} />
              <Text style={styles.detailText}>
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={48} color="#ff3b30" />
          <Text style={styles.errorText}>Failed to load profile data</Text>
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#007bff',
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#007bff',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailIcon: {
    marginRight: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ff3b30',
    marginTop: 15,
  },
  headerLeft: {
    marginLeft: 15,
  },
});