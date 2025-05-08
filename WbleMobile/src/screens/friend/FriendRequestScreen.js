import {
  View, 
  Text, 
  TouchableNativeFeedback, 
  Alert, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView
} from 'react-native';
import React, {useContext, useState, useCallback, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {AuthContext} from '@/contexts/AuthContext';
import {SocketContext} from '@/contexts/SocketContext';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function FriendRequestScreen({route, navigation}) {
  const {authAxios} = useContext(AuthContext);
  const {socket} = useContext(SocketContext);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const _loadFriendRequests = async () => {
    try {
      setLoading(true);
      console.log('Loading friend requests...');
      const response = await authAxios.get('/friends/requests');
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error loading friend requests:', error);
      Alert.alert('Error', 'Failed to load friend requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const _acceptFriendRequest = async friendId => {
    try {
      console.log('Accepting friend request from user:', friendId);
      const response = await authAxios.get(
        `/friends/accept-friend-request/${friendId}`,
      );
      Alert.alert('Success', 'Friend request accepted');
      _loadFriendRequests();
      if (route.params?.friendRefresh) {
        route.params.friendRefresh();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request. Please try again.');
    }
  };

  const _rejectFriendRequest = async friendId => {
    try {
      const response = await authAxios.get(
        `/friends/reject-friend-request/${friendId}`,
      );
      Alert.alert('Success', 'Friend request rejected');
      _loadFriendRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      Alert.alert('Error', 'Failed to reject friend request. Please try again.');
    }
  };

  useEffect(() => {
    _loadFriendRequests();
    
    socket.on('receive_friend_request', friend => {
      setFriendRequests(prevState => {
        return [...prevState, friend];
      });
      _loadFriendRequests();
    });
    
    return () => {
      socket.off('receive_friend_request');
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Friend Requests</Text>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : friendRequests.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="mail-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No friend requests</Text>
          <Text style={styles.emptySubText}>
            Friend requests will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={friendRequests}
          renderItem={({item}) => (
            <View style={styles.requestItem}>
              <View style={styles.userInfo}>
                <Ionicons name="person-circle-outline" size={40} color="#007bff" />
                <Text style={styles.username}>{item.username}</Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableNativeFeedback
                  onPress={() => _acceptFriendRequest(item.id)}>
                  <View style={[styles.actionButton, styles.acceptButton]}>
                    <Ionicons name="checkmark-outline" size={18} color="white" />
                    <Text style={styles.actionText}>Accept</Text>
                  </View>
                </TouchableNativeFeedback>
                
                <TouchableNativeFeedback
                  onPress={() => _rejectFriendRequest(item.id)}>
                  <View style={[styles.actionButton, styles.rejectButton]}>
                    <Ionicons name="close-outline" size={18} color="white" />
                    <Text style={styles.actionText}>Reject</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  requestItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  actionText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginTop: 15,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
