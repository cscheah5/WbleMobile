import React, {useState, useContext} from 'react';
import {
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {AuthContext} from '@/contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formStyles } from '@/styles/formStyles';

export default function EditMaterialScreen({route, navigation}) {
  const {material, onMaterialUpdated} = route.params;
  const {authAxios} = useContext(AuthContext);
  
  const [type, setType] = useState(material.type || 'lecture');
  const [title, setTitle] = useState(material.title || '');
  const [description, setDescription] = useState(material.description || '');

  const materialTypes = [
    {label: 'Lecture', value: 'lecture'},
    {label: 'Tutorial', value: 'tutorial'},
    {label: 'Practical', value: 'practical'},
    {label: 'Assessment', value: 'assessment'},
    {label: 'Other', value: 'other'},
  ];

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

  const handleUpdateMaterial = async () => {
    try {
      const response = await authAxios.put(`/materials/${material.id}`, {
        type: type,
        title: title,
        description: description
      });

      if (response.status === 200) {
        if (onMaterialUpdated) {
          onMaterialUpdated();
        }
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error updating material:', error);
      Alert.alert('Error', 'Failed to update material');
    }
  };

  return (
    <ScrollView style={formStyles.container}>
      <View style={styles.fileInfoBox}>
        <Ionicons name={getFileIcon(material.filename)} size={40} color="#007bff" />
        <View style={styles.fileDetails}>
          <Text style={styles.fileName}>{material.filename}</Text>
          <Text style={styles.fileType}>File Type: {material.filename.split('.').pop().toUpperCase()}</Text>
        </View>
      </View>

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

      <Text style={formStyles.label}>Title (Optional):</Text>
      <TextInput
        style={formStyles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter material title"
      />

      <Text style={formStyles.label}>Description (Optional):</Text>
      <TextInput
        style={formStyles.textArea}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter material description"
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity 
        style={formStyles.primaryButton}
        onPress={handleUpdateMaterial}>
        <Text style={formStyles.primaryButtonText}>Update Material</Text>
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