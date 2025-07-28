import { useState, useContext } from 'react';
import { WebSocketContext } from '../App';

function Table() {
  const [message, setMessage] = useState('');
  const { messages, players, sendMessage } = useContext(WebSocketContext);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage({ type: 'message', content: message });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Game Table</h1>
      <div className="w-full max-w-md mb-4">
        <h2 className="text-xl font-semibold">Players</h2>
        <ul className="border p-2 rounded">
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      </div>
      <div className="w-full max-w-md">
        <h2 className="text-xl font-semibold">Chat</h2>
        <div className="border p-2 rounded h-64 overflow-y-auto mb-2">
          {messages.map((msg, index) => (
            <div key={index} className="mb-1">
              <strong>{msg.username}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="p-2 border rounded flex-1 mr-2"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;