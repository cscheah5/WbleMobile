import {
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback,
  Button,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {FloatingAction} from 'react-native-floating-action';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AuthContext} from '@/contexts/AuthContext';

const actions = [
  {
    text: 'Search User',
    icon: <Ionicons name="search-circle-outline" size={24} color="#fff" />,
    name: 'bt_search_user',
    position: 1,
  },
  {
    text: 'Friend Requests',
    icon: <Ionicons name="accessibility-outline" size={24} color="#fff" />,
    name: 'bt_add_friend',
    position: 2,
  },
];

export default function FriendScreen({navigation}) {
  const {authAxios} = useContext(AuthContext);
  const [acceptedFriends, setAcceptedFriends] = useState([]);

  const _loadFriends = async () => {
    console.log('Loading friends...');
    const response = await authAxios.get('/friends/');
    setAcceptedFriends(response.data.accepted_friends);
    console.log('acceptedFriends', response.data);
  };

  useEffect(() => {
    _loadFriends();
  }, []);

  return (
    <>
      <Text styles={{fontSize: 50}}>Friends</Text>
      <FlatList
        data={acceptedFriends}
        renderItem={({item}) => {
          return (
            <TouchableNativeFeedback
              style={{padding: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
              <Text style={{fontSize: 18}}>{item.username}</Text>
            </TouchableNativeFeedback>
          );
        }}
      />

      <FloatingAction
        actions={actions}
        onPressItem={name => {
          if (name === 'bt_search_user') {
            navigation.navigate('SearchUser');
          } else if (name === 'bt_add_friend') {
            navigation.navigate('FriendRequest');
          }
        }}
        color="#FF6347"
        overlayColor="rgba(0, 0, 0, 0.5)"
      />
    </>
  );
}
