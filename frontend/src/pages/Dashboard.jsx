import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Filter, Search, ChevronRight, History } from 'lucide-react';
import { apiService } from '../services/api';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useAppContext();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const data = await apiService.getHistory();
      if (data.length === 0) {
        setHistory([
          { id: 1, disease: 'Tomato Late Blight', status: 'Diseased', confidence: 94.2, timestamp: '2024-03-20T10:30:00Z', image: 'https://images.unsplash.com/photo-1592819695396-064b9012a660?auto=format&fit=crop&q=80&w=300' },
          { id: 2, disease: 'Healthy Soy', status: 'Healthy', confidence: 99.1, timestamp: '2024-03-19T14:20:00Z', image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=300' },
          { id: 3, disease: 'Rice Blast', status: 'Diseased', confidence: 88.5, timestamp: '2024-03-18T09:15:00Z', image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&q=80&w=300' },
        ]);
      } else {
        setHistory(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const filteredHistory = useMemo(
    () => history.filter(item =>
      item.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [history, searchTerm]
  );

  const stats = useMemo(() => {
    const total = history.length || 1;
    const healthy = history.filter((item) => item.status === 'Healthy').length;
    const diseased = history.filter((item) => item.status === 'Diseased').length;
    const avgConfidence = history.reduce((sum, item) => sum + item.confidence, 0) / total;

    return [
      { label: 'Total Records', value: history.length },
      { label: 'Healthy Rate', value: `${((healthy / total) * 100).toFixed(0)}%` },
      { label: 'Avg Confidence', value: `${avgConfidence.toFixed(1)}%` },
      { label: 'Diseased Cases', value: diseased },
    ];
  }, [history]);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">{t('previous')}</h1>
          <p className="text-gray-400">Review and manage your crop health reports with fast search and clear insights.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search history..."
              className="w-full rounded-3xl border border-white/10 bg-slate-950/70 pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/15"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 mb-10">
        {stats.map((item) => (
          <div key={item.label} className="glass-card p-6 border border-white/10 shadow-2xl shadow-slate-950/20">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300/80 mb-3">{item.label}</p>
            <p className="text-3xl font-black text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card h-80 shimmer rounded-3xl"></div>
          ))}
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredHistory.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass-card group overflow-hidden cursor-pointer border border-white/10 shadow-2xl shadow-slate-950/10"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={item.image} alt={item.disease} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-x-0 top-4 px-4 flex items-center justify-between">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${item.status === 'Healthy' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                    {item.status}
                  </span>
                  <div className="rounded-2xl bg-slate-950/80 px-3 py-2 text-xs font-semibold text-slate-100 backdrop-blur">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.disease}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2">Detection confidence and report details for quick review.</p>
                  </div>
                  <span className="text-2xl font-black text-emerald-300">{item.confidence}%</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-300 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl border border-white/10 p-12 text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-white/5 text-emerald-300">
            <History className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-3">{t('noHistory')}</h3>
          <p className="text-slate-400">No reports yet. Upload an image to start tracking your crop health.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
