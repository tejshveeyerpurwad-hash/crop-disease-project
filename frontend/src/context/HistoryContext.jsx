import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [scans, setScans] = useState(() => {
    const saved = localStorage.getItem('agri_ai_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('agri_ai_history', JSON.stringify(scans));
  }, [scans]);

  const addScan = (scan) => {
    const newScan = {
      ...scan,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    setScans(prev => [newScan, ...prev.slice(0, 9)]); // Keep last 10
  };

  const clearHistory = () => setScans([]);

  return (
    <HistoryContext.Provider value={{ scans, addScan, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useScanHistory = () => useContext(HistoryContext);
