import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  Button,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {AuthContext} from '@/contexts/AuthContext';
import {FlatList} from 'react-native-gesture-handler';

export default function SearchUserScreen() {
  const {authAxios} = useContext(AuthContext);
  const [userList, setUserList] = useState([]);

  const _searchUserByUsername = async username => {
    console.log('Searching for user:', username);
    const response = await authAxios.post(`/friends/search-user`, {username});
    setUserList(response.data);
    console.log('userList', response.data);
  };

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
        onChangeText={text => _searchUserByUsername(text)}
      />
      <FlatList
        data={userList}
        renderItem={({item}) => {
          return (
            <TouchableNativeFeedback
              style={{padding: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
              <Text style={{fontSize: 18}}>{item.username}</Text>
            </TouchableNativeFeedback>
          );
        }}
      />
    </View>
  );
}
