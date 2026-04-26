import { useState } from 'react';

function fmt(n) { return Number(n).toFixed(2); }

const STATUS_STYLE = {
  paid:    { bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.2)',  color: '#4ade80', label: '✓ Paid' },
  pending: { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.2)',  color: '#fde047', label: '⏳ Pending' },
};

function Row({ icon, label, value, mono }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5">
      <span className="material-symbols-outlined text-slate-500 text-lg mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">{label}</div>
        <div className={`text-sm font-semibold text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</div>
      </div>
    </div>
  );
}

export default function JobDetailModal({ job, onClose, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!job) return null;

  const status = STATUS_STYLE[job.status] ?? STATUS_STYLE.pending;

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    onDelete(job.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) { setConfirmDelete(false); onClose(); } }}
    >
      <div className="modal-sheet">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />

        {/* Header */}
        <div className="mb-4">
          <div className="font-headline text-xl font-bold text-slate-100 mb-2">{job.company}</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full border"
              style={{ background: status.bg, borderColor: status.border, color: status.color }}>
              {status.label}
            </span>
            {job.multiplier && (
              <span className="tag tag-orange">{job.multiplier} Multiplier</span>
            )}
          </div>
        </div>

        {/* Pay hero */}
        <div className="rounded-2xl p-4 mb-4 border border-white/5" style={{ background: 'rgba(74,222,128,0.06)' }}>
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Base Pay</div>
          <div className="font-headline text-4xl font-black text-emerald-400">${fmt(job.basePay)}</div>
        </div>

        {/* Detail rows */}
        <div className="mb-4">
          <Row icon="calendar_today"     label="Date"         value={job.date ? new Date(job.date + 'T00:00:00').toLocaleDateString('en-CA', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }) : null} />
          <Row icon="inventory_2"        label="Container ID" value={job.containerId} mono />
          <Row icon="location_on"        label="Address"      value={job.address} />
          <Row icon="numbers"            label="Pieces"       value={job.pieces ? job.pieces.toLocaleString() : null} />
        </div>

        {/* Additives */}
        {job.additives?.length > 0 && (
          <div className="mb-5">
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Additives</div>
            <div className="flex flex-wrap gap-1.5">
              {job.additives.map(a => (
                <span key={a} className="tag tag-teal">{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={handleDelete}
            className="py-3 rounded-xl border font-bold text-sm transition-all"
            style={confirmDelete
              ? { background: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.4)', color: '#f87171' }
              : { background: 'transparent', borderColor: 'rgba(239,68,68,0.2)', color: '#f87171' }
            }
          >
            {confirmDelete ? 'Confirm Delete' : '🗑 Delete Job'}
          </button>
          <button
            onClick={() => { setConfirmDelete(false); onClose(); }}
            className="py-3 rounded-xl font-bold text-sm text-black"
            style={{ background: 'linear-gradient(135deg,#FB923C,#F97316)' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
