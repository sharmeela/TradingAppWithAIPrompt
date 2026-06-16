import { useEffect, useState } from 'react';

type Asset = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h?: number | null;
  market_cap?: number;
  image?: string;
};

export function PortfolioSummary() {
  const [gainers, setGainers] = useState<Asset[]>([]);
  const [losers, setLosers] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/market/portfolio`);
        if (!res.ok) throw new Error(`Fetch error ${res.status}`);
        const json = await res.json();
        if (!mounted) return;
        setGainers(json.data.gainers ?? []);
        setLosers(json.data.losers ?? []);
      } catch (err: any) {
        setError(err?.message ?? 'unknown');
      }
    };

    fetchPortfolio();
    const id = setInterval(fetchPortfolio, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-glow">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Portfolio</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Portfolio movers</h2>
          <p className="mt-1 text-sm text-emerald-400">Top gainers & losers (24h)</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">Updated: 60s</div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {error && <div className="col-span-full text-sm text-rose-400">{error}</div>}
        <div>
          <h3 className="text-sm text-slate-400">Top Gainers</h3>
          <div className="mt-3 space-y-3">
            {gainers.map((g) => (
              <div key={g.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">{g.symbol.toUpperCase()}</p>
                  <p className="text-sm font-semibold text-white">{g.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-100">${g.current_price.toLocaleString()}</p>
                  <p className={((g.price_change_percentage_24h ?? 0) > 0) ? 'text-emerald-400' : 'text-rose-400'}>{g.price_change_percentage_24h ? `${g.price_change_percentage_24h.toFixed(2)}%` : '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-slate-400">Top Losers</h3>
          <div className="mt-3 space-y-3">
            {losers.map((g) => (
              <div key={g.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">{g.symbol.toUpperCase()}</p>
                  <p className="text-sm font-semibold text-white">{g.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-100">${g.current_price.toLocaleString()}</p>
                  <p className={((g.price_change_percentage_24h ?? 0) > 0) ? 'text-emerald-400' : 'text-rose-400'}>{g.price_change_percentage_24h ? `${g.price_change_percentage_24h.toFixed(2)}%` : '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
