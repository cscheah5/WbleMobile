import {View, Text, TouchableNativeFeedback} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {AuthContext} from '@/contexts/AuthContext';

export default function FriendRequestScreen() {
  const {authAxios} = useContext(AuthContext);
  const [friendRequests, setFriendRequests] = useState([]);

  //TODO: try catch block for error handling
  const _loadFriendRequests = async () => {
    console.log('Loading friend requests...');
    const response = await authAxios.get('/friends/requests');
    setFriendRequests(response.data);
    console.log('friendRequests', response.data);
  };

  useEffect(() => {
    _loadFriendRequests();
  }, []);

  return (
    <FlatList
      data={friendRequests}
      renderItem={({item}) => {
        return (
          <View
            style={{padding: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
            <Text style={{fontSize: 18}}>{item.username}</Text>
            <TouchableNativeFeedback onPress={() => {}}>
              <Text style={{color: 'blue'}}>Accept</Text>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => {}}>
              <Text style={{color: 'red'}}>Reject</Text>
            </TouchableNativeFeedback>
          </View>
        );
      }}
    />
  );
}
