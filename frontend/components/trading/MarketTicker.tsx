export function MarketTicker() {
  const items = [
    { pair: 'BTC/USD', price: '67,420.17', change: '+1.24%' },
    { pair: 'ETH/USD', price: '3,640.42', change: '+0.82%' },
    { pair: 'AAPL', price: '193.55', change: '-0.18%' },
  ];

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-glow">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Live Tickers</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Market pulse</h2>
        </div>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">WebSocket ready</span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.pair} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{item.pair}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-100">{item.price}</p>
            <p className={item.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>{item.change}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
