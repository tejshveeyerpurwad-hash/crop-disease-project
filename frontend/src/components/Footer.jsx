import React from 'react';
import { Leaf, Mail, Phone, MapPin, ExternalLink, Link, Globe, ArrowUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Footer = () => {
  const { t } = useAppContext();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900 pt-20 pb-10 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-green-500/5 blur-[120px] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
               <div className="p-2 bg-green-500/10 rounded-xl">
                 <Leaf className="w-6 h-6 text-green-600" />
               </div>
               <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                 CropGuard AI
               </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Empowering global agriculture with advanced artificial intelligence and computer vision technology.
            </p>
            <div className="flex space-x-4">
               {[ExternalLink, Link, Globe].map((Icon, i) => (
                 <a key={i} href="#" className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                   <Icon className="w-5 h-5" />
                 </a>
               ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-lg font-bold mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Dashboard', 'About', 'Research'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-8">Support & Legal</h4>
            <ul className="space-y-4">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Contact Support'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-8">Contact Us</h4>
            <ul className="space-y-6">
               <li className="flex items-start space-x-4">
                  <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">support@cropguardai.com</span>
               </li>
               <li className="flex items-start space-x-4">
                  <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">+91 (800) 123-4567</span>
               </li>
               <li className="flex items-start space-x-4">
                  <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Bangalore Innovation Hub,<br />Karnataka, India</span>
               </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-sm text-gray-500">
          <p>© 2026 CropGuard AI. All rights reserved.</p>
          <div className="flex items-center space-x-8">
             <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="font-medium">System Status: Operational</span>
             </div>
             <button 
                onClick={scrollToTop}
                className="p-3 bg-gray-50 dark:bg-gray-900 rounded-full hover:bg-green-50 dark:hover:bg-green-900/40 transition-colors"
                title="Scroll to Top"
             >
                <ArrowUp className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
