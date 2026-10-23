import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Shield,
  Package,
  Layers,
  BarChart3,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  RefreshCw,
  LogOut,
  ChevronRight,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Eye,
  Plus,
  Minus,
  Save,
  Lock,
  Mail,
  KeyRound,
  AlertTriangle,
  Building,
  User,
  Phone,
  DollarSign,
  TrendingUp,
  Tag,
  Sparkles,
} from 'lucide-react';
import { Order, OrderStatus, Product, Category } from '../types';
import {
  ADMIN_EMAIL,
  ADMIN_PASS,
  verifyAdminCredentials,
  fetchAllOrdersForAdmin,
  subscribeToAllOrdersForAdmin,
  updateMasterOrderStatus,
  fetchInventoryStockFromFirestore,
  updateInventoryStockInFirestore,
} from '../lib/firebase';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currentStockMap: Record<string, number>;
  onUpdateStock: (productId: string, newStock: number) => void;
  onOrderStatusUpdated?: (orderId: string, newStatus: OrderStatus) => void;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onClose: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminPortalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AdminPortal caught error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('jrrvs_master_orders');
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
          <div className="w-full max-w-lg bg-[#141518] border border-red-500/40 rounded-xl p-6 sm:p-8 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg uppercase tracking-tight text-white">
                  Admin HQ System Recovery
                </h3>
                <p className="text-xs text-red-400">Terminal recovered from data anomaly</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              A malformed record was prevented from crashing the terminal. You can reset the local admin cache to restore sample student campus orders or return to the storefront.
            </p>

            {this.state.error && (
              <pre className="p-3 bg-black/60 border border-zinc-800 rounded text-[11px] text-zinc-400 overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Cache & Reload</span>
              </button>
              <button
                onClick={this.props.onClose}
                className="py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg text-xs transition-colors"
              >
                Return to Store
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AdminPortalInner: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  currentStockMap,
  onUpdateStock,
  onOrderStatusUpdated,
}) => {
  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jrrvs_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'stock' | 'analytics' | 'packing'>('orders');

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [searchOrderQuery, setSearchOrderQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState<string>('all');
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState<Order | null>(null);

  // Inventory Editing State
  const [searchProductQuery, setSearchProductQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [stockEditValues, setStockEditValues] = useState<Record<string, number>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Load orders when authenticated & subscribe in real time
  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const fetched = await fetchAllOrdersForAdmin();
      setOrders(fetched);
    } catch (err) {
      console.error('Failed to load orders in admin:', err);
      setOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn && isOpen) {
      loadOrders();

      // Real-time Firestore sync: updates when any customer places or modifies an order
      const unsubscribe = subscribeToAllOrdersForAdmin((liveOrders) => {
        setOrders(liveOrders);
        setIsLoadingOrders(false);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isAdminLoggedIn, isOpen]);

  // Sync initial product stock values into editing map
  useEffect(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      map[p.id] = currentStockMap[p.id] !== undefined ? currentStockMap[p.id] : p.stockCount;
    });
    setStockEditValues(map);
  }, [products, currentStockMap]);

  if (!isOpen) return null;

  // Handle Admin Login
  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      if (verifyAdminCredentials(loginEmail, loginPass)) {
        setIsAdminLoggedIn(true);
        localStorage.setItem('jrrvs_admin_auth', 'true');
        setLoginError(null);
        loadOrders();
      } else {
        setLoginError(
          'Access denied: Invalid administrator email or security passcode.'
        );
      }
      setIsAuthenticating(false);
    }, 400);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('jrrvs_admin_auth');
    setLoginPass('');
    setLoginError(null);
  };

  // Change order status action
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Optimistically update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      await updateMasterOrderStatus(orderId, targetOrder.userId, newStatus);
      if (onOrderStatusUpdated) {
        onOrderStatusUpdated(orderId, newStatus);
      }
      setSaveSuccessMsg(`Order ${targetOrder.orderNumber} status changed to "${newStatus}"`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Stock edit action
  const handleStockAdjust = async (productId: string, delta: number) => {
    const current = stockEditValues[productId] ?? 10;
    const nextVal = Math.max(0, current + delta);
    setStockEditValues((prev) => ({ ...prev, [productId]: nextVal }));
    onUpdateStock(productId, nextVal);
    await updateInventoryStockInFirestore(productId, nextVal);
    setSaveSuccessMsg(`Stock updated for ${productId}`);
    setTimeout(() => setSaveSuccessMsg(null), 2000);
  };

  const handleDirectStockChange = (productId: string, val: number) => {
    const nextVal = Math.max(0, isNaN(val) ? 0 : val);
    setStockEditValues((prev) => ({ ...prev, [productId]: nextVal }));
  };

  const handleSaveDirectStock = async (productId: string) => {
    const val = stockEditValues[productId] ?? 0;
    onUpdateStock(productId, val);
    await updateInventoryStockInFirestore(productId, val);
    setSaveSuccessMsg(`Stock saved (${val} units)`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const handleQuickRestock = async (productId: string, amount: number) => {
    const current = stockEditValues[productId] ?? 0;
    const nextVal = current + amount;
    setStockEditValues((prev) => ({ ...prev, [productId]: nextVal }));
    onUpdateStock(productId, nextVal);
    await updateInventoryStockInFirestore(productId, nextVal);
    setSaveSuccessMsg(`+${amount} units restocked!`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const handleCopyOrderId = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Filtered Orders (100% defensive against missing or corrupted fields)
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders.filter((order) => {
      if (!order) return false;
      const orderNum = String(order.orderNumber || order.id || '');
      const addr = order.deliveryAddress || {};
      const fullName = String(addr.fullName || '');
      const email = String(addr.email || '');
      const phone = String(addr.phone || '');
      const university = String(addr.university || '');
      const city = String(addr.city || '');
      const q = (searchOrderQuery || '').toLowerCase().trim();

      const matchSearch =
        q === '' ||
        orderNum.toLowerCase().includes(q) ||
        fullName.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        phone.toLowerCase().includes(q) ||
        university.toLowerCase().includes(q) ||
        city.toLowerCase().includes(q);

      const status = String(order.status || '').toLowerCase();
      const matchStatus =
        selectedStatusFilter === 'all' || status === selectedStatusFilter.toLowerCase();

      const payment = String(order.paymentMethod || '').toLowerCase();
      const matchPayment =
        selectedPaymentFilter === 'all' || payment === selectedPaymentFilter.toLowerCase();

      return matchSearch && matchStatus && matchPayment;
    });
  }, [orders, searchOrderQuery, selectedStatusFilter, selectedPaymentFilter]);

  // Analytics Metrics
  const totalRevenue = useMemo(() => {
    if (!Array.isArray(orders)) return 0;
    return orders.reduce((sum, o) => {
      const val = Number(o?.totalAmount);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [orders]);

  const ordersByStatus = useMemo(() => {
    if (!Array.isArray(orders)) {
      return { confirmed: 0, dispatched: 0, outForDelivery: 0, delivered: 0 };
    }
    return {
      confirmed: orders.filter((o) => o?.status === 'Confirmed').length,
      dispatched: orders.filter((o) => o?.status === 'Dispatched').length,
      outForDelivery: orders.filter((o) => o?.status === 'Out for Delivery').length,
      delivered: orders.filter((o) => o?.status === 'Delivered').length,
    };
  }, [orders]);

  const paymentBreakdown = useMemo(() => {
    if (!Array.isArray(orders)) {
      return { upi: 0, card: 0, cod: 0 };
    }
    const upi = orders.filter((o) => String(o?.paymentMethod || '').toLowerCase() === 'upi').length;
    const card = orders.filter((o) => String(o?.paymentMethod || '').toLowerCase() === 'card').length;
    const cod = orders.filter((o) => String(o?.paymentMethod || '').toLowerCase() === 'cod').length;
    return { upi, card, cod };
  }, [orders]);

  // Filtered Products for Inventory
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter((p) => {
      if (!p) return false;
      const q = (searchProductQuery || '').toLowerCase().trim();
      const name = String(p.name || '');
      const id = String(p.id || '');
      const cat = String(p.category || '');

      const matchQuery =
        q === '' ||
        name.toLowerCase().includes(q) ||
        id.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q);

      const matchCat =
        selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;

      return matchQuery && matchCat;
    });
  }, [products, searchProductQuery, selectedCategoryFilter]);

  const totalStockUnits = useMemo(() => {
    if (!Array.isArray(products)) return 0;
    return products.reduce((acc, p) => acc + (stockEditValues[p.id] ?? p.stockCount ?? 0), 0);
  }, [products, stockEditValues]);

  const lowStockCount = useMemo(() => {
    if (!Array.isArray(products)) return 0;
    return products.filter((p) => (stockEditValues[p.id] ?? p.stockCount ?? 0) < 10).length;
  }, [products, stockEditValues]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto font-mono">
      <div className="relative w-full max-w-7xl max-h-[96vh] h-[94vh] bg-[#121316] border border-[#27272a] rounded-xl flex flex-col shadow-2xl overflow-hidden text-[#f4f4f5]">
        
        {/* ========================================================= */}
        {/* VIEW 1: ADMIN LOGIN SCREEN (If not logged in)              */}
        {/* ========================================================= */}
        {!isAdminLoggedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-[#71717a] hover:text-white bg-[#18181b] border border-[#27272a] rounded-lg transition-colors"
              title="Return to store"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full max-w-md bg-[#131417] border border-[#222428] rounded-xl p-8 sm:p-10 shadow-2xl space-y-6">
              
              {/* Terminal Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mb-2">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black font-heading tracking-tight text-white uppercase">
                  JRRVS // ADMIN HQ
                </h2>
                <p className="text-xs text-[#a1a1aa]">
                  Restricted Access · Authorized Personnel Only
                </p>
                <div className="text-[11px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded">
                  Secure Administrator Login
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded text-red-400 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#71717a]" />
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@jrrvs.com"
                      className="w-full bg-[#18191c] border border-[#27272a] focus:border-white rounded-lg pl-9 pr-3 py-2 text-white placeholder-[#52525b] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#a1a1aa] uppercase tracking-wider mb-1.5">
                    Admin Security Passcode
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-[#71717a]" />
                    <input
                      type="password"
                      required
                      autoComplete="off"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#18191c] border border-[#27272a] focus:border-white rounded-lg pl-9 pr-3 py-2 text-white placeholder-[#52525b] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-2.5 bg-white text-black font-bold uppercase rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authenticate Terminal</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <button
                  onClick={onClose}
                  className="text-xs text-[#71717a] hover:text-[#a1a1aa] underline"
                >
                  ← Return to JRRVS Storefront
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* VIEW 2: AUTHENTICATED ADMIN DASHBOARD                      */
          /* ========================================================= */
          <>
            {/* Header Bar */}
            <div className="bg-[#121316] border-b border-[#222428] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              
              {/* Left Brand & Status */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-white text-black font-extrabold flex items-center justify-center text-sm font-heading">
                  J
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-sm tracking-tight text-white uppercase">
                      JRRVS HQ ADMIN
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE · ROOT PRIVILEGES
                    </span>
                  </div>
                  <div className="text-[11px] text-[#71717a] flex items-center gap-2">
                    <span>Admin: <strong className="text-zinc-300">{ADMIN_EMAIL}</strong></span>
                    <span>·</span>
                    <span className="text-emerald-400">Firebase Firestore Linked</span>
                  </div>
                </div>
              </div>

              {/* Center Navigation Tabs */}
              <div className="flex items-center space-x-1 bg-[#18191c] p-1 rounded-lg border border-[#27272a] text-xs">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-white text-black font-bold shadow'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>All Orders</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === 'orders' ? 'bg-black text-white' : 'bg-[#27272a] text-zinc-300'
                  }`}>
                    {orders.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('stock')}
                  className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                    activeTab === 'stock'
                      ? 'bg-white text-black font-bold shadow'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Stock & Inventory</span>
                  {lowStockCount > 0 && (
                    <span className="text-[9px] px-1 py-0.2 bg-amber-500 text-black font-bold rounded-full">
                      {lowStockCount} LOW
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-white text-black font-bold shadow'
                      : 'text-[#a1a1aa] hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Analytics</span>
                </button>
              </div>

              {/* Right Action buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={loadOrders}
                  disabled={isLoadingOrders}
                  className="p-2 text-[#a1a1aa] hover:text-white bg-[#18191c] border border-[#27272a] rounded-lg transition-colors"
                  title="Refresh Orders & Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin text-white' : ''}`} />
                </button>

                <button
                  onClick={handleAdminLogout}
                  className="px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 rounded-lg flex items-center gap-1.5 transition-colors"
                  title="Logout from Admin session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
                >
                  Storefront
                </button>
              </div>
            </div>

            {/* Notification / Toast Banner */}
            {saveSuccessMsg && (
              <div className="bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-300 text-xs px-4 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{saveSuccessMsg}</span>
                </div>
                <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-200">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* ========================================================= */}
              {/* TAB 1: ALL ORDERS MANAGEMENT                              */}
              {/* ========================================================= */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  
                  {/* KPI Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-3.5">
                      <span className="text-[10px] text-[#71717a] uppercase block">Total Orders</span>
                      <span className="text-xl sm:text-2xl font-bold font-heading text-white">{orders.length}</span>
                    </div>

                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-3.5">
                      <span className="text-[10px] text-[#71717a] uppercase block">Total Revenue</span>
                      <span className="text-xl sm:text-2xl font-bold font-heading text-emerald-400">
                        ₹{totalRevenue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-3.5">
                      <span className="text-[10px] text-amber-400 uppercase block">Confirmed / Queued</span>
                      <span className="text-xl sm:text-2xl font-bold font-heading text-amber-400">
                        {ordersByStatus.confirmed}
                      </span>
                    </div>

                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-3.5">
                      <span className="text-[10px] text-sky-400 uppercase block">Dispatched & Transit</span>
                      <span className="text-xl sm:text-2xl font-bold font-heading text-sky-400">
                        {ordersByStatus.dispatched + ordersByStatus.outForDelivery}
                      </span>
                    </div>

                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-3.5 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-emerald-400 uppercase block">Delivered to Hostels</span>
                      <span className="text-xl sm:text-2xl font-bold font-heading text-emerald-400">
                        {ordersByStatus.delivered}
                      </span>
                    </div>
                  </div>

                  {/* Filter and Search Bar */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#121316] p-3 rounded-xl border border-[#222428]">
                    
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#71717a]" />
                      <input
                        type="text"
                        value={searchOrderQuery}
                        onChange={(e) => setSearchOrderQuery(e.target.value)}
                        placeholder="Search by Order #, Customer, Phone, University, City..."
                        className="w-full bg-[#18191c] border border-[#27272a] rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-[#52525b] outline-none focus:border-zinc-400 font-mono"
                      />
                      {searchOrderQuery && (
                        <button
                          onClick={() => setSearchOrderQuery('')}
                          className="absolute right-2.5 top-2.5 text-[#71717a] hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-[#71717a] uppercase hidden sm:inline">Status:</span>
                      <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="bg-[#18191c] border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 outline-none focus:border-zinc-400 font-mono"
                      >
                        <option value="all">All Statuses ({orders.length})</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                      {/* Payment Filter */}
                      <select
                        value={selectedPaymentFilter}
                        onChange={(e) => setSelectedPaymentFilter(e.target.value)}
                        className="bg-[#18191c] border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 outline-none focus:border-zinc-400 font-mono"
                      >
                        <option value="all">All Payments</option>
                        <option value="upi">UPI Only</option>
                        <option value="card">Card</option>
                        <option value="cod">Cash on Delivery</option>
                      </select>
                    </div>

                  </div>

                  {/* Orders Listing */}
                  {filteredOrders.length === 0 ? (
                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-12 text-center space-y-3">
                      <Package className="w-12 h-12 text-[#52525b] mx-auto" />
                      <h4 className="text-base font-bold text-white uppercase">No Customer Orders Yet</h4>
                      <p className="text-xs text-[#a1a1aa] max-w-md mx-auto">
                        No orders match your filter criteria. When students and customers place new orders from the store, their live orders and hostel delivery addresses will appear here in real time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => {
                        const statusColor =
                          order.status === 'Confirmed'
                            ? 'text-amber-400 border-amber-500/30 bg-amber-950/20'
                            : order.status === 'Dispatched'
                            ? 'text-sky-400 border-sky-500/30 bg-sky-950/20'
                            : order.status === 'Out for Delivery'
                            ? 'text-purple-400 border-purple-500/30 bg-purple-950/20'
                            : 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';

                        const orderNum = order.orderNumber || order.id || 'JRRVS-ORDER';
                        const addr = order.deliveryAddress || {};
                        const items = Array.isArray(order.items) ? order.items : [];
                        const totalUnits = items.reduce((s, i) => s + (Number(i?.quantity) || 1), 0);

                        return (
                          <div
                            key={order.id}
                            className="bg-[#121316] border border-[#222428] hover:border-[#383a40] rounded-xl p-4 sm:p-5 transition-all space-y-4"
                          >
                            {/* Card Top: Order Number, Date, Status, Total */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1c1d22]">
                              
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <span className="font-heading font-black text-white text-base tracking-tight">
                                  {orderNum}
                                </span>
                                <button
                                  onClick={() => handleCopyOrderId(orderNum, order.id)}
                                  className="text-[#71717a] hover:text-white p-1"
                                  title="Copy Order Number"
                                >
                                  {copiedOrderId === order.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <span className="text-[11px] text-[#71717a]">
                                  Placed: {order.createdAt || 'Recent'}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Total Amount */}
                                <div className="text-right">
                                  <span className="text-[10px] text-[#71717a] block uppercase">Total Amount</span>
                                  <span className="font-heading font-bold text-white text-sm">
                                    ₹{(Number(order.totalAmount) || 0).toLocaleString('en-IN')}
                                  </span>
                                </div>

                                {/* Status Badge */}
                                <div className={`px-2.5 py-1 text-xs rounded-full border font-bold ${statusColor}`}>
                                  {order.status || 'Confirmed'}
                                </div>
                              </div>

                            </div>

                            {/* Card Middle: Customer info & Items summary */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                              
                              {/* Customer & Hostel Address */}
                              <div className="md:col-span-5 space-y-1.5 bg-[#17181c] p-3 rounded-lg border border-[#202126]">
                                <span className="text-[10px] text-[#71717a] uppercase tracking-wider block font-bold">
                                  Student & Campus Details
                                </span>
                                <div className="space-y-1 text-zinc-300">
                                  <p className="font-bold text-white flex items-center gap-1.5">
                                    <User className="w-3 h-3 text-[#a1a1aa]" />
                                    <span>{addr.fullName || 'Student Customer'}</span>
                                  </p>
                                  <p className="flex items-center gap-1.5 text-[11px] text-[#a1a1aa]">
                                    <Phone className="w-3 h-3 text-[#71717a]" />
                                    <span>{addr.phone || 'No phone'}</span>
                                    <span>·</span>
                                    <Mail className="w-3 h-3 text-[#71717a]" />
                                    <span>{addr.email || 'No email'}</span>
                                  </p>
                                  <p className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                                    <Building className="w-3 h-3 text-[#71717a] shrink-0 mt-0.5" />
                                    <span>
                                      {addr.university || 'Campus'} — {addr.hostelOrAddress || 'Hostel'}, {addr.city || 'City'} {addr.pincode ? `(${addr.pincode})` : ''}
                                    </span>
                                  </p>
                                  {addr.deliveryNotes && (
                                    <p className="text-[10px] text-amber-300/80 italic mt-1">
                                      Notes: "{addr.deliveryNotes}"
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Items Breakdown */}
                              <div className="md:col-span-4 space-y-2 bg-[#17181c] p-3 rounded-lg border border-[#202126]">
                                <span className="text-[10px] text-[#71717a] uppercase tracking-wider block font-bold">
                                  Ordered Streetwear Items ({totalUnits})
                                </span>
                                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                                  {items.map((item, idx) => {
                                    const prodName = item?.product?.name || 'Streetwear Garment';
                                    const prodImg = item?.product?.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&q=80';
                                    const prodPrice = Number(item?.product?.price) || 0;
                                    const itemQty = Number(item?.quantity) || 1;

                                    return (
                                      <div key={idx} className="flex items-center gap-2 text-[11px]">
                                        <img
                                          src={prodImg}
                                          alt={prodName}
                                          className="w-9 h-9 object-cover rounded border border-[#27272a] shrink-0 bg-zinc-900"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="font-bold text-white truncate">{prodName}</p>
                                          <p className="text-[10px] text-[#a1a1aa]">
                                            Size: {item?.selectedSize || 'Standard'} · {item?.selectedColor || 'Standard'} · Qty: {itemQty}
                                          </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <span className="font-bold text-zinc-300">
                                            ₹{(prodPrice * itemQty).toLocaleString('en-IN')}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Payment & Security Details */}
                              <div className="md:col-span-3 space-y-2 bg-[#17181c] p-3 rounded-lg border border-[#202126] flex flex-col justify-between">
                                <div>
                                  <span className="text-[10px] text-[#71717a] uppercase tracking-wider block font-bold">
                                    Payment Method & State
                                  </span>
                                  <div className="mt-1 space-y-1">
                                    <div className="flex items-center gap-1.5 font-bold uppercase text-white">
                                      {order.paymentMethod === 'upi' ? (
                                        <span className="text-emerald-400">UPI Instant Pay</span>
                                      ) : order.paymentMethod === 'card' ? (
                                        <span className="text-sky-400">Debit / Credit Card</span>
                                      ) : (
                                        <span className="text-amber-400">Cash on Delivery</span>
                                      )}
                                    </div>

                                    <div className="text-[11px] text-[#a1a1aa]">
                                      Status: <strong className="text-white">{order.paymentStatus || 'Paid'}</strong>
                                    </div>

                                    {order.upiRefId && (
                                      <div className="text-[10px] text-zinc-400 bg-[#121316] p-1.5 rounded border border-[#222428] font-mono break-all">
                                        UPI Ref: <span className="text-emerald-300">{order.upiRefId}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <button
                                  onClick={() => setSelectedOrderForSlip(order)}
                                  className="w-full text-center py-1.5 bg-[#222428] hover:bg-[#2c2e35] text-white rounded text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <Printer className="w-3 h-3" />
                                  <span>Print Dispatch Label</span>
                                </button>
                              </div>

                            </div>

                            {/* Card Bottom: Admin Status Control Center */}
                            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#1c1d22]">
                              <span className="text-[11px] text-[#71717a]">
                                Update Live Status (Notifies Student):
                              </span>

                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  onClick={() => handleStatusChange(order.id, 'Confirmed')}
                                  disabled={order.status === 'Confirmed'}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                                    order.status === 'Confirmed'
                                      ? 'bg-amber-400 text-black shadow'
                                      : 'bg-[#18191c] text-[#a1a1aa] hover:text-white border border-[#27272a]'
                                  }`}
                                >
                                  Confirmed
                                </button>

                                <button
                                  onClick={() => handleStatusChange(order.id, 'Dispatched')}
                                  disabled={order.status === 'Dispatched'}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                                    order.status === 'Dispatched'
                                      ? 'bg-sky-400 text-black shadow'
                                      : 'bg-[#18191c] text-[#a1a1aa] hover:text-white border border-[#27272a]'
                                  }`}
                                >
                                  Dispatched
                                </button>

                                <button
                                  onClick={() => handleStatusChange(order.id, 'Out for Delivery')}
                                  disabled={order.status === 'Out for Delivery'}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                                    order.status === 'Out for Delivery'
                                      ? 'bg-purple-400 text-black shadow'
                                      : 'bg-[#18191c] text-[#a1a1aa] hover:text-white border border-[#27272a]'
                                  }`}
                                >
                                  Out for Delivery
                                </button>

                                <button
                                  onClick={() => handleStatusChange(order.id, 'Delivered')}
                                  disabled={order.status === 'Delivered'}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                                    order.status === 'Delivered'
                                      ? 'bg-emerald-400 text-black shadow'
                                      : 'bg-[#18191c] text-[#a1a1aa] hover:text-white border border-[#27272a]'
                                  }`}
                                >
                                  Delivered
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 2: LIVE STOCK & INVENTORY MANAGEMENT                  */}
              {/* ========================================================= */}
              {activeTab === 'stock' && (
                <div className="space-y-6">
                  
                  {/* Stock Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-3.5">
                      <span className="text-[10px] text-[#71717a] uppercase block">Catalog SKUs</span>
                      <span className="text-xl sm:text-2xl font-bold font-heading text-white">{products.length}</span>
                    </div>

                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-3.5">
                      <span className="text-[10px] text-[#71717a] uppercase block">Total Warehouse Units</span>
                      <span className="text-xl sm:text-2xl font-bold font-heading text-emerald-400">{totalStockUnits}</span>
                    </div>

                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-3.5">
                      <span className="text-[10px] text-amber-400 uppercase block">Low Stock Alerts (&lt; 10)</span>
                      <span className="text-xl sm:text-2xl font-bold font-heading text-amber-400">{lowStockCount}</span>
                    </div>

                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-3.5">
                      <span className="text-[10px] text-red-400 uppercase block">Sold Out Items</span>
                      <span className="text-xl sm:text-2xl font-bold font-heading text-red-400">
                        {products.filter((p) => (stockEditValues[p.id] ?? p.stockCount) === 0).length}
                      </span>
                    </div>
                  </div>

                  {/* Stock Search & Filter Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121316] p-3 rounded-xl border border-[#222428]">
                    
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#71717a]" />
                      <input
                        type="text"
                        value={searchProductQuery}
                        onChange={(e) => setSearchProductQuery(e.target.value)}
                        placeholder="Search product name, category, SKU..."
                        className="w-full bg-[#18191c] border border-[#27272a] rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-[#52525b] outline-none focus:border-zinc-400 font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-[#71717a] uppercase">Category:</span>
                      <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="bg-[#18191c] border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 outline-none focus:border-zinc-400 font-mono"
                      >
                        <option value="all">All Categories</option>
                        <option value="tees">Tees</option>
                        <option value="hoodies">Hoodies</option>
                        <option value="cargos">Cargos</option>
                        <option value="outerwear">Outerwear</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>

                  </div>

                  {/* Stock Inventory Table / Grid */}
                  <div className="bg-[#121316] border border-[#222428] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#17181c] border-b border-[#222428] text-[#71717a] text-[10px] uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Item & Details</th>
                            <th className="py-3 px-4">Category / GSM</th>
                            <th className="py-3 px-4">Price (INR)</th>
                            <th className="py-3 px-4">Available Stock Level</th>
                            <th className="py-3 px-4 text-right">Quick Stock Controls</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1c1d22]">
                          {filteredProducts.map((product) => {
                            const currentStock = stockEditValues[product.id] ?? product.stockCount;
                            const isLow = currentStock > 0 && currentStock < 10;
                            const isSoldOut = currentStock === 0;

                            return (
                              <tr key={product.id} className="hover:bg-[#16171b] transition-colors">
                                {/* Item */}
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center space-x-3">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-12 h-12 rounded object-cover border border-[#27272a] shrink-0"
                                    />
                                    <div>
                                      <p className="font-bold text-white text-xs">{product.name}</p>
                                      <p className="text-[10px] text-[#71717a] truncate max-w-xs">{product.subtitle}</p>
                                      <span className="text-[9px] text-zinc-400 font-mono">SKU: {product.id}</span>
                                    </div>
                                  </div>
                                </td>

                                {/* Specs */}
                                <td className="py-3.5 px-4 text-[#a1a1aa]">
                                  <p className="capitalize font-bold text-white">{product.category}</p>
                                  <p className="text-[11px] text-[#71717a]">{product.gsm} GSM Cotton</p>
                                  <p className="text-[10px] text-zinc-400">{product.fit}</p>
                                </td>

                                {/* Price */}
                                <td className="py-3.5 px-4">
                                  <span className="font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                                  {product.originalPrice && (
                                    <span className="text-[10px] text-[#71717a] block line-through">
                                      ₹{product.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </td>

                                {/* Stock Gauge */}
                                <td className="py-3.5 px-4">
                                  <div className="space-y-1.5 w-44">
                                    <div className="flex items-center justify-between text-[11px]">
                                      <span className="font-bold text-white">{currentStock} units</span>
                                      {isSoldOut ? (
                                        <span className="text-[10px] text-red-400 font-bold">SOLD OUT</span>
                                      ) : isLow ? (
                                        <span className="text-[10px] text-amber-400 font-bold">LOW STOCK</span>
                                      ) : (
                                        <span className="text-[10px] text-emerald-400 font-bold">IN STOCK</span>
                                      )}
                                    </div>
                                    <div className="w-full h-1.5 bg-[#222428] rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all ${
                                          isSoldOut
                                            ? 'bg-red-500 w-0'
                                            : isLow
                                            ? 'bg-amber-400'
                                            : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${Math.min(100, (currentStock / 30) * 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>

                                {/* Controls */}
                                <td className="py-3.5 px-4 text-right">
                                  <div className="inline-flex items-center space-x-1.5">
                                    <button
                                      onClick={() => handleStockAdjust(product.id, -1)}
                                      className="p-1.5 bg-[#18191c] hover:bg-[#222428] text-white rounded border border-[#27272a] transition-colors"
                                      title="Decrease by 1"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>

                                    <input
                                      type="number"
                                      min="0"
                                      value={stockEditValues[product.id] ?? product.stockCount}
                                      onChange={(e) => handleDirectStockChange(product.id, parseInt(e.target.value) || 0)}
                                      onBlur={() => handleSaveDirectStock(product.id)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveDirectStock(product.id);
                                      }}
                                      className="w-14 bg-[#18191c] border border-[#27272a] rounded py-1 text-center text-xs font-bold text-white focus:outline-none focus:border-white"
                                    />

                                    <button
                                      onClick={() => handleStockAdjust(product.id, 1)}
                                      className="p-1.5 bg-[#18191c] hover:bg-[#222428] text-white rounded border border-[#27272a] transition-colors"
                                      title="Increase by 1"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      onClick={() => handleQuickRestock(product.id, 15)}
                                      className="px-2 py-1 bg-white hover:bg-zinc-200 text-black text-[10px] font-bold rounded uppercase transition-colors"
                                      title="Add +15 units"
                                    >
                                      +15
                                    </button>

                                    <button
                                      onClick={() => {
                                        const next = currentStock === 0 ? 20 : 0;
                                        handleDirectStockChange(product.id, next);
                                        onUpdateStock(product.id, next);
                                        updateInventoryStockInFirestore(product.id, next);
                                      }}
                                      className="px-2 py-1 bg-[#1f2024] hover:bg-[#282a30] text-[#a1a1aa] hover:text-white text-[10px] rounded border border-[#27272a] transition-colors"
                                    >
                                      {currentStock === 0 ? 'Restock' : 'Zero'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ========================================================= */}
              {/* TAB 3: ANALYTICS & INSIGHTS                               */}
              {/* ========================================================= */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Payment breakdown */}
                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-5 space-y-4">
                      <h4 className="font-heading font-bold text-white uppercase text-sm flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span>Payment Method Distribution</span>
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div>
                          <div className="flex justify-between text-[#a1a1aa] mb-1">
                            <span>UPI QR & Instant</span>
                            <span className="text-white font-bold">{paymentBreakdown.upi} orders</span>
                          </div>
                          <div className="h-2 bg-[#1c1d22] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full"
                              style={{ width: `${(paymentBreakdown.upi / (orders.length || 1)) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#a1a1aa] mb-1">
                            <span>Debit / Credit Cards</span>
                            <span className="text-white font-bold">{paymentBreakdown.card} orders</span>
                          </div>
                          <div className="h-2 bg-[#1c1d22] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-400 rounded-full"
                              style={{ width: `${(paymentBreakdown.card / (orders.length || 1)) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[#a1a1aa] mb-1">
                            <span>Cash on Delivery</span>
                            <span className="text-white font-bold">{paymentBreakdown.cod} orders</span>
                          </div>
                          <div className="h-2 bg-[#1c1d22] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${(paymentBreakdown.cod / (orders.length || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Universities */}
                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-5 space-y-4">
                      <h4 className="font-heading font-bold text-white uppercase text-sm flex items-center gap-2">
                        <Building className="w-4 h-4 text-purple-400" />
                        <span>Top Campus Hubs</span>
                      </h4>
                      <div className="space-y-2 text-xs">
                        {[
                          { campus: 'Delhi University (SRCC / North Campus)', count: 4 },
                          { campus: 'IIT Bombay (Powai Hostels)', count: 3 },
                          { campus: 'BITS Pilani Main Campus', count: 2 },
                          { campus: 'RV College of Engineering (RVCE)', count: 2 },
                          { campus: 'Chandigarh University', count: 1 },
                        ].map((c, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#1c1d22]">
                            <span className="text-[#a1a1aa] truncate max-w-[200px]">{c.campus}</span>
                            <span className="px-2 py-0.5 bg-[#18191c] text-white rounded font-bold">{c.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Store Performance */}
                    <div className="bg-[#121316] border border-[#222428] rounded-xl p-5 space-y-4">
                      <h4 className="font-heading font-bold text-white uppercase text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span>Key Commerce Metrics</span>
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between py-1 border-b border-[#1c1d22]">
                          <span className="text-[#71717a]">Average Order Value (AOV):</span>
                          <span className="text-white font-bold">
                            ₹{orders.length ? Math.round(totalRevenue / orders.length).toLocaleString('en-IN') : 0}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#1c1d22]">
                          <span className="text-[#71717a]">Prepaid Orders Ratio:</span>
                          <span className="text-emerald-400 font-bold">
                            {orders.length ? Math.round(((paymentBreakdown.upi + paymentBreakdown.card) / orders.length) * 100) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#1c1d22]">
                          <span className="text-[#71717a]">Fulfillment Target:</span>
                          <span className="text-white font-bold">&lt; 48 Hours to Dorm</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[#1c1d22]">
                          <span className="text-[#71717a]">Inventory Health:</span>
                          <span className="text-emerald-400 font-bold">Optimal ({totalStockUnits} units available)</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

            </div>

            {/* Bottom Terminal Bar */}
            <div className="bg-[#101114] border-t border-[#1f2024] px-6 py-2.5 flex items-center justify-between text-[11px] text-[#71717a] shrink-0">
              <div className="flex items-center space-x-4">
                <span>TERMINAL: JRRVS-SECURE-NODE-01</span>
                <span>·</span>
                <span>AUTHENTICATED: {ADMIN_EMAIL}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-emerald-400">FIRESTORE DATA REAL-TIME SYNCED</span>
              </div>
            </div>
          </>
        )}

      </div>

      {/* ========================================================= */}
      {/* PACKING SLIP / DISPATCH LABEL MODAL                        */}
      {/* ========================================================= */}
      {selectedOrderForSlip && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedOrderForSlip(null)}
        >
          <div
            className="w-full max-w-lg bg-white text-black rounded-lg p-6 font-mono text-xs space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b-2 border-black pb-3 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black tracking-tight font-heading uppercase">JRRVS APPAREL</h2>
                <p className="text-[10px] text-zinc-600">CAMPUS DISPATCH & COURIER MANIFEST</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{selectedOrderForSlip.orderNumber || selectedOrderForSlip.id}</p>
                <p className="text-[10px] text-zinc-500">{selectedOrderForSlip.createdAt || 'Recent'}</p>
              </div>
            </div>

            {/* Courier & Dorm Address Box */}
            <div className="border border-black p-3 space-y-1">
              <p className="font-black text-sm uppercase">{selectedOrderForSlip.deliveryAddress?.fullName || 'Student Customer'}</p>
              <p className="font-bold">{selectedOrderForSlip.deliveryAddress?.university || 'Campus'}</p>
              <p>{selectedOrderForSlip.deliveryAddress?.hostelOrAddress || 'Hostel'}</p>
              <p>{selectedOrderForSlip.deliveryAddress?.city || 'City'} {selectedOrderForSlip.deliveryAddress?.pincode ? `- ${selectedOrderForSlip.deliveryAddress.pincode}` : ''}</p>
              <p className="pt-1">Phone: <strong>{selectedOrderForSlip.deliveryAddress?.phone || 'N/A'}</strong></p>
              {selectedOrderForSlip.deliveryAddress?.deliveryNotes && (
                <p className="text-[10px] bg-zinc-100 p-1 mt-1 border border-zinc-300">
                  Gate/Mailroom Note: {selectedOrderForSlip.deliveryAddress.deliveryNotes}
                </p>
              )}
            </div>

            {/* Manifest Items Table */}
            <div className="space-y-1">
              <p className="font-bold uppercase text-[10px]">Package Contents:</p>
              <table className="w-full text-[11px] border-t border-b border-black">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="py-1 text-left">Item</th>
                    <th className="py-1 text-center">Size</th>
                    <th className="py-1 text-center">Color</th>
                    <th className="py-1 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrderForSlip.items || []).map((it, idx) => (
                    <tr key={idx} className="border-b border-zinc-100">
                      <td className="py-1 font-bold">{it?.product?.name || 'Streetwear Garment'}</td>
                      <td className="py-1 text-center">{it?.selectedSize || 'Std'}</td>
                      <td className="py-1 text-center">{it?.selectedColor || 'Std'}</td>
                      <td className="py-1 text-right">{it?.quantity || 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment & Verification */}
            <div className="flex justify-between items-center text-[11px] pt-1 border-t border-zinc-200">
              <div>
                <span>Payment: </span>
                <strong className="uppercase">{selectedOrderForSlip.paymentMethod || 'upi'} ({selectedOrderForSlip.paymentStatus || 'Paid'})</strong>
              </div>
              <div>
                <span>Total: </span>
                <strong className="text-sm">₹{(Number(selectedOrderForSlip.totalAmount) || 0).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Barcode Simulation */}
            <div className="text-center pt-2 border-t border-dashed border-zinc-300 space-y-1">
              <div className="h-8 bg-zinc-900 w-3/4 mx-auto flex items-center justify-around px-2 text-[8px] text-white tracking-widest font-mono">
                ||| | |||| | ||| |||| | |||||| || | |||| ||
              </div>
              <p className="text-[9px] text-zinc-500 uppercase">{selectedOrderForSlip.orderNumber} · VERIFIED JRRVS DISPATCH</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-black text-white font-bold uppercase rounded text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Packing Slip</span>
              </button>
              <button
                onClick={() => setSelectedOrderForSlip(null)}
                className="px-4 py-2 border border-black font-bold uppercase rounded text-xs hover:bg-zinc-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export const AdminPortal: React.FC<AdminPortalProps> = (props) => {
  if (!props.isOpen) return null;
  return (
    <AdminPortalErrorBoundary onClose={props.onClose}>
      <AdminPortalInner {...props} />
    </AdminPortalErrorBoundary>
  );
};

