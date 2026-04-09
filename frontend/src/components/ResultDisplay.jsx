import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, Download, Share2, RefreshCcw } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ResultDisplay = ({ result, imagePreview, onReset }) => {
  const { t } = useAppContext();
  
  if (!result) return null;

  const isHealthy = result.status?.toLowerCase() === 'healthy';
  const confidence = result.confidence || 0;
  const diseaseName = result.disease || "Unknown Disease";
  const recommendation = result.recommendation || "Consult with a local agricultural expert for specific treatment advice.";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-12 px-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Main Result Card */}
        <div className="lg:col-span-3 space-y-8">
          <div className="glass-card overflow-hidden">
             <div className={`p-6 text-white flex items-center justify-between ${isHealthy ? 'bg-green-600' : 'bg-red-600'}`}>
                <div className="flex items-center space-x-3">
                   {isHealthy ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                   <div>
                      <h3 className="text-xl font-bold uppercase tracking-wider">{isHealthy ? t('healthy') : t('diseased')}</h3>
                      <p className="text-white/80 text-sm">Analysis Results</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-xs uppercase font-bold text-white/70">{t('confidence')}</p>
                   <p className="text-3xl font-black">{confidence}%</p>
                </div>
             </div>

             <div className="p-8">
                <div className="mb-8">
                   <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                     {isHealthy ? "Crop is Healthy" : diseaseName}
                   </h2>
                   <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-bold">
                        Leaf Analysis
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold">
                        AI Verified
                      </span>
                   </div>
                   
                   <div className="space-y-6">
                      <section>
                         <h4 className="text-sm font-bold uppercase text-gray-500 mb-2 flex items-center space-x-2">
                            <Info className="w-4 h-4" />
                            <span>About Detection</span>
                         </h4>
                         <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {isHealthy 
                              ? "No significant signs of common diseases were found in the uploaded leaf image. Your crop appears to be in good health."
                              : `Our AI detected signs that match the characteristics of ${diseaseName}. This can affect the yield if not treated promptly.`
                            }
                         </p>
                      </section>

                      <section className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                         <h4 className="text-sm font-bold uppercase text-green-600 dark:text-green-400 mb-3">Recommendations</h4>
                         <p className="text-gray-700 dark:text-gray-300 italic">{recommendation}</p>
                      </section>
                   </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                   <button className="btn-outline flex-1 py-4 text-sm" onClick={onReset}>
                     <RefreshCcw className="w-4 h-4 mr-2" />
                     Analyze Another
                   </button>
                   <button className="btn-primary flex-1 py-4 text-sm">
                     <Download className="w-4 h-4 mr-2" />
                     Save Report
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Media Sidebar */}
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-card p-4 space-y-4">
              <h4 className="text-sm font-bold uppercase text-gray-500">Uploaded Image</h4>
              <div className="aspect-square rounded-xl overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-900">
                 <img src={imagePreview} alt="Target" className="w-full h-full object-cover" />
              </div>
           </div>

           {result.heatmap && (
             <div className="glass-card p-4 space-y-4">
                <h4 className="text-sm font-bold uppercase text-gray-500 flex items-center justify-between">
                   <span>Grad-CAM Insight</span>
                   <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded leading-none">Explainable AI</span>
                </h4>
                <div className="aspect-square rounded-xl overflow-hidden shadow-inner relative group bg-gray-100 dark:bg-gray-900">
                   <img src={result.heatmap} alt="Heatmap" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                      <p className="text-xs text-white font-medium">Highlighting specific leaf areas that influenced the prediction.</p>
                   </div>
                </div>
             </div>
           )}

           <div className="glass-card p-6 flex items-center justify-between">
              <span className="text-sm font-bold">Share with others</span>
              <div className="flex space-x-2">
                 <button className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <Share2 className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultDisplay;
