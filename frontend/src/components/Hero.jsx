import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Hero = ({ onUploadClick }) => {
  const { t } = useAppContext();

  const stats = [
    { label: 'Diseases Covered', value: '32+' },
    { label: 'Avg. Confidence', value: '94.7%' },
    { label: 'Realtime Updates', value: 'Supported' },
  ];

  return (
    <section className="relative overflow-hidden pt-16 pb-28 lg:pt-28 lg:pb-36">
      <div className="absolute inset-x-0 top-0 h-[520px] pointer-events-none">
        <div className="absolute left-[-8%] top-24 w-[320px] h-[320px] rounded-full bg-emerald-500/20 blur-3xl"></div>
        <div className="absolute right-[-12%] top-12 w-[380px] h-[380px] rounded-full bg-cyan-500/15 blur-3xl"></div>
        <div className="absolute left-1/2 top-[220px] h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-emerald-200 shadow-sm shadow-emerald-500/10 backdrop-blur"
        >
          <Leaf className="w-4 h-4 text-emerald-300" />
          <span className="ml-2">AI-powered detection with modern plant intelligence</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mt-10 text-center"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white">
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={onUploadClick}
            className="btn-primary inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold shadow-2xl shadow-emerald-500/20"
          >
            <span>{t('upload')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            className="inline-flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-slate-200 transition hover:border-emerald-300/30 hover:bg-emerald-500/10"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' })}
          >
            Explore Features
          </button>
        </motion.div>

        <motion.div
          className="mt-16 grid gap-6 lg:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card border border-white/10 p-6 text-left shadow-2xl shadow-slate-900/10">
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-300/80 mb-3">{stat.label}</p>
              <p className="text-4xl font-black text-white">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
