import React, { createContext, useContext, useState } from 'react';

type ToastContextType = {
  showUploadSuccess: (transactionCount: number) => void;
  hideToast: () => void;
  isVisible: boolean;
  transactionCount: number;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);

  const showUploadSuccess = (count: number) => {
    setTransactionCount(count);
    setIsVisible(true);
  };

  const hideToast = () => setIsVisible(false);

  return (
    <ToastContext.Provider value={{ showUploadSuccess, hideToast, isVisible, transactionCount }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 