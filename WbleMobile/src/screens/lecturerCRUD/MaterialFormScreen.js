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

export default function MaterialFormScreen({route, navigation}) {
  // Check if we're in edit mode by checking if material exists in params
  const isEditMode = !!route.params?.material;
  
  // Get the appropriate params based on mode
  const {
    sectionId,
    onMaterialCreated,
    material,
    onMaterialUpdated
  } = route.params || {};
  
  const {authAxios} = useContext(AuthContext);
  
  // Initialize state based on edit mode
  const [type, setType] = useState(isEditMode ? material.type || 'lecture' : 'lecture');
  const [file, setFile] = useState(null);
  const [isReplacingFile, setIsReplacingFile] = useState(false);

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
      if (isEditMode) {
        setIsReplacingFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch(ext) {
      case 'pdf': return 'document-text-outline';
      case 'doc':
      case 'docx': return 'document-outline';
      case 'ppt':
      case 'pptx': return 'easel-outline';
      case 'xls':
      case 'xlsx': return 'grid-outline';
      case 'zip':
      case 'rar': return 'archive-outline';
      case 'jpg':
      case 'jpeg':
      case 'png': return 'image-outline';
      default: return 'document-outline';
    }
  };

  const handleSaveMaterial = async () => {
    try {
      let response;
      
      if (isEditMode) {
        try {
          if (file) {
            console.log('Uploading file:', file);
            
            // Create form data for file upload
            const formData = new FormData();
            
            // Use method spoofing for Laravel to handle PUT with files correctly
            formData.append('_method', 'PUT');
            
            // Add the type field
            console.log('Material type being sent:', type);
            formData.append('type', String(type));
            
            // Format the file object
            const fileToUpload = {
              uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
              name: file.name || 'file.tmp',
              type: file.type || 'application/octet-stream',
            };
            
            console.log('File object to upload:', fileToUpload);
            formData.append('file', fileToUpload);
            
            // Log the FormData parts for debugging
            if (formData._parts) {
              formData._parts.forEach((part, index) => {
                console.log(`FormData part ${index}:`, part[0], typeof part[1]);
              });
            }
            
            // Use POST instead of PUT for file uploads (with _method=PUT for Laravel)
            response = await authAxios.post(`/materials/${material.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'application/json',
              },
              transformRequest: (data) => data,
            });
          } else {
            // For type-only updates, use simple JSON
            response = await authAxios.put(`/materials/${material.id}`, { type });
          }
          
          if (response.status === 200 && onMaterialUpdated) {
            onMaterialUpdated();
            Alert.alert('Success', 'Material updated successfully');
          }
          
          navigation.goBack();
        } catch (error) {
          console.error('Error updating material:', error);
          console.log('Error details:', error.response?.data);
          Alert.alert('Error', 'Failed to update material. Please try again.');
        }
      } else {
        // Create new material with file upload
        if (!file) {
          Alert.alert('Error', 'Please select a file');
          return;
        }

        // Create form data for file upload
        const formData = new FormData();

        // Add type FIRST (important!)
        formData.append('type', String(type)); // Use String() to ensure it's a string
        
        // Add section_id
        formData.append('section_id', sectionId);

        // Add the file AFTER other fields
        formData.append('file', {
          uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
          type: file.type || 'application/octet-stream',
          name: file.name,
        });
        
        // Log FormData parts
        if (formData._parts) {
          formData._parts.forEach((part, index) => {
            console.log(`Create FormData part ${index}:`, part[0], part[1] !== undefined);
          });
        }

        response = await authAxios.post('/materials/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
          transformRequest: (data) => data,
        });
        
        if (response.status === 201 && onMaterialCreated) {
          onMaterialCreated();
          Alert.alert('Success', 'Material uploaded successfully');
          navigation.goBack();
        }
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'uploading'} material:`, error);
      Alert.alert('Error', `Failed to ${isEditMode ? 'update' : 'upload'} material`);
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      {isEditMode && material && !isReplacingFile && (
        <View style={styles.fileInfoBox}>
          <Ionicons name={getFileIcon(material.filename)} size={40} color="#007bff" />
          <View style={styles.fileDetails}>
            <Text style={styles.fileName}>{material.filename}</Text>
            <Text style={styles.fileType}>
              File Type: {material.filename.split('.').pop().toUpperCase()}
            </Text>
          </View>
        </View>
      )}

      {isEditMode && isReplacingFile && file && (
        <View style={[styles.fileInfoBox, {backgroundColor: '#e8f5e9'}]}>
          <Ionicons name={getFileIcon(file.name)} size={40} color="#4caf50" />
          <View style={styles.fileDetails}>
            <Text style={styles.fileName}>{file.name} (New file)</Text>
            <Text style={styles.fileType}>
              File Type: {file.name.split('.').pop().toUpperCase()}
            </Text>
          </View>
        </View>
      )}

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
          {isEditMode && !file 
            ? 'Select new file to replace current one (optional)' 
            : (file ? file.name : 'Select a file')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={isEditMode ? formStyles.primaryButton : formStyles.successButton}
        onPress={handleSaveMaterial}>
        <Text style={isEditMode ? formStyles.primaryButtonText : formStyles.successButtonText}>
          {isEditMode ? 'Update Material' : 'Upload Material'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fileInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  fileDetails: {
    marginLeft: 15,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fileType: {
    fontSize: 14,
    color: '#666',
  },
});