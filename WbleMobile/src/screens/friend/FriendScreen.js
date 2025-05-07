import {
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback,
  Button,
  Alert,
} from 'react-native';
import React, {useContext, useState, useCallback} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {FloatingAction} from 'react-native-floating-action';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
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

  //TODO: try catch block for error handling
  const _loadFriends = async () => {
    console.log('Loading friends...');
    const response = await authAxios.get('/friends/');
    setAcceptedFriends(response.data);
    console.log('acceptedFriends', response.data);
  };

  const _handleDeleteFriend = async friendId => {
    const response = await authAxios.get(`/friends/unfriend/${friendId}`);
    console.log('response', response.data);
    _loadFriends();
  };

  const handleLongPress = friend => {
    Alert.alert(
      'Friend options',
      `What would you like to do with ${friend.username} ?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
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
    <>
      <Text styles={{fontSize: 50}}>Friends</Text>
      <FlatList
        data={acceptedFriends}
        renderItem={({item}) => {
          return (
            <TouchableNativeFeedback
              onLongPress={() => handleLongPress(item)}
              onPress={() => navigation.navigate('Chat', {friend: item})}>
              <View
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderColor: '#ccc',
                }}>
                <Text style={{fontSize: 18}}>{item.username}</Text>
              </View>
              {/* <Text style={{fontSize: 18}}>{item.username}</Text> */}
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
            navigation.navigate('FriendRequest', {
              friendRefresh: _loadFriends,
            });
          }
        }}
        color="#FF6347"
        overlayColor="rgba(0, 0, 0, 0.5)"
      />
    </>
  );
}
