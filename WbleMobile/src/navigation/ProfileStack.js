import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '@/screens/ProfileScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' }, 
        headerTintColor: '#000000', 
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
