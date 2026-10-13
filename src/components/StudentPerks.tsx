import React, { useState } from 'react';
import { School, Sparkles, Check, RefreshCw, Truck } from 'lucide-react';

export const StudentPerks: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('COLLEGE10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 border-b border-[#222428] bg-[#0c0d0e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner container */}
        <div className="bg-[#121316] border border-[#1f2024] rounded-xl p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#71717a] tracking-widest">
                <School className="w-4 h-4 text-zinc-400" />
                <span>VERIFIED STUDENT ADVANTAGE</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight">
                Crafted for College Life. Priced for Students.
              </h2>
              <p className="text-xs sm:text-sm text-[#a1a1aa] font-mono leading-relaxed max-w-2xl">
                We believe you shouldn't have to blow ₹8,000+ on hyped resell brands to get true 460 GSM heavyweight fleece and pristine boxy draping. Use our verified student voucher for an instant 10% reduction.
              </p>

              {/* Code Box */}
              <div className="pt-2 flex items-center gap-3">
                <div className="px-4 py-2 bg-[#18191c] border border-dashed border-[#3f3f46] rounded font-mono text-sm font-bold text-white tracking-widest flex items-center gap-2">
                  <span>COLLEGE10</span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-[#1f2024] hover:bg-white hover:text-black text-xs font-mono uppercase tracking-wider text-white rounded border border-[#27272a] transition-all flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <span>Copy Code</span>
                  )}
                </button>
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="lg:col-span-4 space-y-3 text-xs font-mono text-[#a1a1aa] border-t lg:border-t-0 lg:border-l border-[#1f2024] pt-6 lg:pt-0 lg:pl-8">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">Free Campus Shipping</span>
                  <span>Orders over ₹1,999 ship directly to student hostel / campus addresses.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <RefreshCw className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">Dorm Mailroom Size Swaps</span>
                  <span>Need a boxier fit? Swap sizes with prepaid return labels in 30 days.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">Zero Bacon Collar Warranty</span>
                  <span>If your collar warps within the semester, we replace the garment.</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
