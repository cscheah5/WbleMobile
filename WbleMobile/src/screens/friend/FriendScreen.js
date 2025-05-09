import {
  View,
  Text,
  TouchableNativeFeedback,
  Alert,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import React, {useContext, useState, useCallback} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {FloatingAction} from 'react-native-floating-action';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '@/contexts/AuthContext';
import config from '@/config/config.json';

const actions = [
  {
    text: 'Add Friends',
    icon: <Ionicons name="search-circle-outline" size={24} color="#fff" />,
    name: 'bt_search_user',
    position: 1,
    color: '#007bff',
  },
  {
    text: 'Friend Requests',
    icon: <Ionicons name="accessibility-outline" size={24} color="#fff" />,
    name: 'bt_add_friend',
    position: 2,
    color: '#007bff',
  },
];

export default function FriendScreen({navigation}) {
  const {authAxios} = useContext(AuthContext);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const _loadFriends = async () => {
    try {
      setLoading(true);
      console.log('Loading friends...');
      const response = await authAxios.get('/friends/');
      setAcceptedFriends(response.data);
    } catch (error) {
      console.error('Error loading friends:', error);
      Alert.alert('Error', 'Failed to load friends. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // ${config.laravelApiUrl}${item.profile_picture}
  const _handleDeleteFriend = async friendId => {
    try {
      const response = await authAxios.get(`/friends/unfriend/${friendId}`);
      Alert.alert('Success', 'Friend removed successfully');
      _loadFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      Alert.alert('Error', 'Failed to remove friend. Please try again.');
    }
  };

  const handleLongPress = friend => {
    Alert.alert(
      'Friend Options',
      `What would you like to do with ${friend.username}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove Friend',
          style: 'destructive',
          onPress: () => _handleDeleteFriend(friend.id),
        },
      ],
    );
  };

  useFocusEffect(
    useCallback(() => {
      _loadFriends();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.header}>My Friends</Text>

      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.message}>Loading...</Text>
        </View>
      ) : acceptedFriends.length > 0 ? (
        <FlatList
          data={acceptedFriends}
          renderItem={({item}) => (
            <TouchableNativeFeedback
              onLongPress={() => handleLongPress(item)}
              onPress={() => navigation.navigate('Chat', {friend: item})}>
              <View style={styles.friendItem}>
                <View style={styles.avatarContainer}>
                  <Image
                    style={{width: 40, height: 40, borderRadius: 20}}
                    source={{
                      uri: `${config.laravelServerUrl}${item.profile_picture}`,
                    }}
                  />
                </View>
                <View style={styles.friendInfo}>
                  <Text style={styles.friendName}>{item.username}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#ccc" />
              </View>
            </TouchableNativeFeedback>
          )}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>You don't have any friends yet</Text>
          <Text style={styles.emptySubText}>
            Use the + button to search for users or check your friend requests
          </Text>
        </View>
      )}

      <FloatingAction
        actions={actions}
        onPressItem={name => {
          if (name === 'bt_search_user') {
            navigation.navigate('SearchUser');
          } else if (name === 'bt_add_friend') {
            navigation.navigate('FriendRequest', {
              friendRefresh: _loadFriends,
            });
          }
        }}
        color="#007bff"
        overlayColor="rgba(0, 0, 0, 0.5)"
      />
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
  friendItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
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
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  message: {
    fontSize: 16,
    color: '#666',
  },
});
