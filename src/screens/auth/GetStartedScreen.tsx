import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const GetStartedScreen = ({ navigation }) => {
    return (
      <View>
        <Text>Welcome to the App!</Text>
        <Button title="Sign In" onPress={() => navigation.navigate('SignIn')} />
        <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
      </View>
    );
  };

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default GetStartedScreen;
