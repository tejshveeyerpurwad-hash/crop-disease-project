import React from 'react';
import { Leaf, Mail, MapPin, ArrowUp } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-black">A</span>
              </div>
              <span className="text-lg font-black text-white">Agri<span className="text-green-400">Pro</span></span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              AI-powered crop disease detection helping farmers protect their harvests and improve yields worldwide.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Scan</a></li>
              <li><a href="/history" className="hover:text-white transition-colors">History</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-green-400" /> support@agripro.ai</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-400" /> Bangalore, India</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-slate-800">
          <p className="text-xs">© {year} AgriPro. All rights reserved.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
