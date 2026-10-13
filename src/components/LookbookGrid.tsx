import React from 'react';
import { LOOKBOOK_LOOKS } from '../data/products';
import { Camera, MapPin, ArrowUpRight } from 'lucide-react';
import { Category } from '../types';

interface LookbookGridProps {
  onSelectCategory: (category: Category) => void;
  onScrollToCatalog: () => void;
}

export const LookbookGrid: React.FC<LookbookGridProps> = ({
  onSelectCategory,
  onScrollToCatalog,
}) => {
  return (
    <section id="lookbook" className="py-20 border-b border-[#222428] bg-[#0c0d0e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#71717a] tracking-widest mb-1.5">
              <Camera className="w-3.5 h-3.5 text-zinc-400" />
              <span>EDITORIAL ARCHIVE</span>
              <span aria-hidden="true">·</span>
              <span>CAMPUS DOCUMENTATION</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
              The Campus Uniform In Motion
            </h2>
          </div>

          <p className="text-xs text-[#a1a1aa] font-mono max-w-md">
            Unfiltered field captures across university halls, studios, and late-night library marathons. Pure heavyweight drape without artificial styling.
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LOOKBOOK_LOOKS.map((look) => (
            <div
              key={look.id}
              className="group flex flex-col bg-[#121316] border border-[#1f2024] hover:border-[#383a42] rounded-lg overflow-hidden transition-all duration-300"
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/5] bg-[#18191c] overflow-hidden">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Location indicator */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>{look.location}</span>
                  </span>
                </div>
              </div>

              {/* Look Description */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight">
                    {look.title}
                  </h3>
                  <p className="text-xs text-[#a1a1aa] font-light mt-1 leading-relaxed">
                    {look.description}
                  </p>
                </div>

                {/* Items in look */}
                <div className="pt-3 border-t border-[#1f2024] space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#71717a] block">
                    Uniform Breakdown:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {look.items.map((item, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-mono text-zinc-300 bg-[#18191c] px-2 py-0.5 rounded border border-[#27272a]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onSelectCategory('all');
                      onScrollToCatalog();
                    }}
                    className="w-full mt-3 py-2 text-xs font-mono uppercase tracking-wider text-white hover:text-black hover:bg-white border border-[#27272a] rounded transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Shop Look Pieces</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
