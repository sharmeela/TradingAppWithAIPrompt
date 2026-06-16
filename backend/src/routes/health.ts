import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'atlas-trade-backend',
    timestamp: new Date().toISOString(),
    message: 'WebSocket and REST endpoints are ready for real-time market data.',
  });
});
