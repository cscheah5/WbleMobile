import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import config from '@/config/config.json';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '@/contexts/AuthContext';
import { formStyles } from '@/styles/formStyles';

const CreateUserScreen = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [profile_picture, setProfilePicture] = useState(null);
  const { authAxios } = useContext(AuthContext);

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

      await authAxios.post(`/auth/register`, formData, {
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
    <View style={formStyles.container}>
      <Text style={formStyles.label}>Full Name:</Text>
      <TextInput
        style={formStyles.input}
        placeholder="Enter full name"
        value={name}
        onChangeText={setName}
      />

      <Text style={formStyles.label}>Password:</Text>
      <TextInput
        style={formStyles.input}
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={formStyles.label}>Select Role:</Text>
      <View style={formStyles.pickerContainer}>
        <Picker
          selectedValue={role}
          style={formStyles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Lecturer" value="lecturer" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>

      <View style={formStyles.buttonContainer}>
        <Button title="Pick Profile Picture" onPress={handleImagePick} />
      </View>

      {profile_picture && (
        <Text style={formStyles.infoText}>📷 Selected: {profile_picture.fileName}</Text>
      )}

      <View style={formStyles.buttonContainer}>
        <TouchableOpacity 
          style={formStyles.successButton}
          onPress={handleCreateUser}>
          <Text style={formStyles.successButtonText}>Create User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateUserScreen;