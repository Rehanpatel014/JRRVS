import React, { useState, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { Product, Category, FitType } from '../types';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  searchQuery: string;
  onClearSearch: () => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'gsm-desc';

export const ProductList: React.FC<ProductListProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  wishlistIds,
  onToggleWishlist,
  onQuickView,
  onAddToCart,
}) => {
  const [selectedFit, setSelectedFit] = useState<FitType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [minGsm, setMinGsm] = useState<number>(0);

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All Garments' },
    { id: 'tees', label: 'Tees & Longsleeves' },
    { id: 'hoodies', label: 'Hoodies & Sweats' },
    { id: 'cargos', label: 'Cargos & Denim' },
    { id: 'outerwear', label: 'Jackets & Outerwear' },
    { id: 'accessories', label: 'Headwear & Slings' },
  ];

  const fits: (FitType | 'all')[] = ['all', 'Boxy Fit', 'Oversized', 'Wide Leg', 'Relaxed'];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (activeCategory !== 'all' && p.category !== activeCategory) {
          return false;
        }
        // Fit filter
        if (selectedFit !== 'all' && p.fit !== selectedFit) {
          return false;
        }
        // Min GSM filter
        if (minGsm > 0 && p.gsm < minGsm) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSub = p.subtitle.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchColor = p.color.toLowerCase().includes(q);
          const matchGsm = p.gsm.toString().includes(q);
          return matchName || matchSub || matchDesc || matchColor || matchGsm;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'gsm-desc') return b.gsm - a.gsm;
        // Default: featured (new drops first, then bestsellers)
        if (a.isNewDrop && !b.isNewDrop) return -1;
        if (!a.isNewDrop && b.isNewDrop) return 1;
        return 0;
      });
  }, [products, activeCategory, selectedFit, minGsm, searchQuery, sortBy]);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#71717a] tracking-widest mb-1.5">
            <span>COLLECTION 04</span>
            <span aria-hidden="true">·</span>
            <span>CAMPUS SILHOUETTES</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            Drop 04 Essentials
          </h2>
        </div>

        {/* Counter and quick info */}
        <div className="text-xs font-mono text-[#a1a1aa] flex items-center gap-3">
          <span>{filteredProducts.length} GARMENTS AVAILABLE</span>
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="inline-flex items-center gap-1 text-white hover:underline bg-[#1f2024] px-2 py-1 rounded"
            >
              <span>Query: "{searchQuery}"</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category Segmented Controls (Buttons with click handlers per frontend-design skill) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-mono rounded whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-[#141518] text-[#a1a1aa] hover:text-white hover:bg-[#1f2024] border border-[#222428]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#111215] border border-[#1f2024] rounded-lg mb-8">
        {/* Fit Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-[#71717a] flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>FIT:</span>
          </span>
          {fits.map((fit) => (
            <button
              key={fit}
              onClick={() => setSelectedFit(fit)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                selectedFit === fit
                  ? 'bg-[#27272a] text-white font-medium border border-[#3f3f46]'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181b]'
              }`}
            >
              {fit === 'all' ? 'All Fits' : fit}
            </button>
          ))}
        </div>

        {/* GSM Threshold & Sort Control */}
        <div className="flex items-center gap-3">
          {/* GSM quick filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#a1a1aa]">
            <span className="text-[#71717a]">GSM:</span>
            <select
              value={minGsm}
              onChange={(e) => setMinGsm(Number(e.target.value))}
              className="bg-[#18181b] border border-[#27272a] text-white text-xs rounded px-2 py-1 focus:outline-none"
            >
              <option value={0}>All Weights</option>
              <option value={280}>280+ GSM</option>
              <option value={350}>350+ GSM (Heavy)</option>
              <option value={440}>440+ GSM (Ultra Heavy)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#a1a1aa]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#71717a]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#18181b] border border-[#27272a] text-white text-xs rounded px-2.5 py-1 focus:outline-none"
            >
              <option value="featured">Featured Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="gsm-desc">Fabric GSM: Heaviest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-[#27272a] rounded-lg">
          <p className="font-heading text-lg text-white mb-2">No garments found</p>
          <p className="text-xs text-[#71717a] font-mono mb-4">
            Try adjusting your fit, GSM filters, or search terms.
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
              setSelectedFit('all');
              setMinGsm(0);
              onClearSearch();
            }}
            className="px-4 py-2 bg-white text-black font-mono text-xs uppercase tracking-wider rounded hover:bg-zinc-200 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
