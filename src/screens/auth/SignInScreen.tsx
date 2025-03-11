import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const SignInScreen = ({ navigation }) => {
    return (
      <View>
        <Text>Sign In Screen</Text>
        <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
      </View>
    );
  };

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default SignInScreen;
