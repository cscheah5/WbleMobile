import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import config from '@/config/config.json';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const AssignUserScreen = () => {
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [userType, setUserType] = useState('student');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

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
      const response = await axios.get(`${config.laravelApiUrl}/subjects`);
      setSubjects(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load subjects');
      console.error('Subjects error:', error.response?.data);
    }
  };

  const fetchUsers = async (role: string) => {
    try {
      setLoading(true);
      setSelectedUser(''); // Reset user selection when type changes
      const response = await axios.get(`${config.laravelApiUrl}/users?role=${role}`);
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

      const response = await axios.post(
        `${config.laravelApiUrl}${endpoint}`,
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select Subject:</Text>
      <Picker
        selectedValue={selectedSubject}
        onValueChange={value => setSelectedSubject(value)}
        style={styles.picker}
      >
        <Picker.Item label="-- Select Subject --" value="" />
        {subjects.map(subject => (
          <Picker.Item key={subject.id} label={subject.name} value={subject.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Select User Type:</Text>
      <Picker
        selectedValue={userType}
        onValueChange={value => setUserType(value)}
        style={styles.picker}
      >
        <Picker.Item label="Student" value="student" />
        <Picker.Item label="Lecturer" value="lecturer" />
      </Picker>

      <Text style={styles.label}>Select {userType}:</Text>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Picker
          selectedValue={selectedUser}
          onValueChange={value => setSelectedUser(value)}
          style={styles.picker}
        >
          <Picker.Item label={`-- Select ${userType} --`} value="" />
          {users.map(user => (
            <Picker.Item key={user.id} label={user.username} value={user.id} />
          ))}
        </Picker>
      )}

      <View style={styles.buttonContainer}>
        <Button 
          title={assigning ? "Processing..." : "Assign"} 
          onPress={handleAssign}
          disabled={assigning || !selectedSubject || !selectedUser}
        />
      </View>
    </ScrollView>
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

export default AssignUserScreen;