"use client";

import { Activity, Bitcoin, ShieldCheck, TrendingUp } from 'lucide-react';
import { MarketTicker } from "../components/trading/MarketTicker";
import { OrderBook } from "../components/trading/OrderBook";
import { PortfolioSummary } from "../components/trading/PortfolioSummary";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#111827_0%,_#020617_55%,_#020617_100%)] p-6 text-slate-100">
      <section className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-glow">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">AtlasTrade</p>
              <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Real-time trading command center</h1>
              <p className="mt-3 max-w-2xl text-slate-300">This scaffold separates the UI shell from the live WebSocket backend, giving you a clean base for crypto and stock trading workflows.</p>
            </div>
            <div className="flex gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-2">Live feed</span>
              <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-2">Dark mode default</span>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <PortfolioSummary />
            <MarketTicker />
          </div>
          <div className="space-y-6">
            <OrderBook />
            
            <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-glow">
              <div className="flex items-center gap-3 text-cyan-300">
                <ShieldCheck className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Security & risk notes</h2>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Store portfolios and orders in server-authoritative state with signed requests.</li>
                <li>• Use WebSocket auth and heartbeat checks to keep the live stream low-latency.</li>
                <li>• Keep chart data, user positions, and watchlists isolated in modular routes.</li>
              </ul>
            </article>
            <article className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-glow">
              <div className="flex items-center gap-3 text-cyan-300">
                <TrendingUp className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Extending this scaffold</h2>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Add user auth and personalized watchlists.</li>
                <li>• Integrate with trading APIs to place orders.</li>
                <li>• Build custom charting components with WebSocket data.</li>
              </ul>
            </article>
          </div>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          
        </section>
      </section>
    </main>
  );
}
