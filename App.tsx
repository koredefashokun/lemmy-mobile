import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import Login from "./src/screens/Login";
import Register from "./src/screens/Register";

import { AuthContext, AuthProvider } from "./src/contexts/AuthContext";
import { ServiceContext } from "./src/contexts/ServiceContext";
import { WebSocketService } from "./src/services";

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator headerMode="none">
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
};

const AppNavigator = () => {
  const { jwt } = React.useContext(AuthContext);
  const service = React.useMemo(() => new WebSocketService(jwt), [jwt]);

  return (
    <ServiceContext.Provider value={{ service }}>
      <AppStack.Navigator headerMode="none">
        <AppStack.Screen name="Auth" component={AuthNavigator} />
      </AppStack.Navigator>
    </ServiceContext.Provider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
