import { createContext, useState, useEffect } from 'react';
import Lobby from './components/Lobby';
import './App.css';

// WebSocket Context
export const WebSocketContext = createContext(null);

const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080'); // Local WebSocket server
    socket.onopen = () => console.log('WebSocket connected');
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prev) => [...prev, data]);
      } else if (data.type === 'players') {
        setPlayers(data.players);
      }
    };
    socket.onclose = () => console.log('WebSocket disconnected');
    setWs(socket);

    return () => socket.close();
  }, []);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ ws, messages, players, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

function App() {
  return (
    <WebSocketProvider>
      <Lobby />
    </WebSocketProvider>
  );
}

export default App;