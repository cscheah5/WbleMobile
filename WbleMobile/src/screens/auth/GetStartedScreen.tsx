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
});

export default GetStartedScreen;
