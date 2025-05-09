import { StyleSheet } from 'react-native';

export const formStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  
  // Headers and titles
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  
  // Input fields
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    height: 120,
    textAlignVertical: 'top',
  },
  
  // Labels
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  
  // Picker/Dropdown
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  
  // Buttons
  buttonContainer: {
    marginVertical: 15,
  },
  primaryButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  successButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: '#dc3545', 
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  dangerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // File picker
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
  
  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Dividers and spacing
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginVertical: 15,
  },
});
