const STATIC_DEDUCTIONS = [
  { icon: '🚗', label: 'Vehicle Deduction (30%)', color: 'text-teal-400',   barColor: 'bg-teal-400',   pct: 30, fixed: null },
  { icon: '🥾', label: 'Safety Gear / PPE',       color: 'text-blue-400',   barColor: 'bg-blue-400',   pct: 8,  fixed: 35.00 },
  { icon: '⛽', label: 'Gas (Business %)',         color: 'text-emerald-400',barColor: 'bg-emerald-400',pct: 12, fixed: 12.40 },
];

const NOA_YEARS = [
  { year: '2024', color: 'text-blue-400',    barColor: 'bg-blue-400/30',  width: '100%', label: 'NOA Year 1' },
  { year: '2025', color: 'text-blue-400',    barColor: 'bg-blue-400/30',  width: '100%', label: 'NOA Year 2' },
  { year: '2026', color: 'text-emerald-400', barColor: 'bg-emerald-400',  width: '35%',  label: 'Active ▶' },
];

function fmt(n) { return Number(n).toFixed(2); }

export default function Tax({ jobs = [] }) {
  const gross    = jobs.reduce((s, j) => s + j.basePay, 0);
  const taxSet   = gross * 0.35;
  const takeHome = gross * 0.65;

  const deductions = [
    { icon: '🏦', label: 'Tax Set-Aside (35%)', val: `$${fmt(taxSet)}`,    color: 'text-orange-400', barColor: 'bg-orange-400', pct: 35 },
    ...STATIC_DEDUCTIONS.map(d => ({ ...d, val: `$${fmt(d.fixed ?? gross * 0.04)}` })),
  ];

  return (
    <div className="px-5 pt-6 space-y-4 stagger page-enter">

      <div className="flex justify-between items-center">
        <h2 className="font-headline text-2xl font-bold">Tax & Savings</h2>
        <div className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-slate-400">Week View</div>
      </div>

      {/* Net take-home hero */}
      <div className="rounded-3xl p-6 border border-white/5" style={{ background: 'linear-gradient(135deg,rgba(74,222,128,0.08),transparent)' }}>
        <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
          Net Take-Home (After 35% Set-Aside)
        </div>
        <div className="font-headline text-5xl font-black text-emerald-400 tracking-tight">
          ${Math.floor(takeHome)}<span className="text-2xl text-emerald-400/50">.{fmt(takeHome).split('.')[1]}</span>
        </div>
        <div className="text-xs text-slate-500 mt-2">From ${fmt(gross)} gross · {jobs.length} job{jobs.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Breakdown cards */}
      <div className="space-y-3">
        {deductions.map(d => (
          <div key={d.label} className="rounded-2xl p-4 border border-white/5" style={{ background: '#161E2E' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">{d.icon}</div>
                <div className="text-sm font-semibold text-slate-200">{d.label}</div>
              </div>
              <div className={`font-mono font-bold ${d.color}`}>{d.val}</div>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full ${d.barColor} rounded-full`} style={{ width: `${d.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Mortgage readiness */}
      <div className="rounded-2xl p-4 border" style={{ background: 'rgba(96,165,250,0.05)', borderColor: 'rgba(96,165,250,0.15)' }}>
        <div className="text-xs font-semibold text-blue-400 mb-1">🏠 Mortgage Readiness</div>
        <div className="text-xs text-slate-400 leading-relaxed">
          Two clean NOAs needed. Keep tax set-aside consistent and avoid aggressive write-offs for the next 24 months.
          Discipline now = home for your family later.
        </div>
        <div className="mt-3 flex gap-2">
          {NOA_YEARS.map(y => (
            <div key={y.year} className="flex-1 text-center">
              <div className={`font-mono text-sm font-bold ${y.color}`}>{y.year}</div>
              <div className="h-1 bg-white/5 rounded-full mt-1">
                <div className={`h-full ${y.barColor} rounded-full`} style={{ width: y.width }} />
              </div>
              <div className="text-[9px] text-slate-600 mt-1">{y.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
