import {View, Text, TextInput, Button, ScrollView} from 'react-native';
import React, {useEffect, useState, useContext, useRef} from 'react';
import {AuthContext} from '@/contexts/AuthContext';
import {ChatContext} from '@/contexts/ChatContext';

export default function ChatScreen({route, navigation}) {
  const {friend} = route.params;
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [message, setMessage] = useState('');
  const {authAxios, userInfo} = useContext(AuthContext);
  const {socket} = useContext(ChatContext);
  const scrollViewRef = useRef(null);

  const _loadMessages = async () => {
    console.log('Loading messages...');
    const response = await authAxios.get(`/messages/${friend.id}`);
    setMessagesHistory(response.data);
    // console.log(response.data);
  };

  const _createMessage = async message => {
    console.log('Creating message...');

    //create message
    const response = await authAxios.post('/messages/create', {
      friendId: friend.id,
      message: message,
    });
    console.log(response.data);
    setMessage('');
    _loadMessages();
  };

  const _sendMessageViaSocket = message => {
    socket.emit('private_message', {
      senderId: userInfo.id,
      senderName: userInfo.username,
      receiverId: friend.id,
      receiverName: friend.username,
      message: message,
    });
    setMessagesHistory(prev => {
      return [
        ...prev,
        {
          sender_id: userInfo.id,
          receiver_id: friend.id,
          message: message,
          created_at: generateLaravelTimestamps(),
          updated_at: generateLaravelTimestamps(),
        },
      ];
    });
  };

  const generateLaravelTimestamps = () => {
    const now = new Date();
    const iso = now.toISOString(); // Example: "2025-05-05T04:00:38.123Z"
    const base = iso.split('.')[0]; // "2025-05-05T04:00:38"
    return `${base}.000000Z`; // "2025-05-05T04:00:38.000000Z"
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({animated: true});
      }, 100);
    }
  }, [messagesHistory]);

  //listening on socket
  useEffect(() => {
    socket.on('private_message', msg => {
      const {senderId, receiverId, message} = msg;

      console.log('Msg received from socket: ' + message);

      setMessagesHistory(prev => {
        return [
          ...prev,
          {
            sender_id: senderId,
            receiver_id: receiverId,
            message: message,
            created_at: generateLaravelTimestamps(),
            updated_at: generateLaravelTimestamps(),
          },
        ];
      });
    });
  }, []);

  // set the stacker title
  useEffect(() => {
    navigation.setOptions({
      title: `${friend.username}`,
    });

    _loadMessages();
  }, [friend]);

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#f5f5f5'}}>
      <ScrollView ref={scrollViewRef} style={{flex: 1, marginBottom: 10}}>
        {messagesHistory.map((msg, index) => {
          // console.log('Real' + msg.created_at);
          const date = new Date(msg.created_at);
          const options = {weekday: 'long', hour: '2-digit', minute: '2-digit'};
          const formattedDate = date.toLocaleDateString(undefined, options);

          return (
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
                maxWidth: '80%',
              }}>
              <Text style={{fontSize: 14, color: '#000'}}>{msg.message}</Text>
              <Text
                style={{
                  fontSize: 10,
                  color: '#555',
                  textAlign: 'right',
                  marginTop: 5,
                }}>
                {formattedDate}
              </Text>
            </View>
          );
        })}
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
          title="Sendssss"
          onPress={() => {
            _sendMessageViaSocket(message);
            _createMessage(message);
          }}
        />
      </View>
    </View>
  );
}
