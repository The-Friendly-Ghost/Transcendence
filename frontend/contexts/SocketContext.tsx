import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

// Create a Socket context
export const SocketContext = createContext<Socket | null>(null);

// Custom hook to use the WebSocket context
export const useSocket = () => {
  return useContext(SocketContext);
};
