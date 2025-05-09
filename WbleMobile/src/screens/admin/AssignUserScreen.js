import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import config from '@/config/config.json';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '@/contexts/AuthContext';
import { formStyles } from '@/styles/formStyles';

const AssignUserScreen = () => {
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [userType, setUserType] = useState('student');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const { authAxios } = useContext(AuthContext);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (userType) {
      fetchUsers(userType);
    }
  }, [userType]);

  const fetchSubjects = async () => {
    try {
      const response = await authAxios.get(`/subjects`);
      setSubjects(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load subjects');
      console.error('Subjects error:', error.response?.data);
    }
  };

  const fetchUsers = async (role) => {
    try {
      setLoading(true);
      setSelectedUser(''); // Reset user selection when type changes
      const response = await authAxios.get(`/users?role=${role}`);
      setUsers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
      console.error('Users error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedSubject || !selectedUser) {
      Alert.alert('Validation', 'Please select both subject and user.');
      return;
    }

    setAssigning(true);

    try {
      const endpoint = userType === 'student'
        ? '/subjects/enrollStudent'
        : '/subjects/assignLecturer';

      const payload = {
        subject_id: selectedSubject,
        user_id: selectedUser
      };

      const response = await authAxios.post(
        `${endpoint}`,
        payload
      );

      Alert.alert('Success', response.data.message || `${userType} assigned successfully`);

      // Reset selections after successful assignment
      setSelectedUser('');
      if (userType === 'student') {
        setSelectedSubject('');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to assign user';
      Alert.alert('Error', errorMessage);
      console.error('Assignment error:', error.response?.data);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={formStyles.scrollContainer}>
      <Text style={formStyles.label}>Select Subject:</Text>
      <View style={formStyles.pickerContainer}>
        <Picker
          selectedValue={selectedSubject}
          onValueChange={value => setSelectedSubject(value)}
          style={formStyles.picker}
        >
          <Picker.Item label="-- Select Subject --" value="" />
          {subjects.map(subject => (
            <Picker.Item key={subject.id} label={subject.name} value={subject.id} />
          ))}
        </Picker>
      </View>

      <Text style={formStyles.label}>Select User Type:</Text>
      <View style={formStyles.pickerContainer}>
        <Picker
          selectedValue={userType}
          onValueChange={value => setUserType(value)}
          style={formStyles.picker}
        >
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Lecturer" value="lecturer" />
        </Picker>
      </View>

      <Text style={formStyles.label}>Select {userType}:</Text>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <View style={formStyles.pickerContainer}>
          <Picker
            selectedValue={selectedUser}
            onValueChange={value => setSelectedUser(value)}
            style={formStyles.picker}
          >
            <Picker.Item label={`-- Select ${userType} --`} value="" />
            {users.map(user => (
              <Picker.Item key={user.id} label={user.username} value={user.id} />
            ))}
          </Picker>
        </View>
      )}

      <View style={formStyles.buttonContainer}>
        <TouchableOpacity
          style={formStyles.primaryButton}
          onPress={handleAssign}
          disabled={assigning || !selectedSubject || !selectedUser}>
          <Text style={formStyles.primaryButtonText}>
            {assigning ? "Processing..." : "Assign User"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AssignUserScreen;