import { useState, useRef } from 'react';

const ADDITIVES = ['Heavy', 'Mixed', 'Interlock', 'High-Cube', 'Tipped', 'Same Day', 'Holiday', 'Labels Out'];

const EMPTY = { date: '', company: '', containerId: '', pieces: '', basePay: '', multiplier: '', address: '' };

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function LogJobModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [activeAdditives, setActiveAdditives] = useState({});
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const fileRef = useRef(null);

  if (!open) return null;

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const toggleAdditive = (name) => setActiveAdditives(prev => ({ ...prev, [name]: !prev[name] }));

  const handleScanFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanError('');
    setScanning(true);
    try {
      const imageBase64 = await toBase64(file);
      const res = await fetch('/api/parse-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mediaType: file.type }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();

      setForm(prev => ({
        date:        data.date        || prev.date,
        company:     data.company     || prev.company,
        containerId: data.containerId || prev.containerId,
        pieces:      data.pieces      != null ? String(data.pieces)  : prev.pieces,
        basePay:     data.basePay     != null ? String(data.basePay) : prev.basePay,
        multiplier:  data.multiplier  || prev.multiplier,
        address:     data.address     || prev.address,
      }));

      if (Array.isArray(data.additives) && data.additives.length > 0) {
        const next = {};
        data.additives.forEach(a => { next[a] = true; });
        setActiveAdditives(next);
      }
    } catch (err) {
      setScanError('Could not read job — please fill in manually.');
      console.error(err);
    } finally {
      setScanning(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

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
    setScanError('');
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
        <div className="text-sm text-slate-500 mb-4">Record job details, additives, and location for mileage tracking.</div>

        {/* AI Scan button */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleScanFile}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={scanning}
          className="w-full mb-4 py-3 rounded-xl border border-dashed border-orange-400/40 flex items-center justify-center gap-2 text-sm font-semibold text-orange-400 disabled:opacity-50 active:bg-orange-400/5 transition-colors"
          style={{ background: 'rgba(251,146,60,0.04)' }}
        >
          {scanning ? (
            <>
              <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              Scanning with AI…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">photo_camera</span>
              Scan Job from Photo
            </>
          )}
        </button>

        {scanError && (
          <div className="mb-3 text-xs text-red-400 bg-red-400/10 rounded-xl px-3 py-2">{scanError}</div>
        )}

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
