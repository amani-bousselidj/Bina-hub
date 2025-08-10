import React, { createContext, useContext, ReactNode } from 'react';

interface UserData {
  id: string;
  name: string;
  email: string;
  userType: 'user' | 'service-provider' | 'store' | 'admin';
  preferences?: any;
}

interface UserDataContextType {
  userData: UserData | null;
  updateUserData: (data: Partial<UserData>) => void;
  isLoading: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataProviderProps {
  children: ReactNode;
}

export function UserDataProvider({ children }: UserDataProviderProps) {
  // Mock implementation - replace with actual user data logic
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => prev ? { ...prev, ...data } : null);
  };

  const value = {
    userData,
    updateUserData,
    isLoading
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
