import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CartItem, Category, Order, OrderStatus } from './types';
import { Marquee } from './components/Marquee';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductList } from './components/ProductList';
import { FitBuilder } from './components/FitBuilder';
import { LookbookGrid } from './components/LookbookGrid';
import { DropCountdown } from './components/DropCountdown';
import { StudentPerks } from './components/StudentPerks';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SizeCalculatorModal } from './components/SizeCalculatorModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersModal } from './components/OrdersModal';
import { AuthModal } from './components/AuthModal';
import { AdminPortal } from './components/AdminPortal';
import {
  auth,
  StudentProfile,
  fetchUserProfile,
  saveOrderToFirestore,
  fetchOrdersFromFirestore,
  updateOrderStatusInFirestore,
  fetchInventoryStockFromFirestore,
  logoutUser,
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  // Current Firebase Authenticated User
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string | undefined>(undefined);
  const [pendingCheckoutAfterAuth, setPendingCheckoutAfterAuth] = useState(false);

  // Admin Portal State
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Live Inventory Stock State (persisted & synced with Admin Portal)
  const [stockMap, setStockMap] = useState<Record<string, number>>(() => {
    try {
      const local = localStorage.getItem('jrrvs_stock_counts');
      return local ? JSON.parse(local) : {};
    } catch {
      return {};
    }
  });

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jrrvs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jrrvs_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders state - Strictly loaded per authenticated student account. Empty when logged out!
  const [orders, setOrders] = useState<Order[]>([]);

  // Catalog filtering state
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSizeCalcOpen, setIsSizeCalcOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Fetch initial stock from Firestore
  useEffect(() => {
    (async () => {
      try {
        const remote = await fetchInventoryStockFromFirestore();
        if (remote && Object.keys(remote).length > 0) {
          setStockMap((prev) => ({ ...prev, ...remote }));
        }
      } catch (err) {
        console.warn('Could not load inventory stock:', err);
      }
    })();
  }, []);

  // Subscribe to Firebase Auth State Changes
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {

      if (fbUser) {
        const profile = await fetchUserProfile(fbUser.uid);
        setCurrentUser(profile);

        // Fetch user-specific orders from Firestore for this logged-in account
        try {
          const firestoreOrders = await fetchOrdersFromFirestore(fbUser.uid);
          if (firestoreOrders && firestoreOrders.length > 0) {
            setOrders(firestoreOrders);
          } else {
            // Check user-specific localStorage cache
            const userKey = `jrrvs_orders_${fbUser.uid}`;
            const cached = localStorage.getItem(userKey);
            setOrders(cached ? JSON.parse(cached) : []);
          }
        } catch (err) {
          console.error('Error loading orders from Firestore:', err);
          const userKey = `jrrvs_orders_${fbUser.uid}`;
          const cached = localStorage.getItem(userKey);
          setOrders(cached ? JSON.parse(cached) : []);
        }
      } else {
        // User logged out: clear user and clear order history from view!
        setCurrentUser(null);
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Synchronize cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jrrvs_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Synchronize wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jrrvs_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: string, qty = 1) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += qty;
        return next;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity: qty }];
    });
  };

  const handleAddBundleToCart = (
    items: { product: Product; size: string; color: string }[]
  ) => {
    items.forEach((item) => {
      handleAddToCart(item.product, item.size, item.color, 1);
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    setCartItems((prev) => {
      const next = [...prev];
      if (newQty <= 0) {
        return next.filter((_, i) => i !== index);
      }
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Pre-Checkout Authentication Check
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (!currentUser) {
      setAuthReason('Sign in or register your student account to place your order and link your booking to your Firebase profile.');
      setPendingCheckoutAfterAuth(true);
      setIsAuthOpen(true);
    } else {
      setIsCheckoutOpen(true);
    }
  };

  // Called when user successfully signs in or signs up
  const handleAuthSuccess = (profile: StudentProfile) => {
    setCurrentUser(profile);
    setIsAuthOpen(false);
    if (pendingCheckoutAfterAuth) {
      setPendingCheckoutAfterAuth(false);
      setIsCheckoutOpen(true);
    }
  };

  // Sign out user: immediately clear user, order history, and admin session
  const handleSignOut = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setOrders([]); // Clean logged-out view: no old orders visible!
      setIsAdminOpen(false);
      localStorage.removeItem('jrrvs_admin_auth');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Order operations: Save both to active state and user's Firestore path
  const handleSaveOrder = async (newOrder: Order) => {
    const orderWithUser: Order = {
      ...newOrder,
      userId: currentUser?.id || 'guest',
    };

    setOrders((prev) => [orderWithUser, ...prev]);
    handleClearCart();

    // Persist to user-specific Firestore & user-specific storage
    if (currentUser?.id) {
      try {
        await saveOrderToFirestore(currentUser.id, orderWithUser);
        const userKey = `jrrvs_orders_${currentUser.id}`;
        const existing = localStorage.getItem(userKey);
        const list = existing ? JSON.parse(existing) : [];
        localStorage.setItem(userKey, JSON.stringify([orderWithUser, ...list]));
      } catch (err) {
        console.error('Could not save order to Firestore:', err);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );

    if (currentUser?.id) {
      try {
        await updateOrderStatusInFirestore(currentUser.id, orderId, newStatus);
        const userKey = `jrrvs_orders_${currentUser.id}`;
        const existing = localStorage.getItem(userKey);
        if (existing) {
          const list: Order[] = JSON.parse(existing);
          const updated = list.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
          localStorage.setItem(userKey, JSON.stringify(updated));
        }
      } catch (err) {
        console.error('Error updating order status in Firestore:', err);
      }
    }
  };

  // Wishlist operations
  // Live catalog with dynamic admin-managed stock counts
  const currentProducts = useMemo(() => {
    return PRODUCTS.map((p) => {
      const live = stockMap[p.id];
      return live !== undefined ? { ...p, stockCount: live } : p;
    });
  }, [stockMap]);

  // Stock update triggered from Admin Portal
  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setStockMap((prev) => ({ ...prev, [productId]: newStock }));
  };

  // Order status update triggered from Admin Portal
  const handleAdminOrderStatusUpdated = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      }
      return [...prev, product.id];
    });
  };

  const wishlistProducts = currentProducts.filter((p) => wishlistIds.includes(p.id));

  // Smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-[#f2f2ef] flex flex-col noise-overlay">
      {/* Top Announcement Marquee */}
      <Marquee />

      {/* Main Navbar */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        ordersCount={currentUser ? orders.length : 0}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAuth={() => {
          setAuthReason(undefined);
          setPendingCheckoutAfterAuth(false);
          setIsAuthOpen(true);
        }}
        onSignOut={handleSignOut}
        onOpenSizeCalc={() => setIsSizeCalcOpen(true)}
        onOpenAdmin={() => {
          if (currentUser?.email.toLowerCase() === 'rehanpateljrrvs@gmail.com') {
            setIsAdminOpen(true);
          }
        }}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onScrollToSection={scrollToSection}
      />

      <main className="flex-1">
        {/* Streetwear Editorial Hero */}
        <Hero
          onExploreDrop={() => scrollToSection('catalog')}
          onOpenFitBuilder={() => scrollToSection('fit-builder')}
          onOpenSizeGuide={() => setIsSizeCalcOpen(true)}
        />

        {/* Product Catalog & Segmented Filters */}
        <ProductList
          products={currentProducts}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(product) => setSelectedProduct(product)}
          onAddToCart={(product, size, color) => handleAddToCart(product, size, color, 1)}
        />

        {/* Interactive Outfit / Fit Builder */}
        <FitBuilder
          products={currentProducts}
          onAddBundleToCart={handleAddBundleToCart}
        />

        {/* Campus Uniform Lookbook */}
        <LookbookGrid
          onSelectCategory={setActiveCategory}
          onScrollToCatalog={() => scrollToSection('catalog')}
        />

        {/* Student Advantage & Discount Voucher */}
        <StudentPerks />

        {/* Next Drop Countdown (Drop 05) */}
        <DropCountdown />

        {/* Campus Student Reviews & Fit Feedback */}
        <ReviewsSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenSizeCalc={() => setIsSizeCalcOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => {
          if (currentUser?.email.toLowerCase() === 'rehanpateljrrvs@gmail.com') {
            setIsAdminOpen(true);
          }
        }}
        isAdmin={currentUser?.email.toLowerCase() === 'rehanpateljrrvs@gmail.com'}
        onScrollToSection={scrollToSection}
      />

      {/* Modals & Slide-out Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, size, color, qty) => {
          handleAddToCart(product, size, color, qty);
          setIsCartOpen(true);
        }}
        onOpenSizeCalc={() => setIsSizeCalcOpen(true)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <SizeCalculatorModal
        isOpen={isSizeCalcOpen}
        onClose={() => setIsSizeCalcOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={(id) => setWishlistIds((prev) => prev.filter((i) => i !== id))}
        onAddToCart={(product, size, color) => handleAddToCart(product, size, color, 1)}
      />

      {/* Checkout Modal with Reliable Reset, UPI QR Code, and Order Dispatch */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currentUser={currentUser}
        onOrderComplete={handleSaveOrder}
        onViewOrders={() => {
          setIsCheckoutOpen(false);
          setIsOrdersOpen(true);
        }}
      />

      {/* Order History & Live Delivery Status Tracker Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthReason('Sign in to view your orders and live hostel dispatch status.');
          setIsAuthOpen(true);
        }}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onShopCatalog={() => scrollToSection('catalog')}
      />

      {/* Firebase Sign In / Sign Up Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        reasonMessage={authReason}
      />

      {/* Admin Portal HQ Modal - Restricted strictly to rehanpateljrrvs@gmail.com */}
      {currentUser?.email.toLowerCase() === 'rehanpateljrrvs@gmail.com' && (
        <AdminPortal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          products={currentProducts}
          currentStockMap={stockMap}
          onUpdateStock={handleUpdateProductStock}
          onOrderStatusUpdated={handleAdminOrderStatusUpdated}
        />
      )}
    </div>
  );
}
