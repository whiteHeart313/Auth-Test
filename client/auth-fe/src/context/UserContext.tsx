import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id?: string;
  name: string;
  email: string;
  [key: string]: any; 
}

interface UserContextType {
  user: User | null;
  isNewLogin: boolean;
  setUser: (user: User | null) => void;
  setNewLogin: (isNew: boolean) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isNewLogin, setIsNewLogin] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedNewLogin = localStorage.getItem('newLogin');
    
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    
    if (storedNewLogin === 'true') {
      setIsNewLogin(true);
    }
  }, []);

  const setUser = (userData: User | null) => {
    setUserState(userData);
    
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
    }
  };

  const setNewLogin = (isNew: boolean) => {
    setIsNewLogin(isNew);
    localStorage.setItem('newLogin', isNew ? 'true' : 'false');
  };

  
  const clearUser = () => {
    setUserState(null);
    setIsNewLogin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('newLogin');
    localStorage.removeItem('role');
  };

  return (
    <UserContext.Provider value={{ user, isNewLogin, setUser, setNewLogin, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};