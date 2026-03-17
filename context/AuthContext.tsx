import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type AuthContextType = {
  token: string | null;
  customer: any | null;
  loading: boolean;
  login: (token: string, customer: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // App ochilganda tokenni tekshirish
  useEffect(() => {
    (async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      const savedCustomer = await SecureStore.getItemAsync("customer");

      if (savedToken) {
        setToken(savedToken);
        setCustomer(savedCustomer ? JSON.parse(savedCustomer) : null);
      }
      setLoading(false);
    })();
  }, []);

  const login = async (newToken: string, newCustomer: any) => {
    await SecureStore.setItemAsync("token", newToken);
    await SecureStore.setItemAsync("customer", JSON.stringify(newCustomer));
    setToken(newToken);
    setCustomer(newCustomer);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("customer");
    setToken(null);
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ token, customer, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
