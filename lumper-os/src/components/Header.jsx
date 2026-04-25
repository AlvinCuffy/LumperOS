export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 flex justify-between items-center px-5 py-4 border-b border-white/5"
      style={{ background: 'rgba(11,15,26,0.8)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-black font-black text-sm"
          style={{ boxShadow: '0 0 16px rgba(251,146,60,0.4)' }}
        >
          📦
        </div>
        <span className="font-headline text-xl font-bold tracking-tight text-orange-400">LumperOS</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full">
          Apr 7–13
        </div>
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-teal-400 flex items-center justify-center text-black font-bold text-sm"
          style={{ boxShadow: '0 0 0 2px rgba(251,146,60,0.3)' }}
        >
          AC
        </div>
      </div>
    </header>
  );
}
