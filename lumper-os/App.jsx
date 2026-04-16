import React, { useState } from 'react';

const QUICK_COMPANIES = [
  'Canada Lumper Services',
  'Trojan Lumping Services',
  'Container Guyz',
  'Brothers Container Service',
  'QuickCan Lumping Service',
  'Great North Lumper Services',
  'National Lumpers',
  'Direct Lumper Service Inc.',
];

const ADDITIVES = ['Interlock', 'High-Cube', 'Same Day', 'Holiday'];
const TAX_RATE = 0.35;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg-base:           #0B0F1A;
    --bg-card:           #111827;
    --bg-card-2:         #161E2E;
    --bg-hover:          #1A2436;
    --border:            rgba(255,255,255,0.06);
    --border-accent:     rgba(251,146,60,0.3);
    --accent-orange:     #FB923C;
    --accent-orange-dim: rgba(251,146,60,0.15);
    --accent-teal:       #2DD4BF;
    --accent-teal-dim:   rgba(45,212,191,0.15);
    --accent-blue:       #60A5FA;
    --accent-green:      #4ADE80;
    --accent-red:        #F87171;
    --text-primary:      #F1F5F9;
    --text-secondary:    #94A3B8;
    --text-muted:        #475569;
    --font-main:         'DM Sans', sans-serif;
    --font-display:      'Space Grotesk', sans-serif;
    --font-mono:         'JetBrains Mono', monospace;
    --radius:            16px;
    --radius-sm:         10px;
  }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: var(--font-main);
    background: var(--bg-base);
    color: var(--text-primary);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  /* CARD */
  .aj-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    width: 520px;
    max-width: 100%;
    box-shadow: 0 40px 80px rgba(0,0,0,0.5);
  }

  .aj-heading {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }

  .aj-sub {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 28px;
  }

  /* LABELS */
  .aj-label {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 7px;
  }

  .aj-group { margin-bottom: 18px; }

  /* INPUTS */
  .aj-input,
  .aj-select {
    width: 100%;
    background: var(--bg-card-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 11px 14px;
    color: var(--text-primary);
    font-size: 14px;
    font-family: var(--font-main);
    outline: none;
    transition: border-color 0.15s;
  }

  .aj-input:focus,
  .aj-select:focus { border-color: var(--accent-orange); }

  .aj-input::placeholder { color: var(--text-muted); }
  .aj-input.mono { font-family: var(--font-mono); }

  /* QUICK SELECT */
  .aj-select-wrap { position: relative; }

  .aj-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' viewBox='0 0 12 7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2394A3B8' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
    cursor: pointer;
  }

  .aj-default-badge {
    position: absolute;
    right: 38px;
    top: 50%;
    transform: translateY(-50%);
    background: var(--accent-orange-dim);
    border: 1px solid var(--border-accent);
    color: var(--accent-orange);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.6px;
    padding: 2px 8px;
    border-radius: 20px;
    pointer-events: none;
  }

  /* 2-COL GRID */
  .aj-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* UPLOAD ZONE — dotted orange border per mobile blueprint */
  .aj-upload {
    position: relative;
    border: 2px dashed var(--accent-orange);
    border-radius: var(--radius-sm);
    background: var(--accent-orange-dim);
    padding: 24px 16px;
    text-align: center;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
  }

  .aj-upload:hover,
  .aj-upload.dragover {
    background: rgba(251,146,60,0.22);
    box-shadow: 0 0 24px rgba(251,146,60,0.18);
  }

  .aj-upload input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  .aj-upload-icon { font-size: 26px; margin-bottom: 6px; }

  .aj-upload-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--accent-orange);
  }

  .aj-upload-hint {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 3px;
  }

  .aj-upload-success {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent-teal);
    margin-top: 8px;
    word-break: break-all;
  }

  /* DIVIDER */
  .aj-divider { height: 1px; background: var(--border); margin: 22px 0; }

  /* ADDITIVES */
  .aj-additives { display: flex; flex-wrap: wrap; gap: 8px; }

  .aj-chip {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--bg-card-2);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    transition: all 0.15s;
  }

  .aj-chip:hover { border-color: rgba(45,212,191,0.3); color: var(--accent-teal); }

  .aj-chip.on {
    background: var(--accent-teal-dim);
    border-color: rgba(45,212,191,0.35);
    color: var(--accent-teal);
  }

  .aj-chip-box {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    border: 1px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 700;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .aj-chip.on .aj-chip-box {
    background: var(--accent-teal);
    border-color: var(--accent-teal);
    color: #000;
  }

  /* NET PROFIT BOX */
  .aj-net-box {
    background: var(--bg-card-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 18px 20px;
  }

  .aj-net-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .aj-net-label { font-size: 12px; color: var(--text-muted); }

  .aj-net-value {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 500;
  }

  .aj-net-sep { height: 1px; background: var(--border); margin: 12px 0; }

  .aj-net-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .aj-net-total-label {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .aj-net-total-value {
    font-family: var(--font-mono);
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -1px;
    color: var(--accent-green);
    transition: color 0.2s;
  }

  .aj-net-total-value.zero { color: var(--text-muted); }

  /* FOOTER */
  .aj-footer { display: flex; gap: 10px; margin-top: 24px; }

  .aj-btn {
    flex: 1;
    padding: 12px 20px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 600;
    font-family: var(--font-main);
    cursor: pointer;
    border: none;
    transition: all 0.15s;
  }

  .aj-btn-ghost {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }

  .aj-btn-ghost:hover { background: var(--bg-hover); color: var(--text-primary); }

  .aj-btn-primary {
    background: var(--accent-orange);
    color: #000;
    box-shadow: 0 0 20px rgba(251,146,60,0.3);
  }

  .aj-btn-primary:hover {
    box-shadow: 0 0 30px rgba(251,146,60,0.5);
    transform: translateY(-1px);
  }
`;

export default function AddJob() {
  const [quickSelect, setQuickSelect] = useState('Canada Lumper Services');
  const [companyName, setCompanyName] = useState('Canada Lumper Services');
  const [supervisor, setSupervisor]   = useState('');
  const [basePay, setBasePay]         = useState('');
  const [pieces, setPieces]           = useState('');
  const [additives, setAdditives]     = useState({});
  const [screenshot, setScreenshot]   = useState(null);
  const [dragOver, setDragOver]       = useState(false);

  const raw       = parseFloat(basePay) || 0;
  const taxAmount = (raw * TAX_RATE).toFixed(2);
  const netProfit = (raw * (1 - TAX_RATE)).toFixed(2);
  const hasValue  = raw > 0;

  function handleQuickSelect(e) {
    const val = e.target.value;
    setQuickSelect(val);
    setCompanyName(val);
  }

  function toggleAdditive(name) {
    setAdditives(prev => ({ ...prev, [name]: !prev[name] }));
  }

  function handleFile(file) {
    if (file && file.type.startsWith('image/')) setScreenshot(file.name);
  }

  function handleClear() {
    setQuickSelect('Canada Lumper Services');
    setCompanyName('Canada Lumper Services');
    setSupervisor('');
    setBasePay('');
    setPieces('');
    setAdditives({});
    setScreenshot(null);
  }

  return (
    <>
      <style>{css}</style>

      <div className="aj-card">
        <div className="aj-heading">Add Job</div>
        <div className="aj-sub">Log a container — net pay calculates live below.</div>

        {/* QUICK SELECT */}
        <div className="aj-group">
          <label className="aj-label">Quick Select Company</label>
          <div className="aj-select-wrap">
            <select
              className="aj-select"
              value={quickSelect}
              onChange={handleQuickSelect}
            >
              {QUICK_COMPANIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {quickSelect === 'Canada Lumper Services' && (
              <span className="aj-default-badge">DEFAULT</span>
            )}
          </div>
        </div>

        {/* COMPANY NAME */}
        <div className="aj-group">
          <label className="aj-label">Company Name</label>
          <input
            className="aj-input"
            type="text"
            placeholder="e.g. TAS Refrigerated"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
          />
        </div>

        {/* SUPERVISOR + BASE PAY */}
        <div className="aj-grid-2">
          <div className="aj-group">
            <label className="aj-label">Supervisor</label>
            <input
              className="aj-input"
              type="text"
              placeholder="e.g. Julian"
              value={supervisor}
              onChange={e => setSupervisor(e.target.value)}
            />
          </div>
          <div className="aj-group">
            <label className="aj-label">Base Pay ($)</label>
            <input
              className="aj-input mono"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={basePay}
              onChange={e => setBasePay(e.target.value)}
            />
          </div>
        </div>

        {/* PIECES */}
        <div className="aj-group">
          <label className="aj-label">Pieces / SKUs</label>
          <input
            className="aj-input mono"
            type="number"
            placeholder="e.g. 318"
            min="0"
            value={pieces}
            onChange={e => setPieces(e.target.value)}
          />
        </div>

        {/* UPLOAD SCREENSHOT */}
        <div className="aj-group">
          <label className="aj-label">Upload App Screenshot</label>
          <div
            className={`aj-upload${dragOver ? ' dragover' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFile(e.target.files[0])}
            />
            <div className="aj-upload-icon">📸</div>
            <div className="aj-upload-text">Upload App Screenshot</div>
            <div className="aj-upload-hint">Tap to browse or drag &amp; drop — PNG, JPG</div>
            {screenshot && (
              <div className="aj-upload-success">✓ {screenshot}</div>
            )}
          </div>
        </div>

        <div className="aj-divider" />

        {/* ADDITIVES */}
        <div className="aj-group">
          <label className="aj-label">Additives</label>
          <div className="aj-additives">
            {ADDITIVES.map(name => (
              <div
                key={name}
                className={`aj-chip${additives[name] ? ' on' : ''}`}
                onClick={() => toggleAdditive(name)}
              >
                <span className="aj-chip-box">{additives[name] ? '✓' : ''}</span>
                {name}
              </div>
            ))}
          </div>
        </div>

        <div className="aj-divider" />

        {/* NET PROFIT */}
        <label className="aj-label" style={{ marginBottom: 10 }}>
          Net Profit Breakdown
        </label>
        <div className="aj-net-box">
          <div className="aj-net-row">
            <span className="aj-net-label">Base Pay</span>
            <span className="aj-net-value" style={{ color: 'var(--text-primary)' }}>
              ${hasValue ? raw.toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="aj-net-row">
            <span className="aj-net-label">Tax Reserve (35%)</span>
            <span className="aj-net-value" style={{ color: 'var(--accent-red)' }}>
              − ${taxAmount}
            </span>
          </div>
          <div className="aj-net-sep" />
          <div className="aj-net-total-row">
            <span className="aj-net-total-label">Net Profit</span>
            <span className={`aj-net-total-value${!hasValue ? ' zero' : ''}`}>
              ${netProfit}
            </span>
          </div>
        </div>

        <div className="aj-footer">
          <button className="aj-btn aj-btn-ghost" onClick={handleClear}>
            Clear
          </button>
          <button className="aj-btn aj-btn-primary">
            💾 Save Job
          </button>
        </div>
      </div>
    </>
  );
}
