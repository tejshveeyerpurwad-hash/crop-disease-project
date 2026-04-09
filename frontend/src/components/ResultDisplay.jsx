import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, RefreshCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ResultDisplay = ({ result, imagePreview, onReset }) => {
  const { t, language } = useAppContext();
  
  if (!result) return null;

  const isHealthy = result.status?.toLowerCase() === 'healthy';
  const confidence = result.confidence || 0;
  const simpleAdvice = result.simple_advice?.[language] || result.simple_advice?.['en'];
  
  const speakResult = () => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = `${isHealthy ? t('healthy') : t('diseased')}. ${simpleAdvice}. Recommendations: ${result.recommendation}`;
    speech.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(speech);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className={`rounded-3xl shadow-2xl overflow-hidden border-8 ${isHealthy ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
        {/* Header Banner */}
        <div className={`p-8 text-center text-white ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}>
           <div className="flex flex-col items-center gap-4">
              {isHealthy ? <CheckCircle className="w-20 h-20" /> : <AlertTriangle className="w-20 h-20" />}
              <h1 className="text-4xl md:text-6xl font-black uppercase">
                {isHealthy ? t('healthy') : t('diseased')}
              </h1>
           </div>
        </div>

        <div className="p-6 md:p-10 space-y-8">
           {/* Voice Button - VERY BIG for farmers */}
           <button 
             onClick={speakResult}
             className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"
           >
              <RefreshCcw className="w-8 h-8 animate-pulse text-blue-200" />
              <span className="text-2xl font-bold">{t('speak')}</span>
           </button>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Image Preview */}
              <div className="space-y-4">
                 <h4 className="text-lg font-bold text-gray-500 uppercase tracking-widest">Your Plant Image</h4>
                 <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                    <img src={imagePreview} alt="Result" className="w-full h-full object-cover" />
                 </div>
              </div>

              {/* Analysis */}
              <div className="space-y-6">
                 <div>
                    <h4 className="text-lg font-bold text-gray-500 uppercase tracking-widest">{t('prediction')}</h4>
                    <p className="text-3xl font-black text-gray-800">{result.disease_name}</p>
                 </div>

                 <div className="p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
                    <h4 className="text-sm font-bold text-blue-600 mb-2">Advice for Farmer</h4>
                    <p className="text-xl font-medium text-gray-700 leading-relaxed italic">
                       "{simpleAdvice}"
                    </p>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-500 uppercase tracking-widest">Next Steps</h4>
                    <ul className="space-y-3">
                       {result.steps?.map((step, i) => (
                         <li key={i} className="flex items-start gap-3 text-lg font-medium text-gray-800">
                            <div className="mt-1.5 w-3 h-3 rounded-full bg-orange-500 shrink-0" />
                            {step}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>

           {/* Confidence Meter (Simplified) */}
           <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                 <span className="font-bold text-gray-500">{t('confidence')}</span>
                 <span className="font-bold text-gray-800">{result.confidence}%</span>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                 <div className={`h-full transition-all duration-1000 ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${result.confidence}%` }} />
              </div>
           </div>

           <button 
             onClick={onReset}
             className="w-full py-5 bg-gray-800 text-white rounded-2xl text-xl font-bold hover:bg-gray-900 transition-all shadow-lg"
           >
              {t('home')} / New Photo
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultDisplay;
