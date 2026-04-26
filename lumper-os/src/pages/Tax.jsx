import { useState, useEffect, useRef } from 'react';
import { saveStub, listStubs, deleteStub, viewStub } from '../utils/stubStore.js';

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

function fmtBytes(b) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Tax({ jobs = [] }) {
  const gross    = jobs.reduce((s, j) => s + j.basePay, 0);
  const taxSet   = gross * 0.35;
  const takeHome = gross * 0.65;

  const deductions = [
    { icon: '🏦', label: 'Tax Set-Aside (35%)', val: `$${fmt(taxSet)}`,    color: 'text-orange-400', barColor: 'bg-orange-400', pct: 35 },
    ...STATIC_DEDUCTIONS.map(d => ({ ...d, val: `$${fmt(d.fixed ?? gross * 0.04)}` })),
  ];

  const [stubs, setStubs]       = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    listStubs().then(setStubs).catch(() => {});
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await saveStub(file);
      setStubs(await listStubs());
    } catch (err) {
      console.error('Save stub failed:', err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    await deleteStub(id);
    setStubs(await listStubs());
  };

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

      {/* Pay Stub Vault */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-headline text-lg font-bold">Pay Stub Vault</h3>
            <div className="text-xs text-slate-500 mt-0.5">{stubs.length} document{stubs.length !== 1 ? 's' : ''} stored on device</div>
          </div>
          <input ref={fileRef} type="file" accept="application/pdf,image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#FB923C,#F97316)', color: '#000' }}
          >
            {uploading ? (
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-sm">upload_file</span>
            )}
            {uploading ? 'Saving…' : 'Upload'}
          </button>
        </div>

        {stubs.length === 0 ? (
          <div className="rounded-2xl p-6 border border-white/5 text-center" style={{ background: '#161E2E' }}>
            <span className="material-symbols-outlined text-3xl text-slate-600 block mb-2">folder_open</span>
            <div className="text-sm text-slate-500">No pay stubs yet</div>
            <div className="text-xs text-slate-600 mt-1">Upload PDFs here to build your tax record</div>
          </div>
        ) : (
          <div className="space-y-2">
            {stubs.map(stub => (
              <div key={stub.id} className="rounded-2xl p-4 border border-white/5 flex items-center gap-3" style={{ background: '#161E2E' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(251,146,60,0.1)' }}>
                  <span className="material-symbols-outlined text-orange-400 text-xl">description</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-200 truncate">{stub.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{fmtDate(stub.saved)} · {fmtBytes(stub.size)}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => viewStub(stub)}
                    className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center active:bg-white/10"
                  >
                    <span className="material-symbols-outlined text-slate-400 text-base">open_in_new</span>
                  </button>
                  <button
                    onClick={() => handleDelete(stub.id)}
                    className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center active:bg-red-400/10"
                  >
                    <span className="material-symbols-outlined text-slate-600 text-base">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
