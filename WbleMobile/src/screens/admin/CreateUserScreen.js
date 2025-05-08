import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import config from '@/config/config.json';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';

const CreateUserScreen = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [profile_picture, setProfilePicture] = useState(null);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.errorCode) {
        console.log('Image picker error: ', response.errorMessage);
      } else {
        setProfilePicture(response.assets[0]);
      }
    });
  };

  const handleCreateUser = async () => {
    try {
      const formData = new FormData();
      formData.append('username', name);
      formData.append('password', password);
      formData.append('role', role);

      if (profile_picture) {
        const { uri, type, fileName } = profile_picture;
        formData.append('profile_picture', {
          uri,
          type,
          name: fileName,
        });
      }

      await axios.post(`${config.laravelApiUrl}/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', `${role} user created successfully.`);
      setName('');
      setPassword('');
      setRole('student');
      setProfilePicture(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create user.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Full Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter full name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Select Role:</Text>
      <Picker
        selectedValue={role}
        style={styles.picker}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Student" value="student" />
        <Picker.Item label="Lecturer" value="lecturer" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>

      <View style={styles.buttonContainer}>
        <Button title="Pick Profile Picture" onPress={handleImagePick} />
      </View>

      {profile_picture && (
        <Text style={styles.imageInfo}>📷 Selected: {profile_picture.fileName}</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Create User" onPress={handleCreateUser} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    marginBottom: 5,
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  imageInfo: {
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#444',
  },
});

export default CreateUserScreen;