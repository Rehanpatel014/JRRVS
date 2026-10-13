import React from 'react';
import { ArrowRight, Layers, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreDrop: () => void;
  onOpenFitBuilder: () => void;
  onOpenSizeGuide: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreDrop,
  onOpenFitBuilder,
  onOpenSizeGuide,
}) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#222428]">
      {/* Background Streetwear Editorial Visual with moody lighting */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=85"
          alt="JRRVS Campus Streetwear Drop 04"
          className="w-full h-full object-cover object-center brightness-[0.38] contrast-[1.1] scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d0e] via-[#0c0d0e]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d0e]/80 via-transparent to-[#0c0d0e]/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Unboxed editorial category kicker (Zero-pill rule compliant) */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#a1a1aa] mb-4">
          <span>DROP 04</span>
          <span aria-hidden="true" className="text-[#52525b]">/</span>
          <span>CAMPUS UNIFORM</span>
          <span aria-hidden="true" className="text-[#52525b]">/</span>
          <span>EST. 2026</span>
        </div>

        {/* Main Brand Title */}
        <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.05em] uppercase text-white leading-[0.95] mb-6">
          ENGINEERED <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
            DRAPE & WEIGHT.
          </span>
        </h1>

        {/* Brand Mission / Brief */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#a1a1aa] font-normal leading-relaxed mb-8">
          Minimal luxury streetwear engineered specifically for college lecture halls, late library grinds, and off-campus links. Custom 280–460 GSM textiles, drop-shoulder silhouettes, and pre-shrunk anti-bacon collars.
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14">
          <button
            onClick={onExploreDrop}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-black font-semibold text-xs uppercase tracking-widest rounded hover:bg-[#e4e4e7] transition-all shadow-lg shadow-white/5"
          >
            <span>Explore Drop 04</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenFitBuilder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#18181b] text-white border border-[#27272a] hover:border-[#52525b] hover:bg-[#202024] font-semibold text-xs uppercase tracking-widest rounded transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-[#a1a1aa]" />
            <span>Interactive Fit Builder</span>
          </button>
          <button
            onClick={onOpenSizeGuide}
            className="text-xs text-[#a1a1aa] hover:text-white underline underline-offset-4 tracking-wider transition-colors py-2 px-3"
          >
            Size & Height Guide
          </button>
        </div>

        {/* Minimal Editorial Badges Bar (Quiet typography, no fake metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#222428]/80 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              <span>Heavyweight 280-460 GSM</span>
            </div>
            <p className="text-xs text-[#71717a] leading-normal">
              Heavy gauge loopback cotton and combed jersey that drapes cleanly without clinging.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white text-xs font-mono uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>Campus Boxy Drape</span>
            </div>
            <p className="text-xs text-[#71717a] leading-normal">
              True oversized dropped shoulders cut wide at the chest with zero waist bunching.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white text-xs font-mono uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Dorm Laundry Tested</span>
            </div>
            <p className="text-xs text-[#71717a] leading-normal">
              Enzyme pre-shrunk fabrics with reinforced 1.25" rib knit collars that won’t fry in industrial washers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
