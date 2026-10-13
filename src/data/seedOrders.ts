import { Order } from '../types';
import { PRODUCTS } from './products';

export const INITIAL_ADMIN_ORDERS: Order[] = [
  {
    id: 'ord-1718001001',
    userId: 'student-du-01',
    orderNumber: 'JRRVS-IN-841920',
    createdAt: '12 Oct 2026, 09:14 AM',
    items: [
      {
        product: PRODUCTS[0], // Heavyweight Boxy Tee
        selectedSize: 'L',
        selectedColor: 'Vintage Black',
        quantity: 2,
      },
      {
        product: PRODUCTS[2], // Wide-Leg Parachute Cargo
        selectedSize: 'M',
        selectedColor: 'Charcoal Slate',
        quantity: 1,
      },
    ],
    totalAmount: 5497,
    deliveryAddress: {
      fullName: 'Kabir Sharma',
      phone: '+91 98112 34567',
      email: 'kabir.s@srcc.du.ac.in',
      university: 'Delhi University (SRCC North Campus)',
      hostelOrAddress: 'Boys Hostel Wing B, Room 108',
      city: 'New Delhi',
      pincode: '110007',
      deliveryNotes: 'Drop with hostel security guard if after 6 PM',
    },
    paymentMethod: 'upi',
    paymentStatus: 'Paid',
    upiRefId: 'UPI948271049281',
    status: 'Dispatched',
    estimatedDeliveryDate: '14 Oct 2026 (Hostel Mailroom)',
  },
  {
    id: 'ord-1718001002',
    userId: 'student-iitb-02',
    orderNumber: 'JRRVS-IN-912847',
    createdAt: '12 Oct 2026, 10:45 AM',
    items: [
      {
        product: PRODUCTS[1], // Drop-Shoulder Fleece Hoodie
        selectedSize: 'XL',
        selectedColor: 'Bone Off-White',
        quantity: 1,
      },
    ],
    totalAmount: 2999,
    deliveryAddress: {
      fullName: 'Rohan Mehra',
      phone: '+91 99201 88341',
      email: 'rohan.mehra@iitb.ac.in',
      university: 'IIT Bombay Powai',
      hostelOrAddress: 'Hostel 16, Room 314, Powai Campus',
      city: 'Mumbai',
      pincode: '400076',
      deliveryNotes: 'Call before entry at Main Gate Security',
    },
    paymentMethod: 'upi',
    paymentStatus: 'Paid',
    upiRefId: 'UPI881029471920',
    status: 'Confirmed',
    estimatedDeliveryDate: '15 Oct 2026 (Hostel Mailroom)',
  },
  {
    id: 'ord-1718001003',
    userId: 'student-bits-03',
    orderNumber: 'JRRVS-IN-382910',
    createdAt: '11 Oct 2026, 04:22 PM',
    items: [
      {
        product: PRODUCTS[4], // Tactical Bomber Overshirt
        selectedSize: 'L',
        selectedColor: 'Washed Black',
        quantity: 1,
      },
      {
        product: PRODUCTS[6], // Technical Cordura Sling
        selectedSize: 'One Size',
        selectedColor: 'Matte Stealth Black',
        quantity: 1,
      },
    ],
    totalAmount: 4798,
    deliveryAddress: {
      fullName: 'Aarav Varma',
      phone: '+91 97410 55667',
      email: 'aarav.v@pilani.bits-pilani.ac.in',
      university: 'BITS Pilani Main Campus',
      hostelOrAddress: 'Shankar Bhawan, Room 221',
      city: 'Pilani',
      pincode: '333031',
      deliveryNotes: 'Leave at Bhawan common room delivery rack',
    },
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    status: 'Out for Delivery',
    estimatedDeliveryDate: 'Today by 5:00 PM',
  },
  {
    id: 'ord-1718001004',
    userId: 'student-blr-04',
    orderNumber: 'JRRVS-IN-736192',
    createdAt: '10 Oct 2026, 02:18 PM',
    items: [
      {
        product: PRODUCTS[0], // Heavyweight Boxy Tee
        selectedSize: 'M',
        selectedColor: 'Chalk White',
        quantity: 1,
      },
      {
        product: PRODUCTS[5], // Washed Canvas Arch Cap
        selectedSize: 'Adjustable',
        selectedColor: 'Faded Black',
        quantity: 1,
      },
    ],
    totalAmount: 2398,
    deliveryAddress: {
      fullName: 'Devansh Kulkarni',
      phone: '+91 98860 12948',
      email: 'devansh.k@rvce.edu.in',
      university: 'RV College of Engineering (RVCE)',
      hostelOrAddress: 'Sir MV Hostel, 3rd Floor, Room 302',
      city: 'Bengaluru',
      pincode: '560059',
      deliveryNotes: 'Keep with hostel warden if student is in class',
    },
    paymentMethod: 'cod',
    paymentStatus: 'Pay on Delivery',
    status: 'Delivered',
    estimatedDeliveryDate: 'Delivered on 12 Oct 2026',
  },
  {
    id: 'ord-1718001005',
    userId: 'student-chandigarh-05',
    orderNumber: 'JRRVS-IN-501832',
    createdAt: '12 Oct 2026, 11:30 AM',
    items: [
      {
        product: PRODUCTS[3], // Raw-Hem Acid Wash Tee
        selectedSize: 'XL',
        selectedColor: 'Acid Washed Grey',
        quantity: 2,
      },
    ],
    totalAmount: 2798,
    deliveryAddress: {
      fullName: 'Yuvraj Singh Gill',
      phone: '+91 98141 90234',
      email: 'yuvraj.gill@cuchd.in',
      university: 'Chandigarh University',
      hostelOrAddress: 'Tower NC-2, Room 410',
      city: 'Mohali / Chandigarh',
      pincode: '140413',
      deliveryNotes: 'Call on phone on arrival',
    },
    paymentMethod: 'upi',
    paymentStatus: 'Paid',
    upiRefId: 'UPI739102492019',
    status: 'Confirmed',
    estimatedDeliveryDate: '15 Oct 2026 (Hostel Mailroom)',
  },
];
