import {View, Text, TouchableNativeFeedback} from 'react-native';
import React, {useContext, useState, useCallback, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {AuthContext} from '@/contexts/AuthContext';
import {SocketContext} from '@/contexts/SocketContext';
import {useFocusEffect} from '@react-navigation/native';

export default function FriendRequestScreen({route}) {
  const {authAxios} = useContext(AuthContext);
  const {socket} = useContext(SocketContext);
  const [friendRequests, setFriendRequests] = useState([]);

  //TODO: try catch block for error handling
  const _loadFriendRequests = async () => {
    console.log('Loading friend requests...');
    const response = await authAxios.get('/friends/requests');
    setFriendRequests(response.data);
    // console.log('friendRequests', response.data);
  };

  //TODO: try catch block for error handling
  const _acceptFriendRequest = async friendId => {
    console.log('Accepting friend request from user:', friendId);
    const response = await authAxios.get(
      `/friends/accept-friend-request/${friendId}`,
    );
    console.log(response.data);
    _loadFriendRequests();
  };

  //TODO: try catch block for error handling
  const _rejectFriendRequest = async friendId => {
    const response = await authAxios(
      `/friends/reject-friend-request/${friendId}`,
    );
    console.log(response.data);
    _loadFriendRequests();
  };

  //runs code whenever the screen comes into focus, so your friends list will refresh every time you navigate back to this screen.
  useEffect(() => {
    _loadFriendRequests();
  }, []);

  // TODO: socket to be tested
  useEffect(() => {
    socket.on('receive_friend_request', friend => {
      setFriendRequests(prevState => {
        return [...prevState, friend];
      });
      _loadFriendRequests();
    });
  }, []);

  return (
    <FlatList
      data={friendRequests}
      renderItem={({item}) => {
        return (
          <View
            style={{padding: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
            <Text style={{fontSize: 18}}>{item.username}</Text>
            <TouchableNativeFeedback
              onPress={() => {
                _acceptFriendRequest(item.id);
                // route.params.friendRefresh();
              }}>
              <Text style={{color: 'blue'}}>Accept</Text>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => {
                _rejectFriendRequest(item.id);
              }}>
              <Text style={{color: 'red'}}>Reject</Text>
            </TouchableNativeFeedback>
          </View>
        );
      }}
    />
  );
}
