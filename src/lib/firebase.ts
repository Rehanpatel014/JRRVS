import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  query,
  orderBy,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { Order, OrderStatus } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey || "AIzaSyDzQppr_XG839ABWsLcSVZ1PT_7AcDYKiA",
  authDomain: firebaseConfigData.authDomain || "jrrvs-4bcbb.firebaseapp.com",
  projectId: firebaseConfigData.projectId || "jrrvs-4bcbb",
  storageBucket: firebaseConfigData.storageBucket || "jrrvs-4bcbb.firebasestorage.app",
  messagingSenderId: firebaseConfigData.messagingSenderId || "850255820516",
  appId: firebaseConfigData.appId || "1:850255820516:web:cd75aea3e61a88a2addef1",
};

// Safe Firebase Initialization
let appInstance: any;
try {
  appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.warn('Firebase initializeApp warning:', e);
  appInstance = getApps()[0] || null;
}
export const app = appInstance;

// Safe Firebase Auth
let authInstance: any = null;
try {
  if (appInstance) {
    authInstance = getAuth(appInstance);
  }
} catch (e) {
  console.warn('Firebase getAuth warning:', e);
}
export const auth = authInstance;

// Safe Firestore (support named database if configured, fallback cleanly to default)
let dbInstance: any = null;
try {
  if (appInstance) {
    const databaseId =
      firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
        ? firebaseConfigData.firestoreDatabaseId
        : undefined;
    dbInstance = databaseId ? getFirestore(appInstance, databaseId) : getFirestore(appInstance);
  }
} catch (e) {
  console.warn('Named Firestore database initialization failed, falling back to default:', e);
  try {
    if (appInstance) {
      dbInstance = getFirestore(appInstance);
    }
  } catch (err) {
    console.warn('Default Firestore initialization failed:', err);
  }
}
export const db = dbInstance;


// Optional sanity connection test
(async () => {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch {
    // Non-fatal on cold startup
  }
})();

export interface StudentProfile {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  university?: string;
  hostelAddress?: string;
  city?: string;
  pincode?: string;
  createdAt: string;
}

// Auth Helpers
export const registerWithEmail = async (
  email: string,
  pass: string,
  fullName: string,
  details?: { phone?: string; university?: string; hostel?: string; city?: string; pincode?: string }
): Promise<StudentProfile> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;

  if (fullName) {
    await updateProfile(fbUser, { displayName: fullName });
  }

  const profile: StudentProfile = {
    id: fbUser.uid,
    email: fbUser.email || email,
    displayName: fullName || fbUser.displayName || 'Student',
    phoneNumber: details?.phone || '',
    university: details?.university || '',
    hostelAddress: details?.hostel || '',
    city: details?.city || '',
    pincode: details?.pincode || '',
    createdAt: new Date().toISOString(),
  };

  // Save to Firestore
  try {
    await setDoc(doc(db, 'users', fbUser.uid), profile);
  } catch (err) {
    console.error('Failed to save user profile to Firestore:', err);
  }

  return profile;
};

export const loginWithEmail = async (email: string, pass: string): Promise<StudentProfile | null> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;
  return await fetchUserProfile(fbUser.uid);
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const fetchUserProfile = async (uid: string): Promise<StudentProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as StudentProfile;
    }
  } catch (err) {
    console.error('Error fetching user profile:', err);
  }

  // Fallback to basic auth user info
  const current = auth.currentUser;
  if (current) {
    return {
      id: current.uid,
      email: current.email || '',
      displayName: current.displayName || 'Student',
      createdAt: new Date().toISOString(),
    };
  }
  return null;
};

export const saveUserProfileToDb = async (uid: string, profile: Partial<StudentProfile>): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', uid), profile, { merge: true });
  } catch (err) {
    console.error('Error updating user profile in Firestore:', err);
  }
};

import { INITIAL_ADMIN_ORDERS } from '../data/seedOrders';

// Admin Security Constants (Strictly restricted to rehanpateljrrvs@gmail.com)
export const ADMIN_EMAIL = 'rehanpateljrrvs@gmail.com';
export const ADMIN_EMAILS = [ADMIN_EMAIL];
export const ADMIN_PASS = '454545';

export const isAdminUser = (email?: string | null): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

export const verifyAdminCredentials = (email: string, pass: string): boolean => {
  return isAdminUser(email) && pass.trim() === ADMIN_PASS;
};

// Order Persistence in Firestore (Both User Sub-collection and Master Admin collection)
export const saveOrderToFirestore = async (userId: string, order: Order): Promise<void> => {
  // 1. Save to user sub-collection
  try {
    await setDoc(doc(db, 'users', userId, 'orders', order.id), order);
  } catch (err) {
    console.error('Failed to save order to user Firestore sub-collection:', err);
  }

  // 2. Save to master all_orders collection for Admin portal
  try {
    await setDoc(doc(db, 'all_orders', order.id), order);
  } catch (err) {
    console.error('Failed to save order to master all_orders Firestore collection:', err);
  }

  // 3. Mirror in master localStorage ledger
  try {
    const raw = localStorage.getItem('jrrvs_master_orders');
    const existing: Order[] = raw ? JSON.parse(raw) : INITIAL_ADMIN_ORDERS;
    const filtered = existing.filter((o) => o.id !== order.id);
    localStorage.setItem('jrrvs_master_orders', JSON.stringify([order, ...filtered]));
  } catch {
    // ignore
  }
};

export const fetchOrdersFromFirestore = async (userId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'users', userId, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data() as Order);
  } catch (err) {
    console.error('Failed to fetch orders from Firestore, fallback to local:', err);
    return [];
  }
};

export const updateOrderStatusInFirestore = async (
  userId: string,
  orderId: string,
  newStatus: OrderStatus
): Promise<void> => {
  try {
    const orderDocRef = doc(db, 'users', userId, 'orders', orderId);
    await updateDoc(orderDocRef, { status: newStatus });
  } catch (err) {
    console.error('Failed to update order status in Firestore:', err);
  }
};

// ADMIN: Fetch ALL orders across all students
export const fetchAllOrdersForAdmin = async (): Promise<Order[]> => {
  let orders: Order[] = [];

  // Try Firestore all_orders first
  try {
    const allOrdersRef = collection(db, 'all_orders');
    const q = query(allOrdersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    orders = snapshot.docs.map((d) => d.data() as Order);
  } catch (err) {
    console.warn('Could not query Firestore all_orders directly (admin fallback active):', err);
  }

  // Merge with localStorage master orders ledger
  try {
    const localRaw = localStorage.getItem('jrrvs_master_orders');
    const localOrders: Order[] = localRaw ? JSON.parse(localRaw) : INITIAL_ADMIN_ORDERS;
    
    // Merge by id, preferring Firestore version if exists
    const orderMap = new Map<string, Order>();
    localOrders.forEach((o) => orderMap.set(o.id, o));
    orders.forEach((o) => orderMap.set(o.id, o));
    
    const combined = Array.from(orderMap.values());
    if (combined.length === 0) {
      localStorage.setItem('jrrvs_master_orders', JSON.stringify(INITIAL_ADMIN_ORDERS));
      return INITIAL_ADMIN_ORDERS;
    }
    return combined;
  } catch {
    return orders.length > 0 ? orders : INITIAL_ADMIN_ORDERS;
  }
};

// ADMIN: Update order status across all records
export const updateMasterOrderStatus = async (
  orderId: string,
  userId: string | undefined,
  newStatus: OrderStatus
): Promise<void> => {
  // Update in Firestore all_orders
  try {
    await updateDoc(doc(db, 'all_orders', orderId), { status: newStatus });
  } catch (err) {
    console.warn('Could not update all_orders document in Firestore:', err);
  }

  // Update in user subcollection if user exists
  if (userId && userId !== 'guest') {
    try {
      await updateDoc(doc(db, 'users', userId, 'orders', orderId), { status: newStatus });
    } catch (err) {
      console.warn('Could not update user sub-collection order:', err);
    }

    // Update in user local cache
    try {
      const userKey = `jrrvs_orders_${userId}`;
      const cached = localStorage.getItem(userKey);
      if (cached) {
        const list: Order[] = JSON.parse(cached);
        const updated = list.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
        localStorage.setItem(userKey, JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
  }

  // Update master localStorage ledger
  try {
    const raw = localStorage.getItem('jrrvs_master_orders');
    const existing: Order[] = raw ? JSON.parse(raw) : INITIAL_ADMIN_ORDERS;
    const updated = existing.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem('jrrvs_master_orders', JSON.stringify(updated));
  } catch {
    // ignore
  }
};

// ADMIN: Stock & Inventory Management
export const fetchInventoryStockFromFirestore = async (): Promise<Record<string, number>> => {
  const stockMap: Record<string, number> = {};
  try {
    const snap = await getDocs(collection(db, 'inventory'));
    snap.docs.forEach((d) => {
      const data = d.data();
      if (typeof data.stockCount === 'number') {
        stockMap[d.id] = data.stockCount;
      }
    });
  } catch (err) {
    console.warn('Firestore inventory fetch failed (fallback to local cache):', err);
  }

  // Read local overrides
  try {
    const local = localStorage.getItem('jrrvs_stock_counts');
    if (local) {
      const parsed = JSON.parse(local);
      return { ...stockMap, ...parsed };
    }
  } catch {
    // ignore
  }

  return stockMap;
};

export const updateInventoryStockInFirestore = async (
  productId: string,
  stockCount: number
): Promise<void> => {
  // Update in Firestore
  try {
    await setDoc(doc(db, 'inventory', productId), { stockCount, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Failed to update stock in Firestore:', err);
  }

  // Update in localStorage
  try {
    const local = localStorage.getItem('jrrvs_stock_counts');
    const current = local ? JSON.parse(local) : {};
    current[productId] = stockCount;
    localStorage.setItem('jrrvs_stock_counts', JSON.stringify(current));
  } catch {
    // ignore
  }
};

