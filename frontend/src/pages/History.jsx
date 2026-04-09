import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Clock, Activity, Leaf } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/history/');
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading history...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center mb-8">
        <Clock className="w-8 h-8 text-nature-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Diagnosis History</h1>
      </div>
      
      {history.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
           <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <h3 className="text-xl font-medium text-gray-600">No predictions found</h3>
           <p className="text-gray-500 mt-2">Upload a leaf image to generate your first diagnostic report.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className="h-48 bg-gray-100 relative">
                <img src={`http://localhost:8000${item.image_path}`} alt={item.crop_type} className="w-full h-full object-cover" />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${item.disease_status === 'Healthy' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {item.disease_status}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center">
                    <Leaf className="w-4 h-4 text-nature-500 mr-2" />
                    {item.crop_type}
                  </h3>
                  <span className="text-sm font-medium text-gray-500">{item.confidence}%</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                   <p className="text-xs text-gray-500 mb-1">Recommendation</p>
                   <p className="text-sm text-gray-800 line-clamp-2">{item.treatment_recommendation}</p>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
