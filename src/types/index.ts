export type Category = 'all' | 'tees' | 'hoodies' | 'cargos' | 'outerwear' | 'accessories';

export type FitType = 'Boxy Fit' | 'Oversized' | 'Wide Leg' | 'Relaxed';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  category: Category;
  fit: FitType;
  gsm: number;
  color: string;
  colorHex: string;
  availableColors: { name: string; hex: string }[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  image: string;
  secondaryImage: string;
  description: string;
  details: string[];
  modelInfo: string;
  isNewDrop?: boolean;
  isBestseller?: boolean;
  stockCount: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface StudentReview {
  id: string;
  author: string;
  campus: string;
  productName: string;
  sizePurchased: string;
  userStats: string;
  rating: number;
  date: string;
  comment: string;
}

export type OrderStatus = 'Confirmed' | 'Dispatched' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  userId?: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: {
    fullName: string;
    phone: string;
    email: string;
    university: string;
    hostelOrAddress: string;
    city: string;
    pincode: string;
    deliveryNotes?: string;
  };
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'Paid' | 'Pay on Delivery';
  upiRefId?: string;
  status: OrderStatus;
  estimatedDeliveryDate: string;
}
