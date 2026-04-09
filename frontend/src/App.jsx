import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

import { HistoryProvider } from './context/HistoryContext';

function App() {
  return (
    <AppProvider>
      <HistoryProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
                {/* Alias for direct access to upload from hero */}
                <Route path="/upload" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </HistoryProvider>
    </AppProvider>
  );
}

export default App;
