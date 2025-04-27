import { AppButton } from '@/components/AppButton';
import React from 'react';
import {
  SafeAreaView,
  Image,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

const GetStartedScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Text style={styles.title}>Welcome to Wble Mobile!</Text>
        <Image
          source={require('@/assets/images/get_started.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.actionContainer}>
        <AppButton          
          title="Get Started"
          onPress={() => navigation.navigate('SignIn')}        
        />

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Sign in here!</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333333',
    textAlign: 'center',
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  actionContainer: {
    width: '100%',
    marginBottom: 30,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#333333',
  },
  signUpLink: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
});

export default GetStartedScreen;
