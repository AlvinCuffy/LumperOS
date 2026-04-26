import { COMPANY_DATA } from '../data.js';

const STATUS_COLORS = {
  active:  'text-orange-400 bg-orange-400/10 border-orange-400/20',
  sep:     'text-purple-400 bg-purple-400/10 border-purple-400/20',
  sent:    'text-blue-400  bg-blue-400/10  border-blue-400/20',
  replied: 'text-green-400 bg-green-400/10 border-green-400/20',
};

const DOT_STYLE = {
  active:  { background: '#FB923C', boxShadow: '0 0 6px #FB923C' },
  sep:     { background: '#A78BFA', boxShadow: '0 0 6px #A78BFA' },
  sent:    { background: '#60A5FA', boxShadow: '0 0 6px #60A5FA' },
  replied: { background: '#4ADE80', boxShadow: '0 0 6px #4ADE80' },
};

export default function CompanyProfile({ profileKey, onClose }) {
  const co = COMPANY_DATA[profileKey];
  if (!co) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-sheet" style={{ maxHeight: '92vh' }}>

        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="flex items-center gap-1.5 text-slate-400 text-sm font-semibold">
            <span className="material-symbols-outlined text-lg">arrow_back</span> Pipeline
          </button>
          <div className="w-10 h-1 bg-white/10 rounded-full" />
          <button className="text-slate-500">
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
        </div>

        {/* Header card */}
        <section className="rounded-2xl p-5 border border-white/5 mb-4" style={{ background: '#161E2E', borderLeft: '3px solid #FB923C' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_COLORS[co.status]}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={DOT_STYLE[co.status]} />
              {co.statusLabel}
            </span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-white tracking-tight mb-4">{co.name}</h2>
          <div className="flex gap-2 flex-wrap">
            <a href={`tel:${co.phone}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-black text-xs font-bold uppercase tracking-wider" style={{ background: 'linear-gradient(135deg,#FB923C,#F97316)' }}>
              <span className="material-symbols-outlined text-sm">call</span>Call
            </a>
            <a href={`sms:${co.phone}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-wider border border-white/10" style={{ background: '#1A2436' }}>
              <span className="material-symbols-outlined text-sm">message</span>Text
            </a>
            <a href={`mailto:${co.email}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-300 text-xs font-bold uppercase tracking-wider border border-white/10" style={{ background: '#1A2436' }}>
              <span className="material-symbols-outlined text-sm">mail</span>Email
            </a>
          </div>
        </section>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { val: co.jobsDone,   color: 'text-orange-400', label: 'Jobs Done' },
            { val: co.avgPay,     color: 'text-teal-400',   label: 'Avg Pay' },
            { val: co.reliability,color: 'text-blue-400',   label: 'Reliability' },
          ].map(m => (
            <div key={m.label} className="rounded-xl p-3 border border-white/5 text-center" style={{ background: '#161E2E' }}>
              <div className={`font-mono text-xl font-bold ${m.color}`}>{m.val}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Contact details */}
        <div className="rounded-2xl p-4 border border-white/5 mb-4 space-y-3" style={{ background: '#161E2E' }}>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Contact</div>
          {[
            { icon: 'phone_iphone', label: 'Phone',        val: co.phone,        teal: false },
            { icon: 'mail',         label: 'Email',        val: co.email,        teal: false },
            { icon: 'location_on',  label: 'Location',     val: co.address,      teal: false },
            { icon: 'schedule',     label: 'Availability', val: co.availability, teal: true },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-3">
              <span className={`material-symbols-outlined ${row.teal ? 'text-teal-400' : 'text-orange-400'} text-lg`}>{row.icon}</span>
              <div>
                <div className="text-[9px] text-slate-600 uppercase tracking-wider">{row.label}</div>
                <div className="text-sm font-semibold text-slate-200">{row.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="rounded-2xl p-4 border mb-4" style={{ background: 'rgba(251,146,60,0.05)', borderColor: 'rgba(251,146,60,0.15)' }}>
          <div className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">📋 Notes</div>
          <div className="text-sm text-slate-300 leading-relaxed">{co.notes}</div>
        </div>

        {/* Activity log */}
        <div className="mb-2">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Activity Log</div>
          <div className="space-y-2">
            {co.activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-white/5" style={{ background: '#161E2E' }}>
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <span className={`material-symbols-outlined text-lg ${a.color}`}>{a.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-200 truncate">{a.label}</div>
                  <div className="text-xs text-slate-500 truncate">{a.sub}</div>
                </div>
                <div className="text-xs font-mono text-slate-600 flex-shrink-0">{a.date}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
