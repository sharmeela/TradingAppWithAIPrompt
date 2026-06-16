export function OrderBook() {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-glow">
      <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Order Book</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Bid / ask depth</h2>
      <div className="mt-6 space-y-3 text-sm">
        {[
          ['Buy 1.2 BTC', '67,350.00', 'text-emerald-400'],
          ['Buy 0.8 BTC', '67,330.00', 'text-emerald-400'],
          ['Sell 1.0 BTC', '67,470.00', 'text-rose-400'],
        ].map(([label, value, tone]) => (
          <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
            <span className="text-slate-200">{label}</span>
            <span className={tone}>{value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
