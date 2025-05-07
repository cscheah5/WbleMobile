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
    <ScrollView style={styles.container}>
      <View style={styles.fileInfoBox}>
        <Ionicons name={getFileIcon(material.filename)} size={40} color="#007bff" />
        <View style={styles.fileDetails}>
          <Text style={styles.fileName}>{material.filename}</Text>
          <Text style={styles.fileType}>File Type: {material.filename.split('.').pop().toUpperCase()}</Text>
        </View>
      </View>

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

      <Text style={styles.label}>Title (Optional):</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter material title"
      />

      <Text style={styles.label}>Description (Optional):</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter material description"
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
      />

      <TouchableOpacity 
        style={styles.updateButton}
        onPress={handleUpdateMaterial}>
        <Text style={styles.updateButtonText}>Update Material</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    height: 100,
  },
  updateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});