import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';

export default function CreateAnnouncementScreen({route, navigation}) {
  const {sectionId, onAnnouncementCreated} = route.params;
  const {authAxios} = useContext(AuthContext);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateAnnouncement = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!description) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    try {
      const response = await authAxios.post('/announcements', {
        section_id: sectionId,
        title: title,
        description: description
      });

      if (response.status === 201) {
        if (onAnnouncementCreated) {
          onAnnouncementCreated();
        }
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      Alert.alert('Error', 'Failed to create announcement');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter announcement title"
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter announcement description"
        multiline={true}
        numberOfLines={6}
        textAlignVertical="top"
      />

      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateAnnouncement}>
        <Text style={styles.createButtonText}>Create Announcement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    height: 120,
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});