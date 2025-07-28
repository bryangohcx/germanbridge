const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map(); // Store client usernames and WebSocket connections

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'join') {
      clients.set(ws, data.username);
      // Broadcast updated player list
      const players = Array.from(clients.values());
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'players', players }));
        }
      });
    } else if (data.type === 'message') {
      // Broadcast chat message
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              type: 'message',
              username: clients.get(ws),
              content: data.content,
            })
          );
        }
      });
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    // Broadcast updated player list
    const players = Array.from(clients.values());
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'players', players }));
      }
    });
    console.log('Client disconnected');
  });
});

console.log('WebSocket server running on ws://localhost:8080');