import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Button,
} from 'react-native';
import React, {useContext, useState, useRef, useEffect} from 'react';
import {AuthContext} from '@/contexts/AuthContext';
import {FlatList} from 'react-native-gesture-handler';

export default function SearchUserScreen() {
  const {authAxios} = useContext(AuthContext);
  const [userList, setUserList] = useState([]); // all users excluding self
  const [searchTerm, setSearchTerm] = useState(''); // search term for searching users

  const debounceTimer = useRef(null); // debounce timer for search input

  const _searchUserByUsername = async username => {
    console.log('Searching for user:', username);
    const response = await authAxios.post(`/friends/search-user`, {username});
    setUserList(response.data);
  };

  const _sendFriendRequest = async $friendId => {
    console.log('Sending friend request to user:', $friendId);
    const response = await authAxios.get(
      `/friends/send-friend-request/${$friendId}`,
    );
    console.log('response', response.data);
  };

  const toggleFriendRequest = async $friendId => {
    setUserList(prevState => {
      return prevState.map(user => {
        if (user.id === $friendId) {
          return {...user, requested: !user.requested};
        }
        return user;
      });
    });
  };

  // debounce the search input to avoid too many requests
  useEffect(() => {
    if (!searchTerm) return;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(async () => {
      _searchUserByUsername(searchTerm);
    }, 500); // 500ms debounce time
  }, [searchTerm]);

  return (
    <View>
      <Text>SearchUserScreen</Text>
      <TextInput
        placeholder="Search for a user..."
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
        onChangeText={text => setSearchTerm(text)}
      />
      {/* TODO: disable add button if requested before */}
      <FlatList
        data={userList}
        renderItem={({item}) => {
          return (
            <TouchableNativeFeedback
              style={{padding: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
              <Text style={{fontSize: 18}}>
                {item.username}{' '}
                <Button
                  title={item.requested ? 'Requested' : 'Add'}
                  disabled={item.requested}
                  onPress={() => {
                    toggleFriendRequest(item.id);
                    _sendFriendRequest(item.id);
                  }}
                />
              </Text>
            </TouchableNativeFeedback>
          );
        }}
      />
    </View>
  );
}
