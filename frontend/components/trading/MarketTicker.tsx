import { useEffect, useState } from 'react';

type TickerItem = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  price_change_percentage_24h: number | null;
};

export function MarketTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchTickers = async () => {
      try {
        console.log('🔄 Fetching tickers from /api/market/tickers...');
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/market/tickers`);
        console.log('📡 Response status:', res.status);
        if (!res.ok) throw new Error(`Fetch error ${res.status}`);
        const json = await res.json();
        console.log('📊 Fetched tickers data:', json);
        if (!mounted) return;
        setItems(json.data ?? []);
        console.log('✅ Tickers state updated:', json.data ?? []);
      } catch (err: any) {
        setError(err?.message ?? 'unknown');
      }
    };

    fetchTickers();
    const id = setInterval(fetchTickers, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-glow">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Live Tickers</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Market pulse</h2>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">API</span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {error && (
          <div className="col-span-full text-sm text-rose-400">{error}</div>
        )}
        {items.length === 0 && !error && (
          <div className="col-span-full text-sm text-slate-400">Loading...</div>
        )}
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{item.name}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-100">{item.current_price?.toLocaleString(undefined, { maximumFractionDigits: 8 })}</p>
            <p className={((item.price_change_percentage_24h ?? 0) > 0) ? 'text-emerald-400' : 'text-rose-400'}>{item.price_change_percentage_24h ? `${item.price_change_percentage_24h.toFixed(2)}%` : '-'}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
