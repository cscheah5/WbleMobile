import React from 'react';
import { Text, StyleSheet, View ,TouchableNativeFeedback, TouchableNativeFeedbackProps } from 'react-native';

export type AppButtonProps = TouchableNativeFeedbackProps & {
  title: string;
}

export const AppButton: React.FC<AppButtonProps> = (props) => {
  const {
    title,
    onPress,
    disabled = false,
    ...buttonProps
  } = props;

  return (
    <TouchableNativeFeedback 
      onPress={onPress}
      disabled={disabled}
      {...buttonProps}>
      <View style={[styles.button, disabled && styles.buttonDisabled]}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  }
});