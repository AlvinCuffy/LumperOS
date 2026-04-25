const NAV_ITEMS = [
  { id: 'home',     icon: 'home',         label: 'Home',     filled: true },
  { id: 'logs',     icon: 'assignment',   label: 'Logs',     filled: false },
  { id: 'mileage',  icon: 'distance',     label: 'Mileage',  filled: false },
  { id: 'pipeline', icon: 'account_tree', label: 'Pipeline', filled: false },
  { id: 'tax',      icon: 'receipt_long', label: 'Tax',      filled: false },
];

export default function BottomNav({ page, setPage }) {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 border-t border-white/5"
      style={{ background: 'rgba(11,15,26,0.85)', backdropFilter: 'blur(20px)', paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      {NAV_ITEMS.map(item => {
        const active = page === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
              active ? 'text-orange-400 bg-orange-400/10' : 'text-slate-500'
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${active && item.filled ? 'fill-icon' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-widest">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
