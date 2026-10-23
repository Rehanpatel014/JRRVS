import React, { useState, useEffect } from 'react';
import { CartItem, Order } from '../types';
import {
  X,
  CheckCircle,
  Package,
  ArrowRight,
  ShieldCheck,
  School,
  QrCode,
  Smartphone,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Sparkles,
} from 'lucide-react';

import { StudentProfile } from '../lib/firebase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser: StudentProfile | null;
  onOrderComplete: (order: Order) => void;
  onViewOrders: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onOrderComplete,
  onViewOrders,
}) => {
  const [step, setStep] = useState<'details' | 'upi-qr' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || 'Aryan Patel',
    phone: currentUser?.phoneNumber || '9876543210',
    email: currentUser?.email || 'aryan.p@campus.edu.in',
    university: currentUser?.university || 'Delhi University / IIT Bombay',
    dormBuilding: currentUser?.hostelAddress || 'Hostel Block C, Room 204',
    city: currentUser?.city || 'New Delhi',
    zip: currentUser?.pincode || '110007',
    deliveryNotes: 'Leave at hostel gate / reception security desk',
    paymentMethod: 'upi' as 'upi' | 'card' | 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiTimer, setUpiTimer] = useState(300); // 5 mins countdown for QR

  // CRITICAL FIX: Reset step to 'details' every time checkout is opened & populate user details
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setIsSubmitting(false);
      setIsVerifyingUpi(false);
      setUpiTimer(300);
      setCopiedUpi(false);
      if (currentUser) {
        setFormData((prev) => ({
          ...prev,
          name: currentUser.displayName || prev.name,
          email: currentUser.email || prev.email,
          phone: currentUser.phoneNumber || prev.phone,
          university: currentUser.university || prev.university,
          dormBuilding: currentUser.hostelAddress || prev.dormBuilding,
          city: currentUser.city || prev.city,
          zip: currentUser.pincode || prev.zip,
        }));
      }
    }
  }, [isOpen, currentUser]);

  // QR Timer Countdown
  useEffect(() => {
    if (step === 'upi-qr' && upiTimer > 0) {
      const interval = setInterval(() => {
        setUpiTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, upiTimer]);

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText('jrrvs.apparel@okhdfcbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Called when submitting details form
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentMethod === 'upi') {
      // Direct user to UPI QR code screen
      setStep('upi-qr');
    } else {
      // Directly place Card or COD order
      placeFinalOrder(formData.paymentMethod === 'card' ? 'Paid' : 'Pay on Delivery');
    }
  };

  // Called to finalize the order (after UPI verification or directly for Card/COD)
  const placeFinalOrder = (paymentStatus: 'Paid' | 'Pay on Delivery', upiRef?: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const randomOrderNum = `JRRVS-IN-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        userId: currentUser?.id || 'guest',
        orderNumber: randomOrderNum,
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: [...cartItems],
        totalAmount: total,
        deliveryAddress: {
          fullName: formData.name || '',
          phone: formData.phone || '',
          email: formData.email || '',
          university: formData.university || '',
          hostelOrAddress: formData.dormBuilding || '',
          city: formData.city || '',
          pincode: formData.zip || '',
          deliveryNotes: formData.deliveryNotes || '',
        },
        paymentMethod: formData.paymentMethod,
        paymentStatus: paymentStatus,
        upiRefId: upiRef || (formData.paymentMethod === 'upi' ? `UPI${Math.floor(1000000000 + Math.random() * 9000000000)}` : ''),
        status: 'Confirmed',
        estimatedDeliveryDate: '2-3 Business Days (Hostel Mailroom)',
      };

      setCreatedOrder(newOrder);
      setIsSubmitting(false);
      setIsVerifyingUpi(false);
      setStep('success');
      onOrderComplete(newOrder);
    }, 1200);
  };

  const handleConfirmUpiPayment = () => {
    setIsVerifyingUpi(true);
    setTimeout(() => {
      placeFinalOrder('Paid', `UPI${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#121316] border border-[#222428] rounded-xl p-5 sm:p-8 shadow-2xl my-auto text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#a1a1aa] hover:text-white rounded-full bg-[#1c1d22]"
          aria-label="Close checkout"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: FILLING DETAILS & ADDRESS & PAYMENT SELECTION */}
        {step === 'details' && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#71717a] mb-1">
              <School className="w-3.5 h-3.5 text-zinc-400" />
              <span>CAMPUS & HOSTEL DISPATCH PROTOCOL</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mb-1">
              Order Delivery & Payment
            </h2>
            <p className="text-xs text-[#a1a1aa] font-mono mb-5">
              Total Order: <strong className="text-white">₹{total.toLocaleString('en-IN')}</strong> ({cartItems.length} items) · Free Campus Express Shipping Included
            </p>

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              
              {/* Order Items Preview Pill */}
              <div className="p-3 bg-[#18191c] border border-[#27272a] rounded-lg">
                <span className="text-[10px] font-mono uppercase text-[#71717a] block mb-2">
                  Bag Items ({cartItems.length}):
                </span>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-[#121316] px-2.5 py-1.5 rounded border border-[#222428] shrink-0 text-xs font-mono"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-6 h-8 object-cover rounded bg-[#1c1d22]"
                      />
                      <div>
                        <p className="text-white font-medium text-[11px] truncate max-w-[120px]">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-[#71717a]">
                          Size {item.selectedSize} · Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recipient Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#18191c] border border-[#27272a] rounded p-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                    Phone Number (for SMS & OTP) *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2.5 bg-[#141518] border border-r-0 border-[#27272a] rounded-l text-xs font-mono text-[#71717a]">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full bg-[#18191c] border border-[#27272a] rounded-r p-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>

              {/* Email & College */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                    Student / Campus Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#18191c] border border-[#27272a] rounded p-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                    College / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="e.g. Delhi University, IIT, BITS, Christ"
                    className="w-full bg-[#18191c] border border-[#27272a] rounded p-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Hostel / Residence Address */}
              <div>
                <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                  Hostel Block & Room # or Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.dormBuilding}
                  onChange={(e) => setFormData({ ...formData, dormBuilding: e.target.value })}
                  placeholder="e.g. Hostel Block B Room 302 or PG/Apartment Name"
                  className="w-full bg-[#18191c] border border-[#27272a] rounded p-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                />
              </div>

              {/* City & PIN Code */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#18191c] border border-[#27272a] rounded p-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full bg-[#18191c] border border-[#27272a] rounded p-2.5 text-xs font-mono text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-1">
                  Hostel Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  placeholder="e.g. Leave with hostel guard / call on arrival"
                  className="w-full bg-[#18191c] border border-[#27272a] rounded p-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              {/* PAYMENT METHOD SELECTION */}
              <div className="pt-2">
                <label className="text-[10px] font-mono uppercase text-[#71717a] block mb-2">
                  Select Payment Option *
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  
                  {/* UPI OPTION */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                    className={`p-3 rounded-lg border text-left transition-all relative ${
                      formData.paymentMethod === 'upi'
                        ? 'border-white bg-[#1c1d22] text-white ring-1 ring-white/40'
                        : 'border-[#27272a] bg-[#141518] text-[#71717a] hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs font-mono text-white">Instant UPI</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#a1a1aa] block leading-tight">
                      Scan QR / GPay, PhonePe, Paytm
                    </span>
                    <span className="absolute top-1.5 right-1.5 text-[9px] font-mono bg-emerald-950 text-emerald-400 px-1 py-0.5 rounded border border-emerald-600/30">
                      FASTEST
                    </span>
                  </button>

                  {/* CARD OPTION */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-white bg-[#1c1d22] text-white ring-1 ring-white/40'
                        : 'border-[#27272a] bg-[#141518] text-[#71717a] hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Smartphone className="w-4 h-4 text-zinc-300" />
                      <span className="font-bold text-xs font-mono text-white">Card / NetBanking</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#a1a1aa] block leading-tight">
                      Debit, Credit, Student Cards
                    </span>
                  </button>

                  {/* COD OPTION */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-white bg-[#1c1d22] text-white ring-1 ring-white/40'
                        : 'border-[#27272a] bg-[#141518] text-[#71717a] hover:border-[#3f3f46]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Package className="w-4 h-4 text-zinc-300" />
                      <span className="font-bold text-xs font-mono text-white">Campus COD</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#a1a1aa] block leading-tight">
                      Cash on Hostel Drop
                    </span>
                  </button>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-4 border-t border-[#1f2024]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded flex items-center justify-center gap-2 hover:bg-[#e4e4e7] transition-all disabled:opacity-50 shadow-lg"
                >
                  {formData.paymentMethod === 'upi' ? (
                    <>
                      <QrCode className="w-4 h-4" />
                      <span>Proceed to UPI QR Code (₹{total.toLocaleString('en-IN')})</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order (₹{total.toLocaleString('en-IN')})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* STEP 2: DEDICATED INTERACTIVE UPI QR CODE SCREEN */}
        {step === 'upi-qr' && (
          <div className="py-2 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2024]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#71717a] tracking-widest block">
                  REAL-TIME UPI PAYMENT GATEWAY
                </span>
                <h3 className="font-heading text-xl font-bold uppercase text-white">
                  Scan UPI QR Code to Pay
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#18191c] border border-[#27272a] rounded text-xs font-mono text-emerald-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Expires in {formatTimer(upiTimer)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* QR Code Presentation Frame */}
              <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-white rounded-xl text-black">
                <div className="text-center mb-3">
                  <span className="font-heading text-lg font-black tracking-tight uppercase block">
                    jrrvs apparel
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-600">
                    Official Campus Merchant
                  </span>
                </div>

                {/* SVG High-Contrast QR Code Artwork */}
                <div className="relative p-2 bg-white rounded-lg border-2 border-black">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-44 h-44 sm:w-48 sm:h-48"
                    shapeRendering="crispEdges"
                  >
                    {/* Background */}
                    <rect width="200" height="200" fill="#ffffff" />
                    
                    {/* Top-Left Corner Position Finder */}
                    <rect x="10" y="10" width="50" height="50" fill="#000000" />
                    <rect x="20" y="20" width="30" height="30" fill="#ffffff" />
                    <rect x="28" y="28" width="14" height="14" fill="#000000" />

                    {/* Top-Right Corner Position Finder */}
                    <rect x="140" y="10" width="50" height="50" fill="#000000" />
                    <rect x="150" y="20" width="30" height="30" fill="#ffffff" />
                    <rect x="158" y="28" width="14" height="14" fill="#000000" />

                    {/* Bottom-Left Corner Position Finder */}
                    <rect x="10" y="140" width="50" height="50" fill="#000000" />
                    <rect x="20" y="150" width="30" height="30" fill="#ffffff" />
                    <rect x="28" y="158" width="14" height="14" fill="#000000" />

                    {/* QR Code Grid Data Patterns */}
                    <rect x="70" y="15" width="12" height="12" fill="#000000" />
                    <rect x="90" y="25" width="12" height="8" fill="#000000" />
                    <rect x="110" y="15" width="16" height="12" fill="#000000" />
                    <rect x="70" y="40" width="18" height="10" fill="#000000" />
                    <rect x="95" y="45" width="8" height="14" fill="#000000" />
                    <rect x="115" y="38" width="14" height="14" fill="#000000" />
                    
                    <rect x="15" y="70" width="14" height="12" fill="#000000" />
                    <rect x="35" y="80" width="10" height="14" fill="#000000" />
                    <rect x="55" y="72" width="16" height="8" fill="#000000" />

                    <rect x="140" y="70" width="10" height="14" fill="#000000" />
                    <rect x="160" y="80" width="14" height="10" fill="#000000" />
                    <rect x="180" y="72" width="8" height="18" fill="#000000" />

                    <rect x="75" y="75" width="50" height="50" fill="#000000" />
                    <rect x="85" y="85" width="30" height="30" fill="#ffffff" />
                    <text
                      x="100"
                      y="105"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#000000"
                      fontFamily="monospace"
                    >
                      UPI
                    </text>

                    <rect x="15" y="105" width="12" height="16" fill="#000000" />
                    <rect x="35" y="115" width="16" height="10" fill="#000000" />
                    <rect x="55" y="100" width="10" height="14" fill="#000000" />

                    <rect x="140" y="105" width="14" height="12" fill="#000000" />
                    <rect x="165" y="115" width="10" height="14" fill="#000000" />
                    <rect x="180" y="100" width="10" height="12" fill="#000000" />

                    <rect x="70" y="140" width="14" height="12" fill="#000000" />
                    <rect x="90" y="155" width="12" height="14" fill="#000000" />
                    <rect x="110" y="142" width="16" height="10" fill="#000000" />
                    <rect x="75" y="170" width="18" height="12" fill="#000000" />
                    <rect x="100" y="175" width="10" height="12" fill="#000000" />
                    <rect x="120" y="165" width="14" height="14" fill="#000000" />

                    <rect x="145" y="145" width="12" height="12" fill="#000000" />
                    <rect x="165" y="155" width="14" height="10" fill="#000000" />
                    <rect x="182" y="142" width="8" height="16" fill="#000000" />
                    <rect x="150" y="175" width="16" height="12" fill="#000000" />
                    <rect x="175" y="170" width="12" height="15" fill="#000000" />
                  </svg>
                </div>

                <div className="text-center mt-3">
                  <span className="font-heading text-xl font-black text-black">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] font-mono text-neutral-500">
                    Scan with GPay · PhonePe · Paytm · CRED
                  </span>
                </div>
              </div>

              {/* UPI Instructions and Action */}
              <div className="md:col-span-6 space-y-4 text-xs font-mono">
                
                {/* Payee Info */}
                <div className="p-3.5 bg-[#18191c] border border-[#27272a] rounded-lg space-y-2">
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Payee:</span>
                    <span className="text-white font-bold">JRRVS CLOTHING PVT LTD</span>
                  </div>
                  <div className="flex justify-between items-center text-[#a1a1aa]">
                    <span>UPI ID:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold select-all">
                        jrrvs.apparel@okhdfcbank
                      </span>
                      <button
                        onClick={handleCopyUpiId}
                        className="p-1 hover:text-white text-[#71717a]"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Order Amount:</span>
                    <span className="text-white font-bold">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#a1a1aa]">
                    <span>Dispatch to:</span>
                    <span className="text-zinc-300 truncate max-w-[150px]">{formData.dormBuilding}</span>
                  </div>
                </div>

                {/* Steps instructions */}
                <ol className="space-y-1.5 text-[11px] text-[#a1a1aa] list-decimal list-inside bg-[#141518] p-3 rounded border border-[#222428]">
                  <li>Open Google Pay, PhonePe, Paytm, or BHIM</li>
                  <li>Scan the QR code or pay to the UPI ID above</li>
                  <li>Complete payment of <strong>₹{total.toLocaleString('en-IN')}</strong></li>
                  <li>Tap the verification button below</li>
                </ol>

                {/* Confirm button */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleConfirmUpiPayment}
                    disabled={isVerifyingUpi}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs uppercase tracking-widest font-extrabold rounded flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isVerifyingUpi ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Verifying Bank Transaction...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>I Have Completed UPI Payment</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setStep('details')}
                    className="w-full py-2 text-[11px] text-[#71717a] hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Back to Edit Address or Payment Option</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS RECEIPT */}
        {step === 'success' && createdOrder && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-950/80 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-[#71717a] tracking-widest">
                ORDER CONFIRMED & DISPATCHED
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                Drop 04 Dispatched
              </h2>
              <p className="text-xs font-mono text-zinc-300">
                Order Tracking ID: <strong className="text-white">{createdOrder.orderNumber}</strong>
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 bg-[#18191c] border border-[#222428] rounded-lg text-left text-xs font-mono space-y-2.5 my-4">
              <div className="flex justify-between text-[#a1a1aa]">
                <span>Student Recipient:</span>
                <span className="text-white font-bold">{createdOrder.deliveryAddress.fullName} (+91 {createdOrder.deliveryAddress.phone})</span>
              </div>
              <div className="flex justify-between text-[#a1a1aa]">
                <span>Hostel / Destination:</span>
                <span className="text-white">{createdOrder.deliveryAddress.hostelOrAddress}, {createdOrder.deliveryAddress.city}</span>
              </div>
              <div className="flex justify-between text-[#a1a1aa]">
                <span>Payment Mode:</span>
                <span className="text-emerald-400 font-bold uppercase">
                  {createdOrder.paymentMethod === 'upi' ? `Paid via UPI (${createdOrder.upiRefId})` : createdOrder.paymentMethod === 'card' ? 'Card Paid' : 'Cash on Delivery'}
                </span>
              </div>
              <div className="flex justify-between text-[#a1a1aa]">
                <span>Total Paid:</span>
                <span className="text-white font-bold">₹{createdOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-400 pt-2 border-t border-[#27272a]">
                <span>Live Delivery Timeline:</span>
                <span>{createdOrder.estimatedDeliveryDate}</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onViewOrders();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>View in Order History & Status</span>
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 bg-[#18181b] text-white font-mono text-xs uppercase tracking-widest rounded border border-[#27272a] hover:bg-[#22242a] transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
