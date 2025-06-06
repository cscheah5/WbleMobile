import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {AuthContext} from '@/contexts/AuthContext';
import {InputWithLabel} from '@/components/InputWithLabel';
import {AppButton} from '@/components/AppButton';
import {ScrollView} from 'react-native-gesture-handler';

const SignInScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useContext(AuthContext);

  const handleLogin = async () => {
    // Basic validation
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await login(username, password);

    if (!result.success) {
      Alert.alert('Login failed', result.error || 'Invalid credentials');
      setPassword('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <ScrollView>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Login</Text>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
            />
          </View>

          <View style={styles.formContainer}>
            <InputWithLabel
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <InputWithLabel
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <AppButton title="Log in" onPress={handleLogin} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  formContainer: {
    marginTop: 20,
  },
});

export default SignInScreen;
