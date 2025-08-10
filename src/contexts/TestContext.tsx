"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a simple test context
const TestContext = createContext<{ message: string; count: number } | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🧪 TestProvider is rendering!');
  
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('🧪 TestProvider useEffect triggered');
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
      console.log('🧪 TestProvider count updated:', count + 1);
    }, 2000);
    
    return () => clearInterval(timer);
  }, []);
  
  const value = {
    message: 'Test context is working!',
    count
  };
  
  console.log('🧪 TestProvider providing value:', value);
  
  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};


