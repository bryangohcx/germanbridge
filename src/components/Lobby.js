import { useState, useContext } from 'react';
import { WebSocketContext } from '../App';
import Table from './Table';

function Lobby() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const { sendMessage } = useContext(WebSocketContext);

  const handleJoin = () => {
    if (username.trim()) {
      sendMessage({ type: 'join', username });
      setIsJoined(true);
    }
  };

  if (isJoined) return <Table />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">German Bridge Lobby</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        className="p-2 border rounded mb-4"
      />
      <button
        onClick={handleJoin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Join Table
      </button>
    </div>
  );
}

export default Lobby;