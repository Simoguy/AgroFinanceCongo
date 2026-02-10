import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (name: string, code?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const savedAuth = localStorage.getItem("agro_finance_auth");
    if (savedAuth) {
      const data = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(data);
    }
  }, []);

  const login = (name: string, code?: string) => {
    // Admin Principal check
    if (name.toLowerCase() === "francisco mouanga agr") {
      const adminData = { name: "Direction AGR", role: "admin", agentId: "ADM-MAIN" };
      setIsAuthenticated(true);
      setUser(adminData);
      localStorage.setItem("agro_finance_auth", JSON.stringify(adminData));
      return true;
    }

    // Agent/Admin Secondaire check (Mock for now, would use DB in real app)
    // We search in our mock agents list (persisted in localStorage or similar)
    const savedAgents = localStorage.getItem("agro_finance_agents");
    const agents = savedAgents ? JSON.parse(savedAgents) : [
      { id: 1, name: "Lesly Muamba", agentId: "AG-2024-001", role: "agent", code: "1234" }
    ];

    const foundAgent = agents.find((a: any) => 
      (a.name.toLowerCase() === name.toLowerCase() || a.agentId === name) && a.code === code
    );

    if (foundAgent) {
      setIsAuthenticated(true);
      setUser(foundAgent);
      localStorage.setItem("agro_finance_auth", JSON.stringify(foundAgent));
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("agro_finance_auth");
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
