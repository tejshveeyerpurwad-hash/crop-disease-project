import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { darkMode, setDarkMode, language, setLanguage, t } = useAppContext();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'History', path: '/history' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="sticky top-0 z-[100] w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <span className="text-white text-sm font-black">A</span>
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">Agri<span className="text-green-600">Pro</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                location.pathname === link.path 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setLanguage('en')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>EN</button>
            <button onClick={() => setLanguage('hi')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${language === 'hi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>हिं</button>
          </div>

          <button onClick={() => setDarkMode(!darkMode)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button onClick={() => setMobileOpen(v => !v)} className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="md:hidden overflow-hidden bg-white border-t border-slate-100">
            <div className="px-6 py-4 space-y-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-semibold ${location.pathname === link.path ? 'text-green-700 bg-green-50' : 'text-slate-600'}`}>
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
