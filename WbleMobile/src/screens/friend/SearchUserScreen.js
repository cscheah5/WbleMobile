import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Alert,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import React, {useContext, useState, useRef, useEffect} from 'react';
import {AuthContext} from '@/contexts/AuthContext';
import {SocketContext} from '@/contexts/SocketContext';
import {FlatList} from 'react-native-gesture-handler';
import config from '@/config/config.json';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SearchUserScreen({navigation}) {
  const {authAxios} = useContext(AuthContext);
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const {socket} = useContext(SocketContext);
  const debounceTimer = useRef(null);
  const [loading, setLoading] = useState(false);

  const _searchUserByUsername = async username => {
    try {
      setLoading(true);
      console.log('Searching for user:', username);
      const response = await authAxios.post(`/friends/search-user`, {username});
      setUserList(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const _sendFriendRequest = async friendId => {
    try {
      console.log('Sending friend request to user:', friendId);
      const response = await authAxios.get(
        `/friends/send-friend-request/${friendId}`,
      );
      console.log('response', response.data);
      Alert.alert('Success', 'Friend request sent successfully');
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request. Please try again.');
    }
  };

  const toggleFriendRequest = async friendId => {
    setUserList(prevState => {
      return prevState.map(user => {
        if (user.id === friendId) {
          return {...user, requested: !user.requested};
        }
        return user;
      });
    });
  };

  const _sendFriendRequestViaSocket = friend => {
    console.log(friend);
    socket.emit('send_friend_request', {friend});
  };

  // Debounce the search input
  useEffect(() => {
    if (!searchTerm) {
      setUserList([]);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      _searchUserByUsername(searchTerm);
    }, 500);
  }, [searchTerm]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Find Friends</Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#777"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search for a user..."
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={text => setSearchTerm(text)}
          placeholderTextColor="#999"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : searchTerm && userList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No users found</Text>
          <Text style={styles.emptySubText}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={userList}
          renderItem={({item}) => (
            <View style={styles.userItem}>
              <View style={styles.userInfo}>
                <Image
                  style={{width: 40, height: 40, borderRadius: 20}}
                  source={{
                    uri: `${config.laravelServerUrl}${item.profile_picture}`,
                  }}
                />
                <Text style={styles.username}>{item.username}</Text>
              </View>

              <TouchableNativeFeedback
                onPress={() => {
                  if (!item.requested) {
                    toggleFriendRequest(item.id);
                    _sendFriendRequestViaSocket(item);
                    _sendFriendRequest(item.id);
                  }
                }}>
                <View
                  style={[
                    styles.addButton,
                    item.requested && styles.requestedButton,
                  ]}>
                  <Text style={styles.buttonText}>
                    {item.requested ? 'Requested' : 'Add Friend'}
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userIcon: {
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  requestedButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
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
  listContainer: {
    paddingBottom: 20,
  },
});
