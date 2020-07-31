import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets
} from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/contexts/AuthContext';
import { SitesProvider, SitesContext } from './src/contexts/SitesContext';

import NoSite from './src/screens/NoSite';
import SiteSetup from './src/screens/SiteSetup';
import SiteSelector from './src/screens/SiteSelector';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import Post from './src/components/Post';
import { Feather } from '@expo/vector-icons';

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();
const SiteStack = createStackNavigator<SiteStackParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name='Login' component={Login} />
    <AuthStack.Screen name='Register' component={Register} />
  </AuthStack.Navigator>
);

export type SiteStackParamList = {
  Home: undefined;
  Post: { postId: number };
};

const SiteNavigator = () => (
  <SiteStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: '#222222',
        shadowColor: '#999999'
      },
      headerLeftContainerStyle: {
        paddingLeft: 12
      },
      headerTitleStyle: {
        color: '#DEDEDE'
      }
    }}
  >
    <SiteStack.Screen
      name='Home'
      component={Home}
      options={({ navigation }) => ({
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SiteSelector');
            }}
          >
            <Feather name='menu' color='#DEDEDE' size={28} />
          </TouchableOpacity>
        )
      })}
    />
    <SiteStack.Screen
      name='Post'
      component={Post}
      options={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity onPress={navigation.goBack}>
            <Feather name='chevron-left' color='#DEDEDE' size={28} />
          </TouchableOpacity>
        )
      })}
    />
  </SiteStack.Navigator>
);

const AppNavigator = () => {
  const { activeSite } = React.useContext(SitesContext);

  return (
    <AppStack.Navigator
      headerMode='none'
      initialRouteName={activeSite ? 'Site' : 'NoSite'}
      mode='modal'
      screenOptions={{
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS
      }}
    >
      <AppStack.Screen name='NoSite' component={NoSite} />
      <AppStack.Screen name='Site' component={SiteNavigator} />
      <AppStack.Screen name='Auth' component={AuthNavigator} />
      <AppStack.Screen name='SiteSetup' component={SiteSetup} />
      <AppStack.Screen name='SiteSelector' component={SiteSelector} />
    </AppStack.Navigator>
  );
};

const App = () => (
  <AuthProvider>
    <StatusBar style='light' />
    <SitesProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </SitesProvider>
  </AuthProvider>
);

export default App;
