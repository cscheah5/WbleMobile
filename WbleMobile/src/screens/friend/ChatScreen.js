import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useLayoutEffect,
} from 'react';
import {AuthContext} from '@/contexts/AuthContext';
import {SocketContext} from '@/contexts/SocketContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import config from '@/config/config.json';

export default function ChatScreen({route, navigation}) {
  const {friend} = route.params;
  const [messagesHistory, setMessagesHistory] = useState([]);
  const [message, setMessage] = useState('');
  const {authAxios, userInfo} = useContext(AuthContext);
  const {socket} = useContext(SocketContext);
  const scrollViewRef = useRef(null);

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    // Reset tab bar when leaving
    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
      });
    };
  }, [navigation]);

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
      try {
        setTimeout(() => {
          scrollViewRef.current.scrollToEnd({animated: true});
        }, 100);
      } catch (error) {
        console.log('Error scrolling to end:', error);
      }
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

    return () => {
      socket.off('private_message');
    };
  }, []);

  // set the stacker title
  useEffect(() => {
    navigation.setOptions({
      title: friend.username,
      headerTitleAlign: 'center', // Center the title for better appearance
      headerStyle: {
        backgroundColor: '#fff',
        elevation: 2, // Android shadow
        shadowOpacity: 0.1, // iOS shadow
        shadowOffset: {height: 1, width: 0},
        shadowRadius: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 18,
        color: '#000',
      },
      // Add a custom header title component with online status
      headerTitle: () => (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <Ionicons name="person-circle-outline" size={24} color="#555" style={{marginRight: 8}} /> */}
          <Image
            style={{width: 40, height: 40, borderRadius: 20}}
            source={{
              uri: `${config.laravelServerUrl}${friend.profile_picture}`,
            }}
          />
          <View>
            <Text style={{fontSize: 18, fontWeight: '600', color: '#000'}}>
              {friend.username}
            </Text>
          </View>
        </View>
      ),
    });

    _loadMessages();
  }, [friend]);

  const formatTime = dateString => {
    // Create a new date object from the timestamp string
    const date = new Date(dateString);

    // Get hours and minutes in local timezone
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Convert to 12-hour format with AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    // Format with padding for minutes
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const options = {weekday: 'short', month: 'short', day: 'numeric'};
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}>
          {messagesHistory.map((msg, index) => {
            const isMyMessage = msg.sender_id === userInfo.id;
            const time = formatTime(msg.created_at);
            const showDate =
              index === 0 ||
              new Date(msg.created_at).toDateString() !==
                new Date(messagesHistory[index - 1].created_at).toDateString();

            return (
              <React.Fragment key={index}>
                {showDate && (
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                      {formatDate(msg.created_at)}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.messageWrapper,
                    isMyMessage
                      ? styles.myMessageWrapper
                      : styles.theirMessageWrapper,
                  ]}>
                  <View
                    style={[
                      styles.messageContainer,
                      isMyMessage ? styles.myMessage : styles.theirMessage,
                    ]}>
                    <Text
                      style={[
                        styles.messageText,
                        isMyMessage
                          ? styles.myMessageText
                          : styles.theirMessageText,
                      ]}>
                      {msg.message}
                    </Text>
                    <Text
                      style={[
                        styles.timeText,
                        isMyMessage ? styles.myTimeText : styles.theirTimeText,
                      ]}>
                      {time}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            );
          })}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={text => setMessage(text)}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              if (message.trim()) {
                _sendMessageViaSocket(message);
                _createMessage(message);
              }
            }}
            disabled={!message.trim()}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 10,
    paddingBottom: 15,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  myMessageWrapper: {
    justifyContent: 'flex-end',
  },
  theirMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    position: 'relative',
  },
  myMessage: {
    backgroundColor: '#007bff',
    borderBottomRightRadius: 5,
  },
  theirMessage: {
    backgroundColor: '#e5e5ea',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    marginRight: 40,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#333',
  },
  timeText: {
    fontSize: 11,
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 8,
    bottom: 6,
  },
  myTimeText: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirTimeText: {
    color: 'rgba(0,0,0,0.4)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingRight: 40,
    maxHeight: 100,
    fontSize: 16,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#007bff',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
