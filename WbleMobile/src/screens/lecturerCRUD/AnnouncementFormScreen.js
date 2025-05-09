import React, {useState, useContext} from 'react';
import {Text, TextInput, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';
import { formStyles } from '@/styles/formStyles';

export default function AnnouncementFormScreen({route, navigation}) {
  // Check if we're in edit mode by checking if announcement exists in params
  const isEditMode = !!route.params.announcement;
  
  // Get the appropriate params based on mode
  const {
    sectionId, 
    onAnnouncementCreated,
    announcement, 
    onAnnouncementUpdated
  } = route.params;
  
  const {authAxios} = useContext(AuthContext);
  
  // Initialize state based on edit mode
  const [title, setTitle] = useState(isEditMode ? announcement.title : '');
  const [description, setDescription] = useState(isEditMode ? announcement.description : '');

  const handleSaveAnnouncement = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!description) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    try {
      let response;
      
      if (isEditMode) {
        // Update existing announcement
        response = await authAxios.put(`/announcements/${announcement.id}`, {
          title: title,
          description: description
        });
        
        if (response.status === 200 && onAnnouncementUpdated) {
          onAnnouncementUpdated();
        }
      } else {
        // Create new announcement
        response = await authAxios.post('/announcements', {
          section_id: sectionId,
          title: title,
          description: description
        });
        
        if (response.status === 201 && onAnnouncementCreated) {
          onAnnouncementCreated();
        }
      }
      
      navigation.goBack();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} announcement:`, error);
      Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'create'} announcement`);
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
        style={isEditMode ? formStyles.primaryButton : formStyles.successButton}
        onPress={handleSaveAnnouncement}>
        <Text style={isEditMode ? formStyles.primaryButtonText : formStyles.successButtonText}>
          {isEditMode ? 'Update Announcement' : 'Create Announcement'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}