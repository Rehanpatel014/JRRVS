import React, { useState } from 'react';
import { Heart, Plus, Eye, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[1] || product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.color);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  return (
    <div
      className="group flex flex-col bg-[#111215] border border-[#1f2024] hover:border-[#383a42] rounded-lg overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with secondary hover image */}
      <div
        onClick={() => onQuickView(product)}
        className="relative aspect-[3/4] w-full bg-[#18191c] overflow-hidden cursor-pointer"
      >
        <img
          src={isHovered ? product.secondaryImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-white text-black'
              : 'bg-[#0c0d0e]/60 text-white hover:bg-white hover:text-black'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View overlay trigger on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 py-1.5 px-3 bg-[#1e2024]/90 hover:bg-black text-white text-[11px] font-mono uppercase tracking-wider rounded backdrop-blur-sm flex items-center justify-center gap-1.5 transition-colors border border-white/10"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Low Stock Warning */}
        {product.stockCount <= 6 && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/70 backdrop-blur-sm border border-red-500/30 text-[10px] font-mono text-red-300 rounded">
            Only {product.stockCount} left
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Unboxed metadata (No pill capsules!) */}
        <div>
          <div className="flex items-center gap-2 text-[11px] text-[#71717a] font-mono uppercase mb-1">
            <span>{product.fit}</span>
            <span aria-hidden="true">·</span>
            <span>{product.gsm} GSM</span>
            {product.isNewDrop && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-zinc-300 font-semibold">Drop 04</span>
              </>
            )}
          </div>

          <h3
            onClick={() => onQuickView(product)}
            className="font-heading text-sm sm:text-base font-bold text-white hover:text-zinc-300 cursor-pointer tracking-tight transition-colors line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#a1a1aa] line-clamp-1 mt-0.5 font-light">
            {product.subtitle}
          </p>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.availableColors.map((c) => (
            <button
              key={c.name}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(c.name);
              }}
              title={c.name}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                selectedColor === c.name
                  ? 'border-white scale-110 ring-1 ring-white/50'
                  : 'border-[#3f3f46] hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
              aria-label={`Select color ${c.name}`}
            />
          ))}
          <span className="text-[10px] text-[#71717a] ml-1 font-mono">{selectedColor}</span>
        </div>

        {/* Size Selection & Price / Quick Add */}
        <div className="pt-2 border-t border-[#1f2024] space-y-2.5">
          {/* Size segmented tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] text-[#71717a] font-mono mr-1">SIZE:</span>
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                  selectedSize === size
                    ? 'bg-white text-black font-semibold'
                    : 'bg-[#18181b] text-[#a1a1aa] hover:text-white border border-[#27272a]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Price and Add button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-base font-bold text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-[#71717a] line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-all flex items-center gap-1 ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1f2024] text-white hover:bg-white hover:text-black border border-[#2e3036]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add ({selectedSize})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
