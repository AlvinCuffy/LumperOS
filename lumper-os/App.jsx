import React, { useState, useEffect } from 'react';

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
    --accent-green-dim:  rgba(74,222,128,0.12);
    --accent-red:        #F87171;
    --text-primary:      #F1F5F9;
    --text-secondary:    #94A3B8;
    --text-muted:        #475569;
    --font-main:         'DM Sans', sans-serif;
    --font-display:      'Space Grotesk', sans-serif;
    --font-mono:         'JetBrains Mono', monospace;
    --radius:            16px;
    --radius-sm:         10px;
    --nav-h:             68px;
  }

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: var(--font-main);
    background: var(--bg-base);
    color: var(--text-primary);
  }

  /* ── APP SHELL ── */
  .os-shell {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    background: var(--bg-base);
  }

  /* ── TOP HEADER ── */
  .os-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 12px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .os-logo {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--text-primary);
  }

  .os-logo span { color: var(--accent-orange); }

  .os-header-right {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* ── CONTENT ── */
  .os-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    padding-bottom: calc(var(--nav-h) + 12px);
  }

  .os-content::-webkit-scrollbar { display: none; }

  /* ── BOTTOM NAV ── */
  .os-nav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    height: var(--nav-h);
    background: var(--bg-card);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 8px;
    z-index: 100;
  }

  .os-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 4px;
    cursor: pointer;
    border-radius: 12px;
    transition: background 0.15s;
    user-select: none;
    border: none;
    background: transparent;
    color: var(--text-muted);
  }

  .os-nav-item:hover { background: var(--bg-hover); }

  .os-nav-item.active { color: var(--accent-orange); }

  .os-nav-icon { font-size: 20px; line-height: 1; }

  .os-nav-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.4px;
  }

  .os-nav-add {
    background: var(--accent-orange);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: #000;
    cursor: pointer;
    border: none;
    box-shadow: 0 0 20px rgba(251,146,60,0.4);
    transition: box-shadow 0.15s, transform 0.15s;
    user-select: none;
  }

  .os-nav-add:hover {
    box-shadow: 0 0 30px rgba(251,146,60,0.6);
    transform: scale(1.05);
  }

  /* ── SHARED COMPONENTS ── */
  .section-title {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.4px;
    margin-bottom: 4px;
  }

  .section-sub {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 20px;
  }

  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 14px;
  }

  /* ── DASHBOARD ── */
  .dash-greeting {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
  }

  .dash-date {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 24px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 14px;
  }

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 16px;
  }

  .stat-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .stat-value {
    font-family: var(--font-mono);
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -1px;
    color: var(--text-primary);
  }

  .stat-value.green { color: var(--accent-green); }
  .stat-value.orange { color: var(--accent-orange); }
  .stat-value.teal { color: var(--accent-teal); }

  .stat-sub {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .recent-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted);
  }

  .empty-icon { font-size: 40px; margin-bottom: 12px; }

  .empty-text {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 4px;
  }

  .empty-hint { font-size: 12px; }

  /* ── JOB ROW ── */
  .job-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }

  .job-row:last-child { border-bottom: none; }

  .job-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: var(--accent-orange-dim);
    border: 1px solid var(--border-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .job-info { flex: 1; min-width: 0; }

  .job-company {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .job-meta {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .job-pay {
    font-family: var(--font-mono);
    font-size: 15px;
    font-weight: 600;
    color: var(--accent-green);
    flex-shrink: 0;
  }

  /* ── JOB LIST PAGE ── */
  .jobs-summary {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
  }

  .jobs-summary-pill {
    flex: 1;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px;
    text-align: center;
  }

  .jobs-summary-pill .val {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .jobs-summary-pill .lbl {
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 600;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .delete-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
    flex-shrink: 0;
  }

  .delete-btn:hover { color: var(--accent-red); background: rgba(248,113,113,0.1); }

  /* ── ADD JOB FORM ── */
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

  .aj-input:focus, .aj-select:focus { border-color: var(--accent-orange); }
  .aj-input::placeholder { color: var(--text-muted); }
  .aj-input.mono { font-family: var(--font-mono); }

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

  .aj-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .aj-divider { height: 1px; background: var(--border); margin: 18px 0; }

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
  }

  .aj-chip.on .aj-chip-box {
    background: var(--accent-teal);
    border-color: var(--accent-teal);
    color: #000;
  }

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
  }

  .aj-net-total-value {
    font-family: var(--font-mono);
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -1px;
    color: var(--accent-green);
  }

  .aj-net-total-value.zero { color: var(--text-muted); }

  .aj-footer { display: flex; gap: 10px; margin-top: 20px; }

  .aj-btn {
    flex: 1;
    padding: 13px 20px;
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

  .save-toast {
    position: fixed;
    bottom: calc(var(--nav-h) + 16px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--accent-green);
    color: #000;
    font-weight: 700;
    font-size: 13px;
    padding: 10px 22px;
    border-radius: 20px;
    z-index: 200;
    animation: toastIn 0.2s ease;
    white-space: nowrap;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* ── SETTINGS ── */
  .settings-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }

  .settings-row:last-child { border-bottom: none; }

  .settings-row-label { font-size: 14px; font-weight: 500; }

  .settings-row-sub { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  .settings-input {
    width: 90px;
    background: var(--bg-card-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 8px 10px;
    color: var(--text-primary);
    font-size: 14px;
    font-family: var(--font-mono);
    outline: none;
    text-align: right;
    transition: border-color 0.15s;
  }

  .settings-input:focus { border-color: var(--accent-orange); }

  .danger-btn {
    width: 100%;
    padding: 12px;
    border-radius: var(--radius-sm);
    background: rgba(248,113,113,0.1);
    border: 1px solid rgba(248,113,113,0.25);
    color: var(--accent-red);
    font-size: 14px;
    font-weight: 600;
    font-family: var(--font-main);
    cursor: pointer;
    transition: all 0.15s;
    margin-top: 8px;
  }

  .danger-btn:hover { background: rgba(248,113,113,0.18); }
`;

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}

function formatCurrency(n) {
  return '$' + Number(n).toFixed(2);
}

// ── DASHBOARD VIEW ──────────────────────────────────────────────────────────
function Dashboard({ jobs, onAdd }) {
  const totalGross = jobs.reduce((s, j) => s + j.basePay, 0);
  const totalNet   = jobs.reduce((s, j) => s + j.netProfit, 0);
  const totalTax   = jobs.reduce((s, j) => s + j.taxAmount, 0);
  const recent     = jobs.slice(-5).reverse();

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="dash-greeting">{greeting} 👋</div>
      <div className="dash-date">{dateStr}</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Earned</div>
          <div className="stat-value orange">{formatCurrency(totalGross)}</div>
          <div className="stat-sub">{jobs.length} job{jobs.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Net Profit</div>
          <div className="stat-value green">{formatCurrency(totalNet)}</div>
          <div className="stat-sub">after tax reserve</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tax Reserve</div>
          <div className="stat-value" style={{ color: 'var(--accent-red)', fontSize: 22 }}>
            {formatCurrency(totalTax)}
          </div>
          <div className="stat-sub">set aside</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Per Job</div>
          <div className="stat-value teal" style={{ fontSize: 22 }}>
            {jobs.length ? formatCurrency(totalNet / jobs.length) : '$0.00'}
          </div>
          <div className="stat-sub">net average</div>
        </div>
      </div>

      <div className="card">
        <div className="recent-label">Recent Jobs</div>
        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-text">No jobs yet</div>
            <div className="empty-hint">Tap + to log your first container</div>
          </div>
        ) : (
          recent.map(j => (
            <div className="job-row" key={j.id}>
              <div className="job-icon">🚛</div>
              <div className="job-info">
                <div className="job-company">{j.company}</div>
                <div className="job-meta">
                  {j.supervisor ? j.supervisor + ' · ' : ''}{formatDate(j.date)}
                  {j.additives.length ? ' · ' + j.additives.join(', ') : ''}
                </div>
              </div>
              <div className="job-pay">{formatCurrency(j.netProfit)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── JOBS LIST VIEW ──────────────────────────────────────────────────────────
function JobsList({ jobs, onDelete }) {
  const totalGross = jobs.reduce((s, j) => s + j.basePay, 0);
  const totalNet   = jobs.reduce((s, j) => s + j.netProfit, 0);

  const sorted = [...jobs].reverse();

  return (
    <div>
      <div className="section-title">Job History</div>
      <div className="section-sub">All logged containers</div>

      <div className="jobs-summary">
        <div className="jobs-summary-pill">
          <div className="val">{jobs.length}</div>
          <div className="lbl">Jobs</div>
        </div>
        <div className="jobs-summary-pill">
          <div className="val" style={{ color: 'var(--accent-orange)' }}>{formatCurrency(totalGross)}</div>
          <div className="lbl">Gross</div>
        </div>
        <div className="jobs-summary-pill">
          <div className="val" style={{ color: 'var(--accent-green)' }}>{formatCurrency(totalNet)}</div>
          <div className="lbl">Net</div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div className="empty-text">No jobs logged yet</div>
            <div className="empty-hint">Tap + to add your first job</div>
          </div>
        </div>
      ) : (
        <div className="card">
          {sorted.map(j => (
            <div className="job-row" key={j.id}>
              <div className="job-icon">🚛</div>
              <div className="job-info">
                <div className="job-company">{j.company}</div>
                <div className="job-meta">
                  {j.supervisor ? j.supervisor + ' · ' : ''}{formatDate(j.date)}
                  {j.pieces ? ' · ' + j.pieces + ' pcs' : ''}
                  {j.additives.length ? ' · ' + j.additives.join(', ') : ''}
                </div>
              </div>
              <div className="job-pay">{formatCurrency(j.netProfit)}</div>
              <button className="delete-btn" onClick={() => onDelete(j.id)} title="Delete">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ADD JOB VIEW ────────────────────────────────────────────────────────────
function AddJob({ onSave, taxRate }) {
  const [quickSelect, setQuickSelect] = useState('Canada Lumper Services');
  const [companyName, setCompanyName] = useState('Canada Lumper Services');
  const [supervisor,  setSupervisor]  = useState('');
  const [basePay,     setBasePay]     = useState('');
  const [pieces,      setPieces]      = useState('');
  const [additives,   setAdditives]   = useState({});

  const raw       = parseFloat(basePay) || 0;
  const taxAmount = raw * taxRate;
  const netProfit = raw - taxAmount;
  const hasValue  = raw > 0;

  function handleQuickSelect(e) {
    const val = e.target.value;
    setQuickSelect(val);
    setCompanyName(val);
  }

  function toggleAdditive(name) {
    setAdditives(prev => ({ ...prev, [name]: !prev[name] }));
  }

  function handleClear() {
    setQuickSelect('Canada Lumper Services');
    setCompanyName('Canada Lumper Services');
    setSupervisor('');
    setBasePay('');
    setPieces('');
    setAdditives({});
  }

  function handleSave() {
    if (!raw) return;
    onSave({
      id:         Date.now(),
      date:       new Date().toISOString(),
      company:    companyName || quickSelect,
      supervisor,
      basePay:    raw,
      taxAmount,
      netProfit,
      pieces:     parseInt(pieces) || 0,
      additives:  Object.keys(additives).filter(k => additives[k]),
    });
    handleClear();
  }

  return (
    <div>
      <div className="section-title">Add Job</div>
      <div className="section-sub">Log a container — net pay calculates live.</div>

      <div className="aj-group">
        <label className="aj-label">Quick Select Company</label>
        <div className="aj-select-wrap">
          <select className="aj-select" value={quickSelect} onChange={handleQuickSelect}>
            {QUICK_COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {quickSelect === 'Canada Lumper Services' && (
            <span className="aj-default-badge">DEFAULT</span>
          )}
        </div>
      </div>

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

      <div className="aj-divider" />

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

      <label className="aj-label" style={{ marginBottom: 10 }}>Net Profit Breakdown</label>
      <div className="aj-net-box">
        <div className="aj-net-row">
          <span className="aj-net-label">Base Pay</span>
          <span className="aj-net-value" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(raw)}
          </span>
        </div>
        <div className="aj-net-row">
          <span className="aj-net-label">Tax Reserve ({Math.round(taxRate * 100)}%)</span>
          <span className="aj-net-value" style={{ color: 'var(--accent-red)' }}>
            − {formatCurrency(taxAmount)}
          </span>
        </div>
        <div className="aj-net-sep" />
        <div className="aj-net-total-row">
          <span className="aj-net-total-label">Net Profit</span>
          <span className={`aj-net-total-value${!hasValue ? ' zero' : ''}`}>
            {formatCurrency(netProfit)}
          </span>
        </div>
      </div>

      <div className="aj-footer">
        <button className="aj-btn aj-btn-ghost" onClick={handleClear}>Clear</button>
        <button
          className="aj-btn aj-btn-primary"
          onClick={handleSave}
          disabled={!hasValue}
          style={{ opacity: hasValue ? 1 : 0.5 }}
        >
          💾 Save Job
        </button>
      </div>
    </div>
  );
}

// ── SETTINGS VIEW ───────────────────────────────────────────────────────────
function Settings({ taxRate, onTaxChange, onClearAll }) {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div>
      <div className="section-title">Settings</div>
      <div className="section-sub">Configure LumperOS preferences</div>

      <div className="card">
        <div className="recent-label">Tax &amp; Pay</div>
        <div className="settings-row">
          <div>
            <div className="settings-row-label">Tax Reserve Rate</div>
            <div className="settings-row-sub">Percentage set aside from each job</div>
          </div>
          <input
            className="settings-input"
            type="number"
            min="0"
            max="100"
            step="1"
            value={Math.round(taxRate * 100)}
            onChange={e => onTaxChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) / 100)}
          />
        </div>
      </div>

      <div className="card">
        <div className="recent-label">Data</div>
        <div className="settings-row" style={{ borderBottom: 'none' }}>
          <div>
            <div className="settings-row-label">Clear All Jobs</div>
            <div className="settings-row-sub">Permanently delete all logged jobs</div>
          </div>
        </div>
        {!confirmClear ? (
          <button className="danger-btn" onClick={() => setConfirmClear(true)}>
            Clear All Data
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              className="danger-btn"
              style={{ flex: 1, marginTop: 0 }}
              onClick={() => { onClearAll(); setConfirmClear(false); }}
            >
              Yes, Delete All
            </button>
            <button
              className="aj-btn aj-btn-ghost"
              style={{ flex: 1 }}
              onClick={() => setConfirmClear(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 4 }}>
        <div className="recent-label">About</div>
        <div className="settings-row">
          <div className="settings-row-label">LumperOS</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>v1.0.0</div>
        </div>
        <div className="settings-row" style={{ borderBottom: 'none' }}>
          <div className="settings-row-label">Built for lumpers</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>🍁</div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view,    setView]    = useState('dashboard');
  const [jobs,    setJobs]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('lumperos_jobs') || '[]'); } catch { return []; }
  });
  const [taxRate, setTaxRate] = useState(() => {
    const saved = localStorage.getItem('lumperos_tax');
    return saved ? parseFloat(saved) : 0.35;
  });
  const [toast, setToast] = useState(false);

  useEffect(() => {
    localStorage.setItem('lumperos_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('lumperos_tax', String(taxRate));
  }, [taxRate]);

  function addJob(job) {
    setJobs(prev => [...prev, job]);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
    setView('dashboard');
  }

  function deleteJob(id) {
    setJobs(prev => prev.filter(j => j.id !== id));
  }

  const navItems = [
    { id: 'dashboard', icon: '⌂',  label: 'Home'    },
    { id: 'jobs',      icon: '☰',  label: 'Jobs'    },
    { id: 'add',       icon: '+',  label: null, add: true },
    { id: 'settings',  icon: '⚙', label: 'Settings' },
  ];

  const viewLabel = { dashboard: 'Dashboard', jobs: 'Jobs', add: 'Add Job', settings: 'Settings' };

  return (
    <>
      <style>{css}</style>
      <div className="os-shell">

        <header className="os-header">
          <div className="os-logo">Lumper<span>OS</span></div>
          <div className="os-header-right">{viewLabel[view]}</div>
        </header>

        <main className="os-content">
          {view === 'dashboard' && <Dashboard jobs={jobs} onAdd={() => setView('add')} />}
          {view === 'jobs'      && <JobsList  jobs={jobs} onDelete={deleteJob} />}
          {view === 'add'       && <AddJob    onSave={addJob} taxRate={taxRate} />}
          {view === 'settings'  && (
            <Settings
              taxRate={taxRate}
              onTaxChange={setTaxRate}
              onClearAll={() => setJobs([])}
            />
          )}
        </main>

        <nav className="os-nav">
          {navItems.map(item =>
            item.add ? (
              <button key="add" className="os-nav-add" onClick={() => setView('add')}>+</button>
            ) : (
              <button
                key={item.id}
                className={`os-nav-item${view === item.id ? ' active' : ''}`}
                onClick={() => setView(item.id)}
              >
                <span className="os-nav-icon">{item.icon}</span>
                <span className="os-nav-label">{item.label}</span>
              </button>
            )
          )}
        </nav>

        {toast && <div className="save-toast">✓ Job saved!</div>}
      </div>
    </>
  );
}
