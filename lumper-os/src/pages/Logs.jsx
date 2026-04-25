function fmt(n) { return Number(n).toFixed(2); }

function getTagsForJob(job) {
  const tags = [];
  if (job.multiplier) tags.push(['tag-orange', `${job.multiplier} Multiplier`]);
  if (job.additives?.includes('Same Day')) tags.push(['tag-blue', 'Same Day Booking']);
  job.additives?.filter(a => a !== 'Same Day').forEach(a => tags.push(['tag-teal', a]));
  return tags;
}

export default function Logs({ jobs = [], onOpenModal }) {
  const totalPay = jobs.reduce((s, j) => s + j.basePay, 0);
  const totalPieces = jobs.reduce((s, j) => s + (j.pieces || 0), 0);

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
        {[
          { val: `$${fmt(totalPay)}`,          label: 'Total Pay',  color: 'text-orange-400' },
          { val: `${jobs.length}`,              label: 'Jobs',       color: 'text-teal-400' },
          { val: totalPieces.toLocaleString(),  label: 'Pieces',     color: 'text-blue-400' },
          { val: '$0',                          label: 'HST',        color: 'text-slate-400' },
        ].map((s, i, arr) => (
          <div key={s.label} className="flex items-center">
            <div className="text-center px-1">
              <div className={`font-mono text-lg font-bold ${s.color}`}>{s.val}</div>
              <div className="text-[9px] uppercase tracking-wider text-slate-500 mt-0.5">{s.label}</div>
            </div>
            {i < arr.length - 1 && <div className="w-px h-8 bg-white/5 ml-1" />}
          </div>
        ))}
      </div>

      {/* Job cards */}
      {jobs.length === 0 ? (
        <div className="rounded-2xl p-8 border border-white/5 text-center text-slate-500 text-sm" style={{ background: '#161E2E' }}>
          No jobs yet — tap + to log your first one
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => {
            const tags = getTagsForJob(job);
            const highlight = !!job.multiplier;
            return (
              <div
                key={job.id}
                className={`rounded-2xl p-4 border ${highlight ? 'border-orange-400/20' : 'border-white/5'}`}
                style={{ background: highlight ? 'rgba(251,146,60,0.05)' : '#161E2E' }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="text-sm font-bold text-slate-200 truncate">{job.company}</div>
                    <div className="font-mono text-xs text-slate-500 mt-0.5">
                      {[job.containerId, job.pieces && `${job.pieces} pcs`].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-mono font-bold text-emerald-400">${fmt(job.basePay)}</div>
                    <div className={`text-[9px] ${highlight ? 'text-orange-400 font-semibold' : 'text-slate-600'}`}>
                      {highlight ? `${job.multiplier} · ` : ''}
                      {new Date(job.date + 'T00:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map(([cls, label]) => (
                      <span key={label} className={`tag ${cls}`}>{label}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
