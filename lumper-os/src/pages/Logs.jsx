const JOBS = [
  {
    name: 'TAS Refrigerated Distribution',
    sub: 'ZCLU9930419 · 318 pcs · 12 SKUs',
    pay: '$140.00', date: 'Apr 1, 2026',
    tags: [['tag-teal','Heavy'],['tag-teal','Interlock'],['tag-teal','Labels Out'],['tag-teal','Mixed']],
    highlight: false,
  },
  {
    name: 'TAS Refrigerated Distribution',
    sub: 'KKFU6751964 · Half 3 Ways',
    pay: '$38.33', date: 'Apr 6, 2026',
    tags: [['tag-blue','Same Day Booking']],
    highlight: false,
  },
  {
    name: 'TAS Refrigerated Distribution',
    sub: 'FSCU5734460 · 1800 pcs',
    pay: '$75.00', date: 'Apr 6, 2026',
    tags: [['tag-blue','Same Day Booking'],['tag-teal','Interlock']],
    highlight: false,
  },
  {
    name: 'Fresh Taste Produce',
    sub: 'GINGER · 1584 pcs · 11450 Steeles',
    pay: '$187.53', date: '1.5× · Apr 11',
    dateHighlight: true,
    tags: [['tag-orange','1.5× Multiplier'],['tag-blue','Same Day Booking']],
    highlight: true,
  },
];

const SUMMARY = [
  { val: '$440.86', label: 'Total Pay', color: 'text-orange-400' },
  { val: '4',       label: 'Jobs',      color: 'text-teal-400' },
  { val: '3,702',   label: 'Pieces',    color: 'text-blue-400' },
  { val: '$0',      label: 'HST',       color: 'text-slate-400' },
];

export default function Logs({ onOpenModal }) {
  return (
    <div className="px-5 pt-6 space-y-4 stagger page-enter">

      <div className="flex justify-between items-center">
        <h2 className="font-headline text-2xl font-bold">Job Log</h2>
        <button
          onClick={onOpenModal}
          className="flex items-center gap-1 bg-orange-400 text-black text-xs font-bold px-4 py-2 rounded-full"
          style={{ boxShadow: '0 0 16px rgba(251,146,60,0.3)' }}
        >
          <span className="material-symbols-outlined text-sm">add</span> Log Job
        </button>
      </div>

      {/* Pay period summary */}
      <div className="rounded-2xl p-4 border border-white/5 flex justify-between" style={{ background: '#161E2E' }}>
        {SUMMARY.map((s, i) => (
          <div key={s.label} className="flex items-center gap-0">
            <div className="text-center px-2">
              <div className={`font-mono text-lg font-bold ${s.color}`}>{s.val}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-500 mt-0.5">{s.label}</div>
            </div>
            {i < SUMMARY.length - 1 && <div className="w-px h-8 bg-white/5" />}
          </div>
        ))}
      </div>

      {/* Job cards */}
      <div className="space-y-3">
        {JOBS.map((job, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 border ${job.highlight ? 'border-orange-400/20' : 'border-white/5'}`}
            style={{ background: job.highlight ? 'rgba(251,146,60,0.05)' : '#161E2E' }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-bold text-slate-200">{job.name}</div>
                <div className="font-mono text-xs text-slate-500 mt-0.5">{job.sub}</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-emerald-400">{job.pay}</div>
                <div className={`text-[9px] ${job.dateHighlight ? 'text-orange-400 font-semibold' : 'text-slate-600'}`}>{job.date}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {job.tags.map(([cls, label]) => (
                <span key={label} className={`tag ${cls}`}>{label}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
