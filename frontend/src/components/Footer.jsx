import React from 'react';
import { Leaf, Mail, Phone, MapPin, ExternalLink, Globe, ArrowUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const socialLinks = [
  { label: 'Website', icon: ExternalLink, href: '#' },
  { label: 'Docs', icon: Globe, href: '#' },
  { label: 'Community', icon: Globe, href: '#' },
];

const links = ['Home', 'Dashboard', 'About', 'Research'];
const legalLinks = ['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Contact Support'];

const Footer = () => {
  const { t } = useAppContext();
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-shell relative overflow-hidden bg-slate-950 text-slate-300 border-t border-white/10 py-20">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_transparent_35%)] pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid gap-10 xl:grid-cols-[2fr_1.1fr_1fr_1.2fr] mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-300/20">
                <Leaf className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xl font-semibold text-white">CropGuard AI</p>
                <p className="text-sm text-slate-400">Advanced crop diagnostics with intelligent plant insights.</p>
              </div>
            </div>

            <p className="max-w-md leading-7 text-slate-400">
              Empowering global agriculture with AI-driven crop disease detection, predictive analysis, and farmer-friendly recommendations.
            </p>

            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-200 transition hover:bg-emerald-500/15 hover:text-emerald-300"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Navigation</h4>
            <ul className="space-y-4 text-slate-400">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Support</h4>
            <ul className="space-y-4 text-slate-400">
              {legalLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="transition hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Contact us</h4>
            <div className="space-y-5 text-slate-400">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-emerald-300">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm">support@cropguardai.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-emerald-300">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm">+91 (800) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-emerald-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm leading-6">Bangalore Innovation Hub, Karnataka, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} CropGuard AI. All rights reserved.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
              System Status: Operational
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-emerald-500/15"
              title="Scroll to Top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
