import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';
import Login from './app/screens/Login';
import Signup from './app/screens/Signup';
import Profile from './app/screens/Profile';
import Feeds from './app/screens/Feeds';
import TabNavigation from './app/navigation/TabNavigation'; // Assuming TabNavigation is set up for your Home, Feed, etc.
import { LogBox } from 'react-native';
import ForgetPass from './app/screens/ForgetPass';

// Ignore non-serializable navigation warnings
LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Feed: undefined;
  Tabs: undefined; // Tabs might contain Home and Feed, etc.
  ForgetPass: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('User status changed:', user);
      setUser(user); // Set user state on authentication state change
    });

    return () => unsubscribe(); // Unsubscribe from the listener when component unmounts
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // ผู้ใช้ล็อกอินแล้ว แสดง TabNavigation
          <Stack.Screen
            name="Tabs"
            component={TabNavigation}
            options={{ headerShown: false }}
          />
        ) : (
          //User is not logged in, show login/signup screens
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgetPass"
              component={ForgetPass}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;