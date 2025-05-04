import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import io from 'socket.io-client';

var socket = io('http://192.168.0.2:5000/chat', {
  transports: ['websocket'],
});

const App = () => {
  const [name, setName] = useState('Your Name');
  const [message, setMessage] = useState('');
  const [chatroom, setChatroom] = useState('');

  useEffect(() => {
    // When connected, emit a message to the server to inform that this client has connected to the server.
    // Display a Toast to inform user that connection was made.
    socket.on('connect', () => {
      console.log(socket.id); // undefined
      socket.emit(
        'mobile_client_connected',
        {connected: true},
        (response: any) => {
          console.log(response);
        },
      );
      ToastAndroid.show('Connected to server', ToastAndroid.LONG);
    });

    socket.on('connect_to_client', (data: any) => {
      let greets = JSON.parse(data);
      console.log(greets);
    });

    // Handle connection error
    socket.on('error', (error: any) => {
      ToastAndroid.show('Failed to connect to server', ToastAndroid.LONG);
    });

    // Receive chat broadcast from server.
    socket.on('message_broadcast', (data: any) => {
      console.log(data);
      let messageBag = JSON.parse(data);

      setChatroom(
        chatroom =>
          chatroom +
          `Message from ${messageBag.sender} at ${messageBag.timestamp}: \n${messageBag.message}\n\n`,
      );
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={name}
        selectTextOnFocus={true}
        onChangeText={(name: string) => {
          setName(name);
        }}
      />
      <TextInput
        style={styles.output}
        value={chatroom}
        multiline={true}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter message"
        value={message}
        selectTextOnFocus={true}
        onChangeText={(message: string) => {
          setMessage(message);
        }}
      />
      <TouchableOpacity
        onPress={() => {
          socket.emit('message_sent', {
            sender: name,
            message: message,
          });
        }}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Send</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  output: {
    height: 400,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    color: 'black',
  },
  button: {
    padding: 20,
    backgroundColor: 'blue',
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default App;
