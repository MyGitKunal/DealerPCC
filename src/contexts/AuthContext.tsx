import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, UserRole, AccountType } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: UserRole, accountType: AccountType) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@manufacturer.com",
    role: "super_admin",
    accountType: "manufacturer",
    brand: "VW Group",
  },
  {
    id: "2",
    username: "dealer1",
    email: "dealer1@vwdealer.com",
    role: "service_manager",
    accountType: "dealer",
    dealerName: "VW Delhi Central",
    brand: "Volkswagen",
    kvps: "12345",
  },
  {
    id: "3",
    username: "dealer2",
    email: "dealer2@skodadealer.com",
    role: "warranty_manager",
    accountType: "dealer",
    dealerName: "Škoda Mumbai West",
    brand: "Škoda",
    kvps: "67890",
  },
  {
    id: "4",
    username: "tech1",
    email: "tech1@vwdealer.com",
    role: "master_technician",
    accountType: "dealer",
    dealerName: "VW Bangalore South",
    brand: "Volkswagen",
    kvps: "11111",
  },
];

const DEMO_PASSWORDS: Record<string, string> = {
  admin: "admin123",
  dealer1: "dealer123",
  dealer2: "dealer123",
  tech1: "tech123",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  const login = (username: string, password: string, role: UserRole, accountType: AccountType): boolean => {
    // Check approved dealer users first
    try {
      const approvedUsers = JSON.parse(localStorage.getItem("approvedDealerUsers") || "[]");
      const approvedUser = approvedUsers.find(
        (u: any) => (u.username === username || u.email === username) && u.password === password
      );
      if (approvedUser) {
        const u: User = {
          id: approvedUser.id,
          username: approvedUser.username,
          email: approvedUser.email,
          role: approvedUser.role,
          accountType: approvedUser.accountType || "dealer",
          dealerName: approvedUser.dealerName,
          brand: approvedUser.brand,
          kvps: approvedUser.kvps,
        };
        setUser(u);
        return true;
      }
    } catch {
      // ignore
    }

    // Check default users
    const found = DEFAULT_USERS.find(
      (u) =>
        (u.username === username || u.email === username) &&
        u.role === role &&
        u.accountType === accountType
    );
    if (found && DEMO_PASSWORDS[found.username] === password) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
