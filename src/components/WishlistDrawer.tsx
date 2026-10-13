import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

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
            <Heart className="w-4 h-4 text-white fill-current" />
            <span className="font-heading text-lg font-bold uppercase tracking-tight text-white">
              Saved Pieces
            </span>
            <span className="font-mono text-xs text-[#71717a]">
              ({wishlistProducts.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#a1a1aa] hover:text-white rounded-full bg-[#18181b]"
            aria-label="Close wishlist"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Heart className="w-10 h-10 text-[#3f3f46]" />
              <p className="font-heading text-base text-white">No saved items</p>
              <p className="text-xs text-[#71717a] font-mono max-w-xs">
                Tap the heart on any boxy tee, cargo, or hoodie to save it for your next dorm order.
              </p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3.5 p-3 bg-[#141518] border border-[#1f2024] rounded-lg"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded bg-[#1c1d22] shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-heading text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="text-[#71717a] hover:text-white p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] font-mono text-[#a1a1aa]">
                      ₹{product.price.toLocaleString('en-IN')} · {product.gsm} GSM
                    </p>
                    <span className="text-[10px] font-mono text-[#71717a]">
                      {product.fit}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(product, product.sizes[1] || product.sizes[0], product.color);
                      onRemoveFromWishlist(product.id);
                    }}
                    className="mt-2 py-1.5 px-3 bg-[#22242a] hover:bg-white hover:text-black text-white text-[11px] font-mono uppercase tracking-wider rounded border border-[#343740] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlistProducts.length > 0 && (
          <div className="p-5 border-t border-[#1f2024] bg-[#0c0d0e]">
            <button
              onClick={() => {
                wishlistProducts.forEach((p) => {
                  onAddToCart(p, p.sizes[1] || p.sizes[0], p.color);
                  onRemoveFromWishlist(p.id);
                });
              }}
              className="w-full py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded hover:bg-[#e4e4e7] transition-colors"
            >
              Move All to Bag ({wishlistProducts.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
