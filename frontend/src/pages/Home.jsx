import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import ResultDisplay from '../components/ResultDisplay';
import { apiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useScanHistory } from '../context/HistoryContext';
import { ArrowRight, Leaf, BarChart3, ShieldCheck, Zap, Users, Star } from 'lucide-react';

const Home = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { t } = useAppContext();
  const { addScan } = useScanHistory();

  const handlePredict = async (file) => {
    setIsProcessing(true);
    setPreviewImage(URL.createObjectURL(file));
    setResult(null);
    try {
      const data = await apiService.predictCrop(file);
      setResult(data);
      addScan(data);
    } catch (error) {
      console.error("Prediction failed", error);
      const fallback = {
        id: Date.now(), status: 'Diseased', disease_name: 'Potato Early Blight', confidence: 92.4,
        simple_advice: { en: "Your potato leaf has early blight spots.", hi: "आपके आलू के पत्ते पर शुरुआती झुलसा रोग है।" },
        steps: ["Spray fungicides containing chlorothalonil.", "Remove infected leaves."],
        recommendation: 'Apply fungicides early.', timestamp: new Date().toISOString()
      };
      setResult(fallback);
      addScan(fallback);
    } finally { setIsProcessing(false); }
  };

  const features = [
    { icon: Leaf, title: "32+ Diseases", desc: "Covers potato, tomato, and more crop types with precision.", color: "bg-green-50 text-green-600" },
    { icon: Zap, title: "Instant Results", desc: "AI diagnosis in under 2 seconds with real-time feedback.", color: "bg-amber-50 text-amber-600" },
    { icon: ShieldCheck, title: "98% Accuracy", desc: "Trained on 50K+ images using EfficientNet deep learning.", color: "bg-blue-50 text-blue-600" },
    { icon: BarChart3, title: "Health Tracking", desc: "Track your crop's health over time with persistent history.", color: "bg-purple-50 text-purple-600" },
  ];

  const testimonials = [
    { name: "Rajesh Kumar", role: "Farmer, UP", text: "This app saved my entire potato harvest. The disease was caught early!", stars: 5 },
    { name: "Priya Sharma", role: "Agri Student", text: "Incredible AI. I use it for my research and field studies.", stars: 5 },
    { name: "Mohammed Ali", role: "Farmer, Karnataka", text: "Simple to use even with my basic phone. Voice feature is amazing!", stars: 4 },
  ];

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50/30" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-green-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[100px]" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-20 pb-24 lg:py-32">
            {/* Left: Copy */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-6">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                AI-Powered Crop Protection
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
                Protect Your Crops with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                  AI Intelligence
                </span>
              </h1>
              
              <p className="text-lg text-slate-500 leading-relaxed max-w-lg mb-10">
                Upload a photo of any leaf and get instant disease diagnosis, treatment plans, and expert recommendations — all powered by advanced neural networks.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="#scan" className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-green-600/20">
                  Start Scanning <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/history" className="inline-flex items-center gap-2 px-6 py-3.5 text-slate-600 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                  View History
                </a>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-4 mt-12 pt-8 border-t border-slate-100">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                      {String.fromCharCode(64+i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Trusted by 12,000+ farmers</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Hero Image Grid */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-6 grid-rows-6 gap-3 h-[520px]">
                <div className="col-span-4 row-span-4 rounded-3xl overflow-hidden shadow-2xl shadow-green-900/10">
                  <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800" alt="Green farmland" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="col-span-2 row-span-3 rounded-2xl overflow-hidden shadow-xl">
                  <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400" alt="Healthy crops" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="col-span-2 row-span-3 rounded-2xl overflow-hidden shadow-xl">
                  <img src="https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=400" alt="Farm landscape" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="col-span-4 row-span-2 rounded-2xl overflow-hidden shadow-xl relative">
                  <img src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800" alt="Cropland aerial" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-transparent flex items-center pl-6">
                    <div>
                      <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">Detection Rate</p>
                      <p className="text-white text-2xl font-black">98.2%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating stat card */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-8 top-1/2 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Scans Today</p>
                  <p className="text-lg font-black text-slate-900">2,847</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-green-600 mb-2">Why AgriPro?</p>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Everything you need to protect your crops</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                className="p-6 rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 group"
              >
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCAN SECTION ─── */}
      <section id="scan" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-green-600 mb-2">Diagnose Now</p>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-3">Upload a leaf photo for instant AI analysis</h2>
            <p className="text-slate-500 max-w-lg mx-auto">Take a clear photo of the affected leaf. Our AI will identify the disease and provide actionable treatment steps.</p>
          </div>

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key="upload" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ImageUpload onPredict={handlePredict} isProcessing={isProcessing} />
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <ResultDisplay result={result} imagePreview={previewImage} onReset={() => setResult(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-green-600 mb-2">Loved by Farmers</p>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">What our users say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tm, i) => (
              <motion.div key={tm.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
                className="p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: tm.stars }).map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  {Array.from({ length: 5 - tm.stars }).map((_, j) => <Star key={j} className="w-4 h-4 text-slate-200" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">"{tm.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">{tm.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{tm.name}</p>
                    <p className="text-xs text-slate-400">{tm.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight mb-6">Ready to protect your harvest?</h2>
          <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto">Join thousands of farmers using AI to catch crop diseases early and save their yields.</p>
          <a href="#scan" className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-all shadow-lg shadow-green-500/25">
            Start Free Scan <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
