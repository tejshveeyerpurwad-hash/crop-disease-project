import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Users, Cpu, Globe, Shield, Zap, ArrowRight } from 'lucide-react';

const About = () => {
  const team = [
    { name: "Tejsh V.", role: "AI Engineer", initial: "T" },
    { name: "Dev Team", role: "Full-Stack", initial: "D" },
    { name: "Research", role: "Data Science", initial: "R" },
    { name: "Design", role: "UX/UI", initial: "U" },
  ];

  const tech = [
    { icon: Cpu, name: "EfficientNet B0", desc: "Transfer learning on 50K+ leaf images for precision classification" },
    { icon: Shield, name: "Multi-Signal Guard", desc: "4-stage heuristic engine prevents false positives on healthy leaves" },
    { icon: Zap, name: "Real-Time Inference", desc: "Sub-second predictions with TTA (Test Time Augmentation)" },
    { icon: Globe, name: "Multilingual AI", desc: "Results delivered in English and Hindi with voice synthesis" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50/30 py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/20 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-6">
              <Leaf className="w-3 h-3" /> Our Mission
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
              Making crop protection{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">accessible to every farmer</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              AgriPro uses deep learning to detect 32+ crop diseases instantly. Our goal is to 
              reduce crop loss and minimize unnecessary pesticide use for small-scale and commercial farmers alike.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-green-600 mb-2">How It Works</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Three simple steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Photo", desc: "Take a clear photo of the affected leaf using your phone camera or upload from gallery." },
              { step: "02", title: "AI Analyzes", desc: "Our neural network processes the image through multiple classification layers in under 2 seconds." },
              { step: "03", title: "Get Results", desc: "Receive disease identification, confidence score, and actionable treatment recommendations." },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative p-8 rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-lg transition-all"
              >
                <span className="text-5xl font-black text-slate-100 absolute top-6 right-6">{item.step}</span>
                <div className="relative">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-green-600 mb-2">Technology</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Built with cutting-edge AI</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tech.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-green-600 mb-2">Team</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Built by passionate engineers</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="text-center p-6 rounded-2xl border border-slate-100 hover:border-green-200 transition-all"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-green-500/20">
                  {member.initial}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs text-slate-400 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.15),_transparent_60%)]" />
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-4">Support Indian Agriculture</h2>
          <p className="text-slate-400 mb-8">Our project is open-source and constantly evolving. Join us in building a more sustainable future for farming.</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 transition-all shadow-lg shadow-green-500/25">
            Try AgriPro Now <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
