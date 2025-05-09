import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';
import { formStyles } from '@/styles/formStyles';

export default function EditAnnouncementScreen({route, navigation}) {
  const {announcement, onAnnouncementUpdated} = route.params;
  const {authAxios} = useContext(AuthContext);
  
  const [title, setTitle] = useState(announcement.title);
  const [description, setDescription] = useState(announcement.description);

  const handleUpdateAnnouncement = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!description) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    try {
      const response = await authAxios.put(`/announcements/${announcement.id}`, {
        title: title,
        description: description
      });

      if (response.status === 200) {
        if (onAnnouncementUpdated) {
          onAnnouncementUpdated();
        }
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      Alert.alert('Error', 'Failed to update announcement');
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
        style={formStyles.primaryButton}
        onPress={handleUpdateAnnouncement}>
        <Text style={formStyles.primaryButtonText}>Update Announcement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}