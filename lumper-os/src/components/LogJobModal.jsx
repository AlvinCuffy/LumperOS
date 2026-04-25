import { useState } from 'react';

const ADDITIVES = ['Heavy', 'Mixed', 'Interlock', 'High-Cube', 'Tipped', 'Same Day', 'Holiday', 'Labels Out'];

export default function LogJobModal({ open, onClose }) {
  const [active, setActive] = useState({});

  if (!open) return null;

  const toggle = name => setActive(prev => ({ ...prev, [name]: !prev[name] }));

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-sheet">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
        <div className="font-headline text-xl font-bold mb-1">Log a Container Job</div>
        <div className="text-sm text-slate-500 mb-5">Record job details, additives, and location for mileage tracking.</div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Date</label>
              <input type="date" className="form-input" defaultValue="2026-04-13" />
            </div>
            <div>
              <label className="form-label">Company</label>
              <input type="text" className="form-input" placeholder="e.g. TAS Refrigerated" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Container ID</label>
              <input type="text" className="form-input" placeholder="e.g. ZCLU9930419" style={{ fontFamily: 'JetBrains Mono' }} />
            </div>
            <div>
              <label className="form-label">Pieces</label>
              <input type="number" className="form-input" placeholder="e.g. 318" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Base Pay ($)</label>
              <input type="number" className="form-input" placeholder="55.00" />
            </div>
            <div>
              <label className="form-label">Multiplier</label>
              <input type="text" className="form-input" placeholder="e.g. 1.5x" />
            </div>
          </div>
          <div>
            <label className="form-label">Job Site Address (for km calc)</label>
            <input type="text" className="form-input" placeholder="e.g. 11450 Steeles Ave, Brampton" />
          </div>
          <div>
            <label className="form-label">Additives</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {ADDITIVES.map(name => (
                <span
                  key={name}
                  onClick={() => toggle(name)}
                  className={`add-pill tag tag-muted ${active[name] ? 'on' : ''}`}
                >
                  {name}
                </span>
              ))}
            </div>
            <div className="text-xs text-teal-400 mt-2">
              📸 Remember to take photos of all additives before submitting in the CLS app
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <button onClick={onClose} className="py-3 rounded-xl border border-white/10 text-slate-400 font-semibold text-sm">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="py-3 rounded-xl text-black font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#FB923C,#F97316)', boxShadow: '0 0 20px rgba(251,146,60,0.3)' }}
          >
            💾 Save Job
          </button>
        </div>
      </div>
    </div>
  );
}
