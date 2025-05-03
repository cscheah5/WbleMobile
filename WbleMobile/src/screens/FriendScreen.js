import {
  View,
  Text,
  ScrollView,
  TouchableNativeFeedback,
  Button,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {AuthContext} from '@/contexts/AuthContext';

export default function FriendScreen({navigation}) {
  const {authAxios} = useContext(AuthContext);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [pendingFriends, setPendingFriends] = useState([]);

  const _loadFriends = async () => {
    console.log('Loading friends...');
    const response = await authAxios.get('/friends/');
    setAcceptedFriends(response.data.accepted_friends);
    setPendingFriends(response.data.pending_friends);

    console.log('acceptedFriends', response.data.accepted_friends);
    console.log('pendingFriends', response.data.pending_friends);
  };

  useEffect(() => {
    _loadFriends();
  }, []);

  return (
    <>
      <Button
        title="Search User Screen"
        onPress={() => navigation.navigate('SearchUser')}
      />
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
    </>
  );
}
