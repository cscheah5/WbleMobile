import React,{Component}  from "react";
import {StyleSheet} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import AnimalScreen from "./src/screens/AnimalScreen";

const Stack = createStackNavigator();

const App = () => {  
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{title:'HomeScreen', ...styles}} />
        <Stack.Screen 
          name="Animal" 
          component={AnimalScreen} 
          options={styles} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;

const styles = StyleSheet.create({
  headerTitleAlign:'center',
  headerStyle: {
      backgroundColor: '#f4511e',
    },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  }
})