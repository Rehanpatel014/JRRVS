import React, { useState, useEffect } from 'react';
import { Clock, Bell, Check, Sparkles, Send } from 'lucide-react';

export const DropCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  const [rsvpContact, setRsvpContact] = useState('');
  const [isRsvpDone, setIsRsvpDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (rsvpContact.trim()) {
      setIsRsvpDone(true);
      setRsvpContact('');
    }
  };

  return (
    <section id="drop-countdown" className="py-20 border-b border-[#222428] bg-[#0f1013] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Unboxed kicker */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase text-[#71717a] tracking-widest mb-3">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>UPCOMING BATCH RADAR</span>
          <span aria-hidden="true">·</span>
          <span>LIMITED 400 UNITS</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3">
          Next Drop: Batch 05
        </h2>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#a1a1aa] font-mono mb-10">
          Heavyweight Washed Thermal Thermal Waffles & Distressed Acid Zip-Hoodies. Once batch 05 sells out, garments enter vault archive status.
        </p>

        {/* Live Countdown Clock */}
        <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto mb-10">
          {[
            { label: 'DAYS', val: timeLeft.days },
            { label: 'HOURS', val: timeLeft.hours },
            { label: 'MINUTES', val: timeLeft.minutes },
            { label: 'SECONDS', val: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 bg-[#141519] border border-[#222428] rounded-lg flex flex-col items-center justify-center"
            >
              <span className="font-heading text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#71717a] mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* RSVP Input Form */}
        <div className="max-w-md mx-auto">
          {isRsvpDone ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 rounded-lg flex items-center justify-center gap-2 text-emerald-400 text-xs font-mono">
              <Check className="w-4 h-4" />
              <span>You're on the VIP Campus Early Access List! Secret drop link arrives 1 hour early.</span>
            </div>
          ) : (
            <form onSubmit={handleRsvp} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={rsvpContact}
                  onChange={(e) => setRsvpContact(e.target.value)}
                  placeholder="Enter campus .edu email or phone for VIP alert"
                  className="flex-1 bg-[#18191c] border border-[#27272a] rounded px-3.5 py-3 text-xs font-mono text-white placeholder-[#71717a] focus:outline-none focus:border-white"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded hover:bg-[#e4e4e7] transition-all flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>RSVP</span>
                </button>
              </div>
              <p className="text-[10px] font-mono text-[#71717a] text-left">
                No spam. You only receive an SMS/email 60 minutes before Drop 05 goes live.
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
