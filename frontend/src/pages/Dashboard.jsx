import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Filter, Search, Calendar, ChevronRight, History } from 'lucide-react';
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
      // Mock data if empty for demo purposes
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

  const filteredHistory = history.filter(item => 
    item.disease.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">{t('previous')}</h1>
          <p className="text-gray-500 dark:text-gray-400">Review and manage your crop health reports over time.</p>
        </div>

        <div className="flex items-center space-x-4">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search history..."
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <Filter className="w-5 h-5 text-gray-500" />
           </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => (
             <div key={i} className="glass-card h-80 shimmer rounded-2xl"></div>
           ))}
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredHistory.map((item, idx) => (
             <motion.div 
               key={item.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="glass-card group overflow-hidden cursor-pointer"
             >
                <div className="relative h-48 overflow-hidden">
                   <img src={item.image} alt={item.disease} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${item.status === 'Healthy' ? 'bg-green-500' : 'bg-red-500'}`}>
                        {item.status}
                      </span>
                   </div>
                   <div className="absolute bottom-4 right-4">
                      <div className="glass px-3 py-1.5 rounded-lg flex items-center space-x-2 text-xs font-bold">
                        <History className="w-3.5 h-3.5" />
                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                   </div>
                </div>

                <div className="p-6">
                   <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {item.disease}
                      </h3>
                      <span className="text-green-600 dark:text-green-400 font-black">{item.confidence}%</span>
                   </div>
                   
                   <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      ) : (
        <div className="text-center py-24 glass-card">
           <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-gray-400" />
           </div>
           <h3 className="text-2xl font-bold mb-2">{t('noHistory')}</h3>
           <p className="text-gray-500">Your future detection reports will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
