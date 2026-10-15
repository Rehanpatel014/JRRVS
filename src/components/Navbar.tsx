import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Ruler, Menu, X, Sparkles, Package, User, LogOut, Shield } from 'lucide-react';
import { Category } from '../types';
import { StudentProfile, isAdminUser } from '../lib/firebase';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  ordersCount: number;
  currentUser: StudentProfile | null;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenSizeCalc: () => void;
  onOpenAdmin: () => void;
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  ordersCount,
  currentUser,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenAuth,
  onSignOut,
  onOpenSizeCalc,
  onOpenAdmin,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onScrollToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { label: string; category?: Category; target?: string }[] = [
    { label: 'All Items', category: 'all' },
    { label: 'Tees & Tops', category: 'tees' },
    { label: 'Hoodies', category: 'hoodies' },
    { label: 'Cargos & Denim', category: 'cargos' },
    { label: 'Outerwear', category: 'outerwear' },
    { label: 'Fit Builder', target: 'fit-builder' },
    { label: 'Campus Lookbook', target: 'lookbook' },
  ];

  const handleLinkClick = (link: { label: string; category?: Category; target?: string }) => {
    if (link.target) {
      onScrollToSection(link.target);
    } else if (link.category) {
      onSelectCategory(link.category);
      onScrollToSection('catalog');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0d0e]/90 backdrop-blur-md border-b border-[#222428] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Mobile hamburger & desktop links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#a1a1aa] hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs uppercase tracking-widest text-[#a1a1aa]">
              {navLinks.slice(0, 5).map((link) => {
                const isActive = link.category && activeCategory === link.category;
                return (
                  <button
                    key={link.label}
                    onClick={() => handleLinkClick(link)}
                    className={`transition-colors hover:text-white py-1 relative ${
                      isActive ? 'text-white font-semibold' : ''
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
                    )}
                  </button>
                );
              })}
              <div className="h-3 w-[1px] bg-[#27272a]" />
              <button
                onClick={() => handleLinkClick({ label: 'Fit Builder', target: 'fit-builder' })}
                className="hover:text-white flex items-center gap-1.5 text-zinc-300 transition-colors"
              >
                <span>Fit Builder</span>
              </button>
              <button
                onClick={() => handleLinkClick({ label: 'Campus Lookbook', target: 'lookbook' })}
                className="hover:text-white transition-colors"
              >
                Lookbook
              </button>
            </nav>
          </div>

          {/* Center: Brand Wordmark */}
          <div className="flex-1 text-center lg:flex-none">
            <button
              onClick={() => {
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group inline-flex flex-col items-center focus:outline-none"
            >
              <span className="font-heading text-2xl sm:text-3xl font-extrabold tracking-[-0.06em] text-white uppercase group-hover:opacity-90 transition-opacity">
                jrrvs
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#71717a] font-mono -mt-1 uppercase">
                studio / 2026
              </span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Search Input / Trigger */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-[#18181b] border border-[#27272a] rounded-lg px-2.5 py-1 text-xs">
                  <Search className="w-3.5 h-3.5 text-[#71717a] mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search tees, cargos, gsm..."
                    className="bg-transparent text-white placeholder-[#71717a] focus:outline-none w-36 sm:w-48 text-xs font-mono"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      onSearchChange('');
                    }}
                    className="text-[#71717a] hover:text-white ml-1 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-[#a1a1aa] hover:text-white transition-colors"
                  title="Search products"
                  aria-label="Search items"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Smart Size Calculator */}
            <button
              onClick={onOpenSizeCalc}
              className="hidden sm:flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-white px-2 py-1.5 rounded border border-[#27272a] hover:border-[#3f3f46] transition-colors"
              title="Campus Fit & Size Guide"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span className="text-[11px] font-mono tracking-wider">FIT GUIDE</span>
            </button>

            {/* User Account / Auth Dropdown */}
            <div className="relative">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-white rounded border border-white/20 bg-[#16171a] hover:border-white transition-all"
                    title={currentUser.email}
                  >
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-[9px]">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="hidden sm:inline font-bold truncate max-w-[90px]">
                      {currentUser.displayName.split(' ')[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#121316] border border-[#27272a] rounded-lg shadow-2xl p-3 z-50 text-xs font-mono space-y-2">
                      <div className="pb-2 border-b border-[#1f2024]">
                        <span className="text-[10px] text-[#71717a] uppercase block">Logged In Student:</span>
                        <p className="font-bold text-white truncate">{currentUser.displayName}</p>
                        <p className="text-[11px] text-[#a1a1aa] truncate">{currentUser.email}</p>
                        {currentUser.university && (
                          <p className="text-[10px] text-zinc-400 mt-1 truncate">{currentUser.university}</p>
                        )}
                      </div>

                      {isAdminUser(currentUser.email) && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAdmin();
                          }}
                          className="w-full text-left py-1.5 px-2 text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 rounded flex items-center gap-2 font-bold"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Admin Portal HQ</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenOrders();
                        }}
                        className="w-full text-left py-1.5 px-2 text-[#a1a1aa] hover:text-white hover:bg-[#18191c] rounded flex items-center gap-2"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>View Order History</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSignOut();
                        }}
                        className="w-full text-left py-1.5 px-2 text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded flex items-center gap-2 pt-2 border-t border-[#1f2024]"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-[#a1a1aa] hover:text-white rounded border border-[#27272a] hover:border-[#3f3f46] transition-colors"
                  title="Sign In / Register"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">SIGN IN</span>
                </button>
              )}
            </div>

            {/* Admin Portal Button */}
            {isAdminUser(currentUser?.email) && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono rounded border text-amber-400 bg-amber-950/40 border-amber-500/40 font-bold hover:bg-amber-950/70 transition-colors shadow-sm"
                title="Admin Portal HQ (Authorized)"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-[11px]">ADMIN HQ</span>
              </button>
            )}

            {/* Order History Button */}
            <button
              onClick={onOpenOrders}
              className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 text-xs text-[#a1a1aa] hover:text-white rounded border border-[#27272a] hover:border-[#3f3f46] relative transition-colors"
              title="My Orders & Live Status"
              aria-label="Orders history and live status"
            >
              <Package className="w-4 h-4 text-zinc-300" />
              <span className="hidden sm:inline font-mono text-[11px]">ORDERS</span>
              {ordersCount > 0 && (
                <span className="w-4 h-4 bg-emerald-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {ordersCount}
                </span>
              )}
            </button>

            {/* Wishlist Heart */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-[#a1a1aa] hover:text-white relative transition-colors"
              title="Saved items"
              aria-label="Saved items"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Bag */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-white text-black px-3.5 py-1.5 rounded font-medium text-xs tracking-wider uppercase hover:bg-[#e4e4e7] transition-colors shrink-0 font-mono font-bold"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bag</span>
              <span className="text-[11px]">({cartCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#222428] bg-[#0c0d0e] px-6 py-6 space-y-4">
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717a]">Catalog</p>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link)}
                className="block w-full text-left py-2 text-sm text-[#e4e4e7] hover:text-white font-medium transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#1f2024] space-y-3 font-mono">
            {currentUser ? (
              <div className="p-3 bg-[#16171a] border border-[#27272a] rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">{currentUser.displayName}</span>
                  <button
                    onClick={() => {
                      onSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-red-400 text-xs hover:underline"
                  >
                    Logout
                  </button>
                </div>
                <p className="text-[11px] text-[#71717a] truncate">{currentUser.email}</p>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left py-2 text-xs text-white bg-[#18191c] px-3 rounded border border-[#27272a]"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Student Sign In / Sign Up</span>
              </button>
            )}


            {isAdminUser(currentUser?.email) && (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left py-2 px-2 text-xs text-amber-400 hover:text-amber-300 font-bold bg-amber-950/20 rounded border border-amber-500/20"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Portal HQ</span>
              </button>
            )}

            <button
              onClick={() => {
                onOpenOrders();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-xs text-[#a1a1aa] hover:text-white"
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>My Orders & Live Status {ordersCount > 0 ? `(${ordersCount})` : ''}</span>
            </button>
            <button
              onClick={() => {
                onOpenSizeCalc();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-xs text-[#a1a1aa] hover:text-white"
            >
              <Ruler className="w-4 h-4" />
              <span>Campus Fit & Size Recommender</span>
            </button>
            <button
              onClick={() => {
                onScrollToSection('drop-countdown');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-left py-2 text-xs text-[#a1a1aa] hover:text-white"
            >
              <Sparkles className="w-4 h-4" />
              <span>Next Drop Radar (Drop 05)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
