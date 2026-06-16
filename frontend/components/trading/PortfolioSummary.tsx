export function PortfolioSummary() {
  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-glow">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Portfolio</p>
          <h2 className="mt-2 text-xl font-semibold text-white">$241,780.12</h2>
          <p className="mt-1 text-sm text-emerald-400">+3.8% today</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">Risk: Moderate</div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ['Equity', '$178,900'],
          ['Cash', '$42,300'],
          ['Open PnL', '$20,580'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">{value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
