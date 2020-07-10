import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import Post from './src/components/Post';

import { AuthProvider } from './src/contexts/AuthContext';

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator<MainStackParamList>();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator headerMode='none'>
      <AuthStack.Screen name='Login' component={Login} />
      <AuthStack.Screen name='Register' component={Register} />
    </AuthStack.Navigator>
  );
};

export type MainStackParamList = {
  Home: undefined;
  Post: { postId: number };
};

const MainNavigator = () => {
  return (
    <MainStack.Navigator headerMode='none'>
      <MainStack.Screen name='Home' component={Home} />
      <MainStack.Screen name='Post' component={Post} />
    </MainStack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <AppStack.Navigator headerMode='none' initialRouteName='Main'>
      <AppStack.Screen name='Auth' component={AuthNavigator} />
      <AppStack.Screen name='Main' component={MainNavigator} />
    </AppStack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <StatusBar style='light' />
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
