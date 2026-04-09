import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Volume2, RotateCcw, Info, ChevronRight, XCircle, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ResultDisplay = ({ result, imagePreview, onReset }) => {
  const { t, language } = useAppContext();
  if (!result) return null;

  // Map new backend format to local variables
  // Expected fields: label, confidence, message, prevention
  const label = result.label || "Analysis Finished";
  const confidenceStr = result.confidence || "0%";
  const confidenceVal = parseFloat(confidenceStr);
  const message = result.message || "";
  const prevention = result.prevention || "";
  
  const isHealthy = label.toLowerCase().includes('healthy');
  const isInvalid = label.toLowerCase().includes('not a leaf');
  const isUncertain = label.toLowerCase().includes('uncertain');

  const speakResult = () => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = `${label}. ${message}`;
    speech.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(speech);
  };

  const getStatusConfig = () => {
    if (isInvalid) return { 
      bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', 
      icon: <XCircle className="w-6 h-6" />, iconBg: 'bg-slate-100', iconColor: 'text-slate-600',
      title: 'Invalid Image'
    };
    if (isUncertain) return { 
      bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', 
      icon: <Search className="w-6 h-6" />, iconBg: 'bg-amber-100', iconColor: 'text-amber-600',
      title: 'Uncertain Result'
    };
    if (isHealthy) return { 
      bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', 
      icon: <CheckCircle className="w-6 h-6" />, iconBg: 'bg-green-100', iconColor: 'text-green-600',
      title: 'Healthy'
    };
    return { 
      bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', 
      icon: <AlertTriangle className="w-6 h-6" />, iconBg: 'bg-red-100', iconColor: 'text-red-600',
      title: 'Diseased'
    };
  };

  const status = getStatusConfig();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Status Banner */}
        <div className={`px-8 py-6 flex items-center justify-between ${status.bg} border-b ${status.border}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${status.iconBg} ${status.iconColor}`}>
              {status.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Output</p>
              <h2 className={`text-xl font-black ${status.text}`}>
                {status.title}
              </h2>
            </div>
          </div>
          <button onClick={speakResult} className={`p-3 rounded-xl transition-all ${status.iconBg} ${status.iconColor} hover:brightness-95`}>
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
              <img src={imagePreview} alt="Scanned leaf" className="w-full h-full object-cover" />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Inferred Classification</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{label}</h3>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                  <p className={`text-xs font-semibold ${status.iconColor} uppercase tracking-wider mb-2`}>Expert Analysis</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{message}</p>
                </div>

                {prevention && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prevention & Action</p>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0">!</div>
                      <span className="text-sm text-slate-700 font-medium">{prevention}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confidence */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Neural Confidence</span>
                  <span className="text-lg font-black text-slate-900">{confidenceStr}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${confidenceVal}%` }} transition={{ duration: 1 }}
                    className={`h-full rounded-full ${status.iconColor.replace('text', 'bg')}`} />
                </div>
                {confidenceVal < 75 && (
                   <p className="text-[10px] text-amber-600 font-bold mt-2 uppercase tracking-tighter">* BELOW RELIABILITY THRESHOLD (0.75)</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between">
          <button onClick={onReset} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <RotateCcw className="w-4 h-4" /> New Scan
          </button>
          <a href="/history" className="flex items-center gap-1 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
            View History <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultDisplay;
