const BAR_HEIGHTS = [30, 45, 35, 60, 50, 75, 80];
const WEEK_LABELS = ['W1','W2','W3','W4','W5','W6','W7'];

export default function Home({ onViewAll, onOpenModal }) {
  return (
    <div className="px-5 pt-6 space-y-5 stagger page-enter">

      {/* ── Hero earnings card ── */}
      <section className="relative overflow-hidden rounded-3xl p-6 border border-white/5" style={{ background: 'linear-gradient(135deg,#161E2E 0%,#111827 100%)' }}>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full" style={{ background: 'rgba(251,146,60,0.08)', filter: 'blur(40px)' }} />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full" style={{ background: 'rgba(45,212,191,0.05)', filter: 'blur(40px)' }} />
        <div className="relative z-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-2">Week Earnings</div>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="font-headline text-5xl font-black text-orange-400 tracking-tight">$440</span>
            <span className="font-headline text-2xl font-semibold text-orange-400/60">.86</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-5">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>↑ 214% vs last week</span>
          </div>
          <div className="flex items-end gap-1 h-12">
            {BAR_HEIGHTS.map((h, i) => (
              <div key={i} className="flex-1 bar-top bg-white/5 hover:bg-orange-400/20 transition-colors" style={{ height: `${h}%` }} />
            ))}
            <div className="flex-1 bar-top bg-orange-400" style={{ height: '100%', boxShadow: '0 0 8px rgba(251,146,60,0.5)' }} />
          </div>
          <div className="flex justify-between mt-1">
            {WEEK_LABELS.map(w => <span key={w} className="text-[9px] text-slate-600 font-mono">{w}</span>)}
            <span className="text-[9px] text-orange-400 font-mono font-semibold">NOW</span>
          </div>
        </div>
      </section>

      {/* ── Bento stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: 'inventory_2',           color: 'text-orange-400', bg: 'bg-orange-400/10', val: '4',  label: 'Containers' },
          { icon: 'account_balance_wallet', color: 'text-teal-400',   bg: 'bg-teal-400/10',   val: '$154',label: 'Tax Saved' },
          { icon: 'hub',                   color: 'text-blue-400',   bg: 'bg-blue-400/10',   val: '20', label: 'Companies' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 border border-white/5 flex flex-col gap-3" style={{ background: '#161E2E' }}>
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined ${s.color} text-lg`}>{s.icon}</span>
            </div>
            <div>
              <div className={`font-headline text-2xl font-bold ${s.color}`}>{s.val}</div>
              <div className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent jobs ── */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-headline text-lg font-bold">Recent Jobs</h2>
          <button className="text-xs text-orange-400 font-semibold" onClick={onViewAll}>View All →</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all" style={{ background: '#161E2E' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center text-xl">🧊</div>
              <div>
                <div className="text-sm font-semibold text-slate-200">TAS Refrigerated</div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  <span className="tag tag-teal">Heavy</span>
                  <span className="tag tag-teal">Interlock</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-semibold text-emerald-400">$140.00</div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Apr 1</div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all" style={{ background: '#161E2E' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center text-xl">🥬</div>
              <div>
                <div className="text-sm font-semibold text-slate-200">Fresh Taste Produce</div>
                <div className="flex gap-1 mt-1">
                  <span className="tag tag-orange">1.5× Multiplier</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-semibold text-emerald-400">$187.53</div>
              <div className="text-[9px] text-slate-600 uppercase tracking-wider">Apr 11</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick insights ── */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 border border-white/5" style={{ background: 'linear-gradient(135deg,rgba(251,146,60,0.08),transparent)' }}>
          <div className="text-xs font-semibold text-slate-400 mb-1">Mileage Split</div>
          <div className="font-headline text-2xl font-bold text-orange-400">30%</div>
          <div className="text-xs text-slate-500 mt-1">210 of 700 km business</div>
        </div>
        <div className="rounded-2xl p-4 border border-white/5" style={{ background: '#161E2E' }}>
          <div className="text-xs font-semibold text-slate-400 mb-1">Tax Alert</div>
          <div className="font-headline text-2xl font-bold text-emerald-400">$286</div>
          <div className="text-xs text-slate-500 mt-1">Take-home after set-aside</div>
        </div>
      </div>

      {/* ── September banner ── */}
      <div className="rounded-2xl p-4 border flex items-center gap-3" style={{ background: 'rgba(167,139,250,0.06)', borderColor: 'rgba(167,139,250,0.2)' }}>
        <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center text-xl flex-shrink-0">📌</div>
        <div>
          <div className="text-sm font-semibold text-purple-300">September Pipeline Active</div>
          <div className="text-xs text-slate-500 mt-0.5">2 companies saved for full availability in Sep 2026</div>
        </div>
      </div>

    </div>
  );
}
