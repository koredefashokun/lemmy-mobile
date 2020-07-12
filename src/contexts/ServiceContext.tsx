import React from 'react';
import useWebSocketService from '../hooks/useWebSocketService';

export const ServiceContext = React.createContext<
  ReturnType<typeof useWebSocketService> | undefined
>(undefined);

export const ServiceProvider: React.FC = ({ children }) => {
  const service = useWebSocketService();

  return (
    <ServiceContext.Provider value={service}>
      {children}
    </ServiceContext.Provider>
  );
};

