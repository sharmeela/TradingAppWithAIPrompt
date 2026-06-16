import { Router } from 'express';
import { getCachedTickers, getCachedTopMovers, getLastError } from '../services/coingecko';

const router = Router();

// Return cached tickers (trending or top by market cap)
router.get('/tickers', (_req, res) => {
  const data = getCachedTickers();
  const lastErr = getLastError();
  if (lastErr && data.length === 0) return res.status(503).json({ error: 'CoinGecko unavailable', details: lastErr });
  res.json({ data });
});

// Return cached top movers (gainers & losers)
router.get('/portfolio', (_req, res) => {
  const data = getCachedTopMovers();
  const lastErr = getLastError();
  if (lastErr && data.gainers.length === 0 && data.losers.length === 0) return res.status(503).json({ error: 'CoinGecko unavailable', details: lastErr });
  res.json({ data });
});

// Synthesize a basic orderbook using tickers endpoint
router.get('/orderbook', async (req, res) => {
  const coin = String(req.query.coin || 'bitcoin');
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(coin)}/tickers`;
    const r = await fetch(url);
    if (r.status === 429) {
      return res.status(429).json({ error: 'CoinGecko rate limit' });
    }
    if (!r.ok) return res.status(502).json({ error: 'CoinGecko fetch failed', status: r.status });
    const body = await r.json();
    const tickers = (body.tickers || []).slice(0, 30);

    const prices = tickers.map((t: any) => t.last).filter(Boolean);
    const mid = prices.length ? prices[Math.floor(prices.length / 2)] : 0;

    const bids: any[] = [];
    const asks: any[] = [];
    for (let i = 0; i < 10; i++) {
      const base = mid || (prices[i] ?? 1);
      const spread = 0.001 * (i + 1);
      bids.push({ price: Number((base * (1 - spread)).toFixed(8)), size: Math.max(1, Math.round((tickers[i]?.volume ?? 1) / (i + 1))) });
      asks.push({ price: Number((base * (1 + spread)).toFixed(8)), size: Math.max(1, Math.round((tickers[i]?.volume ?? 1) / (i + 1))) });
    }

    res.json({ data: { pair: `${coin.toUpperCase()}/USD`, bids, asks, ts: new Date().toISOString() } });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? 'unknown' });
  }
});

export { router as marketRouter };
