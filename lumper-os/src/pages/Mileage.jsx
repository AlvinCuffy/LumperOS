const TRIPS = [
  { route: 'Home → 18 Abacus Rd',       sub: 'Apr 1 · TAS Refrigerated',    km: '32 km' },
  { route: 'Home → 11450 Steeles Ave',   sub: 'Apr 11 · Fresh Taste Produce', km: '28 km' },
];

export default function Mileage() {
  return (
    <div className="px-5 pt-6 space-y-4 stagger page-enter">

      <div className="flex justify-between items-center">
        <h2 className="font-headline text-2xl font-bold">Mileage Tracker</h2>
        <button className="flex items-center gap-1 bg-teal-400 text-black text-xs font-bold px-4 py-2 rounded-full">
          <span className="material-symbols-outlined text-sm">add</span> Log Trip
        </button>
      </div>

      {/* Ring + stats */}
      <div className="rounded-3xl p-6 border border-white/5" style={{ background: '#161E2E' }}>
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="44" fill="none" stroke="#1A2436" strokeWidth="10" />
              <circle cx="55" cy="55" r="44" fill="none" stroke="#FB923C" strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="276.5"
                strokeDashoffset="193.6"
                transform="rotate(-90 55 55)"
                style={{ filter: 'drop-shadow(0 0 6px rgba(251,146,60,0.5))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-headline text-2xl font-bold text-orange-400">30%</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">Business</div>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {[
              { label: 'Work Kilometers', val: '210 km', color: 'text-orange-400', bar: 'bg-orange-400', pct: '30%' },
              { label: 'Total Kilometers', val: '700 km', color: 'text-slate-300', bar: 'bg-slate-600', pct: '100%' },
            ].map(row => (
              <div key={row.label}>
                <div className="text-xs text-slate-500 mb-1">{row.label}</div>
                <div className={`font-mono text-xl font-bold ${row.color}`}>{row.val}</div>
                <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full ${row.bar} rounded-full`} style={{ width: row.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
          {[
            { val: '$0.73',   color: 'text-orange-400', label: 'Rate/km' },
            { val: '$153.30', color: 'text-teal-400',   label: 'Deductible' },
            { val: '30%',     color: 'text-blue-400',   label: 'Vehicle %' },
          ].map(s => (
            <div key={s.label}>
              <div className={`font-mono text-sm font-semibold ${s.color}`}>{s.val}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CRA rule */}
      <div className="rounded-2xl p-4 border" style={{ background: 'rgba(45,212,191,0.05)', borderColor: 'rgba(45,212,191,0.15)' }}>
        <div className="text-xs font-semibold text-teal-400 mb-1">CRA Rule — How Trips Are Counted</div>
        <div className="text-xs text-slate-400 leading-relaxed">
          Count the full round trip: Home → Job Site → Home. If you go Site A → Site B → Home, count both legs.
          This % is applied to your vehicle costs (gas, insurance, maintenance) as your business deduction.
        </div>
      </div>

      {/* Recent trips */}
      <div>
        <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider mb-3">Recent Trips</h3>
        <div className="space-y-2">
          {TRIPS.map((trip, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5" style={{ background: '#161E2E' }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-teal-400 text-lg">route</span>
                <div>
                  <div className="text-sm font-medium text-slate-200">{trip.route}</div>
                  <div className="text-xs text-slate-500">{trip.sub}</div>
                </div>
              </div>
              <div className="font-mono text-sm text-teal-400">{trip.km}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
