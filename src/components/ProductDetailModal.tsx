import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Check, Ruler, ShieldCheck, ShoppingBag, Heart } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, qty: number) => void;
  onOpenSizeCalc: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenSizeCalc,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[1] || product.sizes[0] || 'M');
      setSelectedColor(product.color);
      setActiveImage(product.image);
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#121316] border border-[#222428] rounded-xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#1c1d22]/80 hover:bg-white hover:text-black text-[#a1a1aa] rounded-full transition-colors backdrop-blur-sm"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Images Gallery */}
          <div className="bg-[#18191c] p-4 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#0e0f12]">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 font-mono text-[10px]">
                <span className="bg-black/75 px-2 py-0.5 rounded text-white border border-white/10 uppercase">
                  {product.gsm} GSM
                </span>
                <span className="bg-black/75 px-2 py-0.5 rounded text-zinc-300 border border-white/10 uppercase">
                  {product.fit}
                </span>
              </div>
            </div>

            {/* Thumbnail switcher */}
            <div className="flex gap-2.5 mt-3">
              <button
                onClick={() => setActiveImage(product.image)}
                className={`relative w-16 h-16 rounded overflow-hidden border transition-all ${
                  activeImage === product.image
                    ? 'border-white scale-105'
                    : 'border-[#27272a] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.image} alt="Angle 1" className="w-full h-full object-cover" />
              </button>
              <button
                onClick={() => setActiveImage(product.secondaryImage)}
                className={`relative w-16 h-16 rounded overflow-hidden border transition-all ${
                  activeImage === product.secondaryImage
                    ? 'border-white scale-105'
                    : 'border-[#27272a] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={product.secondaryImage} alt="Angle 2" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          {/* Right: Garment Specifications & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#71717a] mb-1">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>{product.fit}</span>
                {product.isNewDrop && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-zinc-200">DROP 04</span>
                  </>
                )}
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
                {product.name}
              </h2>
              <p className="text-xs text-[#a1a1aa] mt-1">{product.subtitle}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="font-heading text-2xl font-bold text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#71717a] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] font-mono text-emerald-400">
                  Student code COLLEGE10 applies
                </span>
              </div>
            </div>

            {/* Model stats & drape guidance */}
            <div className="p-3 bg-[#18191c] border border-[#222428] rounded text-xs text-[#a1a1aa] font-mono">
              <span className="text-white font-semibold block mb-0.5">Campus Fit Reference:</span>
              <span>{product.modelInfo}</span>
            </div>

            {/* Color selection */}
            <div>
              <label className="block text-xs font-mono uppercase text-[#71717a] mb-2">
                Colorway: <span className="text-white">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.availableColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-all ${
                      selectedColor === c.name
                        ? 'border-white bg-[#1c1d22] text-white'
                        : 'border-[#27272a] text-[#71717a] hover:border-[#3f3f46]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/40"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase text-[#71717a]">
                  Select Size: <span className="text-white">{selectedSize}</span>
                </label>
                <button
                  onClick={onOpenSizeCalc}
                  className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size & Height Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-mono rounded border transition-all ${
                      selectedSize === size
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-[#18181b] text-zinc-300 border-[#27272a] hover:border-zinc-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Garment Construction Spec Sheet */}
            <div className="space-y-1.5 text-xs text-[#a1a1aa] border-t border-[#1f2024] pt-4">
              <span className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                Textile & Silhouette Specifications:
              </span>
              <ul className="space-y-1 text-[11px] font-mono text-[#a1a1aa]">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-zinc-500">·</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions: Add to Bag, Quantity, Wishlist */}
            <div className="space-y-3 pt-3 border-t border-[#1f2024]">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#27272a] rounded bg-[#18181b] text-xs font-mono">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-[#a1a1aa] hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-2 text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-[#a1a1aa] hover:text-white"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-4 font-mono text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-black hover:bg-[#e4e4e7] font-bold shadow-lg'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag · ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Heart */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded border transition-colors ${
                    isWishlisted
                      ? 'bg-[#1f2024] border-white text-white'
                      : 'border-[#27272a] text-[#71717a] hover:text-white hover:border-[#3f3f46]'
                  }`}
                  aria-label="Save item"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Dorm Shipping notice */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#71717a] pt-1">
                <span>Free express campus shipping over ₹1,999</span>
                <span>30-day free campus returns</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
