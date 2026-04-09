import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Search, ChevronRight, History as HistoryIcon, Trash2 } from 'lucide-react';
import { useScanHistory } from '../context/HistoryContext';
import { useAppContext } from '../context/AppContext';

const HEALTHY_IMAGES = [
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400',
];

const DISEASED_IMAGES = [
  'https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400',
];

const Dashboard = () => {
  const { scans, clearHistory } = useScanHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useAppContext();

  const filteredHistory = useMemo(
    () => scans.filter(item =>
      (item.disease_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.status || '').toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [scans, searchTerm]
  );

  const stats = useMemo(() => {
    const total = scans.length;
    const healthy = scans.filter(i => i.status?.toLowerCase() === 'healthy').length;
    const diseased = scans.filter(i => i.status?.toLowerCase() === 'diseased').length;
    const avg = total > 0 ? scans.reduce((s, i) => s + (i.confidence || 0), 0) / total : 0;
    return [
      { label: 'Total Scans', value: total, color: 'text-slate-950' },
      { label: 'Healthy', value: healthy, color: 'text-green-600' },
      { label: 'Avg Confidence', value: `${avg.toFixed(1)}%`, color: 'text-blue-600' },
      { label: 'Alerts', value: diseased, color: 'text-red-500' },
    ];
  }, [scans]);

  const getImage = (item, idx) => {
    if (item.status?.toLowerCase() === 'healthy') return HEALTHY_IMAGES[idx % HEALTHY_IMAGES.length];
    return DISEASED_IMAGES[idx % DISEASED_IMAGES.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-14">
        <div>
          <h1 className="text-5xl font-black text-slate-950 tracking-tighter mb-2">{t('history')}</h1>
          <p className="text-lg text-slate-400 font-medium">Your diagnostic archive and crop health timeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" placeholder="Filter scans..."
              className="w-64 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-green-400 transition-all"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {scans.length > 0 && (
            <button onClick={clearHistory} className="p-3 rounded-xl border border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all" title="Clear All">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
        {stats.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm"
          >
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
            <p className={`text-3xl font-black tracking-tighter ${item.color}`}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Grid */}
      {filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredHistory.map((item, idx) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
              className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-green-300 transition-all duration-500 group"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={getImage(item, idx)} alt={item.disease_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <span className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest ${item.status?.toLowerCase() === 'healthy' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {item.status}
                  </span>
                  <span className="rounded-lg bg-black/40 backdrop-blur px-3 py-1 text-[10px] font-black text-white">
                    {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1 line-clamp-1">{item.disease_name}</h3>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mb-4">
                  <Clock className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-2xl font-black text-green-600">{item.confidence}%</span>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32">
          <div className="mx-auto mb-8 w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center">
            <HistoryIcon className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">No Scans Yet</h3>
          <p className="text-lg text-slate-400 font-medium max-w-sm mx-auto mb-8">Upload a leaf photo on the home page to start building your crop health archive.</p>
          <a href="/" className="inline-block px-8 py-4 bg-slate-950 text-white font-black rounded-2xl hover:bg-green-600 transition-all">Start Scanning</a>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
