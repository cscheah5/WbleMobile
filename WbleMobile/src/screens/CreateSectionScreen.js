import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateSectionScreen({route, navigation}) {
  const {subjectId, onSectionCreated} = route.params;
  const {authAxios} = useContext(AuthContext);
  
  const [weekNumber, setWeekNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // One week later
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleCreateSection = async () => {
    if (!weekNumber) {
      Alert.alert('Error', 'Please enter a week number');
      return;
    }

    try {
      const response = await authAxios.post('/sections', {
        subject_id: subjectId,
        week_number: weekNumber,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate)
      });

      if (response.status === 201) {
        if (onSectionCreated) {
          onSectionCreated();
        }
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error creating section:', error);
      Alert.alert('Error', 'Failed to create section');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Week Number:</Text>
      <TextInput
        style={styles.input}
        value={weekNumber}
        onChangeText={setWeekNumber}
        placeholder="Enter week number"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Start Date:</Text>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowStartDatePicker(true)}>
        <Text>{formatDate(startDate)}</Text>
      </TouchableOpacity>
      
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setStartDate(selectedDate);
            }
          }}
        />
      )}

      <Text style={styles.label}>End Date:</Text>
      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowEndDatePicker(true)}>
        <Text>{formatDate(endDate)}</Text>
      </TouchableOpacity>
      
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setEndDate(selectedDate);
            }
          }}
        />
      )}

      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateSection}>
        <Text style={styles.createButtonText}>Create Section</Text>
      </TouchableOpacity>
    </View>
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
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});