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
  const [pendingFriendShips, setPendingFriendShips] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // search term for searching users
  const debounceTimer = useRef(null); // debounce timer for search input

  const _searchUserByUsername = async username => {
    console.log('Searching for user:', username);
    const response = await authAxios.post(`/friends/search-user`, {username});
    // check if user is pending friend request
    // if yes, set requested to true
    // if no, set requested to false
    setUserList(
      response.data.map(user => {
        if (
          pendingFriendShips.some(pendingFriend => pendingFriend.id === user.id)
        ) {
          return {...user, requested: true};
        }
        return {...user, requested: false};
      }),
    );
  };

  const _loadPendingFriendShips = async () => {
    console.log('Loading pending friend requests...');
    const response = await authAxios.get('/friends/pending-friends');
    setPendingFriendShips(response.data);

    console.log('pendingFriendRequests', response.data);
  };

  const _sendFriendRequest = async $friendId => {
    const response = await authAxios.post(`/friends/send-friend-request`, {
      friend_id: $friendId,
    });
    console.log('response', response.data);
  };

  const toggleRequest = id => {
    console.log('toggleRequest', id);
    setUserList(prevList => {
      const newList = prevList.map(user => {
        if (user.id === id) {
          return {...user, requested: !user.requested};
        }
        return user;
      });

      return newList;
    });
  };

  useEffect(() => {
    if (!searchTerm) return;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(async () => {
      await _loadPendingFriendShips(); //load pending friend requests for checking if the user is already requested
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
                  title={item.requested ? 'Cancel' : 'Add'}
                  onPress={() => {
                    toggleRequest(item.id);
                    if (item.requested) {
                      //   _sendFriendRequest(item.id);
                    } else {
                      //   _cancelFriendRequest(item.id);
                    }

                    // _loadPendingFriendShips();
                  }}
                />{' '}
              </Text>
            </TouchableNativeFeedback>
          );
        }}
      />
    </View>
  );
}
