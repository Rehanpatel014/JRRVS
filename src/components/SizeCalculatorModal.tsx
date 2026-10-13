import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check, Info } from 'lucide-react';

interface SizeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeCalculatorModal: React.FC<SizeCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [heightFeet, setHeightFeet] = useState<number>(6);
  const [heightInches, setHeightInches] = useState<number>(0);
  const [weightLbs, setWeightLbs] = useState<number>(165);
  const [fitPreference, setFitPreference] = useState<'standard' | 'oversized' | 'baggy'>('oversized');

  if (!isOpen) return null;

  // Calculate recommended size
  const totalInches = heightFeet * 12 + heightInches;

  let baseSize: 'S' | 'M' | 'L' | 'XL' | 'XXL' = 'M';
  if (totalInches <= 68 && weightLbs <= 145) {
    baseSize = 'S';
  } else if (totalInches <= 71 && weightLbs <= 165) {
    baseSize = 'M';
  } else if (totalInches <= 74 && weightLbs <= 190) {
    baseSize = 'L';
  } else if (totalInches <= 76 && weightLbs <= 215) {
    baseSize = 'XL';
  } else {
    baseSize = 'XXL';
  }

  // Adjust for fit preference
  let recommendedSize = baseSize;
  if (fitPreference === 'standard') {
    if (baseSize === 'XXL') recommendedSize = 'XL';
    else if (baseSize === 'XL') recommendedSize = 'L';
    else if (baseSize === 'L') recommendedSize = 'M';
    else if (baseSize === 'M') recommendedSize = 'S';
  } else if (fitPreference === 'baggy') {
    if (baseSize === 'S') recommendedSize = 'M';
    else if (baseSize === 'M') recommendedSize = 'L';
    else if (baseSize === 'L') recommendedSize = 'XL';
    else if (baseSize === 'XL') recommendedSize = 'XXL';
  }

  const measurements = [
    { size: 'S', chest: '44"', length: '28.5"', shoulder: '21.5"', waist: '28-30"' },
    { size: 'M', chest: '47"', length: '29.5"', shoulder: '22.5"', waist: '31-33"' },
    { size: 'L', chest: '50"', length: '30.5"', shoulder: '23.5"', waist: '34-36"' },
    { size: 'XL', chest: '53"', length: '31.5"', shoulder: '24.5"', waist: '36-38"' },
    { size: 'XXL', chest: '56"', length: '32.5"', shoulder: '25.5"', waist: '38-40"' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#121316] border border-[#222428] rounded-xl p-6 sm:p-8 shadow-2xl my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#a1a1aa] hover:text-white rounded-full bg-[#1c1d22]"
          aria-label="Close fit calculator"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#71717a] mb-1">
          <Ruler className="w-3.5 h-3.5 text-zinc-400" />
          <span>CAMPUS SIZING PROTOCOL</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
          Find Your College Silhouette
        </h2>
        <p className="text-xs text-[#a1a1aa] mt-1 mb-6">
          JRRVS garments are deliberately designed with dropped shoulders and roomy torsos. Input your height and build for your recommended size.
        </p>

        {/* Sliders & Inputs */}
        <div className="space-y-5 bg-[#18191c] p-5 rounded-lg border border-[#222428]">
          
          {/* Height */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-[#a1a1aa]">YOUR HEIGHT:</span>
              <span className="text-white font-bold">{heightFeet}'{heightInches}" ({Math.round(totalInches * 2.54)} cm)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-[#71717a] block mb-1">FEET</label>
                <select
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(Number(e.target.value))}
                  className="w-full bg-[#121316] border border-[#27272a] text-white text-xs rounded p-2 font-mono"
                >
                  <option value={5}>5 ft</option>
                  <option value={6}>6 ft</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#71717a] block mb-1">INCHES</label>
                <select
                  value={heightInches}
                  onChange={(e) => setHeightInches(Number(e.target.value))}
                  className="w-full bg-[#121316] border border-[#27272a] text-white text-xs rounded p-2 font-mono"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((inch) => (
                    <option key={inch} value={inch}>
                      {inch} in
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-[#a1a1aa]">YOUR WEIGHT:</span>
              <span className="text-white font-bold">{weightLbs} lbs ({Math.round(weightLbs * 0.453592)} kg)</span>
            </div>
            <input
              type="range"
              min={120}
              max={230}
              step={2}
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="w-full accent-white bg-[#27272a] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#71717a] mt-1">
              <span>120 lbs</span>
              <span>175 lbs</span>
              <span>230 lbs</span>
            </div>
          </div>

          {/* Fit Preference */}
          <div>
            <span className="text-xs font-mono text-[#a1a1aa] block mb-2">INTENDED DRAPE:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFitPreference('standard')}
                className={`p-2.5 rounded border text-left transition-all ${
                  fitPreference === 'standard'
                    ? 'border-white bg-[#22242a] text-white'
                    : 'border-[#27272a] bg-[#121316] text-[#71717a]'
                }`}
              >
                <span className="block text-xs font-mono font-bold text-white">Fitted / Clean</span>
                <span className="text-[10px] font-mono text-[#a1a1aa]">Closer body profile</span>
              </button>

              <button
                onClick={() => setFitPreference('oversized')}
                className={`p-2.5 rounded border text-left transition-all ${
                  fitPreference === 'oversized'
                    ? 'border-white bg-[#22242a] text-white'
                    : 'border-[#27272a] bg-[#121316] text-[#71717a]'
                }`}
              >
                <span className="block text-xs font-mono font-bold text-white">Signature Boxy</span>
                <span className="text-[10px] font-mono text-[#a1a1aa]">Our designed drape</span>
              </button>

              <button
                onClick={() => setFitPreference('baggy')}
                className={`p-2.5 rounded border text-left transition-all ${
                  fitPreference === 'baggy'
                    ? 'border-white bg-[#22242a] text-white'
                    : 'border-[#27272a] bg-[#121316] text-[#71717a]'
                }`}
              >
                <span className="block text-xs font-mono font-bold text-white">Ultra Baggy</span>
                <span className="text-[10px] font-mono text-[#a1a1aa]">Deep stacked skater</span>
              </button>
            </div>
          </div>

        </div>

        {/* Calculation Result */}
        <div className="mt-6 p-4 bg-[#1b1d22] border border-white/20 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
              YOUR OPTIMAL SIZE
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-heading text-3xl font-black text-white">
                SIZE {recommendedSize}
              </span>
              <span className="text-xs font-mono text-emerald-400">97% campus fit match</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-wider rounded font-bold hover:bg-zinc-200 transition-colors"
          >
            Apply to Browsing
          </button>
        </div>

        {/* Garment Sizing Table */}
        <div className="mt-6 overflow-x-auto">
          <span className="text-[11px] font-mono uppercase text-[#71717a] block mb-2">
            Garment Dimensions (Inches):
          </span>
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222428] text-[#71717a]">
                <th className="py-1.5 px-2">SIZE</th>
                <th className="py-1.5 px-2">CHEST</th>
                <th className="py-1.5 px-2">LENGTH</th>
                <th className="py-1.5 px-2">SHOULDER</th>
                <th className="py-1.5 px-2">WAIST</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((m) => (
                <tr
                  key={m.size}
                  className={`border-b border-[#1c1d22] ${
                    m.size === recommendedSize ? 'bg-[#22242a] font-bold text-white' : 'text-[#a1a1aa]'
                  }`}
                >
                  <td className="py-1.5 px-2 flex items-center gap-1.5">
                    {m.size}
                    {m.size === recommendedSize && (
                      <span className="text-[9px] px-1 bg-white text-black rounded font-mono">RECOMMENDED</span>
                    )}
                  </td>
                  <td className="py-1.5 px-2">{m.chest}</td>
                  <td className="py-1.5 px-2">{m.length}</td>
                  <td className="py-1.5 px-2">{m.shoulder}</td>
                  <td className="py-1.5 px-2">{m.waist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dorm Care Guarantee */}
        <div className="flex items-start gap-2 mt-5 text-[11px] font-mono text-[#71717a] pt-3 border-t border-[#1f2024]">
          <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
          <span>
            Dorm Laundry Guarantee: All 280-460 GSM pieces undergo dual-enzyme garment washing so they won’t shrink when run through industrial dorm washers.
          </span>
        </div>

      </div>
    </div>
  );
};
