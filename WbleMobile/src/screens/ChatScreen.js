import {View, Text, TextInput, Button, ScrollView} from 'react-native';
import React, {useEffect} from 'react';

export default function ChatScreen({route, navigation}) {
  const {user} = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: `${user.username}`,
    });
  }, []);

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#f5f5f5'}}>
      <ScrollView style={{flex: 1, marginBottom: 10}}>
        <View
          style={{
            marginVertical: 5,
            padding: 10,
            backgroundColor: '#e0e0e0',
            borderRadius: 5,
            alignSelf: 'flex-start',
          }}>
          <Text>Message 1</Text>
        </View>
        <View
          style={{
            marginVertical: 5,
            padding: 10,
            backgroundColor: '#c8e6c9',
            borderRadius: 5,
            alignSelf: 'flex-end',
          }}>
          <Text>Message 2</Text>
        </View>
        <View
          style={{
            marginVertical: 5,
            padding: 10,
            backgroundColor: '#e0e0e0',
            borderRadius: 5,
            alignSelf: 'flex-start',
          }}>
          <Text>Message 3</Text>
        </View>
        <View
          style={{
            marginVertical: 5,
            padding: 10,
            backgroundColor: '#c8e6c9',
            borderRadius: 5,
            alignSelf: 'flex-end',
          }}>
          <Text>Message 4</Text>
        </View>
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
        />
        <Button title="Send" onPress={() => {}} />
      </View>
    </View>
  );
}
