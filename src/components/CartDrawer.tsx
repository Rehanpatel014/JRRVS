import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, Check, Tag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Cart calculations
  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = appliedPromo
    ? Math.round(rawSubtotal * (appliedPromo.percent / 100))
    : 0;

  const subtotalAfterDiscount = rawSubtotal - discountAmount;
  const freeShippingThreshold = 1999;
  const isFreeShipping = subtotalAfterDiscount >= freeShippingThreshold;
  const shippingCost = isFreeShipping || cartItems.length === 0 ? 0 : 149;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotalAfterDiscount);
  const freeShippingPercent = Math.min(100, (subtotalAfterDiscount / freeShippingThreshold) * 100);
  const total = subtotalAfterDiscount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (code === 'COLLEGE10') {
      setAppliedPromo({ code: 'COLLEGE10', percent: 10 });
    } else if (code === 'DORM20') {
      setAppliedPromo({ code: 'DORM20', percent: 20 });
    } else {
      setPromoError('Invalid code. Try "COLLEGE10" for student perk.');
    }
    setPromoInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0f1013] border-l border-[#222428] h-full flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1f2024] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="font-heading text-lg font-bold uppercase tracking-tight text-white">
              Shopping Bag
            </span>
            <span className="font-mono text-xs text-[#71717a]">
              ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#a1a1aa] hover:text-white rounded-full bg-[#18181b]"
            aria-label="Close bag"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-5 py-3 bg-[#141518] border-b border-[#1f2024] space-y-1.5 font-mono text-xs">
          <div className="flex justify-between items-center">
            {isFreeShipping ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Unlocked Free Express Campus Shipping!</span>
              </span>
            ) : (
              <span className="text-zinc-300">
                Add <strong className="text-white">₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> for Free Campus Delivery
              </span>
            )}
            <span className="text-[10px] text-[#71717a]">{Math.round(freeShippingPercent)}%</span>
          </div>
          <div className="w-full bg-[#27272a] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFreeShipping ? 'bg-emerald-400' : 'bg-white'
              }`}
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#3f3f46]" />
              <p className="font-heading text-base text-white">Your bag is empty</p>
              <p className="text-xs text-[#71717a] font-mono max-w-xs">
                Explore our Drop 04 heavyweight hoodies, boxy tees, or try the interactive Fit Builder.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-wider rounded font-bold hover:bg-zinc-200"
              >
                Start Browsing
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
                className="flex gap-3.5 p-3 bg-[#141518] border border-[#1f2024] rounded-lg"
              >
                {/* Thumbnail */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded bg-[#1c1d22] shrink-0"
                />

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-heading text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-[#71717a] hover:text-red-400 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] font-mono text-[#a1a1aa] mt-0.5 space-x-1.5">
                      <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>{item.selectedColor}</span>
                    </div>

                    <span className="text-[10px] font-mono text-[#71717a] block mt-0.5">
                      {item.product.gsm} GSM · {item.product.fit}
                    </span>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-[#27272a] rounded bg-[#18181b] text-[11px] font-mono">
                      <button
                        onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                        className="px-2 py-0.5 text-[#a1a1aa] hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className="px-2 py-0.5 text-[#a1a1aa] hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-heading text-sm font-bold text-white">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Promo code & Checkout summary */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-[#1f2024] bg-[#0c0d0e] space-y-4">
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#71717a] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo / Student code (COLLEGE10)"
                    className="w-full bg-[#141518] border border-[#27272a] rounded pl-8 pr-3 py-1.5 text-xs font-mono text-white placeholder-[#71717a] focus:outline-none uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#22242a] hover:bg-[#2e313a] text-white font-mono text-xs rounded border border-[#343740]"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span>Code {appliedPromo.code} applied ({appliedPromo.percent}% OFF)</span>
                  <button
                    type="button"
                    onClick={() => setAppliedPromo(null)}
                    className="text-[#71717a] hover:text-white underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoError && (
                <span className="text-[10px] font-mono text-red-400 block">{promoError}</span>
              )}
            </form>

            {/* Calculations breakdown */}
            <div className="space-y-1.5 text-xs font-mono border-t border-[#1f2024] pt-3">
              <div className="flex justify-between text-[#a1a1aa]">
                <span>Garments Subtotal:</span>
                <span>₹{rawSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Student Discount ({appliedPromo?.percent}%):</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#a1a1aa]">
                <span>Campus Express Delivery:</span>
                <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
              </div>

              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#1f2024]">
                <span>Estimated Total:</span>
                <span className="font-heading text-lg font-extrabold">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 bg-white hover:bg-[#e4e4e7] text-black font-mono text-xs uppercase tracking-widest font-bold rounded flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              <span>Proceed to Dorm Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] font-mono text-center text-[#71717a]">
              Direct dorm drop-off available for verified campus halls.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
