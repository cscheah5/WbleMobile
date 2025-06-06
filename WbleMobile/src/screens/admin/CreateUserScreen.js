import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '@/contexts/AuthContext';
import { formStyles } from '@/styles/formStyles';

const CreateUserScreen = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
    if (!username || !name || !email || !password) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (username.length > 30) {
      Alert.alert('Validation Error', 'Username must be leser than 30 characters.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);

      if (profile_picture) {
        const { uri, type, fileName } = profile_picture;

        formData.append('profile_picture', {
          uri,
          type: type || 'jpeg/png/jpg/gif/svg', 
          name: fileName || 'profile',
        });
      }

      await authAxios.post(`/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', `${role} user created successfully.`);
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('student');
      setProfilePicture(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create user.');
    }
  };

  return (
    <ScrollView contentContainerStyle={formStyles.scrollContainer}>
    <View style={formStyles.container}>
      <Text style={formStyles.label}>User Name:</Text>
      <TextInput
        style={formStyles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />

      <Text style={formStyles.label}>Full Name:</Text>
      <TextInput
        style={formStyles.input}
        placeholder="Enter full name"
        value={name}
        onChangeText={setName}
      />

    <Text style={formStyles.label}>Email:</Text>
      <TextInput
        style={formStyles.input}
        placeholder="Enter email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
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
    </ScrollView>
  );
};

export default CreateUserScreen;