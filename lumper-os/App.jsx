import { useState } from 'react';
import Header from './src/components/Header.jsx';
import BottomNav from './src/components/BottomNav.jsx';
import LogJobModal from './src/components/LogJobModal.jsx';
import CompanyProfile from './src/components/CompanyProfile.jsx';
import Home from './src/pages/Home.jsx';
import Logs from './src/pages/Logs.jsx';
import Mileage from './src/pages/Mileage.jsx';
import Pipeline from './src/pages/Pipeline.jsx';
import Tax from './src/pages/Tax.jsx';

export default function App() {
  const [page, setPage] = useState('home');
  const [modalOpen, setModalOpen] = useState(false);
  const [profileKey, setProfileKey] = useState(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="bg-[#0B0F1A] text-slate-100 min-h-screen selection:bg-orange-500/20">
      <Header />

      <main className="pb-32 max-w-lg mx-auto">
        {page === 'home'     && <Home onViewAll={() => setPage('logs')} onOpenModal={openModal} />}
        {page === 'logs'     && <Logs onOpenModal={openModal} />}
        {page === 'mileage'  && <Mileage />}
        {page === 'pipeline' && <Pipeline onOpenProfile={setProfileKey} />}
        {page === 'tax'      && <Tax />}
      </main>

      <BottomNav page={page} setPage={setPage} />

      {/* FAB */}
      <button
        onClick={openModal}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center z-40 text-black transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg,#FB923C,#F97316)', boxShadow: '0 0 28px rgba(251,146,60,0.45)' }}
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      <LogJobModal open={modalOpen} onClose={closeModal} />
      {profileKey && <CompanyProfile profileKey={profileKey} onClose={() => setProfileKey(null)} />}
    </div>
  );
}
