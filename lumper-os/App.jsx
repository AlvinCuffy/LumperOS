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

const SEED_JOBS = [
  { id: 1, date: '2026-04-01', company: 'TAS Refrigerated Distribution', containerId: 'ZCLU9930419', pieces: 318,  basePay: 140.00, multiplier: '',    address: '18 Abacus Rd, Brampton',       additives: ['Heavy','Interlock','Labels Out','Mixed'] },
  { id: 2, date: '2026-04-06', company: 'TAS Refrigerated Distribution', containerId: 'KKFU6751964', pieces: null, basePay: 38.33,  multiplier: '',    address: '18 Abacus Rd, Brampton',       additives: ['Same Day'] },
  { id: 3, date: '2026-04-06', company: 'TAS Refrigerated Distribution', containerId: 'FSCU5734460', pieces: 1800, basePay: 75.00,  multiplier: '',    address: '18 Abacus Rd, Brampton',       additives: ['Same Day','Interlock'] },
  { id: 4, date: '2026-04-11', company: 'Fresh Taste Produce',           containerId: 'GINGER',      pieces: 1584, basePay: 187.53, multiplier: '1.5x',address: '11450 Steeles Ave, Brampton',  additives: ['Same Day'] },
];

function loadJobs() {
  try {
    const saved = localStorage.getItem('lumperos-jobs');
    return saved ? JSON.parse(saved) : SEED_JOBS;
  } catch {
    return SEED_JOBS;
  }
}

export default function App() {
  const [page, setPage] = useState('home');
  const [modalOpen, setModalOpen] = useState(false);
  const [profileKey, setProfileKey] = useState(null);
  const [jobs, setJobs] = useState(loadJobs);

  const addJob = (job) => {
    const newJobs = [job, ...jobs];
    setJobs(newJobs);
    localStorage.setItem('lumperos-jobs', JSON.stringify(newJobs));
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="bg-[#0B0F1A] text-slate-100 min-h-dvh selection:bg-orange-500/20">
      <Header />

      <main className="pb-32 max-w-lg mx-auto">
        {page === 'home'     && <Home jobs={jobs} onViewAll={() => setPage('logs')} onOpenModal={openModal} />}
        {page === 'logs'     && <Logs jobs={jobs} onOpenModal={openModal} />}
        {page === 'mileage'  && <Mileage />}
        {page === 'pipeline' && <Pipeline onOpenProfile={setProfileKey} />}
        {page === 'tax'      && <Tax jobs={jobs} />}
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

      <LogJobModal open={modalOpen} onClose={closeModal} onSave={addJob} />
      {profileKey && <CompanyProfile profileKey={profileKey} onClose={() => setProfileKey(null)} />}
    </div>
  );
}
