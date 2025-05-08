import React, {useState, useContext} from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {AuthContext} from '@/contexts/AuthContext';
import DocumentPicker from 'react-native-document-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CreateMaterialScreen({route, navigation}) {
  const {sectionId, onMaterialCreated} = route.params;
  const {authAxios} = useContext(AuthContext);
  
  const [type, setType] = useState('lecture');
  const [file, setFile] = useState(null);

  const materialTypes = [
    {label: 'Lecture', value: 'lecture'},
    {label: 'Tutorial', value: 'tutorial'},
    {label: 'Practical', value: 'practical'},
    {label: 'Others', value: 'others'}, 
  ];

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      
      setFile(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const handleUploadMaterial = async () => {
    if (!file) {
      Alert.alert('Error', 'Please select a file');
      return;
    }

    try {
      // Create form data for file upload
      const formData = new FormData();

      // Add the file
      formData.append('file', {
        uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
        type: file.type || 'application/octet-stream',
        name: file.name,
      });

      // Required fields only
      formData.append('section_id', sectionId);
      formData.append('type', type);

      console.log('Uploading material with form data:', {
        section_id: sectionId,
        type,
        filename: file.name
      });

      const response = await authAxios.post('/materials/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });

      if (response.status === 201) {
        if (onMaterialCreated) {
          onMaterialCreated();
        }
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error uploading material:', error);
      Alert.alert('Error', 'Failed to upload material. Please ensure the file is valid and try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Material Type:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          style={styles.picker}>
          {materialTypes.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>File:</Text>
      <TouchableOpacity style={styles.filePicker} onPress={pickDocument}>
        <Ionicons name="document-attach-outline" size={24} color="#666" />
        <Text style={styles.filePickerText}>
          {file ? file.name : 'Select a file'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={handleUploadMaterial}>
        <Text style={styles.uploadButtonText}>Upload Material</Text>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  filePicker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 5,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filePickerText: {
    marginLeft: 10,
    color: '#666',
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});