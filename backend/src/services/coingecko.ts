import { type Router } from 'express';

type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number | null;
};

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Simple in-memory cache with polling
const cache: {
  tickers?: CoinMarket[];
  topMovers?: { gainers: CoinMarket[]; losers: CoinMarket[] };
  lastError?: string | null;
} = {};

let isPolling = false;

async function fetchMarkets(perPage = 50): Promise<CoinMarket[]> {
  const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=24h`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });

  if (res.status === 429) throw new Error('rate_limited');
  if (!res.ok) throw new Error(`coingecko_error_${res.status}`);

  const data = await res.json();
  return data.map((d: any) => ({
    id: d.id,
    symbol: d.symbol,
    name: d.name,
    image: d.image,
    current_price: d.current_price,
    market_cap: d.market_cap,
    price_change_percentage_24h: d.price_change_percentage_24h,
  }));
}

async function fetchTrending(): Promise<CoinMarket[]> {
  // CoinGecko trending endpoint returns a different shape; map to CoinMarket-like minimal fields.
  const url = `${COINGECKO_BASE}/search/trending`;
  const res = await fetch(url);
  if (res.status === 429) throw new Error('rate_limited');
  if (!res.ok) throw new Error(`coingecko_error_${res.status}`);
  const data = await res.json();

  // The trending response includes `coins` array with `item` entries.
  const ids = data.coins?.map((c: any) => c.item.id).slice(0, 10) || [];
  if (ids.length === 0) return [];

  // Fetch market data for these ids to get prices
  const marketsUrl = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${encodeURIComponent(ids.join(','))}&sparkline=false`;
  const marketsRes = await fetch(marketsUrl);
  if (marketsRes.status === 429) throw new Error('rate_limited');
  if (!marketsRes.ok) throw new Error(`coingecko_error_${marketsRes.status}`);
  const markets = await marketsRes.json();

  return markets.map((d: any) => ({
    id: d.id,
    symbol: d.symbol,
    name: d.name,
    image: d.image,
    current_price: d.current_price,
    market_cap: d.market_cap,
    price_change_percentage_24h: d.price_change_percentage_24h,
  }));
}

async function refreshCache() {
  try {
    const [markets, trending] = await Promise.all([fetchMarkets(50), fetchTrending()]);

    cache.tickers = trending.length ? trending : markets.slice(0, 10);

    // derive top movers from markets
    const sorted = markets.filter((m) => typeof m.price_change_percentage_24h === 'number');
    sorted.sort((a, b) => (b.price_change_percentage_24h! - a.price_change_percentage_24h!));
    cache.topMovers = {
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse(),
    };
    cache.lastError = null;
  } catch (err: any) {
    cache.lastError = err?.message ?? String(err);
    // If rate limited, keep previous cache but log the event
    console.warn('CoinGecko refresh failed:', cache.lastError);
  }
}

export function startPolling(intervalMs = 60000) {
  if (isPolling) return;
  isPolling = true;
  // initial fetch
  void refreshCache();
  setInterval(() => void refreshCache(), Math.max(60000, intervalMs));
}

export function getCachedTickers() {
  return cache.tickers ?? [];
}

export function getCachedTopMovers() {
  return cache.topMovers ?? { gainers: [], losers: [] };
}

export function getLastError() {
  return cache.lastError ?? null;
}

export type { CoinMarket };
