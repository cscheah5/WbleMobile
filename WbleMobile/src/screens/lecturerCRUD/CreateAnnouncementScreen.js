import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';
import { formStyles } from '@/styles/formStyles';

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
    <ScrollView style={formStyles.container}>
      <Text style={formStyles.label}>Title:</Text>
      <TextInput
        style={formStyles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter announcement title"
      />

      <Text style={formStyles.label}>Description:</Text>
      <TextInput
        style={formStyles.textArea}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter announcement description"
        multiline={true}
        numberOfLines={6}
        textAlignVertical="top"
      />

      <TouchableOpacity 
        style={formStyles.successButton}
        onPress={handleCreateAnnouncement}>
        <Text style={formStyles.successButtonText}>Create Announcement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}