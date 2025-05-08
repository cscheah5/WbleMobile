import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';

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
        style={styles.updateButton}
        onPress={handleUpdateAnnouncement}>
        <Text style={styles.updateButtonText}>Update Announcement</Text>
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
  updateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});