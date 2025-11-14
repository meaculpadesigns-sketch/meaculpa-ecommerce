import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Product, Order, User, Creation, DesignRequest, Message, Coupon, Review, Story } from '@/types';

// Products
export async function getProducts() {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductById(id: string) {
  const productRef = doc(db, 'products', id);
  const snapshot = await getDoc(productRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Product;
  }
  return null;
}

export async function addProduct(product: Omit<Product, 'id'>) {
  const productsRef = collection(db, 'products');
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const productRef = doc(db, 'products', id);
  await updateDoc(productRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProduct(id: string) {
  const productRef = doc(db, 'products', id);
  await deleteDoc(productRef);
}

// Creations
export async function getCreations() {
  const creationsRef = collection(db, 'creations');
  const q = query(creationsRef, where('active', '==', true), orderBy('order'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Creation));
}

export async function addCreation(creation: Omit<Creation, 'id'>) {
  const creationsRef = collection(db, 'creations');
  const docRef = await addDoc(creationsRef, creation);
  return docRef.id;
}

export async function updateCreation(id: string, data: Partial<Creation>) {
  const creationRef = doc(db, 'creations', id);
  await updateDoc(creationRef, data);
}

export async function deleteCreation(id: string) {
  const creationRef = doc(db, 'creations', id);
  await deleteDoc(creationRef);
}

// Orders
export async function createOrder(order: Omit<Order, 'id'>) {
  const ordersRef = collection(db, 'orders');
  const docRef = await addDoc(ordersRef, {
    ...order,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getOrderById(id: string) {
  const orderRef = doc(db, 'orders', id);
  const snapshot = await getDoc(orderRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Order;
  }
  return null;
}

export async function getOrderByNumber(orderNumber: string, contact: string) {
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('orderNumber', '==', orderNumber),
    where('guestEmail', '==', contact)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Order;
  }

  // Try with phone
  const q2 = query(
    ordersRef,
    where('orderNumber', '==', orderNumber),
    where('guestPhone', '==', contact)
  );
  const snapshot2 = await getDocs(q2);
  if (!snapshot2.empty) {
    return { id: snapshot2.docs[0].id, ...snapshot2.docs[0].data() } as Order;
  }

  return null;
}

export async function getUserOrders(userId: string) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  const orderRef = doc(db, 'orders', id);
  await updateDoc(orderRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}

// Users
export async function getUserById(id: string) {
  try {
    const userRef = doc(db, 'users', id);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as User;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
  return null;
}

export async function updateUser(id: string, data: Partial<User>) {
  const userRef = doc(db, 'users', id);
  await updateDoc(userRef, data);
}

export async function addToFavorites(userId: string, productId: string) {
  const userRef = doc(db, 'users', userId);
  const user = await getUserById(userId);
  if (user) {
    const favorites = user.favorites || [];
    if (!favorites.includes(productId)) {
      await updateDoc(userRef, {
        favorites: [...favorites, productId],
      });
    }
  }
}

export async function removeFromFavorites(userId: string, productId: string) {
  const userRef = doc(db, 'users', userId);
  const user = await getUserById(userId);
  if (user) {
    const favorites = user.favorites || [];
    await updateDoc(userRef, {
      favorites: favorites.filter((id) => id !== productId),
    });
  }
}

// Design Requests
export async function createDesignRequest(request: Omit<DesignRequest, 'id' | 'requestNumber'>) {
  const requestsRef = collection(db, 'designRequests');
  const requestNumber = `DR${Date.now()}`;
  const docRef = await addDoc(requestsRef, {
    ...request,
    requestNumber,
    status: 'pending',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return { id: docRef.id, requestNumber };
}

export async function getDesignRequestByNumber(requestNumber: string, contact: string) {
  const requestsRef = collection(db, 'designRequests');
  const q = query(
    requestsRef,
    where('requestNumber', '==', requestNumber),
    where('guestEmail', '==', contact)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as DesignRequest;
  }

  // Try with phone
  const q2 = query(
    requestsRef,
    where('requestNumber', '==', requestNumber),
    where('guestPhone', '==', contact)
  );
  const snapshot2 = await getDocs(q2);
  if (!snapshot2.empty) {
    return { id: snapshot2.docs[0].id, ...snapshot2.docs[0].data() } as DesignRequest;
  }

  return null;
}

// Messages
export async function createMessage(message: Omit<Message, 'id'>) {
  const messagesRef = collection(db, 'messages');
  const docRef = await addDoc(messagesRef, {
    ...message,
    read: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Coupons
export async function getCouponByCode(code: string) {
  const couponsRef = collection(db, 'coupons');
  const q = query(couponsRef, where('code', '==', code), where('active', '==', true));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Coupon;
  }
  return null;
}

export async function useCoupon(id: string) {
  const couponRef = doc(db, 'coupons', id);
  const coupon = await getDoc(couponRef);
  if (coupon.exists()) {
    const data = coupon.data() as Coupon;
    await updateDoc(couponRef, {
      usedCount: data.usedCount + 1,
    });
  }
}

// Reviews
export async function getProductReviews(productId: string) {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, where('productId', '==', productId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review));
}

export async function getAllReviews() {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Review));
}

export async function updateReview(id: string, data: Partial<Review>) {
  const reviewRef = doc(db, 'reviews', id);
  await updateDoc(reviewRef, data);
}

export async function deleteReview(id: string) {
  const reviewRef = doc(db, 'reviews', id);
  await deleteDoc(reviewRef);
}

export async function addReview(review: Omit<Review, 'id'>) {
  const reviewsRef = collection(db, 'reviews');
  const docRef = await addDoc(reviewsRef, {
    ...review,
    helpful: 0,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Stories
export async function getProductStories(productId: string) {
  const storiesRef = collection(db, 'stories');
  const q = query(
    storiesRef,
    where('productId', '==', productId),
    where('approved', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Story));
}

export async function addStory(story: Omit<Story, 'id'>) {
  const storiesRef = collection(db, 'stories');
  const docRef = await addDoc(storiesRef, {
    ...story,
    approved: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// File Upload
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    console.log('🔵 Starting upload:', { fileName: file.name, path, fileSize: file.size });
    console.log('🔵 Storage instance:', storage);

    if (!storage) {
      throw new Error('Storage is not initialized');
    }

    const storageRef = ref(storage, path);
    console.log('🔵 Storage ref created:', storageRef.toString());

    await uploadBytes(storageRef, file);
    console.log('✅ Upload complete, getting download URL...');

    const url = await getDownloadURL(storageRef);
    console.log('✅ Download URL obtained:', url);

    return url;
  } catch (error: any) {
    console.error('❌ Upload error:', {
      message: error?.message,
      code: error?.code,
      name: error?.name,
      fullError: error
    });
    throw error;
  }
}

export async function deleteFile(path: string) {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

// Analytics
export async function getAllOrders() {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
}

export async function getAllUsers() {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
}
