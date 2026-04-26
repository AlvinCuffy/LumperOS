import { useState, useRef, useEffect } from 'react';

function fmt(n) { return Number(n).toFixed(2); }

function getTagsForJob(job) {
  const tags = [];
  if (job.multiplier) tags.push(['tag-orange', `${job.multiplier} Multiplier`]);
  if (job.additives?.includes('Same Day')) tags.push(['tag-blue', 'Same Day Booking']);
  job.additives?.filter(a => a !== 'Same Day').forEach(a => tags.push(['tag-teal', a]));
  return tags;
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function PayStubModal({ open, onClose, result, jobs, onConfirm }) {
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (!result?.matched) return;
    const map = {};
    result.matched.forEach(id => { map[id] = true; });
    setSelected(map);
  }, [result]);

  if (!open || !result) return null;

  const toggleId = (id) => setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  const selectedIds = Object.keys(selected).filter(k => selected[k]).map(Number);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-sheet">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
        <div className="font-headline text-xl font-bold mb-1">Pay Stub Parsed</div>
        {result.payPeriod && (
          <div className="text-xs text-slate-400 mb-4">{result.payPeriod} · Total: ${fmt(result.totalGross ?? 0)}</div>
        )}

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Select jobs to mark as paid
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar mb-4">
          {result.matched?.length > 0 ? result.matched.map(id => {
            const job = jobs.find(j => j.id === id);
            if (!job) return null;
            const on = !!selected[id];
            return (
              <div
                key={id}
                onClick={() => toggleId(id)}
                className={`rounded-xl p-3 border cursor-pointer transition-all ${on ? 'border-emerald-400/40 bg-emerald-400/5' : 'border-white/5'}`}
                style={{ background: on ? undefined : '#161E2E' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{job.company}</div>
                    <div className="text-xs font-mono text-slate-500">{job.containerId} · {job.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">${fmt(job.basePay)}</span>
                    <span className={`material-symbols-outlined text-lg ${on ? 'text-emerald-400' : 'text-slate-600'}`}>
                      {on ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-sm text-slate-500 text-center py-4">
              No matching pending jobs found.
              {result.jobs?.length > 0 && (
                <div className="mt-1 text-xs">AI found {result.jobs.length} line item(s) but no container IDs matched.</div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-3 rounded-xl border border-white/10 text-slate-400 font-semibold text-sm">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(selectedIds); onClose(); }}
            disabled={selectedIds.length === 0}
            className="py-3 rounded-xl text-black font-bold text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#4ade80,#22c55e)', boxShadow: '0 0 20px rgba(74,222,128,0.25)' }}
          >
            ✓ Mark {selectedIds.length} Paid
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Logs({ jobs = [], onOpenModal, onMarkPaid }) {
  const totalPay     = jobs.reduce((s, j) => s + j.basePay, 0);
  const totalPieces  = jobs.reduce((s, j) => s + (j.pieces || 0), 0);
  const pendingCount = jobs.filter(j => j.status !== 'paid').length;

  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [stubResult, setStubResult] = useState(null);
  const [stubOpen, setStubOpen] = useState(false);
  const fileRef = useRef(null);

  const handleStubFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError('');
    setParsing(true);
    try {
      const fileBase64 = await toBase64(file);
      const res = await fetch('/api/parse-paystub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64, mediaType: file.type }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      // Match parsed jobs to pending jobs by containerId or company name
      const pending = jobs.filter(j => j.status !== 'paid');
      const matchedIds = [];
      if (Array.isArray(data.jobs) && data.jobs.length > 0) {
        data.jobs.forEach(pj => {
          const found = pending.find(j =>
            (pj.containerId && j.containerId?.toLowerCase() === pj.containerId?.toLowerCase()) ||
            (pj.company && j.company?.toLowerCase().includes(pj.company?.toLowerCase().slice(0, 8)))
          );
          if (found && !matchedIds.includes(found.id)) matchedIds.push(found.id);
        });
      }
      // Fall back: suggest all pending jobs if nothing matched
      if (matchedIds.length === 0 && pending.length > 0) {
        pending.forEach(j => matchedIds.push(j.id));
      }

      setStubResult({ ...data, matched: matchedIds });
      setStubOpen(true);
    } catch (err) {
      setParseError('Could not parse pay stub — try again.');
      console.error(err);
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

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

      {/* Pay stub upload */}
      <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleStubFile} />
      <button
        onClick={() => fileRef.current?.click()}
        disabled={parsing}
        className="w-full py-3 rounded-xl border border-dashed border-emerald-400/30 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-400 disabled:opacity-50 active:bg-emerald-400/5 transition-colors"
        style={{ background: 'rgba(74,222,128,0.03)' }}
      >
        {parsing ? (
          <>
            <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
            Parsing Pay Stub…
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-lg">receipt_long</span>
            Upload Pay Stub to Mark Paid
            {pendingCount > 0 && <span className="ml-1 bg-orange-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          </>
        )}
      </button>

      {parseError && (
        <div className="text-xs text-red-400 bg-red-400/10 rounded-xl px-3 py-2">{parseError}</div>
      )}

      {/* Summary stats */}
      <div className="rounded-2xl p-4 border border-white/5 flex justify-between" style={{ background: '#161E2E' }}>
        {[
          { val: `$${fmt(totalPay)}`,         label: 'Total Pay', color: 'text-orange-400' },
          { val: `${jobs.length}`,             label: 'Jobs',      color: 'text-teal-400' },
          { val: totalPieces.toLocaleString(), label: 'Pieces',    color: 'text-blue-400' },
          { val: `${pendingCount}`,            label: 'Pending',   color: pendingCount > 0 ? 'text-yellow-400' : 'text-slate-400' },
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
            const isPending = job.status !== 'paid';
            return (
              <div
                key={job.id}
                className={`rounded-2xl p-4 border ${highlight ? 'border-orange-400/20' : isPending ? 'border-yellow-400/15' : 'border-white/5'}`}
                style={{ background: highlight ? 'rgba(251,146,60,0.05)' : isPending ? 'rgba(250,204,21,0.03)' : '#161E2E' }}
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
                <div className="flex flex-wrap gap-1">
                  {isPending ? (
                    <span className="tag" style={{ background: 'rgba(250,204,21,0.12)', color: '#fde047', border: '1px solid rgba(250,204,21,0.2)' }}>⏳ Pending</span>
                  ) : (
                    <span className="tag" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>✓ Paid</span>
                  )}
                  {tags.map(([cls, label]) => (
                    <span key={label} className={`tag ${cls}`}>{label}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PayStubModal
        open={stubOpen}
        onClose={() => setStubOpen(false)}
        result={stubResult}
        jobs={jobs}
        onConfirm={onMarkPaid}
      />
    </div>
  );
}
