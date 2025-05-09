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
import { formStyles } from '@/styles/formStyles';

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
    <ScrollView style={formStyles.container}>
      <Text style={formStyles.label}>Material Type:</Text>
      <View style={formStyles.pickerContainer}>
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          style={formStyles.picker}>
          {materialTypes.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      <Text style={formStyles.label}>File:</Text>
      <TouchableOpacity style={formStyles.filePicker} onPress={pickDocument}>
        <Ionicons name="document-attach-outline" size={24} color="#666" />
        <Text style={formStyles.filePickerText}>
          {file ? file.name : 'Select a file'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={formStyles.successButton}
        onPress={handleUploadMaterial}>
        <Text style={formStyles.successButtonText}>Upload Material</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
