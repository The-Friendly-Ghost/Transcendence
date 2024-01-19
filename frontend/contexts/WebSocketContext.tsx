import { createContext, useContext } from 'react';

// Create a WebSocket context
export const WebSocketContext = createContext<WebSocket | null>(null);

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
