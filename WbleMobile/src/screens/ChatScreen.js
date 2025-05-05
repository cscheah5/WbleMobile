import {View, Text, TextInput, Button, ScrollView} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {AuthContext} from '@/contexts/AuthContext';

export default function ChatScreen({route, navigation}) {
  const {friend} = route.params;
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [message, setMessage] = useState('');
  const {authAxios, userInfo} = useContext(AuthContext);

  const _loadMessages = async () => {
    console.log('Loading messages...');
    const response = await authAxios.get(`/messages/${friend.id}`);
    setMessagesHistory(response.data);
    console.log(response.data);
  };

  const _createMessage = async message => {
    console.log('Creating message...');

    //create message
    const response = await authAxios.post('/messages/create', {
      friendId: friend.id,
      message: message,
    });
    console.log(response.data);

    //reset state
    setMessage('');
    //load
    _loadMessages();
  };

  useEffect(() => {
    navigation.setOptions({
      title: `${friend.username}`,
    });

    _loadMessages();
  }, [friend]);

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#f5f5f5'}}>
      <ScrollView style={{flex: 1, marginBottom: 10}}>
        {messagesHistory.map((msg, index) => (
          <View
            key={index}
            style={{
              marginVertical: 5,
              padding: 10,
              backgroundColor:
                msg.sender_id === userInfo.id ? '#c8e6c9' : '#e0e0e0',
              borderRadius: 5,
              alignSelf:
                msg.sender_id === userInfo.id ? 'flex-end' : 'flex-start',
            }}>
            <Text>{msg.message}</Text>
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 5,
          borderRadius: 5,
        }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginRight: 5,
          }}
          placeholder="Enter message"
          value={message}
          onChangeText={text => setMessage(text)}
        />
        <Button
          title="Send"
          onPress={() => {
            _createMessage(message);
          }}
        />
      </View>
    </View>
  );
}
