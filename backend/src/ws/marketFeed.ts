import { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';

export function createMarketFeedServer(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: '/ws/market' });

  wss.on('connection', (socket) => {
    // Broadcast a ticker sample on connect to simulate live market updates.
    socket.send(JSON.stringify({
      type: 'ticker',
      symbol: 'BTC/USD',
      price: 67420.17,
      change: 1.24,
      ts: new Date().toISOString(),
    }));

    const heartbeat = setInterval(() => {
      socket.send(JSON.stringify({
        type: 'heartbeat',
        ts: new Date().toISOString(),
      }));
    }, 5000);

    socket.on('close', () => clearInterval(heartbeat));
  });

  return wss;
}
