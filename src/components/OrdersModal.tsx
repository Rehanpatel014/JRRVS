import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { StudentProfile } from '../lib/firebase';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  RefreshCw,
  Lock,
  User,
} from 'lucide-react';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentUser: StudentProfile | null;
  onOpenAuth: () => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onShopCatalog: () => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentUser,
  onOpenAuth,
  onUpdateOrderStatus,
  onShopCatalog,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0] || null;

  const statusSteps: { status: OrderStatus; label: string; desc: string }[] = [
    {
      status: 'Confirmed',
      label: 'Order Confirmed',
      desc: 'Textile inventory verified & packed at JRRVS Central Archive',
    },
    {
      status: 'Dispatched',
      label: 'Dispatched in Transit',
      desc: 'Handed over to Campus Express Courier (BlueDart / Delhivery)',
    },
    {
      status: 'Out for Delivery',
      label: 'Out for Campus Drop',
      desc: 'Delivery rider is arriving at your hostel / college gate',
    },
    {
      status: 'Delivered',
      label: 'Delivered to Hostel',
      desc: 'Package received at hostel mailroom / student security desk',
    },
  ];

  const getStatusIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return 0;
      case 'Dispatched':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#121316] border border-[#222428] rounded-xl overflow-hidden shadow-2xl my-auto text-white max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1f2024] flex items-center justify-between shrink-0 bg-[#0e0f12]">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-white" />
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-white">
                My Orders & Live Status
              </h2>
              <span className="text-[10px] font-mono text-[#71717a]">
                {currentUser ? (
                  <>
                    ACCOUNT: <strong className="text-zinc-300">{currentUser.displayName}</strong> ({currentUser.email})
                  </>
                ) : (
                  'LOGGED OUT VIEW'
                )}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#a1a1aa] hover:text-white rounded-full bg-[#18181b]"
            aria-label="Close orders"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LOGGED-OUT VIEW: No orders shown after logout */}
        {!currentUser ? (
          <div className="p-10 sm:p-16 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#18191c] border border-[#27272a] flex items-center justify-center text-[#71717a]">
              <Lock className="w-8 h-8 text-zinc-400" />
            </div>
            
            <div className="space-y-1.5 max-w-md">
              <span className="text-[10px] font-mono uppercase text-[#71717a] tracking-widest block">
                AUTHENTICATION REQUIRED
              </span>
              <h3 className="font-heading text-xl font-extrabold text-white uppercase tracking-tight">
                No Orders in Logged-Out View
              </h3>
              <p className="text-xs font-mono text-[#a1a1aa] leading-relaxed">
                You are currently signed out. Each student's order history and real-time hostel delivery tracking are private and linked exclusively to their authenticated Firebase account.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <User className="w-4 h-4" />
                <span>Sign In to Access Your Orders</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onShopCatalog();
                }}
                className="w-full sm:w-auto px-5 py-3 bg-[#18191c] text-[#a1a1aa] hover:text-white font-mono text-xs uppercase tracking-wider rounded border border-[#27272a] transition-colors"
              >
                Browse Drop 04 Catalog
              </button>
            </div>
          </div>
        ) : orders.length === 0 ? (
          /* LOGGED-IN BUT NO ORDERS YET */
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#18191c] border border-[#27272a] flex items-center justify-center text-[#52525b]">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 block font-semibold">
                CONNECTED TO FIREBASE
              </span>
              <h3 className="font-heading text-lg font-bold text-white uppercase">
                No Active Orders Yet
              </h3>
              <p className="text-xs font-mono text-[#71717a] max-w-md">
                No garment bookings found for <strong className="text-white">{currentUser.email}</strong>. When you order a boxy tee, oversized hoodie, or parachute cargo, your live delivery tracking will appear here.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onShopCatalog();
              }}
              className="mt-2 px-5 py-2.5 bg-white text-black font-mono text-xs uppercase tracking-wider font-bold rounded hover:bg-zinc-200 transition-colors"
            >
              Shop Drop 04 Essentials
            </button>
          </div>
        ) : (
          /* LOGGED-IN WITH ACTIVE/PAST ORDERS */
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
            
            {/* Left Column: Order List Sidebar */}
            <div className="md:col-span-5 border-r border-[#1f2024] overflow-y-auto p-4 space-y-2.5 max-h-[70vh]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono uppercase text-[#71717a] tracking-widest block">
                  Your Orders ({orders.length}):
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  Firebase Synced
                </span>
              </div>

              {orders.map((order) => {
                const isSelected = activeOrder?.id === order.id;
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#1c1d22] border-white shadow-md'
                        : 'bg-[#141518] border-[#222428] hover:border-[#383a42]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-white">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-600/30'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[#a1a1aa] flex justify-between items-center">
                      <span>{order.createdAt}</span>
                      <span className="font-bold text-white">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-[#71717a] truncate mt-1">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.deliveryAddress.hostelOrAddress}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Live Status Tracker & Order Breakdown */}
            {activeOrder && (
              <div className="md:col-span-7 overflow-y-auto p-5 sm:p-6 space-y-6 max-h-[70vh]">
                
                {/* Active Order Title & Status Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1f2024]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#71717a] tracking-widest block">
                      CURRENT TRACKING STATUS
                    </span>
                    <h3 className="font-heading text-xl font-extrabold text-white">
                      Order {activeOrder.orderNumber}
                    </h3>
                    <span className="text-xs font-mono text-[#a1a1aa]">
                      Placed on {activeOrder.createdAt}
                    </span>
                  </div>

                  {/* Real-time Status Sync Badge */}
                  <div className="self-start sm:self-auto px-3 py-1.5 bg-[#16171b] border border-[#27272a] text-xs font-mono rounded flex items-center gap-2 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Live Dispatch Tracking</span>
                  </div>
                </div>

                {/* VISUAL STEPPER: LIVE DELIVERY PIPELINE */}
                <div className="p-4 bg-[#16171b] border border-[#222428] rounded-lg">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block mb-4">
                    Hostel Dispatch Milestones:
                  </span>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#27272a]">
                    {statusSteps.map((step, idx) => {
                      const currentIdx = getStatusIndex(activeOrder.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.status} className="relative">
                          {/* Dot Indicator */}
                          <div
                            className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 border-emerald-400 text-black'
                                : 'bg-[#18191c] border-[#3f3f46] text-[#71717a]'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <span className="text-[9px] font-mono">{idx + 1}</span>
                            )}
                          </div>

                          {/* Step Text */}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4
                                className={`text-xs font-mono font-bold uppercase ${
                                  isCurrent
                                    ? 'text-white'
                                    : isCompleted
                                    ? 'text-emerald-400'
                                    : 'text-[#71717a]'
                                }`}
                              >
                                {step.label}
                              </h4>
                              {isCurrent && (
                                <span className="text-[9px] font-mono bg-white text-black px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
                                  Current Status
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-mono text-[#a1a1aa] mt-0.5">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recipient & Payment Details Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3.5 bg-[#16171b] border border-[#222428] rounded-lg space-y-1">
                    <span className="text-[10px] uppercase text-[#71717a] block mb-1">
                      Hostel Delivery Address:
                    </span>
                    <p className="text-white font-bold">{activeOrder.deliveryAddress.fullName}</p>
                    <p className="text-[#a1a1aa]">{activeOrder.deliveryAddress.hostelOrAddress}</p>
                    <p className="text-[#a1a1aa]">
                      {activeOrder.deliveryAddress.city} - {activeOrder.deliveryAddress.pincode}
                    </p>
                    <p className="text-[#71717a] pt-1 border-t border-[#1f2024]">
                      Phone: +91 {activeOrder.deliveryAddress.phone}
                    </p>
                  </div>

                  <div className="p-3.5 bg-[#16171b] border border-[#222428] rounded-lg space-y-1">
                    <span className="text-[10px] uppercase text-[#71717a] block mb-1">
                      Payment Verification:
                    </span>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a1a1aa]">Method:</span>
                      <span className="text-white uppercase font-bold">
                        {activeOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#a1a1aa]">Payment Status:</span>
                      <span className="text-emerald-400 font-bold">
                        {activeOrder.paymentStatus}
                      </span>
                    </div>
                    {activeOrder.upiRefId && (
                      <div className="flex justify-between items-center text-[10px] pt-1">
                        <span className="text-[#71717a]">UPI Ref ID:</span>
                        <span className="text-zinc-300 font-mono select-all">
                          {activeOrder.upiRefId}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1 border-t border-[#1f2024]">
                      <span className="text-[#a1a1aa]">Order Total:</span>
                      <span className="text-white font-extrabold text-sm">
                        ₹{activeOrder.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ordered Items List */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono uppercase text-[#71717a] tracking-wider block">
                    Garments in this Drop ({activeOrder.items.length}):
                  </span>

                  <div className="space-y-2">
                    {activeOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-[#16171b] border border-[#222428] rounded-lg text-xs font-mono"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-12 object-cover rounded bg-[#1c1d22]"
                          />
                          <div>
                            <h5 className="font-heading font-bold text-white text-xs sm:text-sm">
                              {item.product.name}
                            </h5>
                            <span className="text-[11px] text-[#a1a1aa]">
                              Size: <strong className="text-white">{item.selectedSize}</strong> · {item.selectedColor}
                            </span>
                            <span className="text-[10px] text-[#71717a] block">
                              {item.product.gsm} GSM · Qty: {item.quantity}
                            </span>
                          </div>
                        </div>

                        <span className="font-heading font-bold text-white sm:text-sm">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
