import { useState } from 'react';
import { PIPE_COMPANIES } from '../data.js';

const FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'overnight', label: '🌙 Overnight' },
  { id: 'weekend',   label: '📅 Weekend' },
  { id: 'september', label: '📌 September' },
  { id: 'active',    label: '✅ Active' },
];

const SUMMARY = [
  { val: '1',  color: 'text-orange-400', label: 'Active' },
  { val: '4',  color: 'text-blue-400',   label: 'Texted' },
  { val: '2',  color: 'text-purple-400', label: 'Sep 2026' },
  { val: '13', color: 'text-slate-400',  label: 'Pending' },
];

export default function Pipeline({ onOpenProfile }) {
  const [filter, setFilter] = useState('all');

  const visible = PIPE_COMPANIES.filter(c =>
    filter === 'all' || c.filter.includes(filter)
  );

  return (
    <div className="px-5 pt-6 space-y-4 stagger page-enter">

      <div className="flex justify-between items-center">
        <h2 className="font-headline text-2xl font-bold">Company Pipeline</h2>
        <div className="font-mono text-xs text-slate-500">20 companies</div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-2">
        {SUMMARY.map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: '#161E2E' }}>
            <div className={`font-mono font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`filter-pill flex-shrink-0 ${filter === f.id ? 'active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Company list */}
      <div className="space-y-2">
        {visible.map((co, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 border border-white/5 transition-all ${co.key ? 'cursor-pointer hover:border-white/10' : ''}`}
            style={{ background: '#161E2E' }}
            onClick={() => co.key && onOpenProfile(co.key)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full ${co.dot} flex-shrink-0 mt-1.5`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-200">{co.name}</div>
                <div className="font-mono text-xs text-slate-500 mt-0.5">{co.contact}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {co.tags.map(([cls, label]) => (
                    <span key={label} className={`tag ${cls}`}>{label}</span>
                  ))}
                </div>
                {co.note && <div className="text-xs text-slate-600 mt-1.5">{co.note}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
