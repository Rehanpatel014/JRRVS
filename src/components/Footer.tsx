import React, { useState } from 'react';
import { ArrowUpRight, Check, Shield } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  onSelectCategory: (category: Category) => void;
  onOpenSizeCalc: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onScrollToSection: (sectionId: string) => void;
  isAdmin?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSizeCalc,
  onOpenOrders,
  onOpenAdmin,
  onScrollToSection,
  isAdmin = false,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#090a0c] border-t border-[#1f2024] text-[#a1a1aa] font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-[#1f2024]">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-flex flex-col">
              <span className="font-heading text-3xl font-black uppercase text-white tracking-[-0.05em]">
                jrrvs
              </span>
              <span className="text-[10px] text-[#71717a] tracking-[0.2em] -mt-1 uppercase">
                campus archive studio
              </span>
            </div>

            <p className="text-xs text-[#71717a] font-normal leading-relaxed max-w-sm">
              Engineered minimal streetwear for college students and Gen-Z. Built from custom 280–460 GSM combed cottons and fleece, cut with true dropped shoulders and preshrunk anti-bacon collars.
            </p>

            <div className="text-[11px] text-[#71717a] space-y-1">
              <p>Campus Dispatch: Direct to dorm residence mailrooms</p>
              <p>Design Studio: Tokyo · Los Angeles · London</p>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-white font-semibold block">
              Catalog
            </span>
            <ul className="space-y-2">
              {[
                { label: 'Tees & Tops', cat: 'tees' as Category },
                { label: 'Hoodies & Sweats', cat: 'hoodies' as Category },
                { label: 'Cargos & Denim', cat: 'cargos' as Category },
                { label: 'Jackets & Shells', cat: 'outerwear' as Category },
                { label: 'Headwear & Slings', cat: 'accessories' as Category },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      onSelectCategory(item.cat);
                      onScrollToSection('catalog');
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus Protocols */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-white font-semibold block">
              Student Lab
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenOrders}
                  className="hover:text-white transition-colors text-left text-zinc-300 font-semibold"
                >
                  My Orders & Live Status
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSizeCalc}
                  className="hover:text-white transition-colors text-left"
                >
                  Size & Height Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('fit-builder')}
                  className="hover:text-white transition-colors text-left"
                >
                  Campus Fit Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('lookbook')}
                  className="hover:text-white transition-colors text-left"
                >
                  Uniform Lookbook
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('drop-countdown')}
                  className="hover:text-white transition-colors text-left"
                >
                  Drop 05 Radar
                </button>
              </li>
              {isAdmin && (
                <li className="pt-2 border-t border-[#1f2024]">
                  <button
                    onClick={onOpenAdmin}
                    className="text-amber-400/90 hover:text-amber-300 transition-colors text-left flex items-center gap-1.5 font-bold"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Portal Terminal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-white font-semibold block">
              Campus Drop Bulletin
            </span>
            <p className="text-xs text-[#71717a]">
              Receive secret password drops 60 minutes before general release.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Subscribed to JRRVS campus drops.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-[#141518] border border-[#27272a] rounded-l px-3 py-2 text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-zinc-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-white text-black font-bold uppercase rounded-r hover:bg-zinc-200 transition-colors"
                  >
                    Join
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#71717a]">
          <div>
            © {new Date().getFullYear()} JRRVS CLOTHING CO. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>TERMS OF SERVICE</span>
            <span>PRIVACY DISCLOSURE</span>
            <span>DORM MAILROOM COMPLIANCE</span>
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-amber-400 hover:text-amber-300 transition-colors uppercase font-bold flex items-center gap-1"
              >
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Admin Access</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
