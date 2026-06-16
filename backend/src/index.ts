import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createMarketFeedServer } from './ws/marketFeed';
import { healthRouter } from './routes/health';
import { marketRouter } from './routes/market';
import { startPolling } from './services/coingecko';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

// Middleware for secure API access and CORS policy.
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// Register modular routes for health checks and future trading endpoints.
app.use('/api/health', healthRouter);
app.use('/api/market', marketRouter);

const server = app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

// Start the native WebSocket market feed alongside the REST server.
createMarketFeedServer(server);

// Start background CoinGecko polling
startPolling(60_000);
