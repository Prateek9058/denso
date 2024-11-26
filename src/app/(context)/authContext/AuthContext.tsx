"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
interface AuthContextProps {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  isAuthenticated: boolean;
  login: (token: string, role: string, profile: any) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export const AuthProviderMain: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserRole) {
      setUserRole(storedUserRole);
      setIsAuthenticated(true);
    }
  }, []);
  const login = (token: string, role: string, profile: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("profile", JSON.stringify(profile));
    setUserRole(role);
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("loginId");
    setUserRole(null);
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProviderMain");
  }
  return context;
};
