import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Hero = ({ onUploadClick }) => {
  const { t } = useAppContext();

  return (
    <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden opacity-20 dark:opacity-10">
         <div className="absolute top-[-100px] left-[-200px] w-[800px] h-[800px] bg-green-500 rounded-full blur-[120px]"></div>
         <div className="absolute top-[200px] right-[-300px] w-[600px] h-[600px] bg-emerald-500 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold mb-8 border border-green-200 dark:border-green-800/50"
        >
          <Leaf className="w-4 h-4" />
          <span>Advanced AI Detection Powered by Deep Learning</span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            {t('title')}
          </span>
        </motion.h1>

        <motion.p 
          className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button 
            onClick={onUploadClick}
            className="btn-primary w-full sm:w-auto h-14 text-lg space-x-2"
          >
            <span>{t('upload')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4">
             <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900 bg-green-500 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
             </div>
             <div className="text-left">
                <p className="text-sm font-bold">1,000+ Farmers</p>
                <p className="text-xs text-gray-500">Already using our platform</p>
             </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {[
            { icon: ShieldCheck, title: "Highly Accurate", desc: "98%+ accuracy on 30+ types of crops and diseases." },
            { icon: Zap, title: "Real-time Results", desc: "Get predictions within seconds after uploading your image." },
            { icon: Leaf, title: "Smart Care", desc: "Receive customized treatment and prevention recommendations." }
          ].map((feature, idx) => (
            <div key={idx} className="glass-card p-8 text-center flex flex-col items-center">
               <div className="p-3 bg-green-500/10 rounded-2xl mb-6">
                 <feature.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
               </div>
               <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
               <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
