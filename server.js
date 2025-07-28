const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server running');
});

const wss = new WebSocket.Server({ server });
const clients = new Map();

wss.on('connection', (ws, req) => {
  console.log('Client connected from:', req.socket.remoteAddress);
  console.log('Request headers:', req.headers);

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (error) {
      console.error('Invalid JSON received:', error);
      return;
    }

    if (data.type === 'join') {
      clients.set(ws, data.username);
      const players = Array.from(clients.values());
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'players', players }));
        }
      });
    } else if (data.type === 'message') {
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
    const players = Array.from(clients.values());
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'players', players }));
      }
    });
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

wss.on('error', (error) => {
  console.error('WebSocket server error:', error);
});

server.on('upgrade', (req, socket, head) => {
  console.log('Upgrade request received:', req.headers);
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

const port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', () => {
  console.log(`WebSocket server running on port ${port}`);
});