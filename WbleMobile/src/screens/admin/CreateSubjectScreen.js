import React, {useState, useContext} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import config from '@/config/config.json';
import {AuthContext} from '@/contexts/AuthContext';

const CreateSubjectScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {authAxios} = useContext(AuthContext);


  const handleCreateSubject = async () => {
    try {
      const subjectResponse = await authAxios.post(`/subjects`, {
        name,
        code,
        description,
      });

      const subjectId = subjectResponse.data.subject.id;
      const sections = [];
      let currentStart = new Date(startDate);

      for (let i = 1; i <= 7; i++) {
        const sectionStart = new Date(currentStart);
        const sectionEnd = new Date(sectionStart);
        sectionEnd.setDate(sectionEnd.getDate() + 6);

        sections.push({
          subject_id: subjectId,
          week_number: i,
          start_date: sectionStart.toISOString().split('T')[0],
          end_date: sectionEnd.toISOString().split('T')[0],
        });

        currentStart.setDate(currentStart.getDate() + 7);
      }

      // Send section creation requests
      for (const section of sections) {
        await authAxios.post(`/sections`, section);
      }

      Alert.alert('Success', 'Subject and sections created successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to create subject or sections.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Subject Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject Code"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.datePickerContainer}>
        <Text style={styles.label}>Start Date: {startDate.toDateString()}</Text>
        <Button title="Pick Start Date" onPress={() => setShowDatePicker(true)} />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      <Button title="Create Subject" onPress={handleCreateSubject} />
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

export default CreateSubjectScreen;
