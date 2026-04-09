import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Languages, Leaf, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { darkMode, setDarkMode, language, setLanguage, t } = useAppContext();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('history'), path: '/history' },
    { name: t('about'), path: '/about' },
  ];

  const toggleMobile = () => setMobileOpen((value) => !value);

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/80 border-b border-white/10 backdrop-blur-xl shadow-lg shadow-slate-900/20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
            >
              <Leaf className="w-7 h-7" />
            </motion.div>
            <div className="space-y-1">
              <p className="text-lg font-semibold tracking-tight text-white">CropGuard AI</p>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">Crop Health Intelligence</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive ? 'text-emerald-300' : 'text-slate-300 hover:text-emerald-300'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.name}
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-emerald-400 transition-all ${
                      isActive ? 'opacity-100 w-full' : 'opacity-0 w-0'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="hidden md:inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-emerald-300/30 hover:bg-emerald-500/10"
              title="Toggle Language"
            >
              <Languages className="w-4 h-4" />
              <span className="font-semibold uppercase">{language}</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 transition hover:border-emerald-300/30 hover:bg-emerald-500/10"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleMobile}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 transition hover:border-emerald-300/30 hover:bg-emerald-500/10 md:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/20 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    location.pathname === link.path ? 'bg-emerald-500/15 text-emerald-200' : 'text-slate-200 hover:bg-white/5 hover:text-emerald-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 hover:border-emerald-300/30 hover:bg-emerald-500/10"
              >
                <span>Language</span>
                <span className="uppercase font-semibold">{language}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
