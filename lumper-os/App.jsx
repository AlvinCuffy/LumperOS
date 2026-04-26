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
  { id: 1,  date: '2026-04-01', company: 'TAS Refrigerated Distribution', containerId: 'ZCLU9930419', pieces: 318,  basePay: 140.00, multiplier: '',    address: '18 Abacus Road, Brampton', additives: ['Heavy','Interlock','Labels Out','Mixed'], status: 'paid' },
  { id: 2,  date: '2026-04-06', company: 'TAS Refrigerated Distribution', containerId: 'KKFU6751964', pieces: null, basePay: 38.33,  multiplier: '',    address: '18 Abacus Road, Brampton', additives: ['Same Day'],                               status: 'paid' },
  { id: 3,  date: '2026-04-06', company: 'TAS Refrigerated Distribution', containerId: 'FSCU5734460', pieces: 1800, basePay: 75.00,  multiplier: '',    address: '18 Abacus Road, Brampton', additives: ['Same Day','Interlock'],                   status: 'paid' },
  { id: 4,  date: '2026-04-11', company: 'Fresh Taste Produce',           containerId: 'GINGER',      pieces: 1584, basePay: 187.53, multiplier: '1.5x',address: '11450 Steeles Ave, Brampton', additives: ['Same Day'],                             status: 'paid' },
  { id: 5,  date: '2026-04-14', company: 'TAS Refrigerated Distribution', containerId: 'OERU4009514', pieces: 1800, basePay: 60.00,  multiplier: '',    address: '18 Abacus Road, Brampton', additives: ['Interlock'],                              status: 'pending' },
  { id: 6,  date: '2026-04-15', company: 'TAS Refrigerated Distribution', containerId: 'MNBU4147375', pieces: 1160, basePay: 55.00,  multiplier: '',    address: '18 Abacus Road, Brampton', additives: ['Interlock'],                              status: 'pending' },
  { id: 7,  date: '2026-04-15', company: 'TAS Refrigerated Distribution', containerId: 'MNBU9111781', pieces: 1160, basePay: 55.00,  multiplier: '',    address: '18 Abacus Road, Brampton', additives: ['Interlock'],                              status: 'pending' },
  { id: 8,  date: '2026-04-16', company: 'TAS Refrigerated Distribution', containerId: 'MNBU3640031', pieces: 1160, basePay: 55.00,  multiplier: '',    address: '18 Abacus Road, Brampton', additives: ['Interlock'],                              status: 'pending' },
  { id: 9,  date: '2026-04-16', company: 'TAS Refrigerated Distribution', containerId: 'MNBU4676105', pieces: 1160, basePay: 55.00,  multiplier: '',    address: '18 Abacus Road, Brampton', additives: ['Interlock'],                              status: 'pending' },
  { id: 10, date: '2026-04-20', company: 'TAS Refrigerated Distribution', containerId: 'SEGU9688486',   pieces: 1800, basePay: 60.00,  multiplier: '',    address: '18 Abacus Road, Brampton', additives: ['Interlock','Labels Out'],                 status: 'pending' },
  { id: 11, date: '2026-04-23', company: 'TAS Refrigerated Distribution', containerId: 'REPILE-26PAL', pieces: 1820, basePay: 60.00,  multiplier: '',    address: '18 Abacus Road, Brampton', additives: [],                                         status: 'pending' },
];

const SEED_VERSION = 4;

function loadJobs() {
  try {
    const version = Number(localStorage.getItem('lumperos-seed-v') ?? 0);
    const saved   = localStorage.getItem('lumperos-jobs');

    if (!saved) {
      localStorage.setItem('lumperos-seed-v', SEED_VERSION);
      localStorage.setItem('lumperos-jobs', JSON.stringify(SEED_JOBS));
      return SEED_JOBS;
    }

    if (version < SEED_VERSION) {
      // Merge: prepend any seed jobs whose containerId isn't already stored
      const existing    = JSON.parse(saved);
      const existingIds = new Set(existing.map(j => j.containerId));
      const toAdd       = SEED_JOBS.filter(j => !existingIds.has(j.containerId));
      const merged      = [...toAdd, ...existing];
      localStorage.setItem('lumperos-seed-v', SEED_VERSION);
      localStorage.setItem('lumperos-jobs', JSON.stringify(merged));
      return merged;
    }

    return JSON.parse(saved);
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
    const newJobs = [{ ...job, status: 'pending' }, ...jobs];
    setJobs(newJobs);
    localStorage.setItem('lumperos-jobs', JSON.stringify(newJobs));
  };

  const deleteJob = (id) => {
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
    localStorage.setItem('lumperos-jobs', JSON.stringify(updated));
  };

  const markJobsPaid = (ids) => {
    const idSet = new Set(ids);
    const updated = jobs.map(j => idSet.has(j.id) ? { ...j, status: 'paid' } : j);
    setJobs(updated);
    localStorage.setItem('lumperos-jobs', JSON.stringify(updated));
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="bg-[#0B0F1A] text-slate-100 min-h-dvh selection:bg-orange-500/20">
      <Header />

      <main className="pb-32 max-w-lg mx-auto">
        {page === 'home'     && <Home jobs={jobs} onViewAll={() => setPage('logs')} onOpenModal={openModal} />}
        {page === 'logs'     && <Logs jobs={jobs} onOpenModal={openModal} onMarkPaid={markJobsPaid} onDeleteJob={deleteJob} />}
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
