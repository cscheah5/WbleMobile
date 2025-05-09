import React, {useState, useContext} from 'react';
import {View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AuthContext} from '@/contexts/AuthContext';
import { formStyles } from '@/styles/formStyles';

const CreateSubjectScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {authAxios} = useContext(AuthContext);

  const toTitleCase = (str) => {
    if (!str) return str; 
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleCreateSubject = async () => {
    // Trim inputs
    const trimmedName = toTitleCase(name.trim());
    const trimmedCode = code.trim();

    // Name validation
    if (trimmedName.length < 5 || trimmedName.length > 50) {
      Alert.alert(
        'Validation Error',
        'Subject name must be between 5 and 50 characters.',
      );
      return;
    }

    // Code format validation (4 uppercase letters + 4 digits)
    const codeRegex = /^[A-Z]{4}[0-9]{4}$/;
    if (!codeRegex.test(trimmedCode)) {
      Alert.alert(
        'Validation Error',
        'Subject code must be 4 uppercase letters followed by 4 digits (e.g., MATH1001).',
      );
      return;
    }

    try {
      const subjectResponse = await authAxios.post(`/subjects`, {
        name: trimmedName,
        code: trimmedCode,
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
    <View style={formStyles.container}>
      <TextInput
        style={formStyles.input}
        placeholder="Subject Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={formStyles.input}
        placeholder="Subject Code"
        value={code}
        onChangeText={setCode}
      />
      <TextInput
        style={formStyles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.datePickerContainer}>
        <Text style={formStyles.label}>Start Date: {startDate.toDateString()}</Text>
        <Button
          title="Pick Start Date"
          onPress={() => setShowDatePicker(true)}
        />
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

      <TouchableOpacity 
        style={formStyles.successButton}
        onPress={handleCreateSubject}>
        <Text style={formStyles.successButtonText}>Create Subject</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    marginBottom: 15,
  }
});

export default CreateSubjectScreen;
