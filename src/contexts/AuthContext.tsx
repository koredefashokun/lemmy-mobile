import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { AppLoading } from "expo";

interface AuthContextValue {
  jwt: string | null;
  setJwt(jwt: string): void;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthContextValue>({
  jwt: null,
  setJwt: () => {},
  loading: true,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [jwt, setJwt] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem("jwt");
      if (savedToken) setJwt(savedToken);
      setLoading(false);
    })();
  }, []);

  React.useEffect(() => {
    if (!jwt) {
      AsyncStorage.removeItem("jwt");
    } else {
      AsyncStorage.setItem("jwt", jwt);
    }
  }, [jwt]);

  return (
    <AuthContext.Provider value={{ jwt, setJwt, loading }}>
      {loading ? <AppLoading /> : children}
    </AuthContext.Provider>
  );
};
