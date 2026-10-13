import React, { useState } from 'react';
import { Product } from '../types';
import { Layers, Sparkles, Check, RefreshCw, ShoppingBag } from 'lucide-react';

interface FitBuilderProps {
  products: Product[];
  onAddBundleToCart: (items: { product: Product; size: string; color: string }[]) => void;
}

export const FitBuilder: React.FC<FitBuilderProps> = ({ products, onAddBundleToCart }) => {
  const tops = products.filter((p) => p.category === 'tees' || p.category === 'hoodies');
  const bottoms = products.filter((p) => p.category === 'cargos');
  const accessories = products.filter((p) => p.category === 'accessories');

  const [selectedTopId, setSelectedTopId] = useState<string>(tops[0]?.id || '');
  const [selectedBottomId, setSelectedBottomId] = useState<string>(bottoms[0]?.id || '');
  const [selectedAccId, setSelectedAccId] = useState<string>(accessories[0]?.id || '');

  const [topSize, setTopSize] = useState<string>('L');
  const [bottomSize, setBottomSize] = useState<string>('M');
  const [isAdded, setIsAdded] = useState(false);

  const selectedTop = tops.find((p) => p.id === selectedTopId) || tops[0];
  const selectedBottom = bottoms.find((p) => p.id === selectedBottomId) || bottoms[0];
  const selectedAcc = accessories.find((p) => p.id === selectedAccId) || accessories[0];

  if (!selectedTop || !selectedBottom || !selectedAcc) {
    return null;
  }

  const rawTotal = selectedTop.price + selectedBottom.price + selectedAcc.price;
  const bundleDiscountPercent = 15;
  const bundleTotal = Math.round(rawTotal * (1 - bundleDiscountPercent / 100));
  const savings = rawTotal - bundleTotal;
  const combinedGsm = selectedTop.gsm + selectedBottom.gsm + selectedAcc.gsm;

  const handleRandomize = () => {
    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    const randomAcc = accessories[Math.floor(Math.random() * accessories.length)];
    setSelectedTopId(randomTop.id);
    setSelectedBottomId(randomBottom.id);
    setSelectedAccId(randomAcc.id);
  };

  const handleAddBundle = () => {
    onAddBundleToCart([
      { product: selectedTop, size: topSize, color: selectedTop.color },
      { product: selectedBottom, size: bottomSize, color: selectedBottom.color },
      { product: selectedAcc, size: 'M', color: selectedAcc.color },
    ]);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <section id="fit-builder" className="py-20 border-t border-b border-[#222428] bg-[#0e0f12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#71717a] tracking-widest mb-1">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>INTERACTIVE OUTFIT BUILDER</span>
              <span aria-hidden="true">·</span>
              <span>15% AUTOMATIC BUNDLE REBATE</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
              Build Your Campus Fit
            </h2>
          </div>

          <button
            onClick={handleRandomize}
            className="self-start md:self-auto inline-flex items-center gap-2 px-3.5 py-2 bg-[#18181b] hover:bg-[#27272a] text-xs font-mono text-white rounded border border-[#27272a] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Shuffle Fit Pieces</span>
          </button>
        </div>

        {/* Builder Grid: 3 columns for selecting pieces + live outfit summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 3 Layer Selectors */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. TOP SELECTOR */}
            <div className="p-5 bg-[#121316] border border-[#1f2024] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-zinc-300 font-semibold">
                  01. Select Upper Body
                </span>
                <span className="text-[11px] font-mono text-[#71717a]">{selectedTop.name}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tops.slice(0, 6).map((top) => {
                  const isSel = top.id === selectedTop.id;
                  return (
                    <button
                      key={top.id}
                      onClick={() => setSelectedTopId(top.id)}
                      className={`relative text-left p-2 rounded border transition-all flex flex-col items-center ${
                        isSel
                          ? 'bg-[#1c1d22] border-white ring-1 ring-white/50'
                          : 'bg-[#16171b] border-[#222428] hover:border-[#383a42]'
                      }`}
                    >
                      <img
                        src={top.image}
                        alt={top.name}
                        className="w-full aspect-square object-cover rounded mb-2"
                      />
                      <span className="text-[11px] font-medium text-white truncate w-full text-center">
                        {top.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#a1a1aa]">₹{top.price.toLocaleString('en-IN')}</span>
                    </button>
                  );
                })}
              </div>

              {/* Size Picker for Top */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#1f2024]">
                <span className="text-[10px] font-mono text-[#71717a]">SIZE:</span>
                {selectedTop.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTopSize(s)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                      topSize === s ? 'bg-white text-black font-bold' : 'bg-[#18181b] text-[#a1a1aa]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. BOTTOM SELECTOR */}
            <div className="p-5 bg-[#121316] border border-[#1f2024] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-zinc-300 font-semibold">
                  02. Select Pant / Cargo
                </span>
                <span className="text-[11px] font-mono text-[#71717a]">{selectedBottom.name}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {bottoms.map((btm) => {
                  const isSel = btm.id === selectedBottom.id;
                  return (
                    <button
                      key={btm.id}
                      onClick={() => setSelectedBottomId(btm.id)}
                      className={`relative text-left p-2 rounded border transition-all flex flex-col items-center ${
                        isSel
                          ? 'bg-[#1c1d22] border-white ring-1 ring-white/50'
                          : 'bg-[#16171b] border-[#222428] hover:border-[#383a42]'
                      }`}
                    >
                      <img
                        src={btm.image}
                        alt={btm.name}
                        className="w-full aspect-square object-cover rounded mb-2"
                      />
                      <span className="text-[11px] font-medium text-white truncate w-full text-center">
                        {btm.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#a1a1aa]">₹{btm.price.toLocaleString('en-IN')}</span>
                    </button>
                  );
                })}
              </div>

              {/* Size Picker for Bottom */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#1f2024]">
                <span className="text-[10px] font-mono text-[#71717a]">WAIST:</span>
                {selectedBottom.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setBottomSize(s)}
                    className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                      bottomSize === s ? 'bg-white text-black font-bold' : 'bg-[#18181b] text-[#a1a1aa]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. ACCESSORY SELECTOR */}
            <div className="p-5 bg-[#121316] border border-[#1f2024] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase text-zinc-300 font-semibold">
                  03. Select Essential Accessory
                </span>
                <span className="text-[11px] font-mono text-[#71717a]">{selectedAcc.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {accessories.map((acc) => {
                  const isSel = acc.id === selectedAcc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedAccId(acc.id)}
                      className={`relative text-left p-2 rounded border transition-all flex flex-col items-center ${
                        isSel
                          ? 'bg-[#1c1d22] border-white ring-1 ring-white/50'
                          : 'bg-[#16171b] border-[#222428] hover:border-[#383a42]'
                      }`}
                    >
                      <img
                        src={acc.image}
                        alt={acc.name}
                        className="w-full aspect-square object-cover rounded mb-2"
                      />
                      <span className="text-[11px] font-medium text-white truncate w-full text-center">
                        {acc.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#a1a1aa]">₹{acc.price.toLocaleString('en-IN')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Styled Fit Preview & Bundle Math */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="p-6 bg-[#121316] border border-[#1f2024] rounded-lg">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#1f2024]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717a]">
                    CAMPUS FIT SIMULATION
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white">
                    The {selectedTop.fit} Uniform
                  </h3>
                </div>
                <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-600/30 text-emerald-400 font-mono text-[10px] rounded uppercase">
                  15% Bundle Off
                </span>
              </div>

              {/* Visual Fit Stack */}
              <div className="grid grid-cols-3 gap-2 my-5">
                <div className="space-y-1">
                  <div className="aspect-[3/4] bg-[#18191c] rounded overflow-hidden">
                    <img
                      src={selectedTop.image}
                      alt={selectedTop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-300 truncate">{selectedTop.name}</p>
                  <p className="text-[9px] text-[#71717a] font-mono">Size {topSize}</p>
                </div>

                <div className="space-y-1">
                  <div className="aspect-[3/4] bg-[#18191c] rounded overflow-hidden">
                    <img
                      src={selectedBottom.image}
                      alt={selectedBottom.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-300 truncate">{selectedBottom.name}</p>
                  <p className="text-[9px] text-[#71717a] font-mono">Size {bottomSize}</p>
                </div>

                <div className="space-y-1">
                  <div className="aspect-[3/4] bg-[#18191c] rounded overflow-hidden">
                    <img
                      src={selectedAcc.image}
                      alt={selectedAcc.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-300 truncate">{selectedAcc.name}</p>
                  <p className="text-[9px] text-[#71717a] font-mono">One Size</p>
                </div>
              </div>

              {/* Fit Tech Details */}
              <div className="py-3 px-3.5 bg-[#18181b] rounded text-xs space-y-1.5 font-mono mb-5">
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>Total Textile Density:</span>
                  <span className="text-white font-bold">{combinedGsm} GSM Combined</span>
                </div>
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>Silhouette Profile:</span>
                  <span className="text-white">Boxy Drop Shoulder + Wide Stack</span>
                </div>
                <div className="flex justify-between text-[#a1a1aa]">
                  <span>Dorm Care:</span>
                  <span className="text-white">Cold Wash / Anti-Bacon Rib</span>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 border-t border-[#1f2024] pt-4 mb-6">
                <div className="flex justify-between text-xs text-[#71717a] font-mono">
                  <span>Regular Total (3 items):</span>
                  <span className="line-through">₹{rawTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400 font-mono">
                  <span>Campus Bundle Perk (15%):</span>
                  <span>-₹{savings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-white">
                    Complete Fit Price:
                  </span>
                  <div className="text-right">
                    <span className="font-heading text-3xl font-extrabold text-white">
                      ₹{bundleTotal.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] text-[#71717a] font-mono">
                      Includes Free Campus Express Shipping
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAddBundle}
                className={`w-full py-3.5 px-4 font-mono text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-black hover:bg-[#e4e4e7] font-bold shadow-lg'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Fit Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Entire Fit to Bag (₹{bundleTotal.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
