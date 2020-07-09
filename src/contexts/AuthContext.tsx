import React from "react";
import AsyncStorage from "@react-native-community/async-storage";

export const AuthContext = React.createContext<{
  jwt: string | null;
  setJwt(jwt: string): void;
}>({
  jwt: null,
  setJwt: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [jwt, setJwt] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!jwt) {
      AsyncStorage.removeItem("jwt");
    } else {
      AsyncStorage.setItem("jwt", jwt);
    }
  }, [jwt]);

  return (
    <AuthContext.Provider value={{ jwt, setJwt }}>
      {children}
    </AuthContext.Provider>
  );
};
