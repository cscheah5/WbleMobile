import React from 'react';
import {
  View,
  ViewStyle,
  Text,
  TextStyle,
  TextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
} from 'react-native';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  inputStyle ?: StyleProp<TextStyle>;
};

export const InputWithLabel: React.FC<InputProps> = props => {
  const {
    label,
    error,
    inputStyle,
    ...inputProps
  } = props;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  errorText: {
    fontSize: 12,
    color: '#FF0000',
    marginTop: 3,
  }
});
