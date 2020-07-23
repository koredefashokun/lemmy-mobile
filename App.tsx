import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Home from './src/screens/Home';
import Post from './src/components/Post';

import { colors } from './src/styles/theme';

import { ServiceProvider } from './src/contexts/ServiceContext';
import { SitesProvider, SitesContext } from './src/contexts/SitesContext';
import { Feather } from '@expo/vector-icons';
import NoSite from './src/screens/NoSite';
import SiteSetup from './src/screens/SiteSetup';
import SiteSelector from './src/screens/SiteSelector';

const AppStack = createStackNavigator();
const SiteStack = createStackNavigator<SiteStackParamList>();

export type SiteStackParamList = {
  Home: undefined;
  Post: { postId: number };
};

const SiteNavigator = () => {
  return (
    <SiteStack.Navigator>
      <SiteStack.Screen
        name='Home'
        component={Home}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: '#222222',
            shadowColor: '#999999',
          },
          headerTitle: '',
          headerLeftContainerStyle: {
            paddingLeft: 8,
          },
        })}
      />
      <SiteStack.Screen name='Post' component={Post} />
    </SiteStack.Navigator>
  );
};

const AppNavigator = () => {
  const { activeSite } = React.useContext(SitesContext);

  return (
    <AppStack.Navigator
      headerMode='none'
      initialRouteName={activeSite ? 'Site' : 'NoSite'}
      mode='modal'
    >
      <AppStack.Screen name='NoSite' component={NoSite} />
      <AppStack.Screen name='Site' component={SiteNavigator} />
      <AppStack.Screen name='SiteSetup' component={SiteSetup} />
      <AppStack.Screen name='SiteSelector' component={SiteSelector} />
    </AppStack.Navigator>
  );
};

const App = () => {
  return (
    <SitesProvider>
      <StatusBar style='light' />
      <ServiceProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ServiceProvider>
    </SitesProvider>
  );
};

export default App;
