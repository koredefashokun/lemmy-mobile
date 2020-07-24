import React from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { AppLoading } from "expo";
import { User } from "../interfaces";

interface AuthContextValue {
  jwt: string | null;
  setJwt(jwt: string): void;
  user?: User;
  setUser(user: User): void;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthContextValue>({
  jwt: null,
  setJwt: () => {},
  setUser: () => {},
  loading: true,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | undefined>();
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

  React.useEffect(() => {
    if (!user) {
      AsyncStorage.removeItem("user");
    } else {
      AsyncStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ jwt, setJwt, user, setUser, loading }}>
      {loading ? <AppLoading /> : children}
    </AuthContext.Provider>
  );
};
