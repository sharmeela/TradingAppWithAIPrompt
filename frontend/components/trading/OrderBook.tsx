import { useEffect, useState } from 'react';
import { json } from 'stream/consumers';

type OrderBookItem = {
  pair: string;
  bids: { price: number; size: number }[];
  asks: { price: number; size: number }[];
  ts: string;
}

export function OrderBook() {
  const [orderBookItems, setOrderBookItems] = useState<OrderBookItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pair, setPair] = useState<string>('N/A');  
  const [bids, setBids] = useState<{ price: number; size: number }[]>([]);
  const [asks, setAsks] = useState<{ price: number; size: number }[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchOrderBook = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/market/orderbook`);
        console.log('📡 Response status:', res.status);
        if (!res.ok) throw new Error(`Fetch error ${res.status}`);
        const json = await res.json();
        if (!mounted) return;
        setOrderBookItems(json.data ?? []);
        setBids(json.data.bids || []);
        setAsks (json.data.asks || []);
        setPair(json.data.pair || 'N/A');
      } catch (err: any) {
        setError(err?.message ?? 'unknown');
      }
    };

    fetchOrderBook();
    const id = setInterval(fetchOrderBook, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-glow">
      {error && (
          <div className="col-span-full text-sm text-rose-400">{error}</div>
        )}
        {orderBookItems.length === 0 && !error && (
          <div className="col-span-full text-sm text-slate-400">Loading...</div>
        )}

      <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Order Book</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Bid / Ask depth</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
        <div className="p-4">
          <span className='text-slate-200 text-green-400'>BID </span>
          {bids.map((g, index) => (
              <div key={`bids-${index}`} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 flex items-center justify-between">
                  <span className="text-slate-200">{g.price}</span>
                  <span className="text-slate-200 text-green-400">{g.size}</span>
              </div>
            ))}
        </div>
        <div className="p-4">
          <span className='text-slate-200 text-red-400'>ASK </span>
          {asks.map((a, index) => (
            <div key={`ask-${index}`} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 flex items-center justify-between">
                <span className="text-slate-200">{a.price}</span>
                <span className="text-slate-200 text-red-400">{a.size}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
