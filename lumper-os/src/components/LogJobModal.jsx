import { useState } from 'react';

const ADDITIVES = ['Heavy', 'Mixed', 'Interlock', 'High-Cube', 'Tipped', 'Same Day', 'Holiday', 'Labels Out'];

const EMPTY = { date: '', company: '', containerId: '', pieces: '', basePay: '', multiplier: '', address: '' };

export default function LogJobModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [activeAdditives, setActiveAdditives] = useState({});

  if (!open) return null;

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const toggleAdditive = (name) => setActiveAdditives(prev => ({ ...prev, [name]: !prev[name] }));

  const handleSave = () => {
    if (!form.company || !form.basePay) return;
    onSave({
      id: Date.now(),
      date: form.date || new Date().toISOString().slice(0, 10),
      company: form.company,
      containerId: form.containerId,
      pieces: form.pieces ? Number(form.pieces) : null,
      basePay: parseFloat(form.basePay),
      multiplier: form.multiplier,
      address: form.address,
      additives: Object.keys(activeAdditives).filter(k => activeAdditives[k]),
    });
    setForm(EMPTY);
    setActiveAdditives({});
    onClose();
  };

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
              <input type="date" className="form-input" value={form.date} onChange={set('date')} />
            </div>
            <div>
              <label className="form-label">Company</label>
              <input type="text" className="form-input" placeholder="e.g. TAS Refrigerated" value={form.company} onChange={set('company')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Container ID</label>
              <input type="text" className="form-input" placeholder="e.g. ZCLU9930419" value={form.containerId} onChange={set('containerId')} style={{ fontFamily: 'JetBrains Mono' }} />
            </div>
            <div>
              <label className="form-label">Pieces</label>
              <input type="number" className="form-input" placeholder="e.g. 318" value={form.pieces} onChange={set('pieces')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Base Pay ($)</label>
              <input type="number" className="form-input" placeholder="55.00" value={form.basePay} onChange={set('basePay')} />
            </div>
            <div>
              <label className="form-label">Multiplier</label>
              <input type="text" className="form-input" placeholder="e.g. 1.5x" value={form.multiplier} onChange={set('multiplier')} />
            </div>
          </div>
          <div>
            <label className="form-label">Job Site Address (for km calc)</label>
            <input type="text" className="form-input" placeholder="e.g. 11450 Steeles Ave, Brampton" value={form.address} onChange={set('address')} />
          </div>
          <div>
            <label className="form-label">Additives</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {ADDITIVES.map(name => (
                <span
                  key={name}
                  onClick={() => toggleAdditive(name)}
                  className={`add-pill tag tag-muted ${activeAdditives[name] ? 'on' : ''}`}
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
            onClick={handleSave}
            disabled={!form.company || !form.basePay}
            className="py-3 rounded-xl text-black font-bold text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#FB923C,#F97316)', boxShadow: '0 0 20px rgba(251,146,60,0.3)' }}
          >
            💾 Save Job
          </button>
        </div>
      </div>
    </div>
  );
}
